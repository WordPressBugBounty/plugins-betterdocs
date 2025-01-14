/******/ (() => { // webpackBootstrap
/*!***********************************************!*\
  !*** ./react-src/public/shortcodes/search.js ***!
  \***********************************************/
class LiveSearch {
  constructor() {
    var $ = jQuery;

    //live search
    this.request;
    this.searchForm = $(".betterdocs-searchform");
    this.searchField = $(".betterdocs-search-field");
    this.searchCategory = $(".betterdocs-search-category");
    this.popularSearch = $(".betterdocs-popular-search-keyword .popular-keyword");
    this.searchClose = $(".docs-search-close");
    this.liveSearch();
  }
  liveSearch() {
    var $ = jQuery;
    var $this = this;
    // disable from submit on enter
    this.popularSearch.on("click", function (e) {
      e.preventDefault();
      let popularKeyword = $(this).text();
      $(this).parent(".betterdocs-popular-search-keyword").siblings(".betterdocs-searchform").find(".betterdocs-search-field").val(popularKeyword).trigger("propertychange");
    });
    this.searchForm.on("keyup keypress", function (e) {
      let keyCode = e.keyCode || e.which;
      if (keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });

    // ajax load titles on keyup to searchbox
    this.searchField.on("input propertychange paste", function (e) {
      let thisEvent = $(this);
      let inputVal = $(this).val();
      let inputCat = thisEvent.parent(".betterdocs-searchform-input-wrap").siblings(".betterdocs-search-category").find(":selected").val();
      let resultWrapper = thisEvent.parent().parent(".betterdocs-searchform");
      let kbSlug = thisEvent.parent().parent(".betterdocs-searchform").find(".betterdocs-search-kbslug").val();

      //Before the result is fetched, we have to remove the search result wrapper based on letter limit characters
      if (!inputVal.length) {
        var nodeResults = thisEvent.parents(".betterdocs-live-search").find(".betterdocs-search-result-wrap");
        if (nodeResults.length > 0) {
          nodeResults.each(function (item) {
            $(nodeResults[item]).remove();
          });
        }
      }
      $this.liveSearchAction(e, thisEvent, inputVal, inputCat, resultWrapper, kbSlug);
    });
    this.searchCategory.on("change", function (e) {
      let thisEvent = $(this);
      let inputVal = thisEvent.siblings(".betterdocs-searchform-input-wrap").children(".betterdocs-search-field").val();
      let inputCat = $(this).find(":selected").val();
      let resultWrapper = thisEvent.parent(".betterdocs-searchform");
      let kbSlug = thisEvent.parent(".betterdocs-searchform").find(".betterdocs-search-kbslug").val();
      $this.liveSearchAction(e, thisEvent, inputVal, inputCat, resultWrapper, kbSlug);
    });
    this.liveSearchAction = function (e, thisEvent, inputVal, inputCat, resultWrapper, kbSlug) {
      let $ = jQuery;
      let resultList = thisEvent.parent(".betterdocs-searchform").find(".betterdocs-search-result-wrap");
      let searchLoader = thisEvent.parent().find(".docs-search-loader");
      let searchClose = thisEvent.parent().find(".docs-search-close");
      let search_letter_limit = betterdocsSearchConfig.search_letter_limit;
      if (e.key != "a" && e.keyCode != 17 && e.keyCode != 91 && inputVal.length >= search_letter_limit) {
        $this.delay(function () {
          $this.ajaxLoad(inputVal, inputCat, kbSlug, resultWrapper, resultList, searchLoader, searchClose, thisEvent);
        }, 400);
      } else if (!inputVal.length) {
        thisEvent.parent().parent(".betterdocs-live-search").find(".betterdocs-search-result-wrap").addClass("hideArrow");
        thisEvent.parent().parent(".betterdocs-live-search").find(".docs-search-result").slideUp(300);
        searchLoader.hide();
        searchClose.hide();
      }
    };
    this.searchClose.on("click", function () {
      $(this).hide();
      $(this).parent().parent().find(".betterdocs-search-result-wrap").addClass("hideArrow");
      $(this).parent().parent().find(".docs-search-result").slideUp(300);
      $(this).siblings(".betterdocs-search-field").val("");
    });
    this.delay = function (callback, ms) {
      let timer = 0;
      return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
        return timer;
      };
    }();
    this.ajaxLoad = function (inputVal, inputCat, kbSlug, resultWrapper, resultList, searchLoader, searchClose, inputEvent) {
      var $ = jQuery;
      let request;
      if (request) {
        request.abort();
      }
      request = $.ajax({
        url: betterdocsSearchConfig.ajax_url,
        type: "post",
        data: {
          action: "betterdocs_get_search_result",
          search_input: inputVal,
          search_cat: inputCat,
          kb_slug: kbSlug,
          is_post_type_archive: betterdocsSearchConfigTwo?.is_post_type_archive
        },
        beforeSend: function () {
          searchLoader.show();
          searchClose.hide();
          resultList.addClass("hideArrow");
          $(".betterdocs-live-search .docs-search-result").slideUp(400);
        },
        success: function (response) {
          resultList.remove();
          searchLoader.hide();
          searchClose.show();
          let search_letter_limit = betterdocsSearchConfig.search_letter_limit;
          var inputVal2 = inputEvent.val();

          //After the result is fetched, we have to remove the search result wrapper
          if (inputVal2.length < search_letter_limit) {
            var nodeResults = $(".betterdocs-live-search").find(".betterdocs-search-result-wrap");
            if (nodeResults.length > 0) {
              nodeResults.each(function (item) {
                $(nodeResults[item]).slideUp(400);
              });
            }
            searchClose.hide();
            return;
          }
          resultWrapper.append(response.data.post_lists);
        }
      });
    };
  }
}
new LiveSearch();
/******/ })()
;
//# sourceMappingURL=search.js.map