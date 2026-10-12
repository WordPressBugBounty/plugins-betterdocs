import React from 'react'
import { sprintf, _n } from '@wordpress/i18n';


const Counts = ({ count, attributes }) => {
    let { prefix = '', suffix = '', suffixSingular = '', layout } = attributes;

    if( layout === 'layout-2' ) {
        prefix = '';
        suffix = '';
        suffixSingular = '';
    }

    return (
        <div data-count={count} className="betterdocs-category-items-counts">
            <span>{sprintf(_n(
                '%1$s %2$d %3$s',
                '%1$s %2$d %3$s',
                count,
                'betterdocs'
            ), prefix, count, count === 1 ? suffixSingular : suffix)?.trim()} </span>
        </div>
    )
}

export default Counts
