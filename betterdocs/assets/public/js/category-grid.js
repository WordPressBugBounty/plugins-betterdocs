/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./react-src/utils/categoryGrid.js":
/*!*****************************************!*\
  !*** ./react-src/utils/categoryGrid.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   toggleList: () => (/* binding */ toggleList)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__($scope, $) {
  let masonryGrids = $(".betterdocs-category-grid-inner-wrapper.masonry", $scope);
  if (masonryGrids?.length == 0) {
    let masonryItems = $('.betterdocs-single-category-wrapper', $scope);
    (masonryItems || []).each((_, item) => {
      item.removeAttribute("style");
    });
    return;
  }
  var mobileDevice = window.matchMedia("(max-width: 767px)");
  var tabDevice = window.matchMedia("(max-width: 1024px)");
  masonryGrids.each((_, masonryGrid) => {
    var _masonryGrid$getAttri;
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
        column_space = (_masonryGrid$getAttri = masonryGrid.getAttribute("data-column_space_desktop")) !== null && _masonryGrid$getAttri !== void 0 ? _masonryGrid$getAttri : 15;
        break;
    }
    column_space = parseInt(column_space);
    columnPerGrid = parseInt(columnPerGrid);
    let masonryItems = masonryGrid.querySelectorAll(".betterdocs-single-category-wrapper");
    let total_margin = (columnPerGrid - 1) * column_space;
    if (masonryGrid) {
      masonryItems.forEach(item => {
        item.style.width = `calc((100% - ${total_margin}px) / ${columnPerGrid})`;
      });
      new Masonry(masonryGrid, {
        itemSelector: ".betterdocs-single-category-wrapper",
        percentPosition: true,
        gutter: column_space
      });
    }
  });
}
function toggleList() {
  var $ = jQuery;
  let currentActiveCat = $(".betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-single-category-wrapper.active");
  let catTitleList = $(".betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-single-category-wrapper .betterdocs-category-header");
  let nestedCatTitle = $(".betterdocs-nested-category-title");
  let nestedCatTitleA = $(".betterdocs-nested-category-title a");
  nestedCatTitleA.on('click', function (e) {
    e.preventDefault();
  });
  currentActiveCat.addClass("show").find(".betterdocs-body").css("display", "block");
  currentActiveCat.siblings().find(".betterdocs-body").css("display", "none");
  catTitleList.on("click", function (e) {
    e.preventDefault();
    let $parentCat = jQuery(e.target).closest(".betterdocs-single-category-wrapper");
    $parentCat.find(".betterdocs-body").slideToggle();
    $parentCat.addClass("active").toggleClass("show").siblings().removeClass("active").find(".betterdocs-body").slideUp();
  });
  nestedCatTitle.on("click", function (e) {
    e.preventDefault();
    $(this).children(".toggle-arrow").toggle();
    $(this).next(".betterdocs-nested-category-list").hasClass('active') ? $(this).next(".betterdocs-nested-category-list").slideUp('fast', 'swing', function () {
      $(this).toggleClass('active');
    }) : $(this).next(".betterdocs-nested-category-list").slideDown('fast', 'swing', function () {
      $(this).toggleClass('active');
    });
  });
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************************!*\
  !*** ./react-src/public/category-grid.js ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_categoryGrid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/categoryGrid */ "./react-src/utils/categoryGrid.js");

(function ($) {
  $(document).ready(function () {
    document.querySelectorAll('.betterdocs-category-grid-inner-wrapper.masonry').forEach(grid => {
      (0,_utils_categoryGrid__WEBPACK_IMPORTED_MODULE_0__["default"])(grid.parentElement, $);
    });
    if (betterdocsCategoryGridConfig?.is_betterdocs_templates != 1) {
      //run this script only from outside betterdocs templates only, this script is made to determine set the kb and its value on cookie
      $('.betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-link-btn').on('click', function (e) {
        //this is triggerd when clicked on explore more on category grid
        let secondTopLayer = $($($($(this)?.parent())?.parent())?.parent())?.parent();
        let topLayerMkbAttribute = $(secondTopLayer).attr('data-mkb-slug');
        if (topLayerMkbAttribute?.length > 0) {
          var expiryDate = new Date();
          var timeStamp = expiryDate.setDate(expiryDate.getDate() + 30).toString();
          document.cookie = `last_knowledge_base=${topLayerMkbAttribute}; expires=${timeStamp}; path=/;`;
        }
      });
      $('.betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-body .betterdocs-articles-list li a').on('click', function (e) {
        //this is triggerd when clicked on single doc list
        let secondTopLayer = $($($($($($(this).parent()).parent()).parent()).parent()).parent()).parent();
        let topLayerMkbAttribute = $(secondTopLayer).attr('data-mkb-slug');
        if (topLayerMkbAttribute?.length > 0) {
          var expiryDate = new Date();
          var timeStamp = expiryDate.setDate(expiryDate.getDate() + 30).toString();
          document.cookie = `last_knowledge_base=${topLayerMkbAttribute}; expires=${timeStamp}; path=/;`;
        }
      });
    }
  });
})(jQuery);
})();

/******/ })()
;
//# sourceMappingURL=category-grid.js.map