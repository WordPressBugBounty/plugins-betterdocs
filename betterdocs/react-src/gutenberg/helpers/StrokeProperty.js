import Property from "./Property";

class StrokeProperty extends Property {
    generate() {
        if (this.attributes?.[this.id] != undefined) {
            this.data = { desktop: `stroke: ${this.attributes[this.id]};` };
        }
        if (
            this.args?.hover &&
            this.attributes?.[this.args?.hover] != undefined
        ) {
            this.data.hoverDesktop = `stroke: ${
                this.attributes[this.args?.hover]
            };`;
        }
    }
}

export default StrokeProperty;
