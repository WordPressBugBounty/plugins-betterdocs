import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Icon } from '@wordpress/components';
import { useInstanceId } from "@wordpress/compose";
import { GenericField, useBuilderContext } from 'quickbuilder';
// @ts-ignore
import { __, _n, sprintf } from '@wordpress/i18n';

import Swal from "sweetalert2";

const Delete = ({onClick}) => {
	return <svg
			xmlns="http://www.w3.org/2000/svg"
			width={16}
			height={16}
			viewBox="0 0 16 16"
			fill="none"
			onClick={onClick}
		>
			<path
			d="M2 3.9987H3.33333M3.33333 3.9987H14M3.33333 3.9987V13.332C3.33333 13.6857 3.47381 14.0248 3.72386 14.2748C3.97391 14.5249 4.31304 14.6654 4.66667 14.6654H11.3333C11.687 14.6654 12.0261 14.5249 12.2761 14.2748C12.5262 14.0248 12.6667 13.6857 12.6667 13.332V3.9987H3.33333ZM5.33333 3.9987V2.66536C5.33333 2.31174 5.47381 1.9726 5.72386 1.72256C5.97391 1.47251 6.31304 1.33203 6.66667 1.33203H9.33333C9.68696 1.33203 10.0261 1.47251 10.2761 1.72256C10.5262 1.9726 10.6667 2.31174 10.6667 2.66536V3.9987M6.66667 7.33203V11.332M9.33333 7.33203V11.332"
			stroke="#98A2B3"
			strokeWidth={1.66667}
			strokeLinecap="round"
			strokeLinejoin="round"
			/>
  		</svg>
}

const Edit = ({onClick}) => {
	return <svg
				xmlns="http://www.w3.org/2000/svg"
				width={12}
				height={12}
				viewBox="0 0 12 12"
				fill="none"
				onClick={onClick}
  			>
				<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8.60581 0.582347C8.97868 0.209473 9.48441 0 10.0117 0C10.2729 0 10.5314 0.0514267 10.7726 0.151347C11.0139 0.251267 11.233 0.39772 11.4177 0.582347C11.6023 0.766973 11.7487 0.98616 11.8487 1.22739C11.9486 1.46861 12 1.72716 12 1.98826C12 2.24936 11.9486 2.50791 11.8487 2.74913C11.7487 2.99036 11.6023 3.20955 11.4177 3.39417L10.6821 4.12977C10.4217 4.39013 9.99961 4.39013 9.73928 4.12978L7.87021 2.26076C7.60988 2.00041 7.60988 1.5783 7.87021 1.31795L8.60581 0.582347ZM6.92741 3.20357C6.66708 2.94322 6.24495 2.94322 5.98461 3.20357L1.34057 7.8476C0.913375 8.2748 0.610308 8.81007 0.463781 9.3962L0.0199214 11.1717C-0.0368786 11.3988 0.0296881 11.6391 0.195275 11.8047C0.360861 11.9703 0.601188 12.0369 0.828375 11.9801L2.60382 11.5362C3.18993 11.3897 3.72519 11.0867 4.15239 10.6595L8.79641 6.0154C9.05681 5.75507 9.05681 5.33293 8.79641 5.0726L6.92741 3.20357Z"
				fill="#718096"
				/>
				<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M6 11.3346C6 10.9664 6.29847 10.668 6.66667 10.668H11.3333C11.7015 10.668 12 10.9664 12 11.3346C12 11.7028 11.7015 12.0013 11.3333 12.0013H6.66667C6.29847 12.0013 6 11.7028 6 11.3346Z"
				fill="#718096"
				/>
  			</svg>
}

const BetterRepeaterValueShow = (props) => {
    const builderContext = useBuilderContext();
    const [action, setAction] = useState(false);
    const buttonRef = useRef(null);
    const { fields, onChange, index, parent, visible_fields, setIsOpen, isDefault, isEditMode, editState } = props;

    // @ts-ignore
    const fieldsArray = Object.values(fields).filter(field => visible_fields.includes(field?.name));

    useEffect(() => {
        function handleClickOutside(event) {
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
            setAction(false);
            }
        }

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);
    const onDelete = (event) => {
		Swal.fire({
			title:__('Are you sure you want delete this rule?', "betterdocs"),
			icon: "warning",
			showConfirmButton: true,
			showCancelButton:true,
			confirmButtonText: __('Yes', 'betterdocs'),
			cancelButtonText: __('No', 'betterdocs'),
			customClass: {
				popup: 'betterdocs-bulk-action-popup'
			}
		}).then((result) => {
			if( result?.isConfirmed ) {
				setAction(false);
				event?.stopPropagation();
		 		props.remove(props.index);
			}
		});
    }
    return (
        <div className={`wprf-repeater-field`}>
            <div className="wprf-repeater-inner-field betterdocs">
                {fieldsArray.map((field, fieldIndex) => {
					if( isEditMode ) {
						if (!editState?.[field?.name]) {
                        	return;
                    	}
						return <div className='wprf-repeater-inner-field-item' key={'wprf-repeater-inner-field' + fieldIndex}>
							<p>{ editState?.[field?.name] }</p>
						</div>
					} else {
						if (!builderContext.values?.[parent]?.[index]?.[field?.name]) {
                        	return;
                    	}

						return <div className='wprf-repeater-inner-field-item' key={'wprf-repeater-inner-field' + fieldIndex}>
							<p>{ builderContext.values?.[parent]?.[index]?.[field?.name] }</p>
						</div>
					}
                })}
                {/* {!isDefault && ( */}
                <div className="betterdocs-action-toggle-wrapper" ref={buttonRef}>
                    {/* <a
                        className="nx-admin-three-dots"
                        onClick={ () => setAction(!action) }
                    >
                        <img src={''} alt={'three-dots'} />
                    </a> */}
					<div className="betterdocs-cookies-list-action">
						{/*  || item?.elementor_id */}
						<ul id="betterdocs-admin-actions-ul">
							{/* <li onClick={() => {
								setIsOpen(true);
								setAction(false);
							}}>
									{ __('Edit Rule','betterdocs') }
							</li> */}
							{/* @ts-ignore  */}
							<Edit onClick={() => {
								setIsOpen(true);
								setAction(false);
							}}/>
							<Delete onClick={(event) => onDelete(event)}/>
							{/* <li onClick={(event) => onDelete(event)}>  { __('Delete Rule', 'betterdocs') } </li> */}
						</ul>
					</div>
                </div>
                {/* )} */}
            </div>

        </div>
    )
}

export default BetterRepeaterValueShow;
