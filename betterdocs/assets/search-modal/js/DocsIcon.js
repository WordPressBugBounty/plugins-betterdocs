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
/*!**************************************************************!*\
  !*** ./react-src/public/shortcodes/search-modal/DocsIcon.js ***!
  \**************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


const DocsIcon = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "21",
  height: "20",
  viewBox: "0 0 21 20",
  fill: "none"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  clipPath: "url(#clip0_7196_26074)"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("mask", {
  id: "mask0_7196_26074",
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
  fill: "#C4C4C4"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  mask: "url(#mask0_7196_26074)"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M7.99967 15.0013H12.9997C13.2358 15.0013 13.4337 14.9214 13.5934 14.7617C13.7531 14.602 13.833 14.4041 13.833 14.168C13.833 13.9319 13.7531 13.7339 13.5934 13.5742C13.4337 13.4145 13.2358 13.3346 12.9997 13.3346H7.99967C7.76356 13.3346 7.56565 13.4145 7.40592 13.5742C7.2462 13.7339 7.16634 13.9319 7.16634 14.168C7.16634 14.4041 7.2462 14.602 7.40592 14.7617C7.56565 14.9214 7.76356 15.0013 7.99967 15.0013ZM7.99967 11.668H12.9997C13.2358 11.668 13.4337 11.5881 13.5934 11.4284C13.7531 11.2687 13.833 11.0707 13.833 10.8346C13.833 10.5985 13.7531 10.4006 13.5934 10.2409C13.4337 10.0812 13.2358 10.0013 12.9997 10.0013H7.99967C7.76356 10.0013 7.56565 10.0812 7.40592 10.2409C7.2462 10.4006 7.16634 10.5985 7.16634 10.8346C7.16634 11.0707 7.2462 11.2687 7.40592 11.4284C7.56565 11.5881 7.76356 11.668 7.99967 11.668ZM5.49967 18.3346C5.04134 18.3346 4.64898 18.1714 4.32259 17.8451C3.9962 17.5187 3.83301 17.1263 3.83301 16.668V3.33464C3.83301 2.8763 3.9962 2.48394 4.32259 2.15755C4.64898 1.83116 5.04134 1.66797 5.49967 1.66797H11.4788C11.7011 1.66797 11.9129 1.70964 12.1143 1.79297C12.3156 1.8763 12.4927 1.99436 12.6455 2.14714L16.6872 6.1888C16.84 6.34158 16.958 6.51866 17.0413 6.72005C17.1247 6.92144 17.1663 7.13325 17.1663 7.35547V16.668C17.1663 17.1263 17.0031 17.5187 16.6768 17.8451C16.3504 18.1714 15.958 18.3346 15.4997 18.3346H5.49967ZM11.333 6.66797C11.333 6.90408 11.4129 7.102 11.5726 7.26172C11.7323 7.42144 11.9302 7.5013 12.1663 7.5013H15.4997L11.333 3.33464V6.66797Z",
  fill: "#D0D5DD"
}))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("clipPath", {
  id: "clip0_7196_26074"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("rect", {
  x: "0.5",
  width: "20",
  height: "20",
  rx: "6.4",
  fill: "white"
}))));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DocsIcon);
})();

/******/ })()
;
//# sourceMappingURL=DocsIcon.js.map