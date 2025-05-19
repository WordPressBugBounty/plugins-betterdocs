(function ($) {
    let $gb_editor_panel = $('#editor');
    var $is_popup_button_added = false;

    wp.data.subscribe(function () {
        setTimeout(function () {
            essential_block_button_init();
        }, 1);
    });

    function essential_block_button_init() {
        if (!$('#betterdocs-eb-popup-button').length && !$is_popup_button_added) {
            $gb_editor_panel.find('.edit-post-header__settings, .editor-header__settings').prepend($('#betterdocs-gb-eb-button-template').html());
            if ($('#betterdocs-eb-popup-button').length) {
                $is_popup_button_added = true;

                if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                    $('#betterdocs-eb-popup-button').closest('.editor-header').addClass('has-betterdocs-eb-promo');
                }
            }
        }
        if( ! $('#betterdocs-gb-eb-banner-promo').length ) {
            $gb_editor_panel.find('.interface-interface-skeleton__content').prepend($('#betterdocs-gb-eb-banner-promo-template').html());
        }

    }

    $(document).on('click', '#betterdocs-eb-popup-button', function () {
        $('body').append($('#betterdocs-gb-eb-popup-template').html()).append(`<div id="betterdocs-gb-eb-popup-overlay"></div>`);
    }).on('click', '.betterdocs-gb-eb-dismiss, #betterdocs-gb-eb-popup-overlay', function () {
        $('.betterdocs-gb-eb-popup, #betterdocs-gb-eb-popup-overlay').remove();
    }).on('click', '.betterdocs-gb-eb-content-pagination span', function () {
        let $this = $(this),
            page_id = $this.data('page'),
            page_content = $(`#betterdocs-gb-eb-button-template-page-${page_id}`).html();

        $('.betterdocs-gb-eb-popup-content.--page-1').addClass('hide-betterdocs-gb-eb-never-show-button');
        $this.addClass('active').siblings().removeClass('active').closest('.betterdocs-gb-eb-popup-content')
            .removeClass('--page-1 --page-2 --page-3 --page-4 --page-5').addClass(`--page-${page_id}`);
        $('.betterdocs-gb-eb-popup .betterdocs-gb-eb-content-image').html($(page_content).find('.betterdocs-gb-eb-content-image').html());
        $('.betterdocs-gb-eb-popup .betterdocs-gb-eb-content-info').html($(page_content).find('.betterdocs-gb-eb-content-info').html());
    }).on('click', '.betterdocs-gb-eb-prev, .betterdocs-gb-eb-next', function () {
        let $this = $(this),
            isNext = $this.hasClass('betterdocs-gb-eb-next'),
            isPrev = $this.hasClass('betterdocs-gb-eb-prev'),
            currentPage = $('.betterdocs-gb-eb-content-pagination span.active');

        if (isNext) {
            currentPage.next().trigger('click');
        } else if (isPrev) {
            currentPage.prev().trigger('click');
        }
    }).on('click', 'button.betterdocs-gb-eb-never-show', function () {
        let $this = $(this),
            nonce = $this.data('nonce');

        $.ajax({
            url: "admin-ajax.php",
            type: "POST",
            data: {
                action: "betterdocs_gb_eb_popup_dismiss",
                security: nonce,
            },
            success: function (response) {
                if (response.success) {
                    $('.betterdocs-gb-eb-dismiss').trigger('click');
                    $('#betterdocs-eb-popup-button').remove();
                } else {
                    console.log(response.data);
                }
            },
            error: function (err) {
                console.log(err.responseText);
            },
        });
    }).on('click', 'button.betterdocs-gb-eb-banner-promo-close', function () {
        let $this = $(this),
            nonce = $this.data('nonce');

        $.ajax({
            url: "admin-ajax.php",
            type: "POST",
            data: {
                action: "betterdocs_eb_banner_promo_dismiss",
                security: nonce,
            },
            success: function (response) {
                if (response.success) {
                    $('#betterdocs-gb-eb-banner-promo-template').remove();
                    $('#betterdocs-gb-eb-banner-promo').remove();
                } else {
                    console.log(response.data);
                }
            },
            error: function (err) {
                console.log(err.responseText);
            },
        });
    }).on('click', 'button.betterdocs-gb-eb-install', function (ev) {
        ev.preventDefault();

        let button = $(this),
            action = button.data("action"),
            promoType = button.data("promotype") ?? "",
            nonce = button.data("nonce");

        if ($.active && typeof action != "undefined") {
            button.text("Waiting...").attr("disabled", true);

            setInterval(function () {
                if (!$.active) {
                    button.attr("disabled", false).trigger("click");
                }
            }, 1000);
        }

        if (action === "install" && !$.active) {
            button.text("Installing...").attr("disabled", true);

            $.ajax({
                url: "admin-ajax.php",
                type: "POST",
                data: {
                    action: "wpdeveloper_install_plugin",
                    security: nonce,
                    slug: "essential-blocks",
                    promotype: promoType
                },
                success: function (response) {
                    if (response.success) {
                        button.text("Activated");
                        button.data("action", null);
                        $('.betterdocs-gb-eb-dismiss').trigger('click');
                        $('#betterdocs-eb-popup-button').remove();

                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    } else {
                        button.text("Try Essential Blocks");
                    }

                    button.attr("disabled", false);
                },
                error: function (err) {
                    console.log(err.responseJSON);
                },
            });
        } else if (action === "activate" && !$.active) {
            button.text("Activating...").attr("disabled", true);

            $.ajax({
                url: "admin-ajax.php",
                type: "POST",
                data: {
                    action: "wpdeveloper_activate_plugin",
                    security: nonce,
                    basename: "essential-blocks/essential-blocks.php",
                },
                success: function (response) {
                    if (response.success) {
                        button.text("Activated");
                        button.data("action", null);
                        $('.betterdocs-gb-eb-dismiss').trigger('click');
                        $('#betterdocs-eb-popup-button').remove();

                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    } else {
                        button.text("Activate");
                    }

                    button.attr("disabled", false);
                },
                error: function (err) {
                    console.log(err.responseJSON);
                },
            });
        }
    });
})(jQuery);
