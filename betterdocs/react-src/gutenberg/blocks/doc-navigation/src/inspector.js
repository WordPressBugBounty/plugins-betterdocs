import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    TabPanel,
    PanelBody,
    TextControl,
    BaseControl
} from '@wordpress/components';

import TypographyDropdown from '../../../util/typography-control-v2';
import ColorControl from '../../../util/color-control';
import objAttributes from './attributes';
import { NAVIGATION_TEXT_TYPO } from './typographyPrefixConstants';
import { NAVIGATION_ARROW_SIZE } from './constants';
import ResponsiveRangeController from '../../../util/responsive-range-control';
import ResponsiveDimensionsControl from '../../../util/dimensions-control-v2';
import BorderShadowControl from '../../../util/border-shadow-control';
import { NAVIGATION_BOX_PADDING, NAVIGATION_BOX_MARGIN, NAVIGATION_BOX_BORDER, NAVIGATION_ARROW_PADDING, NAVIGATION_ARROW_MARGIN } from './constants';

const Inspector = ( { attributes, setAttributes } ) => {
	const { resOption, navigation_text_color, navigation_arrow_color, navigation_text_hover_color, navigation_box_color, navigation_arrow_bg_color } = attributes;

	const resRequiredProps = {
		setAttributes,
		resOption,
		attributes,
		objAttributes
	};

	return (
		<InspectorControls key="controls">
			<div className="eb-panel-control">
			<TabPanel className="eb-parent-tab-panel" activeClass="active-tab" tabs={[{
				name: "general",
				title: __("General", "betterdocs"),
				className: "eb-tab styles",
			}]}>
				{
					(tab) => {
						return (
							<div className={"eb-tab-controls " + tab.name}>
								{
									tab.name === 'general' && (
                                            <>
                                                <PanelBody title={__("Wrapper", "betterdocs")} initialOpen={false}>
                                                    <ColorControl
                                                        label={__("Background Color", "betterdocs")}
                                                        color={navigation_box_color}
                                                        onChange={((color) => setAttributes({navigation_box_color:color}))}
                                                    />
                                                    <ResponsiveDimensionsControl
                                                        baseLabel={__("Box Padding", "betterdocs")}
                                                        resRequiredProps={resRequiredProps}
                                                        controlName={NAVIGATION_BOX_PADDING}
                                                    />
                                                    <ResponsiveDimensionsControl
                                                        baseLabel={__("Box Margin", "betterdocs")}
                                                        resRequiredProps={resRequiredProps}
                                                        controlName={NAVIGATION_BOX_MARGIN}
                                                    />
                                                    <BaseControl>
                                                        <h3 className='eb-control-title'>
                                                            {__("Border", "betterdocs")}
                                                        </h3>
                                                    </BaseControl>
                                                    <BorderShadowControl
                                                        controlName={NAVIGATION_BOX_BORDER}
                                                        resRequiredProps={resRequiredProps}
                                                    />
                                            </PanelBody>
                                            <PanelBody title={__("Navigation", "betterdocs")} initialOpen={true}>
                                                <ColorControl
                                                    label={__("Navigation Text Color", "betterdocs")}
                                                    color={navigation_text_color}
                                                    onChange={((color) => setAttributes({navigation_text_color:color}))}
                                                />
                                                <ColorControl
                                                    label={__("Navigation Text Hover Color", "betterdocs")}
                                                    color={navigation_text_hover_color}
                                                    onChange={((color) => setAttributes({navigation_text_hover_color:color}))}
                                                />
                                                <TypographyDropdown
                                                    baseLabel={__("Typography", "betterdocs")}
                                                    typographyPrefixConstant={NAVIGATION_TEXT_TYPO}
                                                    resRequiredProps={resRequiredProps}
                                                />
                                                <ResponsiveRangeController
                                                    baseLabel={__("Arrow Size", "betterdocs")}
                                                    controlName={NAVIGATION_ARROW_SIZE}
                                                    resRequiredProps={resRequiredProps}
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                />
                                                <ColorControl
                                                    label={__("Arrow Color", "betterdocs")}
                                                    color={navigation_arrow_color}
                                                    onChange={((color) => setAttributes({navigation_arrow_color:color}))}
                                                />
                                                <ColorControl
                                                        label={__("Arrow Background Color", "betterdocs")}
                                                        color={navigation_arrow_bg_color}
                                                        onChange={((color) => setAttributes({navigation_arrow_bg_color:color}))}
                                                    />
                                                    <ResponsiveDimensionsControl
                                                        baseLabel={__("Arrow Padding", "betterdocs")}
                                                        resRequiredProps={resRequiredProps}
                                                        controlName={NAVIGATION_ARROW_PADDING}
                                                    />
                                                    <ResponsiveDimensionsControl
                                                        baseLabel={__("Arrow Margin", "betterdocs")}
                                                        resRequiredProps={resRequiredProps}
                                                        controlName={NAVIGATION_ARROW_MARGIN}
                                                    />
                                            </PanelBody>
                                        </>
									)
								}
							</div>
						)
					}
				}
			</TabPanel>
			</div>
		</InspectorControls>
	);
}

export default Inspector;
