import categoryGrid from '../utils/categoryGrid'

(function ($) {
    $(document).ready(function () {
        document.querySelectorAll('.betterdocs-category-grid-inner-wrapper.masonry').forEach(grid => {
            categoryGrid(grid.parentElement, $);
        });

        if( betterdocsCategoryGridConfig?.is_betterdocs_templates != 1 ) { //run this script only from outside betterdocs templates only, this script is made to determine set the kb and its value on cookie
            $('.betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-category-link-btn').on('click', function(e){ //this is triggerd when clicked on explore more on category grid
                let secondTopLayer = $($($($(this)?.parent())?.parent())?.parent())?.parent();
                let topLayerMkbAttribute = $(secondTopLayer).attr('data-mkb-slug');
                if( topLayerMkbAttribute?.length > 0 ) {
                    var expiryDate = new Date();
                    var timeStamp = expiryDate.setDate(expiryDate.getDate() + 30).toString();
                    document.cookie = `last_knowledge_base=${topLayerMkbAttribute}; expires=${timeStamp}; path=/;` ;
                }
            });

            $('.betterdocs-category-grid-inner-wrapper .betterdocs-single-category-wrapper .betterdocs-body .betterdocs-articles-list li a').on('click', function(e) { //this is triggerd when clicked on single doc list
                let secondTopLayer = $($($($($($(this).parent()).parent()).parent()).parent()).parent()).parent();
                let topLayerMkbAttribute = $(secondTopLayer).attr('data-mkb-slug');
                if( topLayerMkbAttribute?.length > 0 ) {
                    var expiryDate = new Date();
                    var timeStamp = expiryDate.setDate(expiryDate.getDate() + 30).toString();
                    document.cookie = `last_knowledge_base=${topLayerMkbAttribute}; expires=${timeStamp}; path=/;` ;
                }
            })
        }
    });
})(jQuery);
