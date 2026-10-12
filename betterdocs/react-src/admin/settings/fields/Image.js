import React from 'react'

const Image = (props) => {
    return (
        <div className='wprf-image-wrapper'>
            {props?.media?.url != undefined && <img src={props.media.url} alt={props?.media?.alt ?? ''} />}
        </div>
    )
}

export default Image
