import Property from "./Property";

class BorderColorProperty extends Property {
    generate() {
        if (this.attributes?.[this.id] != undefined) {
            this.data = { desktop: `border-color: ${this.attributes[this.id]};` };
        }
        if (
            this.args?.hover &&
            this.attributes?.[this.args?.hover] != undefined
        ) {
            this.data.hoverDesktop = `border-color: ${
                this.attributes[this.args?.hover]
            };`;
        }
    }
}

export default BorderColorProperty;
