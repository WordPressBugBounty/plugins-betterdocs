import { createHigherOrderComponent } from "@wordpress/compose";
import { useEffect } from "@wordpress/element";
import WebFont from "webfontloader";
import { addFilter } from "@wordpress/hooks";

const withAdvancedControls = createHigherOrderComponent((BlockEdit) => {

    return (props) => {
        const { attributes } = props;

        // typography
        useEffect(() => {
            let googleFontFamily = [];
            for (var key in attributes) {
                if (/^(\w+)FontFamily/.test(key)) {
                    if (attributes[key] !== "Default") {
                        googleFontFamily.push(
                            attributes[key] +
                            ":100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic"
                        );
                    }
                }
            }

            if (googleFontFamily.length > 0) {
                let webFontConfig = {
                    google: {
                        families: googleFontFamily,
                    },
                    context: frames["editor-canvas"],
                };
                WebFont.load(webFontConfig);
            }
        }, [attributes]);

        return <BlockEdit {...props} />;

    };
}, "withAdvancedControls");

/**
 * Filter for modification of Edit Function
 */
addFilter("editor.BlockEdit", "betterdocs/global", withAdvancedControls);

