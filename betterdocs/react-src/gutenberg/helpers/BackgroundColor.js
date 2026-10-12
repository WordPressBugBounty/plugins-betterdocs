import Property from "./Property";

class BackgroundColor extends Property {
    generate() {
        if (this.attributes?.[this.id] != undefined) {
            this.data = {
                desktop: `background-color: ${this.attributes[this.id]};`,
            };
        }
        if (
            this.args?.hover &&
            this.attributes?.[this.args?.hover] != undefined
        ) {
            this.data.hoverDesktop = `background-color: ${
                this.attributes[this.args?.hover]
            };`;
        }
    }
}

export default BackgroundColor;
