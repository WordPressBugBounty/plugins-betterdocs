import React from 'react'

const HTML = (props) => {
    return (
        <div className='wprf-control-wrapper wpfr-section-html' dangerouslySetInnerHTML={{__html: props.html}}/>
    )
}

export default HTML;
