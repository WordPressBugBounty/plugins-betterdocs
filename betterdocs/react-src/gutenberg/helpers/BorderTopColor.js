import Property from "./Property";

class BorderTopColor extends Property {
    generate() {
        if (this.attributes?.[this.id] != undefined) {
            this.data = { desktop: `border-top-color: ${this.attributes[this.id]};` };
        }
        if (
            this.args?.hover &&
            this.attributes?.[this.args?.hover] != undefined
        ) {
            this.data.hoverDesktop = `border-top-color: ${
                this.attributes[this.args?.hover]
            };`;
        }
    }
}

export default BorderTopColor;
