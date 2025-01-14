/******/ (() => { // webpackBootstrap
/*!********************************************!*\
  !*** ./react-src/public/shortcodes/faq.js ***!
  \********************************************/
jQuery(document).ready(function ($) {
  jQuery(document).on("click", '.betterdocs-faq-post', function (e) {
    var current_node = jQuery(this);
    var active_list = jQuery(".betterdocs-faq-group.active");
    if (!current_node.parent().hasClass("active")) {
      current_node.parent().addClass("active");
      current_node.children("svg").toggle();
      current_node.next().slideDown();
    }
    for (let node of active_list) {
      if (jQuery(node).hasClass("active")) {
        jQuery(node).removeClass("active");
        jQuery(node).children(".betterdocs-faq-post").children("svg").toggle();
        jQuery(node).children(".betterdocs-faq-main-content").slideUp();
      }
    }
  });
});
/******/ })()
;
//# sourceMappingURL=faq.js.map