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
/*!***************************************************************!*\
  !*** ./react-src/public/shortcodes/search-modal/LayoutOne.js ***!
  \***************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


const LayoutOne = props => {
  const {
    placeholder,
    heading,
    subheading,
    headingTag: HeadingTag = 'h2',
    subheadingTag: SubheadingTag = 'h3',
    buttonText,
    searchButton
  } = props;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "betterdocs-search-layout-1"
  }, (heading || subheading) && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "search-header"
  }, heading && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(HeadingTag, {
    className: "search-heading"
  }, heading), subheading && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SubheadingTag, {
    className: "search-subheading"
  }, subheading)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "search-bar",
    onClick: props.handleSearchFieldClick
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "search-input-wrapper"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    className: "search-icon",
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    clipPath: "url(#clip0_7075_27802)"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M14.4631 13.6407L17.8394 17.0162L16.724 18.1317L13.3485 14.7554C12.0925 15.7622 10.5303 16.3098 8.92061 16.3075C5.00435 16.3075 1.82593 13.1291 1.82593 9.21285C1.82593 5.29658 5.00435 2.11816 8.92061 2.11816C12.8369 2.11816 16.0153 5.29658 16.0153 9.21285C16.0176 10.8226 15.47 12.3848 14.4631 13.6407ZM12.8818 13.0558C13.8823 12.027 14.441 10.6479 14.4387 9.21285C14.4387 6.16371 11.969 3.69476 8.92061 3.69476C5.87147 3.69476 3.40252 6.16371 3.40252 9.21285C3.40252 12.2612 5.87147 14.7309 8.92061 14.7309C10.3557 14.7332 11.7347 14.1745 12.7636 13.174L12.8818 13.0558Z",
    fill: "#98A2B3"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("clipPath", {
    id: "clip0_7075_27802"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
    width: "18.9192",
    height: "18.9192",
    fill: "white",
    transform: "translate(0.248535 0.540039)"
  })))), placeholder && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "search-input"
  }, placeholder)), buttonText && searchButton && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "search-button"
  }, buttonText)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LayoutOne);
})();

/******/ })()
;
//# sourceMappingURL=LayoutOne.js.map