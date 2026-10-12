import categoryGrid from '../../../../utils/categoryGrid';
window.addEventListener("load", function(){
    document.querySelectorAll('.betterdocs-category-grid-inner-wrapper.masonry').forEach(grid => {
        categoryGrid(grid.parentElement, jQuery);
    });
});
