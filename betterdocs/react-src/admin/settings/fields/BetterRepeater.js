import React, { useCallback, useMemo, useEffect, useState } from 'react'
import { ReactSortable } from "react-sortablejs";
import { v4 } from "uuid";
import { executeChange, useBuilderContext, GenericField, isArray } from 'quickbuilder';
import BetterRepeaterField from './BetterRepeaterField';
import ReactModal from "react-modal";
import BetterRepeaterValueShow from './BetterRepeaterValueShow';
import { __ } from '@wordpress/i18n';
import CloseIcon from '../components/CloseIcon';


const BetterRepeater = (props) => {
    const { name: fieldName, value: fieldValue, placeholder_img, button, _fields, visible_fields, empty_rules_message } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
    const [isEditNecessaryModalOpen, setIsEditCookieInfoModalOpen] = useState(false);
    const builderContext = useBuilderContext();
    const [localMemoizedValue, setLocalMemoizedValue] = useState(builderContext.values?.[fieldName]);
    const [activeEditItem, setActiveEditItem] = useState("");
	const [lastEditState, setLastEditState] = useState({});

    useEffect(() => {
        if (builderContext.values?.[fieldName] != undefined) {
            setLocalMemoizedValue(builderContext.values?.[fieldName]);
        }
    }, [builderContext.values?.[fieldName]]);

    const handleChange = (event, index) => {
        if (event.persist) {
            event.persist();
        }
        const { field, val: value } = executeChange(event);
        builderContext.setFieldValue([fieldName, index, field], value);
    }

    const handleRemove = useCallback((index) => {
        let lValue = [...localMemoizedValue];
        lValue.splice(index, 1)
        builderContext.setFieldValue(fieldName, lValue);
    }, [localMemoizedValue])

    const handleClone = useCallback((index) => {
        let lValue = [...localMemoizedValue];
        if (lValue.length > 0) {
            let indexedCopy = lValue?.[index] || {};
            if(indexedCopy?.title){
                indexedCopy = {...indexedCopy, title: (indexedCopy.title + ' - Copy')}
            }
            if(indexedCopy?.post_title){
                indexedCopy = {...indexedCopy, post_title: (indexedCopy.post_title + ' - Copy')}
            }
            if(indexedCopy?.username){
                indexedCopy = {...indexedCopy, username: (indexedCopy.username + ' - Copy')}
            }
            if(indexedCopy?.plugin_theme_name){
                indexedCopy = {...indexedCopy, plugin_theme_name: (indexedCopy.plugin_theme_name + ' - Copy')}
            }
            indexedCopy = {...indexedCopy, index: v4(), isCollapsed: false};
            builderContext.setFieldValue([fieldName, localMemoizedValue.length], indexedCopy);
        }
    }, [localMemoizedValue])


    useEffect(() => {
        if (localMemoizedValue == undefined || localMemoizedValue == '') {
            setLocalMemoizedValue([]);
        } else{
            // setLocalMemoizedValue((items) => items.map((item) => {
            //     return {...item, index: v4()};
            // }))
        }
    }, [])

    const handleButtonClick = () => {
		let fieldKeys 					  = Object.keys(_fields);
		let newFieldKeysWithDefaultValues = {};
		fieldKeys?.map((key) => {
			newFieldKeysWithDefaultValues[key] = '';
		});
        builderContext.setFieldValue(fieldName, [...localMemoizedValue, {index: v4(), ...newFieldKeysWithDefaultValues}]);
        setIsOpen(true);
    }

    const _handleButtonClick = () => {
        setIsIntegrationModalOpen(true);
    }


	let editItem		   = localMemoizedValue?.find((value) => ( value?.index == activeEditItem));
	let modalLockCondition = ( localMemoizedValue != undefined && editItem == undefined && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.access_control_rule?.length > 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.control_access_restrict_doc_category?.length > 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.control_access_restrict_roles?.length > 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.control_access_permission_mode?.length > 0 ) ||
							 ( localMemoizedValue != undefined && editItem == undefined && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.access_control_rule_kb?.length > 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.control_access_restrict_multiple_kb?.toString()?.length > 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.control_access_restrict_roles_kb?.length > 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.control_access_permission_mode_kb?.length > 0 ) ||
							 ( editItem != undefined && editItem?.access_control_rule?.length > 0 &&  editItem?.control_access_restrict_doc_category?.length > 0 &&  editItem?.control_access_restrict_roles?.length > 0 && editItem?.control_access_permission_mode?.length > 0 ) ||
							 ( editItem != undefined && editItem?.access_control_rule_kb?.length > 0 && editItem?.control_access_restrict_multiple_kb?.toString()?.length > 0 &&  editItem?.control_access_restrict_roles_kb?.length > 0 && editItem?.control_access_permission_mode_kb?.length > 0 )
							 ? '' : ' locked';


	function closeiconremove(e) {
		if( activeEditItem?.length == 0 ) { // if this is not edit more remove modal, active edit item
			setIsOpen(false);
			setActiveEditItem("");
			handleRemove(localMemoizedValue?.length - 1); // remove the recently added fresh modal if cross is clicked
		} else {
			let index = localMemoizedValue?.findIndex((value) => {
				return value?.index == lastEditState?.index;
			});

			if( index != undefined ) {
				localMemoizedValue[index] = {...lastEditState};
			}

			builderContext.setFieldValue(fieldName, [...localMemoizedValue]);
			setIsOpen(false);
			setActiveEditItem("");
		}
	}

	useEffect(() => {
		if( activeEditItem?.length > 0 ) {
			let foundItem = localMemoizedValue?.find((value) => value?.index == activeEditItem);
			if( foundItem != undefined ) {
				setLastEditState({...foundItem}); //preserve the last edit state
			}
		} else {
			setLastEditState({}); //revert the last edit state, when edit mode is disabled
		}
	}, [activeEditItem]);

    return (
		<>
		{empty_rules_message != undefined && localMemoizedValue?.length == 0 && <div className='wprf-repeater-no-rules-message-wrapper'>
			<div className='wprf-repeater-no-rules-message-wrapper-secondary-wrapper'>
				{empty_rules_message?.icon_url?.length > 0 && <img className="wprf-repeater-rules-image" src={empty_rules_message?.icon_url}></img>}
				{empty_rules_message?.heading?.length > 0 && <h3 className='wprf-repeater-rules-heading'>{empty_rules_message?.heading}</h3>}
				{empty_rules_message?.subtitle?.length > 0 && <p className='wprf-repeater-rules-subtitle'>{empty_rules_message?.subtitle}</p>}
			</div>
		</div>}
        <div className={`wprf-repeater-control${localMemoizedValue?.length == 0 ? ' no-rules' : ''}`}>
            {localMemoizedValue?.length > 0 ? (
                button?.position == 'top' &&
                    <div className="wprf-repeater-label" onClick={handleButtonClick}>
                        <button className="wprf-repeater-button"
                            onClick={handleButtonClick}>
                            {button?.label}
                        </button>
                    </div>
                ) : (
                    <div className="wprf-repeater-empty">
                        {button?.position == 'top' &&
                            <div className="wprf-repeater-label" onClick={handleButtonClick}>
                                <button className="wprf-repeater-button"
                                    onClick={handleButtonClick}>
                                    {button?.label}
                                </button>
                            </div>
                        }
                    </div>
                )
            }
            {
                localMemoizedValue && localMemoizedValue?.length > 0 &&
                <div className="wprf-repeater-content">
                    {
                        localMemoizedValue.map((value, index) => {
                            return ( isOpen && localMemoizedValue?.length - 1 == index &&  ! activeEditItem )  ? '' : <BetterRepeaterValueShow
								isEditMode={lastEditState != undefined && value?.index == lastEditState?.index ? true : false}
								editState={lastEditState != undefined ? lastEditState : {}}
                                isDefault={value?.default ? true : false}
                                isCollapsed={value?.isCollapsed}
                                key={value?.index || index}
                                fields={_fields}
                                index={index}
                                parent={fieldName}
                                clone={handleClone}
                                remove={handleRemove}
                                onChange={(event) => handleChange(event, index)}
                                visible_fields={visible_fields}
                                setIsOpen={() => {
                                    setIsOpen(true);
                                    setActiveEditItem(value?.index);
                                }}
                            />
                        })
                    }
                </div>
            }
            { button?.position == 'bottom' &&
                <div className="wprf-repeater-label" onClick={handleButtonClick}>
					{button?.icon_url?.length > 0 && <img className="repeater-button-icon-wrapper" src={button?.icon_url}/>}
                    <button className="wprf-repeater-button"
                        onClick={handleButtonClick}>
                        {button?.label}
                    </button>
                </div>
            }
            <ReactModal
                isOpen={isOpen}
                ariaHideApp={false}
                overlayClassName={`betterdocs-access-control-wrapper-overlay`}
				className={'betterdocs-access-control-wrapper'}
                style={{
                    overlay: {
                        zIndex: 99999,
                    }
                }}
            >
                <>
                    <div className="wprf-modal-preview-header" onClick={closeiconremove}>
						<CloseIcon onClick={closeiconremove}/>
						{/* <button onClick={() => {
                                setIsOpen(false);
                                setActiveEditItem("");
                            }}>
                            <CloseIcon />
                        </button> */}
                    </div>
                    <div className="wprf-modal-table-wrapper wpsp-better-repeater-fields">
						<span className='repeater-heading'>{ activeEditItem ? __( 'Edit Rule','betterdocs' ) : __( 'Create New Rule','betterdocs' ) }</span>
						<p className='repeater-subtitle'>{__('Set custom rules to control who can view, edit, or manage specific documentation based on user roles.', 'betterdocs')}</p>
                        { localMemoizedValue && localMemoizedValue?.length > 0 &&
                            <div className="wprf-repeater-content">
                                { activeEditItem &&
                                    localMemoizedValue.map((value, index) => {
										let parentIndex = [...props.parentIndex, 'fields', index];
                                        if( value?.index == activeEditItem ) {
                                            return <BetterRepeaterField
                                                isCollapsed={value?.isCollapsed}
                                                key={value?.index || index}
                                                fields={_fields}
                                                index={index}
                                                parent={fieldName}
                                                clone={handleClone}
                                                remove={handleRemove}
                                                onChange={(event) => handleChange(event, index)}
												parentIndex={parentIndex}
                                            />
                                        }
                                    })
                                }
                                { !activeEditItem &&
                                    localMemoizedValue.map((value, index) => {
                                        if(  localMemoizedValue?.length == (index + 1) ) {
											let parentIndex = [...props.parentIndex, 'fields', index];
                                            return <BetterRepeaterField
                                                isCollapsed={value?.isCollapsed}
                                                key={value?.index || index}
                                                fields={_fields}
                                                index={index}
                                                parent={fieldName}
                                                clone={handleClone}
                                                remove={handleRemove}
                                                onChange={(event) => handleChange(event, index)}
												parentIndex={parentIndex}
                                            />
                                        }
                                    })
                                }
                            </div>
                        }
						<div className="wprf-modal-preview-footer">
                        	<button className={`wpsp-btn wpsp-btn-preview-update${modalLockCondition}`} onClick={() => {
								if( ( activeEditItem?.length == 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.access_control_rule?.length == 0 ) ||
									( activeEditItem?.length == 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.control_access_restrict_doc_category?.length == 0 ) ||
									( activeEditItem?.length == 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.control_access_restrict_roles?.length == 0 ) ||
									( activeEditItem?.length == 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.control_access_permission_mode?.length == 0 ) ||
									( activeEditItem?.length == 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.access_control_rule_kb?.length == 0 ) ||
									( activeEditItem?.length == 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.control_access_restrict_multiple_kb?.toString()?.length == 0 ) ||
									( activeEditItem?.length == 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.control_access_restrict_roles_kb?.length == 0 ) ||
									( activeEditItem?.length == 0 && builderContext.values?.[fieldName][localMemoizedValue?.length - 1]?.control_access_permission_mode_kb?.length == 0 )
								) {
									return;
								}

								if( ( activeEditItem?.length > 0 && editItem?.access_control_rule?.length == 0 ) ||
									( activeEditItem?.length > 0 && editItem?.control_access_restrict_doc_category?.length == 0 ) ||
									( activeEditItem?.length > 0 && editItem?.control_access_restrict_roles?.length == 0 ) ||
									( activeEditItem?.length > 0 && editItem?.control_access_permission_mode?.length == 0 ) ||
									( activeEditItem?.length > 0 && editItem?.access_control_rule_kb?.length == 0 ) ||
									( activeEditItem?.length > 0 && editItem?.control_access_restrict_multiple_kb?.toString()?.length == 0 ) ||
									( activeEditItem?.length > 0 && editItem?.control_access_restrict_roles_kb?.length == 0 ) ||
									( activeEditItem?.length > 0 && editItem?.control_access_permission_mode_kb?.length == 0 ) ) {
									return;
								}
								setIsOpen(false);
								setActiveEditItem("");
							}}> { activeEditItem ? __( 'Update','betterdocs' ) : __( 'Save','betterdocs' ) }</button>
                    	</div>
                    </div>
                </>
            </ReactModal>
        </div>
		</>
    )
}

export default BetterRepeater;
