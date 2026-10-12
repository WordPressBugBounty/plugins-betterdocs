/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { BaseControl } from "@wordpress/components";
import { withInstanceId } from "@wordpress/compose";

/**
 * External Dependencies
 */
import Select2 from "react-select";

/**
 * Internal dependencies
 */
import { googleFonts } from "./googleFonts";

function FontFamilyPicker({
    label,
    value,
    help,
    instanceId,
    onChange,
    className,
    ...props
}) {
    const id = `inspector-eb-font-family-${instanceId}`;
    const fonts = [
        { value: "", label: __("Default", "essential-blocks") },
        { value: "Arial", label: "Arial" },
        { value: "Helvetica", label: "Helvetica" },
        { value: "Times-New-Roman", label: "Times New Roman" },
        { value: "Georgia", label: "Georgia" },
    ];

    //Add Google Fonts
    Object.keys(googleFonts).map((font) => {
        fonts.push({ value: font, label: googleFonts[font].family });
    });

    //Google Font Json to my Format #DONT DELETE THIS CODE
    // let gfont = googleFonts.items;
    // let fontObj = {};
    // const regexTT = /italic/i;

    // gfont.map((item) => {
    //   let font = {
    //     family: item.family,
    //     category: item.category,
    //     //   variants: item.variants == "regular" ? "400" : item.variants,
    //     variants: item.variants
    //       .map((i) => (i === "regular" ? "400" : i))

    //       //   .filter((y) => (y === "italic" ? false : true)),
    //       .filter((y) => !regexTT.test(y)),
    //     subsets: item.subsets,
    //   };
    //   fontObj[item.family.replace(/\s+/g, "-")] = font;
    // });
    // console.log("fontObj", fontObj);

    const onChangeValue = (select) => {
        let selectedFont = select.label;
        onChange(selectedFont);
    };

    return (
        <BaseControl label={label} id={id} help={help} className={className}>
            <Select2
                name="eb-select-font"
                defaultValue={{
                    value: (value || "").replace(/\s+/g, "-"),
                    label: value,
                }}
                onChange={onChangeValue}
                options={fonts}
            />
        </BaseControl>
    );
}

export default withInstanceId(FontFamilyPicker);
