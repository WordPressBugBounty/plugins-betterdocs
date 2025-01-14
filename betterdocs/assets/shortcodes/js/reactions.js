/******/ (() => { // webpackBootstrap
/*!**************************************************!*\
  !*** ./react-src/public/shortcodes/reactions.js ***!
  \**************************************************/
jQuery(document).ready(function ($) {
  $(".betterdocs-feelings,.betterdocs-emoji").on('click', function (e) {
    var _betterdocsReactionsC;
    e.preventDefault();
    console.log('clicked');
    let feelings = e.currentTarget.dataset.feelings;
    let betterdocsConfig = (_betterdocsReactionsC = betterdocsReactionsConfig) !== null && _betterdocsReactionsC !== void 0 ? _betterdocsReactionsC : undefined;
    if (betterdocsConfig != undefined && betterdocsConfig.FEEDBACK != undefined && betterdocsConfig.FEEDBACK.DISPLAY != undefined && betterdocsConfig.FEEDBACK.DISPLAY == true) {
      var URL = betterdocsConfig.FEEDBACK.URL;
      if (URL.indexOf('?') > -1) {
        URL += '/' + betterdocsConfig.post_id + '&feelings=' + feelings;
      } else {
        URL += '/' + betterdocsConfig.post_id + '?feelings=' + feelings;
      }
      jQuery.ajax({
        url: URL,
        method: 'POST',
        success: function (res) {
          if (res === true) {
            $('.betterdocs-article-reactions .betterdocs-article-reactions-heading,.betterdocs-article-reactions .betterdocs-article-reaction-links,.layout-3.betterdocs-article-reactions h5,.layout-3.betterdocs-article-reactions .betterdocs-article-reaction-links').fadeOut(1000);
            $('.betterdocs-article-reactions.layout-1, .betterdocs-article-reactions.layout-2 .betterdocs-article-reactions-box,.layout-3.betterdocs-article-reactions .betterdocs-article-reactions-sidebar, .betterdocs-article-reactions-blocks .betterdocs-article-reactions-sidebar .betterdocs-article-reaction-links, .betterdocs-blocks .betterdocs-article-reactions-box').html('<p class="feedback-message">' + betterdocsConfig.FEEDBACK.SUCCESS + '</p>').fadeIn(1000);
          }
        }
      });
    }
  });
});
/******/ })()
;
//# sourceMappingURL=reactions.js.map