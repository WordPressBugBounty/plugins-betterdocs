import {
    ResponsiveProperty,
    DimensionProperty,
    BackgroundProperty,
    BorderProperty,
    TypographyProperty,
    ColorProperty,
    AlignProperty,
    FillProperty,
    BackgroundColor,
    ZIndex,
    BorderTopColor,
    BorderColorProperty,
	StrokeProperty
} from ".";

export default function (property, attributes) {
    switch (property.type) {
        case 'responsive':
            return new ResponsiveProperty(property, attributes);
        case 'dimension':
            return new DimensionProperty(property, attributes);
        case 'background':
            return new BackgroundProperty(property, attributes);
        case 'border':
            return new BorderProperty(property, attributes);
        case 'typography':
            return new TypographyProperty(property, attributes);
        case 'color':
            return new ColorProperty(property, attributes);
        case 'fill':
            return new FillProperty(property, attributes);
        case 'border-top-color':
            return new BorderTopColor(property, attributes);
        case 'background-color':
            return new BackgroundColor(property, attributes)
        case 'alignment':
            return new AlignProperty(property, attributes);
        case 'z-index':
            return new ZIndex(property, attributes);
        case 'border-color':
            return new BorderColorProperty(property, attributes);
		case 'stroke':
			return new StrokeProperty(property, attributes);
    }
}
