window.addEventListener("load", function(){
    document.querySelectorAll('.betterdocs-category-handbook-inner-wrapper.masonry').forEach(handbook => {
        categoryHandbook(handbook.parentElement, jQuery);
    });
});
