import Property from "./Property";

class ColorProperty extends Property {
    generate() {
        if( this.attributes?.[this.id] != undefined ) {
            this.data = { desktop: this.args.hasOwnProperty('customProperty') ? `${this.args.customProperty}:${this.attributes[this.id]}` : `color: ${this.attributes[this.id]};` };
        }
        if (this.args?.hover && this.attributes?.[this.args?.hover] != undefined ) {
            this.data.hoverDesktop = `color: ${this.attributes[this.args?.hover]};`;
        }
    }
}

export default ColorProperty;
