jQuery(document).ready(function ($) {
	// FAQ Accordion
	const $tabs = $(".betterdocs-faq-tab");
	const $mobileTabs = $(".betterdocs-faq-list-wrapper .betterdocs-faq-tab");
    const $contents = $(".betterdocs-faq-list-content");

    $tabs.on("click", function () {
        const termId = $(this).data("term-id");

        // Remove active class from all tabs and hide all contents
        $tabs.removeClass("active");
        $contents.hide().removeClass("active");

		// Reset all icons to default state
		$(".betterdocs-faq-iconplus").show();
		$(".betterdocs-faq-iconminus").hide();

        // Add active class to the clicked tab and show the corresponding content
        $(this).addClass("active");
        $contents.filter(`[data-term-id="${termId}"]`).show().addClass("active");

		// Toggle icons for the active tab
		$(this).find(".betterdocs-faq-iconplus").hide();
		$(this).find(".betterdocs-faq-iconminus").show();
    });

    // Trigger click on the first tab to show the first content by default
    if ($tabs.length > 0) {
        $tabs.first().trigger("click").addClass("active");

		const $mobileFirstTab = $mobileTabs.first();
        $mobileFirstTab.addClass("active");
		$mobileFirstTab.find(".betterdocs-faq-iconplus").hide();
		$mobileFirstTab.find(".betterdocs-faq-iconminus").show();
    }

    jQuery(document).on("click", '.betterdocs-faq-post', function (e) {
        var current_node = jQuery(this);
        var active_list = jQuery(".betterdocs-faq-group.active");

        if (!current_node.parent().hasClass("active")) {
            current_node.parent().addClass("active");
            current_node.children("svg").toggle();
            current_node.next().slideDown();
        } else {
			jQuery(jQuery(e?.currentTarget).parent()).removeClass("active");
			jQuery(jQuery(e?.currentTarget).parent())
				.children(".betterdocs-faq-post")
				.children("svg")
				.toggle();
			jQuery(jQuery(e?.currentTarget).parent())
				.children(".betterdocs-faq-main-content")
				.slideUp();
		}
    });

});
