import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    BaseControl,
    ButtonGroup,
    Button,
    PanelBody,
    TabPanel,
    ToggleControl,
    SelectControl,
    TextControl,
    RangeControl,
} from '@wordpress/components';

import CodeMirrorControl from '../../code-snippet/src/components/CodeMirrorControl';

import {
    THEME_OPTIONS,
    CODE_SNIPPET_WRAPPER_MARGIN,
    CODE_SNIPPET_WRAPPER_PADDING,
    CODE_SNIPPET_HEADER_PADDING,
    CODE_SNIPPET_LINE_NUMBERS_PADDING,
    CODE_SNIPPET_CODE_PADDING,
} from '../../code-snippet/src/constants';

import ResponsiveDimensionsControl from '../../../util/dimensions-control-v2';
import ColorControl from '../../../util/color-control';
import objAttributes from './attributes';

// Response bodies default to JSON but any of these are selectable per tab.
const RESPONSE_LANGUAGE_OPTIONS = [
    { label: __('JSON', 'betterdocs'), value: 'json' },
    { label: __('XML', 'betterdocs'), value: 'xml' },
    { label: __('YAML', 'betterdocs'), value: 'yaml' },
    { label: __('JavaScript', 'betterdocs'), value: 'javascript' },
    { label: __('PHP', 'betterdocs'), value: 'php' },
    { label: __('Python', 'betterdocs'), value: 'python' },
    { label: __('Bash', 'betterdocs'), value: 'bash' },
    { label: __('HTML', 'betterdocs'), value: 'html' },
    { label: __('Plain Text', 'betterdocs'), value: 'text' },
];

const Inspector = ({ attributes, setAttributes }) => {
    const {
        responses = [],
        showCopyButton,
        showHeader,
        showLineNumbers,
        theme,
        lineNumberColor,
        lineNumberBgColor,
        lineNumberBorderColor,
        lineNumberBorderWidth,
        resOption,
        wrapperBackgroundColor,
        wrapperBorderColor,
        wrapperBorderWidth,
        wrapperBorderRadius,
        headerBackgroundColor,
        headerBorderColor,
        headerBorderWidth,
        copyButtonColor,
        copyButtonBorderColor,
        codeBackgroundColor,
    } = attributes;

    const resRequiredProps = { setAttributes, resOption, attributes, objAttributes };

    const addResponse = () => {
        setAttributes({
            responses: [
                ...responses,
                { status: '', language: 'json', codeContent: '' },
            ],
        });
    };

    const updateResponse = (index, key, value) => {
        const next = responses.map((response, i) =>
            i === index ? { ...response, [key]: value } : response
        );
        setAttributes({ responses: next });
    };

    const removeResponse = (index) => {
        setAttributes({ responses: responses.filter((_, i) => i !== index) });
    };

    return (
        <InspectorControls key="controls">
            <div className="eb-panel-control">
                <TabPanel
                    className="eb-parent-tab-panel"
                    activeClass="active-tab"
                    tabs={[
                        { name: 'general', title: __('General', 'betterdocs'), className: 'eb-tab general' },
                        { name: 'styles', title: __('Styles', 'betterdocs'), className: 'eb-tab styles' },
                    ]}
                >
                    {(tab) => (
                        <div className={'eb-tab-controls ' + tab.name}>
                            {tab.name === 'general' && (
                                <>
                                    <PanelBody title={__('Responses', 'betterdocs')} initialOpen={true}>
                                        <BaseControl
                                            className="betterdocs-code-snippet-tab-repeater"
                                            help={__('Add one entry per HTTP status. Each becomes a tab (200, 404, …).', 'betterdocs')}
                                        >
                                            {responses.map((response, index) => (
                                                <div
                                                    className="betterdocs-code-snippet-tab-repeater-row"
                                                    key={index}
                                                    style={{
                                                        marginTop: '16px',
                                                        paddingTop: '12px',
                                                        borderTop: '1px solid #e0e0e0',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            gap: '12px',
                                                            marginBottom: '8px',
                                                        }}
                                                    >
                                                        <strong>{__('Response', 'betterdocs')} {index + 1}</strong>
                                                        <Button isDestructive variant="link" onClick={() => removeResponse(index)}>
                                                            {__('Remove', 'betterdocs')}
                                                        </Button>
                                                    </div>
                                                    <TextControl
                                                        label={__('Status / Response type', 'betterdocs')}
                                                        value={response.status || ''}
                                                        onChange={(value) => updateResponse(index, 'status', value)}
                                                        placeholder={__('e.g. 200, 404', 'betterdocs')}
                                                        __next40pxDefaultSize
                                                        __nextHasNoMarginBottom
                                                    />
                                                    <SelectControl
                                                        label={__('Language', 'betterdocs')}
                                                        value={response.language || 'json'}
                                                        options={RESPONSE_LANGUAGE_OPTIONS}
                                                        onChange={(value) => updateResponse(index, 'language', value)}
                                                        __next40pxDefaultSize
                                                        __nextHasNoMarginBottom
                                                    />
                                                    <CodeMirrorControl
                                                        label={__('Response Body', 'betterdocs')}
                                                        value={response.codeContent || ''}
                                                        onChange={(value) => updateResponse(index, 'codeContent', value)}
                                                        placeholder={__('Paste the example response here…', 'betterdocs')}
                                                        rows={10}
                                                    />
                                                </div>
                                            ))}
                                            <Button
                                                variant="secondary"
                                                onClick={addResponse}
                                                className="betterdocs-code-snippet-tab-repeater__add"
                                                __next40pxDefaultSize
                                                style={{ marginTop: '16px' }}
                                            >
                                                {__('+ Add response', 'betterdocs')}
                                            </Button>
                                        </BaseControl>
                                    </PanelBody>

                                    <PanelBody title={__('Appearance', 'betterdocs')} initialOpen={false}>
                                        <BaseControl
                                            label={__('Theme', 'betterdocs')}
                                            help={__('Choose light or dark styling for the response block.', 'betterdocs')}
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
                                            label={__('Show header bar', 'betterdocs')}
                                            checked={showHeader}
                                            onChange={(value) => setAttributes({ showHeader: value })}
                                            help={__('Toggle the status tabs + copy button.', 'betterdocs')}
                                        />
                                        {showHeader && (
                                            <ToggleControl
                                                label={__('Enable copy button', 'betterdocs')}
                                                checked={showCopyButton}
                                                onChange={(value) => setAttributes({ showCopyButton: value })}
                                                help={__('Show a one-click copy-to-clipboard icon.', 'betterdocs')}
                                            />
                                        )}
                                                help={__('Display a tooltip (‘Copied!’) on copy button hover or click.', 'betterdocs')}
                                            />
                                        )}
                                        <ToggleControl
                                            label={__('Show line numbers', 'betterdocs')}
                                            checked={showLineNumbers}
                                            onChange={(value) => setAttributes({ showLineNumbers: value })}
                                            help={__('Display line numbers in the response body.', 'betterdocs')}
                                        />
                                    </PanelBody>
                                </>
                            )}
                            {tab.name === 'styles' && (
                                <div>
                                    <PanelBody title={__('Wrapper', 'betterdocs')} initialOpen={false}>
                                        <ResponsiveDimensionsControl
                                            baseLabel={__('Margin', 'betterdocs')}
                                            resRequiredProps={resRequiredProps}
                                            controlName={CODE_SNIPPET_WRAPPER_MARGIN}
                                        />
                                        <ResponsiveDimensionsControl
                                            baseLabel={__('Padding', 'betterdocs')}
                                            resRequiredProps={resRequiredProps}
                                            controlName={CODE_SNIPPET_WRAPPER_PADDING}
                                        />
                                        <ColorControl
                                            label={__('Background Color', 'betterdocs')}
                                            color={wrapperBackgroundColor}
                                            onChange={(colorValue) => setAttributes({ wrapperBackgroundColor: colorValue })}
                                        />
                                        <ColorControl
                                            label={__('Border Color', 'betterdocs')}
                                            color={wrapperBorderColor}
                                            onChange={(colorValue) => setAttributes({ wrapperBorderColor: colorValue })}
                                        />
                                        <RangeControl
                                            label={__('Border Width', 'betterdocs')}
                                            value={wrapperBorderWidth}
                                            onChange={(value) => setAttributes({ wrapperBorderWidth: value })}
                                            min={0}
                                            max={10}
                                            step={1}
                                        />
                                        <RangeControl
                                            label={__('Border Radius', 'betterdocs')}
                                            value={wrapperBorderRadius}
                                            onChange={(value) => setAttributes({ wrapperBorderRadius: value })}
                                            min={0}
                                            max={50}
                                            step={1}
                                        />
                                    </PanelBody>

                                    {showHeader && (
                                        <PanelBody title={__('Header', 'betterdocs')} initialOpen={false}>
                                            <ResponsiveDimensionsControl
                                                baseLabel={__('Padding', 'betterdocs')}
                                                resRequiredProps={resRequiredProps}
                                                controlName={CODE_SNIPPET_HEADER_PADDING}
                                            />
                                            <ColorControl
                                                label={__('Background Color', 'betterdocs')}
                                                color={headerBackgroundColor}
                                                onChange={(colorValue) => setAttributes({ headerBackgroundColor: colorValue })}
                                            />
                                            <ColorControl
                                                label={__('Border Color', 'betterdocs')}
                                                color={headerBorderColor}
                                                onChange={(colorValue) => setAttributes({ headerBorderColor: colorValue })}
                                            />
                                            <RangeControl
                                                label={__('Border Width', 'betterdocs')}
                                                value={headerBorderWidth}
                                                onChange={(value) => setAttributes({ headerBorderWidth: value })}
                                                min={0}
                                                max={10}
                                                step={1}
                                                help={__('Controls border bottom width', 'betterdocs')}
                                            />
                                            <ColorControl
                                                label={__('Copy Button Color', 'betterdocs')}
                                                color={copyButtonColor}
                                                onChange={(colorValue) => setAttributes({ copyButtonColor: colorValue })}
                                            />
                                            <ColorControl
                                                label={__('Copy Button Border Color', 'betterdocs')}
                                                color={copyButtonBorderColor}
                                                onChange={(colorValue) => setAttributes({ copyButtonBorderColor: colorValue })}
                                            />
                                        </PanelBody>
                                    )}

                                    {showLineNumbers && (
                                        <PanelBody title={__('Line Numbers', 'betterdocs')} initialOpen={false}>
                                            <ResponsiveDimensionsControl
                                                baseLabel={__('Padding', 'betterdocs')}
                                                resRequiredProps={resRequiredProps}
                                                controlName={CODE_SNIPPET_LINE_NUMBERS_PADDING}
                                            />
                                            <ColorControl
                                                label={__('Line Number Color', 'betterdocs')}
                                                color={lineNumberColor}
                                                onChange={(colorValue) => setAttributes({ lineNumberColor: colorValue })}
                                            />
                                            <ColorControl
                                                label={__('Line Number Background', 'betterdocs')}
                                                color={lineNumberBgColor}
                                                onChange={(colorValue) => setAttributes({ lineNumberBgColor: colorValue })}
                                            />
                                            <ColorControl
                                                label={__('Border Color', 'betterdocs')}
                                                color={lineNumberBorderColor}
                                                onChange={(colorValue) => setAttributes({ lineNumberBorderColor: colorValue })}
                                            />
                                            <RangeControl
                                                label={__('Border Width', 'betterdocs')}
                                                value={lineNumberBorderWidth}
                                                onChange={(value) => setAttributes({ lineNumberBorderWidth: value })}
                                                min={0}
                                                max={10}
                                                step={1}
                                                help={__('Controls border right width', 'betterdocs')}
                                            />
                                        </PanelBody>
                                    )}

                                    <PanelBody title={__('Code Content Area', 'betterdocs')} initialOpen={false}>
                                        <ResponsiveDimensionsControl
                                            baseLabel={__('Padding', 'betterdocs')}
                                            resRequiredProps={resRequiredProps}
                                            controlName={CODE_SNIPPET_CODE_PADDING}
                                        />
                                        <ColorControl
                                            label={__('Background Color', 'betterdocs')}
                                            color={codeBackgroundColor}
                                            onChange={(colorValue) => setAttributes({ codeBackgroundColor: colorValue })}
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
};

export default Inspector;
