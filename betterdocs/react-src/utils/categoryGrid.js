export default function ( $scope, $ ) {
    let masonryGrids = $(".betterdocs-category-grid-inner-wrapper.masonry", $scope);

    if ( masonryGrids?.length == 0 ) {
        let masonryItems = $('.betterdocs-single-category-wrapper', $scope);
        (masonryItems || []).each((_, item) => {
            item.removeAttribute("style");
        });

        return;
    }

    var mobileDevice = window.matchMedia("(max-width: 767px)");
    var tabDevice = window.matchMedia("(max-width: 1024px)");

    masonryGrids.each((_, masonryGrid) => {
        let columnPerGrid = 0;
        let column_space = 0;

        switch (true) {
            case mobileDevice.matches:
                columnPerGrid = masonryGrid.getAttribute("data-column_mobile");
                column_space = masonryGrid.getAttribute("data-column_space_mobile");
                break;
            case tabDevice.matches:
                columnPerGrid = masonryGrid.getAttribute("data-column_tab");
                column_space = masonryGrid.getAttribute("data-column_space_tab");
                break;
            default:
                columnPerGrid = masonryGrid.getAttribute("data-column_desktop");
                column_space = masonryGrid.getAttribute("data-column_space_desktop") ?? 15;
                break;
        }

        column_space = parseInt(column_space);
        columnPerGrid = parseInt(columnPerGrid);

        let masonryItems = masonryGrid.querySelectorAll(".betterdocs-single-category-wrapper");
        let total_margin = (columnPerGrid - 1) * column_space;

        if (masonryGrid) {
            masonryItems.forEach((item) => {
                item.style.width = `calc((100% - ${total_margin}px) / ${columnPerGrid})`;
            });

            new Masonry(masonryGrid, {
                itemSelector: ".betterdocs-single-category-wrapper",
                percentPosition: true,
                gutter: column_space,
            });
        }
    });
}


export function toggleList() {
    var $ = jQuery;

    let currentActiveCat = $(".betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-single-category-wrapper.active");
    let catTitleList = $(".betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-single-category-wrapper .betterdocs-category-header");

    // Nested-category interactions are delegated off document because the
    // markup is injected later via AJAX (lazy-load) and any handler bound
    // directly on init would miss those nodes.
    $(document).on("click", ".betterdocs-nested-category-title a", function (e) {
        e.preventDefault();
    });

    currentActiveCat
        .addClass("show")
        .find(".betterdocs-body")
        .css("display", "block");
    currentActiveCat
        .siblings()
        .find(".betterdocs-body")
        .css("display", "none");

    // Inject a skeleton (animated placeholder rows) into a lazy body and
    // fetch its real content. The skeleton stays visible for at least
    // SKELETON_MIN_MS so the user perceives a clear loading state even if
    // the AJAX returns almost instantly. Returns a promise that resolves
    // after both the fetch and the minimum-delay timer have completed.
    var SKELETON_MIN_MS = 1000;
    var SKELETON_HTML = (
        '<ul class="betterdocs-skeleton" aria-hidden="true">' +
        '<li><span class="betterdocs-skeleton-bar"></span></li>' +
        '<li><span class="betterdocs-skeleton-bar"></span></li>' +
        '<li><span class="betterdocs-skeleton-bar"></span></li>' +
        '<li><span class="betterdocs-skeleton-bar"></span></li>' +
        '<li><span class="betterdocs-skeleton-bar"></span></li>' +
        '</ul>'
    );

    function loadLazyBody($body) {
        if ($body.attr("data-bd-loaded") === "1" || $body.attr("data-bd-loading") === "1") {
            return $.Deferred().resolve().promise();
        }
        var cfg = window.betterdocsCategoryGridConfig || {};
        if (!cfg.ajax_url) {
            return $.Deferred().reject().promise();
        }

        $body.html(SKELETON_HTML);
        $body.attr("data-bd-loading", "1");

        // Sleek sidebar (layout-7) uses folder icons on nested-category-title.
        // The initial PHP render gets this via sidebar-7.php's
        // category_icon=folder shortcode attr; the AJAX path needs to be told
        // explicitly so its rendered HTML matches.
        var category_icon = $body.closest(".betterdocs-sidebar-layout-7").length ? "folder" : "";

        var ajax = $.post(cfg.ajax_url, {
            action:        cfg.lazy_load_action || "betterdocs_lazy_category_body",
            term_id:       $body.attr("data-bd-term-id"),
            kb_slug:       cfg.kb_slug || "",
            multiple_kb:   cfg.multiple_kb ? 1 : 0,
            category_icon: category_icon
        });

        var minDelay = $.Deferred();
        setTimeout(function () { minDelay.resolve(); }, SKELETON_MIN_MS);

        return $.when(ajax, minDelay.promise())
            .done(function (ajaxArgs) {
                // $.when wraps single-promise resolve values in arrays.
                var resp = $.isArray(ajaxArgs) ? ajaxArgs[0] : ajaxArgs;
                if (resp && resp.success && resp.data && typeof resp.data.html === "string") {
                    $body.html(resp.data.html);
                    $body.attr("data-bd-loaded", "1");
                    $body.removeAttr("data-bd-lazy");
                }
            })
            .always(function () {
                $body.removeAttr("data-bd-loading");
            });
    }

    catTitleList.on("click", function (e) {
        e.preventDefault();
        var $parentCat = jQuery(e.target).closest(".betterdocs-single-category-wrapper");
        var $body = $parentCat.children(".betterdocs-single-category-inner").children(".betterdocs-body");
        if ($body.length === 0) {
            $body = $parentCat.find(".betterdocs-body").first();
        }
        var isLazy = $body.attr("data-bd-lazy") === "1";
        var isLoaded = $body.attr("data-bd-loaded") === "1";

        // Kick off the lazy fetch synchronously so the skeleton paints
        // immediately on the slide-down (loadLazyBody injects the skeleton
        // into $body before returning the AJAX promise).
        if (isLazy && !isLoaded) {
            loadLazyBody($body);
        }

        $body.slideToggle();
        $parentCat.toggleClass("show");
        $parentCat.siblings()
            .removeClass("active show")
            .find(".betterdocs-body").slideUp();
        $parentCat.addClass("active");
    });

    $(document).on("click", ".betterdocs-nested-category-title", function (e) {
        e.preventDefault();
        var $self = $(this);
        // Sleek Layout (.betterdocs-sidebar-layout-7) uses fixed folder icons
        // pinned by !important CSS -- jQuery's .toggle() ends up hiding both
        // arrow SVGs because the inline display can't beat the !important
        // arrow-down rule. Skip the arrow swap there and let CSS keep its
        // intended static visual.
        if (!$self.closest(".betterdocs-sidebar-layout-7").length) {
            $self.children(".toggle-arrow").toggle();
        }
        var $list = $self.next(".betterdocs-nested-category-list");
        if ($list.hasClass("active")) {
            $list.slideUp("fast", "swing", function () { $(this).toggleClass("active"); });
        } else {
            $list.slideDown("fast", "swing", function () { $(this).toggleClass("active"); });
        }
    });

    // Memphis layout (sidebar-2): IntersectionObserver triggers AJAX as each
    // .betterdocs-body scrolls into view, since the layout has no click-to-toggle
    // category header.
    var memphis = document.querySelector(".betterdocs-sidebar-layout-2");
    if (memphis && "IntersectionObserver" in window) {
        var pending = memphis.querySelectorAll('.betterdocs-body[data-bd-lazy="1"]:not([data-bd-loaded="1"])');
        if (pending.length) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    observer.unobserve(entry.target);
                    var $b = $(entry.target);
                    loadLazyBody($b).done(function () {
                        $b.css("display", "block");
                    });
                });
            }, { rootMargin: "200px 0px" });
            pending.forEach(function (el) { observer.observe(el); });
        }
    }
}
