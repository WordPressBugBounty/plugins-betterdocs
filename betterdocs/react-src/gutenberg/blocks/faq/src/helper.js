export default function () {
    let masonryHandbooks = document.querySelectorAll(".betterdocs-category-handbook-inner-wrapper.masonry");

    if ( masonryHandbooks?.length == 0 ) {
        let masonryItems = document.querySelectorAll('.betterdocs-single-category-wrapper');
        (masonryItems || []).forEach((item) => {
            item.removeAttribute("style");
        });

        return;
    }

    var mobileDevice = window.matchMedia("(max-width: 767px)");
    var tabDevice = window.matchMedia("(max-width: 1024px)");

    masonryHandbooks.forEach((masonryHandbook) => {
        let columnPerHandbook = 0;
        let column_space = 0;

        switch (true) {
            case mobileDevice.matches:
                columnPerHandbook = masonryHandbook.getAttribute("data-column_mobile");
                column_space = masonryHandbook.getAttribute("data-column_space_mobile");
                break;
            case tabDevice.matches:
                columnPerHandbook = masonryHandbook.getAttribute("data-column_tab");
                column_space = masonryHandbook.getAttribute("data-column_space_tab");
                break;
            default:
                columnPerHandbook = masonryHandbook.getAttribute("data-column_desktop");
                column_space = masonryHandbook.getAttribute("data-column_space_desktop");
                break;
        }

        column_space = parseInt(column_space);
        columnPerHandbook = parseInt(columnPerHandbook);

        let masonryItems = masonryHandbook.querySelectorAll(".betterdocs-single-category-wrapper");
        let total_margin = (columnPerHandbook - 1) * column_space;

        if (masonryHandbook) {
            masonryItems.forEach((item) => {
                item.style.width = `calc((100% - ${total_margin}px) / ${columnPerHandbook})`;
            });

            new Masonry(masonryHandbook, {
                itemSelector: ".betterdocs-single-category-wrapper",
                percentPosition: true,
                gutter: column_space,
            });
        }
    });
}
