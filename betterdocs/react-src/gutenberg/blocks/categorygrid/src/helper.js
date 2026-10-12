export default function () {
    let masonryGrids = document.querySelectorAll(".betterdocs-category-grid-inner-wrapper.masonry");

    if ( masonryGrids?.length == 0 ) {
        let masonryItems = document.querySelectorAll('.betterdocs-single-category-wrapper');
        (masonryItems || []).forEach((item) => {
            item.removeAttribute("style");
        });

        return;
    }

    var mobileDevice = window.matchMedia("(max-width: 767px)");
    var tabDevice = window.matchMedia("(max-width: 1024px)");

    masonryGrids.forEach((masonryGrid) => {
        let columnPerGrid = 0;
        let column_space = 0;

        switch (true) {
            case mobileDevice.matches:
                columnPerGrid = masonryGrid.getAttribute("data-column_mobile");
                column_space = masonryGrid.getAttribute("data-column_space_mobile");
                break;
            case tabDevice.matches:
                columnPerGrid = masonryGrid.getAttribute("data-column_tab");
                column_space = masonryGrid.getAttribute("data-column_space_tab");
                break;
            default:
                columnPerGrid = masonryGrid.getAttribute("data-column_desktop");
                column_space = masonryGrid.getAttribute("data-column_space_desktop");
                break;
        }

        column_space = parseInt(column_space);
        columnPerGrid = parseInt(columnPerGrid);

        let masonryItems = masonryGrid.querySelectorAll(".betterdocs-single-category-wrapper");
        let total_margin = (columnPerGrid - 1) * column_space;

        if (masonryGrid) {
            masonryItems.forEach((item) => {
                item.style.width = `calc((100% - ${total_margin}px) / ${columnPerGrid})`;
            });

            new Masonry(masonryGrid, {
                itemSelector: ".betterdocs-single-category-wrapper",
                percentPosition: true,
                gutter: column_space,
            });
        }
    });
}
