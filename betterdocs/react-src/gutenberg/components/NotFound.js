import React from 'react'
import { __ } from '@wordpress/i18n'

const NotFound = () => {
    return (
        <div>
            {__("No category found.", "betterdocs")}
        </div>
    )
}

export default NotFound
