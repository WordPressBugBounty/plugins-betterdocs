/******/ (() => { // webpackBootstrap
/*!***************************************!*\
  !*** ./react-src/admin/betterdocs.js ***!
  \***************************************/
class BetterDocsAdmin {
  constructor(config) {
    this.config = config;
    this.initialize();
    this.init();
  }
  init() {
    this.settingsTab();
    this.sortable();
    this.copyToClipboard();
    this.enableDarkMode();
    this.generateSampleData();
  }
  initialize() {
    var $ = jQuery;
    this.body = $("body");
    this.droppableUl = $(".betterdocs-single-listing ul");
    this.copyBtn = $(".betterdocs-settings-input-text span");
    this.darkModeBtn = $("#betterdocs-mode-toggle");
    this.settingsMenu = $(".betterdocs-settings-menu li");
  }
  settingsTab() {
    this.settingsMenu.on("click", function (e) {
      var $ = jQuery;
      var tabToGo = $(this).data("tab");
      $(this).addClass("active").siblings().removeClass("active");
      $("#betterdocs-" + tabToGo).addClass("active").siblings().removeClass("active");
    });
  }
  get_query_vars(name) {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (_, key, value) => vars[key] = value);
    return name !== "" ? vars[name] : vars;
  }
  enableDarkMode() {
    var $this = this;
    this.darkModeBtn.prop("checked", Boolean(this.config.dark_mode));
    this.darkModeBtn.on("click", function (e) {
      $this.body.toggleClass("betterdocs-dark-mode");
      jQuery.ajax({
        type: "POST",
        url: $this.config.ajaxurl,
        data: {
          action: "betterdocs_dark_mode",
          mode: e.currentTarget.checked ? 1 : 0,
          nonce: $this.config.doc_cat_order_nonce
        },
        dataType: "JSON",
        success: function (response) {
          if (response?.success == false) {
            $this.body.toggleClass("betterdocs-dark-mode");
          }
        }
      });
    });
  }
  permalinkStructure() {
    var multiple_kb = $("#multiple_kb");
    var permalink_structure = $("#permalink_structure");
    var $val = permalink_structure.val();
    if ($val && !multiple_kb.is(":checked")) {
      permalink_structure.val($val.replace(/%knowledge_base%\/?/g, ""));
    }
  }
  copyToClipboard() {
    var $this = this;
    this.copyBtn.on("click", function (e) {
      var previousValue = this.previousSibling;
      previousValue.select();
      document.execCommand("copy");
      this.firstChild.textContent = $this.config.text;
      previousValue.setSelectionRange(0, 99999);
    });
  }
  setView() {}
  sortable() {
    var $this = this;
    this.droppableUl.each((i, _item) => {
      var singleDocsList = jQuery(_item),
        termID = singleDocsList.data("category_id"),
        droppable = false;
      if (singleDocsList.hasClass("docs-droppable")) {
        droppable = true;
      }
      singleDocsList.sortable({
        connectWith: "ul.docs-droppable",
        placeholder: "betterdocs-post-list-placeholder",
        // axis: droppable ? "y" : true,
        // On start, set a height for the placeholder to prevent table jumps.
        start: function (event, ui) {
          const item = jQuery(ui.item[0]);
          jQuery(".betterdocs-post-list-placeholder").css("height", item.css("height"));
        },
        receive: function (event, ui) {
          const item = ui.item;
          item.siblings(".betterdocs-no-docs").remove();
          if (termID != undefined) {
            // AJAX Data.
            const data = {
              action: "update_docs_term",
              object_id: item.data("id"),
              prev_term_id: ui.sender.data("category_id"),
              list_term_id: termID,
              doc_cat_order_nonce: $this.config.doc_cat_order_nonce
            };
            // Run the ajax request.
            jQuery.ajax({
              type: "POST",
              url: $this.config.ajaxurl,
              data: data,
              dataType: "JSON",
              success: function (response) {
                // console.log( response );
              }
            });
          }
        },
        update: function (event, ui) {
          const docs_ordering_data = [];
          singleDocsList.find("li.ui-sortable-handle").each(function () {
            const ele = jQuery(this);
            docs_ordering_data.push(ele.data("id"));
          });
          if (termID != undefined) {
            // AJAX Data.
            const data = {
              action: "update_doc_order_by_category",
              docs_ordering_data: docs_ordering_data,
              list_term_id: termID,
              doc_cat_order_nonce: $this.config.doc_cat_order_nonce
            };
            // Run the ajax request.
            jQuery.ajax({
              type: "POST",
              url: $this.config.ajaxurl,
              data: data,
              dataType: "JSON",
              success: function (response) {
                // console.log( response );
              }
            });
          }
        }
      });
    });
  }
  generateSampleData() {
    let $ = jQuery;
    let generateButtonDom = $('.generate-sample-data');
    let apiUrl = this?.config?.generate_data_url;
    let nonce = this?.config?.nonce;
    generateButtonDom.on('click', function (e) {
      e.preventDefault();
      generateButtonDom.text('Generating...');
      jQuery?.ajax({
        type: "POST",
        url: apiUrl,
        data: {
          action: 'create-dummy-data',
          _wpnonce: nonce
        },
        dataType: "JSON",
        success: function (response) {
          if (response?.status == 'success') {
            generateButtonDom?.text('Generated Successfully');
            window.location.reload();
          }
        }
      });
    });
  }
}
(function ($) {
  "use strict";

  new BetterDocsAdmin(window?.betterdocs_admin);
})(jQuery);
/******/ })()
;
//# sourceMappingURL=betterdocs.js.map