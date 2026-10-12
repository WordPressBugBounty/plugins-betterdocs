import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
    BaseControl,
    ButtonGroup,
    Button,
    PanelBody,
    TabPanel,
    ToggleControl,
    SelectControl,
    TextControl,
	RangeControl
} from '@wordpress/components';

import CodeMirrorControl from './components/CodeMirrorControl';



import {
    LANGUAGE_OPTIONS,
    THEME_OPTIONS,
    CODE_SNIPPET_WRAPPER_MARGIN,
    CODE_SNIPPET_WRAPPER_PADDING,
    CODE_SNIPPET_HEADER_PADDING,
    CODE_SNIPPET_LINE_NUMBERS_PADDING,
    CODE_SNIPPET_CODE_PADDING,
} from './constants';

import {
    typoPrefix_fileName
} from "./typographyPrefixConstants";

import ResponsiveDimensionsControl from "../../../util/dimensions-control-v2";
import ColorControl from "../../../util/color-control";
import TypographyDropdown from "../../../util/typography-control-v2";
import objAttributes from './attributes';

const Inspector = ({attributes, setAttributes}) => {
    const {
        codeContent,
        language,
        codeVariants = [],
        showCopyButton,
        showHeader,
        showLineNumbers,
        theme,
        lineNumberColor,
        lineNumberBgColor,
        lineNumberBorderColor,
        lineNumberBorderWidth,
        resOption,
        fileName,
        showFileIcon,
        fileIcon,
        showTrafficLights,
        wrapperBackgroundColor,
        wrapperBorderColor,
        wrapperBorderWidth,
        wrapperBorderRadius,
        headerBackgroundColor,
        headerBorderColor,
        headerBorderWidth,
        fileNameColor,
        copyButtonColor,
        copyButtonBorderColor,
        codeBackgroundColor,
    } = attributes;

    const resRequiredProps = {
        setAttributes,
        resOption,
        attributes,
        objAttributes,
    };

    // Additional-language repeater helpers. The primary language/code above is
    // variant #1; these append to it. When 1+ exist the frontend shows a
    // language dropdown to switch between them.
    const addVariant = () => {
        setAttributes({
            codeVariants: [
                ...codeVariants,
                { language: 'php', codeContent: '' },
            ],
        });
    };

    const updateVariant = (index, key, value) => {
        const next = codeVariants.map((variant, i) =>
            i === index ? { ...variant, [key]: value } : variant
        );
        setAttributes({ codeVariants: next });
    };

    const removeVariant = (index) => {
        setAttributes({
            codeVariants: codeVariants.filter((_, i) => i !== index),
        });
    };

    return(
        <InspectorControls key="controls">
            <div className="eb-panel-control">
                <TabPanel
                    className="eb-parent-tab-panel"
                    activeClass="active-tab"
                    tabs={[
                        {
                            name: "general",
                            title: __("General", "betterdocs"),
                            className: "eb-tab general"
                        },
                        {
                            name: "styles",
                            title: __("Styles", "betterdocs"),
                            className: "eb-tab styles",
                        }
                    ]}
                >
                    {(tab) => (
                        <div className={"eb-tab-controls " + tab.name}>
                            {tab.name === 'general' && (
                                <>
                                <PanelBody title={__("Code Settings", "betterdocs")} initialOpen={true}>
                                    <SelectControl
                                        label={__("Choose Programming Language", "betterdocs")}
                                        value={language}
                                        options={LANGUAGE_OPTIONS}
                                        onChange={(value) => setAttributes({ language: value })}
                                        help={__("Choose language for syntax highlighting.", "betterdocs")}
                                        __next40pxDefaultSize
                                        __nextHasNoMarginBottom
                                    />

                                    <CodeMirrorControl
                                        label={__("Code Snippet", "betterdocs")}
                                        value={codeContent}
                                        onChange={(value) => setAttributes({ codeContent: value })}
                                        placeholder={__("// Paste or type your code here...", "betterdocs")}
                                        rows={15}
                                        help={__("Enter your code snippet. Use Tab for indentation. Syntax highlighting will appear in the preview.", "betterdocs")}
                                    />

                                    <BaseControl
                                        className="betterdocs-code-variants-control"
                                        help={__("Add the same snippet in other languages. When you add one or more, the header shows a language dropdown to switch between them.", "betterdocs")}
                                    >
                                        {codeVariants.map((variant, index) => (
                                            <div
                                                className="betterdocs-code-variant"
                                                key={index}
                                                style={{
                                                    marginTop: '16px',
                                                    paddingTop: '12px',
                                                    borderTop: '1px solid #e0e0e0',
                                                }}
                                            >
                                                <div
                                                    className="betterdocs-code-variant__head"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: '12px',
                                                        marginBottom: '8px',
                                                    }}
                                                >
                                                    <strong>
                                                        {__("Language", "betterdocs")} {index + 2}
                                                    </strong>
                                                    <Button
                                                        isDestructive
                                                        variant="link"
                                                        onClick={() => removeVariant(index)}
                                                    >
                                                        {__("Remove", "betterdocs")}
                                                    </Button>
                                                </div>
                                                <SelectControl
                                                    label={__("Programming Language", "betterdocs")}
                                                    value={variant.language}
                                                    options={LANGUAGE_OPTIONS}
                                                    onChange={(value) => updateVariant(index, 'language', value)}
                                                    __next40pxDefaultSize
                                                    __nextHasNoMarginBottom
                                                />
                                                <CodeMirrorControl
                                                    label={__("Code Snippet", "betterdocs")}
                                                    value={variant.codeContent}
                                                    onChange={(value) => updateVariant(index, 'codeContent', value)}
                                                    placeholder={__("// Paste or type your code here...", "betterdocs")}
                                                    rows={10}
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            variant="secondary"
                                            onClick={addVariant}
                                            className="betterdocs-code-variant__add"
                                            __next40pxDefaultSize
                                        >
                                            {__("+ Add Language", "betterdocs")}
                                        </Button>
                                    </BaseControl>
                                </PanelBody>

                                <PanelBody title={__("Appearance", "betterdocs")} initialOpen={false}>
									<BaseControl
										label={__("Theme", "betterdocs")}
										help={__("Choose light or dark styling for the code snippet block.", "betterdocs")}
									>
										<ButtonGroup>
											{THEME_OPTIONS.map((option) => (
												<Button
													key={option.value}
													variant={theme === option.value ? 'primary' : 'secondary'}
													onClick={() => setAttributes({ theme: option.value })}
												>
													{option.label}
												</Button>
											))}
										</ButtonGroup>
									</BaseControl>
									<ToggleControl
                                        label={__("Show header bar", "betterdocs")}
                                        checked={showHeader}
                                        onChange={(value) => setAttributes({ showHeader: value })}
                                        help={__("Toggle the filename header and copy button.", "betterdocs")}
                                    />
									{showHeader && (
										<ToggleControl
											label={__("Enable copy button", "betterdocs")}
											checked={showCopyButton}
											onChange={(value) => setAttributes({ showCopyButton: value })}
											help={__("Show a one-click copy-to-clipboard icon.", "betterdocs")}
										/>
									)}

											help={__("Display a tooltip (‘Copied!’) on copy button hover or click.", "betterdocs")}
										/>
									)}
									<ToggleControl
										label={__("Show line numbers", "betterdocs")}
										checked={showLineNumbers}
										onChange={(value) => setAttributes({ showLineNumbers: value })}
										help={__("Display line numbers in the code block.", "betterdocs")}
									/>
                                </PanelBody>
								{showHeader && (
									<PanelBody title={__("File Preview Header", "betterdocs")} initialOpen={false}>
										<TextControl
											label={__("Filename", "betterdocs")}
											value={fileName}
											onChange={(value) => setAttributes({ fileName: value })}
											placeholder={__("hero-section.tsx", "betterdocs")}
											help={__("Enter the name to display in header (e.g., hero-section.tsx)", "betterdocs")}
											__next40pxDefaultSize
											__nextHasNoMarginBottom
										/>

										<ToggleControl
											label={__("Show window buttons", "betterdocs")}
											checked={showTrafficLights}
											onChange={(value) => setAttributes({ showTrafficLights: value })}
											help={__("Display macOS-style close/minimize/maximize circles.", "betterdocs")}
										/>

										<ToggleControl
											label={__("Show language icon", "betterdocs")}
											checked={showFileIcon}
											onChange={(value) => setAttributes({ showFileIcon: value })}
											help={__("Display the default icon for this file type.", "betterdocs")}
										/>

										{showFileIcon && (
											<MediaUploadCheck>
												<MediaUpload
													onSelect={(media) => setAttributes({ fileIcon: media.url })}
													allowedTypes={['image']}
													value={fileIcon}
													render={({ open }) => (
														<BaseControl
															label={__("Custom language icon", "betterdocs")}
															help={__("Upload a custom icon to override the default.", "betterdocs")}
														>
															<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
																<Button
																	onClick={open}
																	variant="secondary"
																	__next40pxDefaultSize
																>
																	{fileIcon ? __("Change Icon", "betterdocs") : __("Upload Icon", "betterdocs")}
																</Button>
																{fileIcon && (
																	<>
																		<img
																			src={fileIcon}
																			alt={__("File icon preview", "betterdocs")}
																			style={{ width: '24px', height: '24px', objectFit: 'contain' }}
																		/>
																		<Button
																			onClick={() => setAttributes({ fileIcon: '' })}
																			variant="link"
																			isDestructive
																			__next40pxDefaultSize
																		>
																			{__("Remove", "betterdocs")}
																		</Button>
																	</>
																)}
															</div>
														</BaseControl>
													)}
												/>
											</MediaUploadCheck>
										)}
									</PanelBody>
								)}
                                </>
                            )}
                            {tab.name === 'styles' && (
                                <div>
                                    <PanelBody title={__("Wrapper", "betterdocs")} initialOpen={false}>
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Margin", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={CODE_SNIPPET_WRAPPER_MARGIN}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Padding", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={CODE_SNIPPET_WRAPPER_PADDING}
                                        />
                                        <ColorControl
                                            label={__("Background Color", "betterdocs")}
                                            color={wrapperBackgroundColor}
                                            onChange={(colorValue) => {
                                                setAttributes({wrapperBackgroundColor: colorValue})
                                            }}
                                        />
                                        <ColorControl
                                            label={__("Border Color", "betterdocs")}
                                            color={wrapperBorderColor}
                                            onChange={(colorValue) => {
                                                setAttributes({wrapperBorderColor: colorValue})
                                            }}
                                        />
                                        <RangeControl
                                            label={__("Border Width", "betterdocs")}
                                            value={wrapperBorderWidth}
                                            onChange={(value) => setAttributes({wrapperBorderWidth: value})}
                                            min={0}
                                            max={10}
                                            step={1}
                                        />
                                        <RangeControl
                                            label={__("Border Radius", "betterdocs")}
                                            value={wrapperBorderRadius}
                                            onChange={(value) => setAttributes({wrapperBorderRadius: value})}
                                            min={0}
                                            max={50}
                                            step={1}
                                        />
                                    </PanelBody>

                                    {showHeader && (
                                        <PanelBody title={__("Header", "betterdocs")} initialOpen={false}>
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Padding", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={CODE_SNIPPET_HEADER_PADDING}
                                            />
                                            <ColorControl
                                                label={__("Background Color", "betterdocs")}
                                                color={headerBackgroundColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({headerBackgroundColor: colorValue})
                                                }}
                                            />
                                            <ColorControl
                                                label={__("Border Color", "betterdocs")}
                                                color={headerBorderColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({headerBorderColor: colorValue})
                                                }}
                                            />
                                            <RangeControl
                                                label={__("Border Width", "betterdocs")}
                                                value={headerBorderWidth}
                                                onChange={(value) => setAttributes({headerBorderWidth: value})}
                                                min={0}
                                                max={10}
                                                step={1}
                                                help={__("Controls border bottom width", "betterdocs")}
                                            />
                                            <TypographyDropdown
                                                baseLabel={__("File Name Typography", "betterdocs")}
                                                typographyPrefixConstant={typoPrefix_fileName}
                                                resRequiredProps={resRequiredProps}
                                                defaultFontSize={14}
                                            />
											<ColorControl
                                                label={__("File Name Color", "betterdocs")}
                                                color={fileNameColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({fileNameColor: colorValue})
                                                }}
                                            />
                                            <ColorControl
                                                label={__("Copy Button Color", "betterdocs")}
                                                color={copyButtonColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({copyButtonColor: colorValue})
                                                }}
                                            />
                                            <ColorControl
                                                label={__("Copy Button Border Color", "betterdocs")}
                                                color={copyButtonBorderColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({copyButtonBorderColor: colorValue})
                                                }}
                                            />
                                        </PanelBody>
                                    )}

                                    {showLineNumbers && (
                                        <PanelBody title={__("Line Numbers", "betterdocs")} initialOpen={false}>
                                            <ResponsiveDimensionsControl
                                                baseLabel={__("Padding", "betterdocs")}
                                                resRequiredProps={resRequiredProps}
                                                controlName={CODE_SNIPPET_LINE_NUMBERS_PADDING}
                                            />
                                            <ColorControl
                                                label={__("Line Number Color", "betterdocs")}
                                                color={lineNumberColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({lineNumberColor: colorValue})
                                                }}
                                            />
                                            <ColorControl
                                                label={__("Line Number Background", "betterdocs")}
                                                color={lineNumberBgColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({lineNumberBgColor: colorValue})
                                                }}
                                            />
                                            <ColorControl
                                                label={__("Border Color", "betterdocs")}
                                                color={lineNumberBorderColor}
                                                onChange={(colorValue) => {
                                                    setAttributes({lineNumberBorderColor: colorValue})
                                                }}
                                            />
                                            <RangeControl
                                                label={__("Border Width", "betterdocs")}
                                                value={lineNumberBorderWidth}
                                                onChange={(value) => setAttributes({lineNumberBorderWidth: value})}
                                                min={0}
                                                max={10}
                                                step={1}
                                                help={__("Controls border right width", "betterdocs")}
                                            />
                                        </PanelBody>
                                    )}

                                    <PanelBody title={__("Code Content Area", "betterdocs")} initialOpen={false}>
                                        <ResponsiveDimensionsControl
                                            baseLabel={__("Padding", "betterdocs")}
                                            resRequiredProps={resRequiredProps}
                                            controlName={CODE_SNIPPET_CODE_PADDING}
                                        />
                                        <ColorControl
                                            label={__("Background Color", "betterdocs")}
                                            color={codeBackgroundColor}
                                            onChange={(colorValue) => {
                                                setAttributes({codeBackgroundColor: colorValue})
                                            }}
                                        />
                                    </PanelBody>
                                </div>
                            )}
                        </div>
                    )}
                </TabPanel>
            </div>
        </InspectorControls>
    );
}

export default Inspector;
