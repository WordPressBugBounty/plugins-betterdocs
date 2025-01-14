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
/*!******************************************************************!*\
  !*** ./react-src/public/shortcodes/search-modal/NoResultIcon.js ***!
  \******************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


const NoResultIcon = () => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: "217",
    height: "216",
    viewBox: "0 0 217 216",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("mask", {
    id: "mask0_7201_2527",
    style: {
      maskType: 'luminance'
    },
    maskUnits: "userSpaceOnUse",
    x: "0",
    y: "0",
    width: "217",
    height: "216"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M216.333 0H0.687012V215.646H216.333V0Z",
    fill: "white"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    mask: "url(#mask0_7201_2527)"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M108.51 193.362C156.149 193.362 194.768 154.743 194.768 107.104C194.768 59.4649 156.149 20.8457 108.51 20.8457C60.8709 20.8457 22.2517 59.4649 22.2517 107.104C22.2517 154.743 60.8709 193.362 108.51 193.362Z",
    fill: "#F2F4F7"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M76.1632 45.6855H142.68C149.033 45.6855 154.182 50.8344 154.182 57.1866V145.622C154.182 151.974 149.033 157.123 142.68 157.123H76.1632C69.811 157.123 64.6621 151.974 64.6621 145.622V57.1866C64.6621 50.8344 69.811 45.6855 76.1632 45.6855Z",
    fill: "url(#paint0_linear_7201_2527)"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M76.0913 60.0625H104.988C106.933 60.0625 108.51 61.6396 108.51 63.5847C108.51 65.5298 106.933 67.1069 104.988 67.1069H76.0913C74.1462 67.1069 72.5691 65.5298 72.5691 63.5847C72.5691 61.6396 74.1462 60.0625 76.0913 60.0625Z",
    fill: "#344054"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M76.0913 80.0449H140.929C142.874 80.0449 144.451 81.622 144.451 83.5671C144.451 85.5122 142.874 87.0893 140.929 87.0893H76.0913C74.1462 87.0893 72.5691 85.5122 72.5691 83.5671C72.5691 81.622 74.1462 80.0449 76.0913 80.0449Z",
    fill: "#DCEAE9"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M76.0913 100.027H140.929C142.874 100.027 144.451 101.604 144.451 103.55C144.451 105.495 142.874 107.072 140.929 107.072H76.0913C74.1462 107.072 72.5691 105.495 72.5691 103.55C72.5691 101.604 74.1462 100.027 76.0913 100.027Z",
    fill: "#DCEAE9"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M76.0913 120.01H140.929C142.874 120.01 144.451 121.587 144.451 123.532C144.451 125.477 142.874 127.054 140.929 127.054H76.0913C74.1462 127.054 72.5691 125.477 72.5691 123.532C72.5691 121.587 74.1462 120.01 76.0913 120.01Z",
    fill: "#DCEAE9"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M76.0913 139.994H140.929C142.874 139.994 144.451 141.571 144.451 143.516C144.451 145.461 142.874 147.039 140.929 147.039H76.0913C74.1462 147.039 72.5691 145.461 72.5691 143.516C72.5691 141.571 74.1462 139.994 76.0913 139.994Z",
    fill: "#DCEAE9"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M207.815 33.3711H164.628C162.616 33.3711 160.984 35.0876 160.984 37.206V58.5685C160.984 60.6862 162.616 62.4034 164.628 62.4034H207.815C209.828 62.4034 211.459 60.6862 211.459 58.5685V37.206C211.459 35.0876 209.828 33.3711 207.815 33.3711Z",
    fill: "white"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M171.766 52.4735C174.148 52.4735 176.079 50.5427 176.079 48.1606C176.079 45.7784 174.148 43.8477 171.766 43.8477C169.384 43.8477 167.453 45.7784 167.453 48.1606C167.453 50.5427 169.384 52.4735 171.766 52.4735Z",
    fill: "#C5D8D3"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M186.142 43.8477H200.519C202.901 43.8477 204.832 45.7784 204.832 48.1606C204.832 50.5427 202.901 52.4735 200.519 52.4735H186.142C183.76 52.4735 181.83 50.5427 181.83 48.1606C181.83 45.7784 183.76 43.8477 186.142 43.8477Z",
    fill: "#DCEAE9"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M133.747 162.139C143.005 162.139 151.609 159.339 158.759 154.539L188.014 182.466L198.624 170.156L170.394 143.208C175.608 135.87 178.674 126.9 178.674 117.213C178.674 92.4018 158.559 72.2871 133.747 72.2871C108.935 72.2871 88.8213 92.4018 88.8213 117.213C88.8213 142.025 108.935 162.139 133.747 162.139ZM172.067 117.213C172.067 138.22 155.037 155.249 134.031 155.249C113.025 155.249 95.9965 138.22 95.9965 117.213C95.9965 96.2072 113.025 79.1784 134.031 79.1784C155.037 79.1784 172.067 96.2072 172.067 117.213Z",
    fill: "#90B8B1"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M134.028 155.982C155.664 155.982 173.203 138.603 173.203 117.166C173.203 95.7285 155.664 78.3496 134.028 78.3496C112.391 78.3496 94.8523 95.7285 94.8523 117.166C94.8523 138.603 112.391 155.982 134.028 155.982Z",
    fill: "white",
    fillOpacity: "0.3"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M140.801 117.167L150.282 107.724C151.17 106.789 151.657 105.538 151.657 104.227C151.657 102.042 150.311 100.118 148.433 99.3831C146.556 98.6487 144.403 99.2656 143.166 100.842L134.034 112.34L124.902 100.842C123.665 99.2656 121.512 98.6487 119.635 99.3831C117.758 100.118 116.412 102.042 116.412 104.227C116.412 105.538 116.899 106.789 117.787 107.724L127.268 117.167L117.787 126.609C116.278 128.228 116.278 130.856 117.787 132.474C119.295 134.093 121.767 134.093 123.276 132.474L134.034 120.68L144.793 132.474C145.547 133.312 146.562 133.73 147.578 133.73C148.593 133.73 149.608 133.312 150.362 132.474C151.871 130.856 151.871 128.228 150.362 126.609L140.801 117.167Z",
    fill: "#344054"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
    id: "paint0_linear_7201_2527",
    x1: "64.6621",
    y1: "57.6866",
    x2: "155.982",
    y2: "57.6866",
    gradientUnits: "userSpaceOnUse"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
    stopColor: "white"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
    offset: "1",
    stopColor: "#DCEAE9"
  })))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NoResultIcon);
})();

/******/ })()
;
//# sourceMappingURL=NoResultIcon.js.map