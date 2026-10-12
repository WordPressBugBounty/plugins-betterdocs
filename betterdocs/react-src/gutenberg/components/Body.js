import React from 'react'
import { useMemo } from '@wordpress/element';
import { buildQueryString } from '@wordpress/url';

import { useFetch } from '../hooks';
import { DocList } from './partials';

const Body = (props) => {
    let bodyWrapper = {className: 'betterdocs-body'};

    if( props.hasOwnProperty('activeId') && props?.activeId == props?.id ) {
        bodyWrapper.style = {display:'block'};
    }

    return (
        <div {...bodyWrapper}>
            <DocList {...props} />
        </div>
    )
}

export default Body;
