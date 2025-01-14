/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "clipboard":
/*!******************************!*\
  !*** external "ClipboardJS" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = ClipboardJS;

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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************************!*\
  !*** ./react-src/public/betterdocs.js ***!
  \****************************************/
class BetterDocs {
  constructor(config) {
    this.config = config;
    this.initialize();
    this.init();
  }
  init() {
    this.categoryListAccordion();
    this.feedbackForm();

    // Single Docs
    this.printToc();
    this.stickyTocContainer();
    this.tocClose();
    this.cloneTocContentToAfter();
    this.copyToClipboard();
    this.subCategoryExpand();
    this.tocSmallCollapisble();
    this.sidebarOpen();
    this.tocOpen();
  }
  tocSmallCollapisble() {
    $ = jQuery;
    var docTocTitle = $(".betterdocs-toc.collapsible-sm .toc-title");
    docTocTitle.each(function () {
      $(this).click(function (e) {
        e.preventDefault();
        $(this).children(".angle-icon").toggle();
        $(this).next(".toc-list").slideToggle();
      });
    });
  }
  initialize() {
    var $ = jQuery;
    this.body = $("body");
    this.catTitleList = $(".betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-single-category-wrapper .betterdocs-category-header");
    this.currentActiveCat = $(".betterdocs-sidebar-content .betterdocs-category-grid-wrapper .betterdocs-single-category-wrapper.active");
    this.listSidebarCatTitles = $(".betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list .betterdocs-category-header");
    this.listSidebarCurrentCat = $(".betterdocs-sidebar-content .betterdocs-sidebar-list-wrapper .betterdocs-sidebar-list.active");
    // single page feedback form selectors
    this.formLink = $("a[name=betterdocs-form-modal]");
    this.feedbackFormWrap = $("#betterdocs-feedback-form");
    this.feedbackFormFields = $("#betterdocs-feedback-form input, #betterdocs-feedback-form textarea");
  }
  categoryListAccordion() {
    let $parentThis = this;
    $parentThis.listSidebarCurrentCat.find(".betterdocs-body").css("display", "block");
    $parentThis.listSidebarCurrentCat.siblings().find(".betterdocs-body").css("display", "none");
    this.listSidebarCatTitles.on("click", function (e) {
      e.preventDefault();
      let $parentCat = jQuery(e.target).closest(".betterdocs-sidebar-list");
      $parentCat.find(".betterdocs-body").slideToggle();
      $parentCat.toggleClass("active").siblings().removeClass("active").find(".betterdocs-body").slideUp();
    });
  }

  // function to add link active class on scroll
  onScroll() {
    var $ = jQuery;
    var scrollPos = $(document).scrollTop();
    $(".sticky-toc-container .betterdocs-toc .toc-list a, .betterdocs-full-sidebar-right .betterdocs-toc .toc-list a, .wp-block-group.is-position-sticky .betterdocs-toc .toc-list a").each(function () {
      var currLink = $(this);
      var refElement = $(currLink.attr("href"));
      if (refElement.position()?.top <= scrollPos && refElement.position()?.top + refElement.height() > scrollPos) {
        $(".betterdocs-toc .toc-list a").removeClass("active");
        currLink.addClass("active");
      }
    });
  }
  stickyTocContainer() {
    var $ = jQuery;
    let $parentThis = this;
    var betterdocsSidebar = $("#betterdocs-sidebar");
    var betterdocsToc = $(".betterdocs-toc");
    if (betterdocsToc.length > 0 && betterdocsSidebar.length) {
      // create an instance of TOC
      var stickyTocContent = $(".betterdocs-toc").clone();
      $(".sticky-toc-container").append(stickyTocContent);
    }
    $(window).on("scroll", function () {
      var tocSidebar = document.querySelector(".betterdocs-sidebar-content");
      var mainTocEligibleForScrolling = $('.sticky-toc-container .betterdocs-toc .toc-list li a')?.length > 0; // check if toc items exists, based on this return 'true' or 'false'
      if (tocSidebar === null) {
        return;
      }
      var stickyToc = $(".sticky-toc-container");
      var tocHeight = $(".betterdocs-sidebar-content").outerHeight();
      var tocSidebarRect = tocSidebar.getBoundingClientRect();
      var tocSidebarTop = Math.abs(tocSidebarRect?.top);
      if (tocSidebarRect?.top < 0 && tocHeight <= tocSidebarTop && mainTocEligibleForScrolling) {
        stickyToc.addClass("toc-sticky");
      } else {
        stickyToc.removeClass("toc-sticky");
      }
      //for elementor single doc template
      if (betterdocsSidebar.closest(".elementor-widget-wrap")?.length > 0) {
        if ($(window).scrollTop() >= betterdocsSidebar.closest(".elementor-widget-wrap").offset()?.top + betterdocsSidebar.closest(".elementor-widget-wrap").outerHeight() - window.innerHeight && !betterdocsSidebar.hasClass("betterdocs-el-single-sidebar")) {
          stickyToc?.removeClass("toc-sticky");
        }
      } else if (betterdocsSidebar.closest(".wp-block-column")?.length > 0) {
        //for blocks fse templates single doc
        if ($(window).scrollTop() >= betterdocsSidebar.closest(".wp-block-column").offset()?.top + betterdocsSidebar.closest(".wp-block-column").outerHeight() - window.innerHeight && !betterdocsSidebar.hasClass("betterdocs-el-single-sidebar")) {
          stickyToc?.removeClass("toc-sticky");
        }
      } else if (
      //for normal template single doc rendered by betterdocs itself, betterdocs native single doc Sticky TOC template
      $(window).scrollTop() >= betterdocsSidebar.offset()?.top + betterdocsSidebar.outerHeight() - window.innerHeight && !betterdocsSidebar.hasClass("betterdocs-el-single-sidebar")) {
        stickyToc?.removeClass("toc-sticky");
      }
    });

    // Add smooth scrolling to links
    $(document).on("scroll", $parentThis?.onScroll);
    var toc_links = $(".betterdocs-toc .toc-list a");
    toc_links.on("click", function (e) {
      e.preventDefault();
      $(document).off("scroll");
      toc_links.each(function () {
        $(this).removeClass("active");
      });
      $(this).addClass("active");
      var target = decodeURIComponent(this.hash),
        $target = $(target);
      var scrollTopOffset = $target.offset()?.top;
      $("html, body").stop().animate({
        scrollTop: scrollTopOffset - betterdocsConfig?.sticky_toc_offset
      }, "slow", function () {
        $(document).on("scroll", $parentThis?.onScroll);
      });
    });
  }
  tocClose() {
    var $ = jQuery;
    // close sticky toc
    $(".close-toc").on("click", function (event) {
      event.preventDefault();
      $(".sticky-toc-container").remove(".sticky-toc-container");
    });
  }
  sidebarOpen() {
    var $ = jQuery;
    if ($(window).width() <= 768) {
      // Click to open the left sidebar
      $('.betterdocs-sidebar-icon').on('click', function (e) {
        e.stopPropagation(); // Prevent click propagation to the document

        // Check if the wrapper doesn't already exist to avoid duplicates
        if (!$('.betterdocs-mobile-sidebar-wrapper').length) {
          // Wrap sidebar elements with the wrapper div
          $('#betterdocs-sidebar, #betterdocs-sidebar-left, #betterdocs-full-sidebar-left').wrap('<div class="betterdocs-mobile-sidebar-wrapper"></div>');
        }

        // Append the wrapper to the `.betterdocs-content-wrapper` instead of body
        if (!$('.betterdocs-mobile-sidebar-wrapper').parent().is('.betterdocs-content-wrapper')) {
          $('.betterdocs-content-wrapper').append($('.betterdocs-mobile-sidebar-wrapper'));
        }

        // Slide in the sidebar by animating its left position
        $('.betterdocs-mobile-sidebar-wrapper').fadeIn();
        $('#betterdocs-sidebar, #betterdocs-sidebar-left, #betterdocs-full-sidebar-left').css({
          'left': '-300px',
          'display': 'block'
        }).animate({
          left: '0'
        }, 300); // Adjust time for the sliding effect
      });

      // Close the left sidebar on click outside
      $(document).on('click.betterdocs-left-sidebar', function (e) {
        if (!$(e.target).closest('#betterdocs-sidebar, #betterdocs-sidebar-left, #betterdocs-full-sidebar-left, .betterdocs-sidebar-icon').length) {
          $('#betterdocs-sidebar, #betterdocs-sidebar-left, #betterdocs-full-sidebar-left').animate({
            left: '-300px'
          }, 300, function () {
            $('.betterdocs-mobile-sidebar-wrapper').fadeOut();
          });
        }
      });

      // Prevent closing the left sidebar when clicked inside
      $('#betterdocs-sidebar, #betterdocs-sidebar-left, #betterdocs-full-sidebar-left').on('click', function (e) {
        e.stopPropagation(); // Prevent sidebar clicks from propagating to the document click handler
      });
    }
  }
  tocOpen() {
    var $ = jQuery;
    if ($(window).width() <= 768) {
      // Click to open the right sidebar
      $('.betterdocs-toc-icon').on('click', function (e) {
        e.stopPropagation(); // Prevent click propagation to the document

        // Check if the wrapper doesn't already exist to avoid duplicates
        if (!$('.betterdocs-mobile-toc-wrapper').length) {
          // Wrap sidebar elements with the wrapper div
          $('#betterdocs-sidebar-right').wrap('<div class="betterdocs-mobile-toc-wrapper"></div>');
        }

        // Append the wrapper to the `.betterdocs-content-wrapper` instead of body
        if (!$('.betterdocs-mobile-toc-wrapper').parent().is('.betterdocs-content-wrapper')) {
          $('.betterdocs-content-wrapper').append($('.betterdocs-mobile-toc-wrapper'));
        }

        // Slide in the sidebar by animating its right position
        $('.betterdocs-mobile-toc-wrapper').fadeIn();
        $('#betterdocs-sidebar-right').css({
          'right': '-300px',
          'display': 'block'
        }).animate({
          right: '0'
        }, 300); // Adjust time for the sliding effect
      });

      // Close the right sidebar on click outside
      $(document).on('click.betterdocs-right-sidebar', function (e) {
        if (!$(e.target).closest('#betterdocs-sidebar-right, .betterdocs-toc-icon').length) {
          $('#betterdocs-sidebar-right').animate({
            right: '-300px'
          }, 300, function () {
            $('.betterdocs-mobile-toc-wrapper').fadeOut();
          });
        }
      });

      // Prevent closing the right sidebar when clicked inside
      $('#betterdocs-sidebar-right').on('click', function (e) {
        e.stopPropagation(); // Prevent sidebar clicks from propagating to the document click handler
      });
    }
  }
  delay(callback, time) {
    setTimeout(callback, time);
  }
  printToc() {
    this.reusablePrintFunction('.betterdocs-print-btn');
    this.reusablePrintFunction('.betterdocs-print-pdf-2');
  }
  cloneTocContentToAfter() {
    let $ = jQuery;
    let tocContent = $(".betterdocs-single-layout-3 #betterdocs-sidebar-right .betterdocs-toc .toc-list a");
    $.each(tocContent, function (index, item) {
      $(this).addClass(`toc-item-link-${index + 1}`);
      $(`<style>.toc-item-link-${index + 1}:after {height: ${item.offsetHeight + 10}px}</style>`).appendTo("head");
    });
  }
  reusablePrintFunction(selector) {
    var $ = jQuery;
    // close sticky toc
    $("body").on("click", selector, function (event) {
      let entryTitle = "";
      if ($("#betterdocs-entry-title").length) {
        entryTitle = document.getElementById("betterdocs-entry-title").innerHTML;
      } else if ($('.wp-block-post-title').length) {
        //for blocks single doc title
        entryTitle = document.getElementsByClassName("wp-block-post-title")[0]?.innerHTML;
      }
      var printContents = document.getElementById("betterdocs-single-content").innerHTML;
      var combined = document.createElement("div");
      combined.innerHTML = "<h1>" + entryTitle + "</h1>" + " " + printContents;
      combined.id = "new-doc-print";
      var pwidth = document.getElementById("betterdocs-single-content").offsetWidth;
      var wheight = $(window).height();
      var winPrint = window.open("", "", "left=50%,top=10%,width=" + pwidth + ",height=" + wheight + ",toolbar=0,scrollbars=0,status=0");

      // Add the stylesheet to the new window
      var styles = Array.from(document.styleSheets).map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('');
        } catch (e) {
          console.log('Access to stylesheet blocked by CORS policy:', styleSheet.href);
          return '';
        }
      }).join('\n');
      var styleElement = winPrint.document.createElement('style');
      styleElement.textContent = styles;
      winPrint.document.head.appendChild(styleElement);
      winPrint.document.body.innerHTML = combined.outerHTML;
      winPrint.document.close();
      winPrint.focus();
      winPrint.print();

      // Delay the close action to avoid malfunction of the print button
      setTimeout(function () {
        winPrint.close();
      }, 300);
    });
  }
  copyToClipboard() {
    let $ = jQuery;
    if ($(".batterdocs-anchor").length) {
      const getURLClipboard = function (e) {
        // Clipboard
        e.preventDefault();
        e.stopPropagation();
        let clipboardJS = new ClipboardJS(e.target);
        clipboardJS.on("success", function (e) {
          $(document).find("div.tooltip-box").text(betterdocsConfig.copy_text);
          e.clearSelection();
          $(e.trigger).addClass("copied");
          setTimeout(function () {
            $(e.trigger).removeClass("copied");
          }, 2000);
          clipboardJS.destroy();
        });

        // Triggering the First Click Here. and also emitting the event to work above code.
        let text = ClipboardJS.copy(e.target.dataset.clipboardText);
        clipboardJS.emit(text ? 'success' : 'error', {
          action: 'copy',
          text,
          trigger: e.target,
          clearSelection() {
            if (e.target) {
              e.target.focus();
            }
            window.getSelection().removeAllRanges();
          }
        });
      };

      // tooltips
      $('a.batterdocs-anchor[href*="#"]').hover(function () {
        var title = $(this).attr("data-title");
        $("<div/>", {
          text: title,
          class: "tooltip-box"
        }).appendTo(this);
      }, function () {
        $(this).find("div.tooltip-box").remove();
      }).on('click', getURLClipboard);
      (function () {
        if (typeof self === "undefined" || !self.Prism || !self.document) {
          return;
        }
        if (!Prism.plugins.toolbar) {
          console.warn("Copy to Clipboard plugin loaded before Toolbar plugin.");
          return;
        }
        var ClipboardJS = window.ClipboardJS || undefined;
        if (!ClipboardJS && "function" === "function") {
          ClipboardJS = __webpack_require__(/*! clipboard */ "clipboard");
        }
        var callbacks = [];
        if (!ClipboardJS) {
          var script = document.createElement("script");
          var head = document.querySelector("head");
          script.onload = function () {
            ClipboardJS = window.ClipboardJS;
            if (ClipboardJS) {
              while (callbacks.length) {
                callbacks.pop()();
              }
            }
          };
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js";
          head.appendChild(script);
        }
        Prism.plugins.toolbar.registerButton("copy-to-clipboard", function (env) {
          var linkCopy = document.createElement("button");
          linkCopy.textContent = "Copy";
          if (!ClipboardJS) {
            callbacks.push(registerClipboard);
          } else {
            registerClipboard();
          }
          return linkCopy;
          function registerClipboard() {
            var clip = new ClipboardJS(linkCopy, {
              text: function () {
                return env.code;
              }
            });
            clip.on("success", function () {
              linkCopy.textContent = "Copied!";
              resetText();
            });
            clip.on("error", function () {
              linkCopy.textContent = "Press Ctrl+C to copy";
              resetText();
            });
          }
          function resetText() {
            setTimeout(function () {
              linkCopy.textContent = "Copy";
            }, 5000);
          }
        });
      })();
    }
  }
  feedbackForm() {
    var $ = jQuery;
    var $this = this;
    let formModal = $("#betterdocs-form-modal");
    let formModalContent = $("#betterdocs-form-modal .modal-content");
    //select all the a tag with name equal to modal
    this.formLink.click(function (e) {
      e.preventDefault();
      formModal.fadeIn(500);
    });

    //if outside of modal content is clicked
    $(document).mouseup(function (e) {
      if (!formModalContent.is(e.target) && formModalContent.has(e.target).length === 0) {
        formModal.fadeOut();
      }
    });

    //if close button is clicked
    $(".betterdocs-modalwindow .close").click(function (e) {
      e.preventDefault();
      formModal.fadeOut(500);
    });
    this.feedbackFormFields.on("keyup", function () {
      $(this).removeClass("val-error");
      $(this).siblings(".error-message").remove();
    });
    this.feedbackFormWrap.on("submit", function (e) {
      e.preventDefault();
      var form = $(this);
      var message_name = $("#message_name");
      var message_email = $("#message_email");
      var message_subject = $("#message_subject");
      var message_text = $("#message_text");
      $this.betterdocsFeedbackFormSubmit(form, message_name, message_email, message_subject, message_text);
    });
    this.betterdocsFeedbackFormSubmit = function (form, message_name, message_email, message_subject, message_text) {
      let request;
      if (request) {
        request.abort();
      }
      request = $.ajax({
        url: betterdocsSubmitFormConfig.ajax_url,
        type: "post",
        data: {
          action: "betterdocs_feedback_form_submit",
          form: form.serializeArray(),
          postID: betterdocsSubmitFormConfig.post_id,
          message_name: message_name.val(),
          message_email: message_email.val(),
          message_subject: message_subject.val(),
          message_text: message_text.val(),
          security: betterdocsSubmitFormConfig.nonce
        },
        beforeSend: function () {},
        success: function (data) {
          if (data.success) {
            if (data.success == true) {
              $(".response").html('<span class="success-message">' + data.data.message + "</span>");
              form[0].reset();
              $this.delay(function () {
                $(".betterdocs-modalwindow").fadeOut(500);
                $(".response .success-message").remove();
              }, 3000);
            } else {
              $(".response").html('<span class="error-message">' + data.sentMessage + "</span>");
            }
          } else if (data.success == false) {
            if (data.data.message.name) {
              if (message_name.hasClass("val-error") == false) {
                message_name.addClass("val-error");
                $(".form-name").append('<span class="error-message">' + data.data.message.name + "</span>");
              }
            }
            if (data.data.message.email) {
              if (message_email.hasClass("val-error") == false) {
                message_email.addClass("val-error");
                $(".form-email").append('<span class="error-message">' + data.data.message.email + "</span>");
              }
            }
            if (data.data.message.message) {
              if (message_text.hasClass("val-error") == false) {
                message_text.addClass("val-error");
                $(".form-message").append('<span class="error-message">' + data.data.message.message + "</span>");
              }
            }
          }
        }
      });
    };
  }
  subCategoryExpand() {
    var $ = jQuery;
    let subCatActive = $(".betterdocs-nested-category-list.betterdocs-current-category.active");

    /**
     * Subcategory Expand On Load Including Nested Subcategories
     */
    if (subCatActive.length > 0) {
      subCatActive.each(function (index) {
        $(this).prev().children(".toggle-arrow").toggle();
      });
    }
  }
}
(function ($) {
  "use strict";

  $(document).ready(function () {
    new BetterDocs(window?.betterdocsConfig);
  });
})(jQuery);
})();

/******/ })()
;
//# sourceMappingURL=betterdocs.js.map