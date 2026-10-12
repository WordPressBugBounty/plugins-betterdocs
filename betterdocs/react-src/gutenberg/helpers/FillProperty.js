import Property from "./Property";

class FillProperty extends Property {
    generate() {
        if (this.attributes?.[this.id] != undefined) {
            this.data = { desktop: `fill: ${this.attributes[this.id]};` };
        }
        if (
            this.args?.hover &&
            this.attributes?.[this.args?.hover] != undefined
        ) {
            this.data.hoverDesktop = `fill: ${
                this.attributes[this.args?.hover]
            };`;
        }
    }
}

export default FillProperty;
