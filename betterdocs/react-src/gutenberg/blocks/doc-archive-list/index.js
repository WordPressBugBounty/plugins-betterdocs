/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./blocks/doc-archive-list/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./blocks/doc-archive-list/icon/DocIcon.js":
/*!*************************************************!*\
  !*** ./blocks/doc-archive-list/icon/DocIcon.js ***!
  \*************************************************/
/*! exports provided: DocIcon, ArrowDown */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DocIcon\", function() { return DocIcon; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ArrowDown\", function() { return ArrowDown; });\nconst DocIcon = () => {\n  return /* @__PURE__ */ React.createElement(\"svg\", {\n    xmlns: \"http://www.w3.org/2000/svg\",\n    \"aria-hidden\": \"true\",\n    width: \".86em\",\n    height: \"1em\",\n    style: {\n      msTransform: \"rotate(360deg)\",\n      WebkitTransform: \"rotate(360deg)\",\n      transform: \"rotate(360deg)\"\n    },\n    viewBox: \"0 0 1536 1792\"\n  }, /* @__PURE__ */ React.createElement(\"path\", {\n    d: \"M1468 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28H96q-40 0-68-28t-28-68V96q0-40 28-68T96 0h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528V640H992q-40 0-68-28t-28-68V128H128v1536h1280zM384 800q0-14 9-23t23-9h704q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64zm736 224q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704zm0 256q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704z\"\n  }));\n};\nconst ArrowDown = () => {\n  return /* @__PURE__ */ React.createElement(\"svg\", {\n    className: \"toggle-arrow arrow-down\",\n    xmlns: \"http://www.w3.org/2000/svg\",\n    \"aria-hidden\": \"true\",\n    width: \".8em\",\n    height: \"1em\",\n    style: {\n      msTransform: \"rotate(360deg)\",\n      WebkitTransform: \"rotate(360deg)\",\n      transform: \"rotate(360deg)\"\n    },\n    viewBox: \"0 0 1024 1280\"\n  }, /* @__PURE__ */ React.createElement(\"path\", {\n    d: \"M1011 480q0 13-10 23L535 969q-10 10-23 10t-23-10L23 503q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z\"\n  }));\n};\n\n\n//# sourceURL=webpack:///./blocks/doc-archive-list/icon/DocIcon.js?");

/***/ }),

/***/ "./blocks/doc-archive-list/src/attributes.js":
/*!***************************************************!*\
  !*** ./blocks/doc-archive-list/src/attributes.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst { __ } = wp.i18n;\nconst attributes = {\n  resOption: {\n    type: \"string\",\n    default: \"Desktop\"\n  },\n  blockId: {\n    type: \"string\"\n  },\n  blockRoot: {\n    type: \"string\",\n    default: \"better_docs\"\n  },\n  blockMeta: {\n    type: \"object\"\n  },\n  nested_subcategory: {\n    type: \"boolean\",\n    default: true\n  },\n  order_by: {\n    type: \"string\",\n    default: \"title\"\n  },\n  order: {\n    type: \"string\",\n    default: \"asc\"\n  },\n  nested_subcategory: {\n    type: \"boolean\",\n    default: false\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (attributes);\n\n\n//# sourceURL=webpack:///./blocks/doc-archive-list/src/attributes.js?");

/***/ }),

/***/ "./blocks/doc-archive-list/src/constants.js":
/*!**************************************************!*\
  !*** ./blocks/doc-archive-list/src/constants.js ***!
  \**************************************************/
/*! exports provided: ARCHIVE_DOC_ORDERBY */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ARCHIVE_DOC_ORDERBY\", function() { return ARCHIVE_DOC_ORDERBY; });\nconst ARCHIVE_DOC_ORDERBY = \"archive_doc_orderby\";\n\n\n//# sourceURL=webpack:///./blocks/doc-archive-list/src/constants.js?");

/***/ }),

/***/ "./blocks/doc-archive-list/src/edit.js":
/*!*********************************************!*\
  !*** ./blocks/doc-archive-list/src/edit.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _inspector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inspector */ \"./blocks/doc-archive-list/src/inspector.js\");\n/* harmony import */ var _icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../icon/DocIcon */ \"./blocks/doc-archive-list/icon/DocIcon.js\");\nvar require;var __defProp = Object.defineProperty;\nvar __getOwnPropSymbols = Object.getOwnPropertySymbols;\nvar __hasOwnProp = Object.prototype.hasOwnProperty;\nvar __propIsEnum = Object.prototype.propertyIsEnumerable;\nvar __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;\nvar __spreadValues = (a, b) => {\n  for (var prop in b || (b = {}))\n    if (__hasOwnProp.call(b, prop))\n      __defNormalProp(a, prop, b[prop]);\n  if (__getOwnPropSymbols)\n    for (var prop of __getOwnPropSymbols(b)) {\n      if (__propIsEnum.call(b, prop))\n        __defNormalProp(a, prop, b[prop]);\n    }\n  return a;\n};\nvar __require = typeof require !== \"undefined\" ? require : (x) => {\n  throw new Error('Dynamic require of \"' + x + '\" is not supported');\n};\nconst { __ } = wp.i18n;\nconst { useEffect } = wp.element;\nconst { select } = wp.data;\nconst { useBlockProps } = wp.blockEditor;\n\n\nconst edit = ({ attributes, setAttributes, isSelected, clientId }) => {\n  const { resOption, blockId, blockMeta, blockRoot } = attributes;\n  const blockProps = useBlockProps({\n    className: `bd-guten-block-main-parent-wrapper`\n  });\n  return /* @__PURE__ */ React.createElement(React.Fragment, null, isSelected && /* @__PURE__ */ React.createElement(_inspector__WEBPACK_IMPORTED_MODULE_0__[\"default\"], {\n    attributes,\n    setAttributes\n  }), /* @__PURE__ */ React.createElement(\"div\", __spreadValues({}, blockProps), /* @__PURE__ */ React.createElement(\"div\", {\n    id: \"main\",\n    className: \"docs-listing-main\"\n  }, /* @__PURE__ */ React.createElement(\"div\", {\n    className: \"docs-category-listing\"\n  }, /* @__PURE__ */ React.createElement(\"div\", {\n    className: \"docs-cat-title\"\n  }, /* @__PURE__ */ React.createElement(\"h3\", {\n    className: \"docs-cat-heading\"\n  }, \"Dummy Title\"), /* @__PURE__ */ React.createElement(\"p\", null, \"Dummy Description\")), /* @__PURE__ */ React.createElement(\"div\", {\n    className: \"docs-list\"\n  }, /* @__PURE__ */ React.createElement(\"ul\", null, /* @__PURE__ */ React.createElement(\"li\", null, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"DocIcon\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Dummy Doc 1\")), /* @__PURE__ */ React.createElement(\"li\", null, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"DocIcon\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Dummy Doc 2\")), /* @__PURE__ */ React.createElement(\"li\", null, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"DocIcon\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Dummy Doc 3\")), /* @__PURE__ */ React.createElement(\"li\", null, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"DocIcon\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Dummy Doc 4\")), /* @__PURE__ */ React.createElement(\"li\", null, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"DocIcon\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Dummy Doc 5\")), /* @__PURE__ */ React.createElement(\"li\", null, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"DocIcon\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Dummy Doc 6\"))), /* @__PURE__ */ React.createElement(\"span\", {\n    className: \"docs-sub-cat-title\"\n  }, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"ArrowDown\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Subcatgory\")), /* @__PURE__ */ React.createElement(\"ul\", {\n    className: \"docs-sub-cat\"\n  }, /* @__PURE__ */ React.createElement(\"li\", {\n    className: \"sub-list\"\n  }, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"DocIcon\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Dummy Sub Doc 1\")), /* @__PURE__ */ React.createElement(\"li\", {\n    className: \"sub-list\"\n  }, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"DocIcon\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Dummy Sub Doc 2\")), /* @__PURE__ */ React.createElement(\"li\", {\n    className: \"sub-list\"\n  }, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"DocIcon\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Dummy Sub Doc 3\")), /* @__PURE__ */ React.createElement(\"li\", {\n    className: \"sub-list\"\n  }, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"DocIcon\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Dummy Sub Doc 4\")), /* @__PURE__ */ React.createElement(\"li\", {\n    className: \"sub-list\"\n  }, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"DocIcon\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Dummy Sub Doc 5\")), /* @__PURE__ */ React.createElement(\"li\", {\n    className: \"sub-list\"\n  }, /* @__PURE__ */ React.createElement(_icon_DocIcon__WEBPACK_IMPORTED_MODULE_1__[\"DocIcon\"], null), /* @__PURE__ */ React.createElement(\"a\", {\n    href: \"#\"\n  }, \"Dummy Sub Doc 6\"))))))));\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (edit);\n\n\n//# sourceURL=webpack:///./blocks/doc-archive-list/src/edit.js?");

/***/ }),

/***/ "./blocks/doc-archive-list/src/index.js":
/*!**********************************************!*\
  !*** ./blocks/doc-archive-list/src/index.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit */ \"./blocks/doc-archive-list/src/edit.js\");\n/* harmony import */ var _attributes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./attributes */ \"./blocks/doc-archive-list/src/attributes.js\");\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ \"./blocks/doc-archive-list/src/style.scss\");\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_2__);\nconst { __ } = wp.i18n;\nconst { registerBlockType } = wp.blocks;\n\n\n\nregisterBlockType(\"betterdocs/archive-doc-list\", {\n  title: __(\"BetterDocs Archive Doc List\", \"betterdocs\"),\n  description: __(\"Display Betterdocs Single Doc Content In FSE Single Docs\"),\n  category: \"betterdocs\",\n  attributes: _attributes__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  keywords: [__(\"better docs\", \"betterdocs\"), __(\"archive doc list\", \"betterdocs\"), __(\"docs archive\", \"betterdocs\")],\n  edit: _edit__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  save: () => null,\n  example: {\n    viewportWidth: 1200\n  }\n});\n\n\n//# sourceURL=webpack:///./blocks/doc-archive-list/src/index.js?");

/***/ }),

/***/ "./blocks/doc-archive-list/src/inspector.js":
/*!**************************************************!*\
  !*** ./blocks/doc-archive-list/src/inspector.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ \"./blocks/doc-archive-list/src/constants.js\");\nconst { __ } = wp.i18n;\nconst { InspectorControls } = wp.blockEditor;\nconst {\n  PanelBody,\n  TextControl,\n  Button,\n  ButtonGroup,\n  BaseControl,\n  ToggleControl,\n  SelectControl,\n  TabPanel,\n  Notice\n} = wp.components;\n\nconst Inspector = ({ attributes, setAttributes }) => {\n  const { order_by, nested_subcategory } = attributes;\n  return /* @__PURE__ */ React.createElement(InspectorControls, {\n    key: \"controls\"\n  }, /* @__PURE__ */ React.createElement(\"div\", {\n    className: \"eb-panel-control\"\n  }, /* @__PURE__ */ React.createElement(TabPanel, {\n    className: \"eb-parent-tab-panel\",\n    activeClass: \"active-tab\",\n    tabs: [\n      {\n        name: \"general\",\n        title: __(\"General\", \"betterdocs\"),\n        className: \"eb-tab general\"\n      },\n      {\n        name: \"styles\",\n        title: __(\"Style\", \"betterdocs\"),\n        className: \"eb-tab styles\"\n      },\n      {\n        name: \"advance\",\n        title: __(\"Advanced\", \"betterdocs\"),\n        className: \"eb-tab styles\"\n      }\n    ]\n  }, (tab) => {\n    return /* @__PURE__ */ React.createElement(\"div\", {\n      className: \"eb-tab-controls \" + tab.name\n    }, tab.name === \"general\" && /* @__PURE__ */ React.createElement(PanelBody, {\n      title: __(\"Query\", \"betterdocs\")\n    }, /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ToggleControl, {\n      label: __(\"Nested Subcategory\", \"betterdocs\"),\n      checked: nested_subcategory,\n      onChange: () => {\n        setAttributes({\n          nested_subcategory: !nested_subcategory\n        });\n      }\n    }))));\n  })));\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (Inspector);\n\n\n//# sourceURL=webpack:///./blocks/doc-archive-list/src/inspector.js?");

/***/ }),

/***/ "./blocks/doc-archive-list/src/style.scss":
/*!************************************************!*\
  !*** ./blocks/doc-archive-list/src/style.scss ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./blocks/doc-archive-list/src/style.scss?");

/***/ })

/******/ });