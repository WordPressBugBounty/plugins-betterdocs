import Property from "./Property";

class AlignProperty extends Property {
    generate() {
        this.data = { desktop: this.args?.hasOwnProperty('alignProperty') ? `${this.args?.alignProperty}:${this.attributes[this.id]};`: `text-align: ${this.attributes[this.id]};` };
    }
}

export default AlignProperty;
