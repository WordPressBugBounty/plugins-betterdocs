import Property from "./Property";

class ZIndex extends Property {
    generate() {
        this.data = { desktop: `z-index: ${this.attributes[this.id]};` };
    }
}

export default ZIndex;
