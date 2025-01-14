/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/*!*************************************************************!*\
  !*** ./react-src/public/shortcodes/search-modal/FaqIcon.js ***!
  \*************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


const FaqIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "21",
  height: "20",
  viewBox: "0 0 21 20",
  fill: "none"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("mask", {
  id: "mask0_7196_26080",
  style: {
    maskType: 'alpha'
  },
  maskUnits: "userSpaceOnUse",
  x: "0",
  y: "0",
  width: "21",
  height: "20"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "0.5",
  width: "20",
  height: "20",
  fill: "#D9D9D9"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  mask: "url(#mask0_7196_26080)"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M12.1667 12.4993C12.4029 12.4993 12.6077 12.4125 12.7813 12.2389C12.9549 12.0653 13.0417 11.8605 13.0417 11.6243C13.0417 11.3882 12.9549 11.1834 12.7813 11.0098C12.6077 10.8362 12.4029 10.7493 12.1667 10.7493C11.9306 10.7493 11.7258 10.8362 11.5522 11.0098C11.3786 11.1834 11.2917 11.3882 11.2917 11.6243C11.2917 11.8605 11.3786 12.0653 11.5522 12.2389C11.7258 12.4125 11.9306 12.4993 12.1667 12.4993ZM12.1667 9.83268C12.3195 9.83268 12.4619 9.77713 12.5938 9.66602C12.7258 9.5549 12.8056 9.40907 12.8334 9.22852C12.8612 9.06185 12.9202 8.90907 13.0105 8.77018C13.1008 8.63129 13.264 8.44379 13.5001 8.20768C13.9167 7.79102 14.1945 7.45421 14.3334 7.19727C14.4723 6.94032 14.5417 6.63824 14.5417 6.29102C14.5417 5.66602 14.323 5.1556 13.8855 4.75977C13.448 4.36393 12.8751 4.16602 12.1667 4.16602C11.7084 4.16602 11.2917 4.27018 10.9167 4.47852C10.5417 4.68685 10.2431 4.98546 10.0209 5.37435C9.93758 5.51324 9.93064 5.65907 10.0001 5.81185C10.0695 5.96463 10.1876 6.07574 10.3542 6.14518C10.507 6.21463 10.6563 6.22157 10.8022 6.16602C10.948 6.11046 11.0695 6.01324 11.1667 5.87435C11.2917 5.69379 11.4376 5.55838 11.6042 5.4681C11.7709 5.37782 11.9584 5.33268 12.1667 5.33268C12.5001 5.33268 12.7709 5.42643 12.9792 5.61393C13.1876 5.80143 13.2917 6.0549 13.2917 6.37435C13.2917 6.56879 13.2362 6.75282 13.1251 6.92643C13.014 7.10004 12.8195 7.31879 12.5417 7.58268C12.139 7.9299 11.882 8.19727 11.7709 8.38477C11.6598 8.57227 11.5904 8.84657 11.5626 9.20768C11.5487 9.37435 11.6008 9.52018 11.7188 9.64518C11.8369 9.77018 11.9862 9.83268 12.1667 9.83268ZM7.16675 14.9993C6.70841 14.9993 6.31605 14.8362 5.98966 14.5098C5.66328 14.1834 5.50008 13.791 5.50008 13.3327V3.33268C5.50008 2.87435 5.66328 2.48199 5.98966 2.1556C6.31605 1.82921 6.70841 1.66602 7.16675 1.66602H17.1667C17.6251 1.66602 18.0174 1.82921 18.3438 2.1556C18.6702 2.48199 18.8334 2.87435 18.8334 3.33268V13.3327C18.8334 13.791 18.6702 14.1834 18.3438 14.5098C18.0174 14.8362 17.6251 14.9993 17.1667 14.9993H7.16675ZM3.83341 18.3327C3.37508 18.3327 2.98272 18.1695 2.65633 17.8431C2.32994 17.5167 2.16675 17.1243 2.16675 16.666V5.83268C2.16675 5.59657 2.24661 5.39865 2.40633 5.23893C2.56605 5.07921 2.76397 4.99935 3.00008 4.99935C3.23619 4.99935 3.43411 5.07921 3.59383 5.23893C3.75355 5.39865 3.83341 5.59657 3.83341 5.83268V16.666H14.6667C14.9029 16.666 15.1008 16.7459 15.2605 16.9056C15.4202 17.0653 15.5001 17.2632 15.5001 17.4993C15.5001 17.7355 15.4202 17.9334 15.2605 18.0931C15.1008 18.2528 14.9029 18.3327 14.6667 18.3327H3.83341Z",
  fill: "#D0D5DD"
}))));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FaqIcon);
})();

/******/ })()
;
//# sourceMappingURL=FaqIcon.js.map