/******/ (() => { // webpackBootstrap
/*!******************************************!*\
  !*** ./react-src/admin/category-edit.js ***!
  \******************************************/
(function ($) {
  $(document).ready(function ($) {
    function appendImage(event = null, attachment = null, remove = false, previewClass = '.doc-category-image-wrapper', imgID = '.doc-category-image-id') {
      if (event === null) {
        document.querySelectorAll(previewClass).forEach(node => {
          let customImage = node.querySelector('.custom_media_image');
          let displayedImage = node.querySelector('img');
          if (customImage) {
            customImage.remove();
          }
          if (displayedImage) {
            displayedImage.style.display = 'block';
          }
        });
        document.querySelectorAll(imgID).forEach(node => {
          node.value = '';
        });
        return;
      }
      const closestParent = event.target.closest('.form-field');
      const node = closestParent.querySelector(previewClass);
      const imageIDNode = closestParent.querySelector(imgID);
      if (!remove) {
        var _attachment$id;
        let alreadySetImage = node.querySelector('.custom_media_image');
        if (alreadySetImage) {
          var _attachment$url;
          alreadySetImage.src = (_attachment$url = attachment?.url) !== null && _attachment$url !== void 0 ? _attachment$url : '';
        } else {
          var _attachment$url2;
          const tempImage = document.createElement('img');
          tempImage.src = (_attachment$url2 = attachment?.url) !== null && _attachment$url2 !== void 0 ? _attachment$url2 : '';
          tempImage.style.margin = '0px';
          tempImage.style.padding = '0px';
          tempImage.style.maxHeight = '100px';
          tempImage.style.float = 'none';
          tempImage.classList.add('custom_media_image');
          node.querySelector('img').style.display = 'none';
          node.append(tempImage);
        }
        imageIDNode.value = (_attachment$id = attachment?.id) !== null && _attachment$id !== void 0 ? _attachment$id : '';
        return;
      }
      imageIDNode.value = '';
      node.querySelector('.custom_media_image')?.remove();
      node.querySelector('img').style.display = 'block';
    }
    function betterdocs_media_upload(button_class) {
      var _custom_media = true,
        _betterdocs_send_attachment = wp.media.editor.send.attachment;
      $('body').on('click', button_class, function (e) {
        let button_id = '#' + $(this).attr('id');
        let button = $(button_id);
        _custom_media = true;

        // Reset the image selection
        wp.media.frame?.state()?.get('selection')?.reset();
        wp.media.editor.send.attachment = function (props, attachment) {
          if (_custom_media) {
            appendImage(e, attachment);
          } else {
            return _betterdocs_send_attachment.apply(button_id, [props, attachment]);
          }
        };
        wp.media.editor.open(button);
        return false;
      });
    }
    betterdocs_media_upload('.betterdocs_tax_media_button.button');
    $('body').on('click', '.doc_tax_media_remove', e => appendImage(e, null, true));
    $(document).ajaxComplete(function (event, xhr, settings) {
      var queryStringArr = settings.data.split('&');
      if ($.inArray('action=add-tag', queryStringArr) !== -1) {
        var xml = xhr.responseXML;
        $response = $(xml).find('term_id').text();
        if ($response != "") {
          // Clear the thumb image
          appendImage();
        }
      }
    });

    /**
     * DRAG and DROP sortable categories
     */
    function betterdocsCategorySorter(config, className = '.taxonomy-doc_category') {
      if (config === undefined) {
        return;
      }
      var $ = jQuery;
      let _paged = parseInt(config.paged);
      let _per_page_id = parseInt($("#" + config.per_page_id).val());
      const base_index = _paged > 0 ? (_paged - 1) * _per_page_id : 0;
      const tableList = document.querySelector(className + " #the-list");
      if (tableList != null && !tableList.querySelector('tr:first-child').classList.contains('no-items')) {
        $(tableList).sortable({
          placeholder: "betterdocs-drag-drop-item-placeholder",
          axis: "y",
          // On start, set a height for the placeholder to prevent table jumps.
          start: function (event, ui) {
            const item = $(ui.item[0]);
            $(".betterdocs-drag-drop-item-placeholder").css("height", item.css("height"));
          },
          // Update callback.
          update: function (event, ui) {
            const taxonomy_ordering_data = [];
            $(tableList).find("tr.ui-sortable-handle").each(function () {
              const ele = $(this);
              const term_data = {
                term_id: ele.attr("id").replace("tag-", ""),
                order: parseInt(ele.index()) + 1
              };
              taxonomy_ordering_data.push(term_data);
            });

            // AJAX Data.
            const data = {
              action: config.action,
              data: taxonomy_ordering_data,
              base_index,
              nonce: config.nonce
            };

            // Run the ajax request.
            $.ajax({
              type: "POST",
              url: config.ajaxurl,
              data,
              dataType: "JSON",
              success: function (response) {},
              error: function (error) {
                console.error("Ordering Error: ", error);
              }
            });
          }
        });
      }
    }
    if (window?.betterdocsCategorySorting != undefined) {
      var _window$betterdocsCat;
      betterdocsCategorySorter(window.betterdocsCategorySorting, (_window$betterdocsCat = window?.betterdocsCategorySorting?.selector) !== null && _window$betterdocsCat !== void 0 ? _window$betterdocsCat : '.taxonomy-doc_category');
    }
  });
})(jQuery);
/******/ })()
;
//# sourceMappingURL=category-edit.js.map