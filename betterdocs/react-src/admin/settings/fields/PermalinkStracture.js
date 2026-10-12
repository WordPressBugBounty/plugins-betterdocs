import React, { useCallback, useEffect, useState } from 'react';
import { validFieldProps, withLabel, GenericInput } from 'quickbuilder';
const PermalinkStracture = (props) => {
    const validProps = validFieldProps(
        props,
        ['is_pro', 'visible', 'trigger', 'copyOnClick', 'disable', 'parentIndex', 'context', 'badge', 'popup', 'tags']
    );
    const handleChange = useCallback(
        (event) => validProps.onChange(event, { popup: props?.popup, isPro: !!props.is_pro }),
        [validProps?.value]
    );

    if (props.tags) {
        let tags = Object.values(props.tags);

        if (!Boolean(props?.context?.is_pro_active) || !props?.context?.values?.multiple_kb) {
            tags = tags.filter(item => item.value !== '%knowledge_base%');
        }

        let valueArray = props.value.length > 0 ? props.value.split('/') : [];

        const inputRef = React.useRef(null);
        const clicked = (tag, isActive) => {
            const input = inputRef.current;
            const start = input?.selectionStart ?? 0;

            if (isActive && valueArray.find(item => item === tag.value) != undefined) {
                valueArray = valueArray.filter(item => item !== tag.value);
            }

            let valueString = valueArray.join('/');

            if (!isActive) {
                let nextPointer = valueString.indexOf('/', start);

                if (nextPointer !== -1) {
                    let before = valueString.slice(0, nextPointer);
                    let after = valueString.slice(nextPointer);
                    valueString = `${before}${!before.endsWith('/')?'/':''}${tag.value}${after}`;
                } else {
                    valueString = `${valueString}${!valueString.endsWith('/')?'/':''}${tag.value}`;
                }
            }

            handleChange({
                target: {
                    type: 'button',
                    name: props.name,
                    value: valueString
                }
            });
        };

        return <>
            {React.createElement("input", { ...validProps, onChange: handleChange, ref: inputRef, type: "text" })}
            <div className="wprf-tags-wrapper">
                {
                    tags.map((tag, index) => {
                        let isActive = valueArray.includes(tag.value);

                        return (
                            <React.Fragment key={index}>
                                <span
                                    className={`button button-secondary ${isActive ? 'active' : ''}`}
                                    title={tag.label}
                                    onClick={(e) => clicked(tag, isActive)}
                                >{tag.value}</span>
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </>
    }


    return React.createElement('input', {
        ...validProps, onChange: handleChange
    })
}

export const GenericPermalinkStracture = React.memo(PermalinkStracture);
export default withLabel(React.memo(PermalinkStracture));
