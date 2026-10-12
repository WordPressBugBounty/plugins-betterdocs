(function ($) {
    "use strict";
    $(document).ready(function () {
        var cfg = window.betterdocsSwitcher;
        if (!cfg || !cfg.page) {
            return;
        }
        // Inject the "Switch to BetterDocs UI" button next to the page heading.
        // The script is only enqueued on the relevant classic screens (Docs,
        // FAQ, FAQ groups, Product FAQ groups, Doc Categories, Doc Tags), so
        // targeting the first .wp-heading-inline is safe. `cfg.url` is the
        // full React admin page URL (it can carry extra args like the FAQ
        // Builder tab); `cfg.page` is the older slug-only fallback.
        var href = cfg.url || "admin.php?page=" + cfg.page;
        $(".wp-heading-inline")
            .first()
            .after(
                '<a href="' +
                    href +
                    '" class="page-title-action betterdocs-ui-switch">' +
                    (cfg.menu_title || "Switch to BetterDocs UI") +
                    "</a>"
            );
    });
})(jQuery);
