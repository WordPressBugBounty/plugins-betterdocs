import apiFetch from "@wordpress/api-fetch";

/**
 * Send Ajax Request To The Server
 *
 * @param {object} data
 * @param {string} url
 * @param {string} method
 *
 */
export function ajaxRequest(data, url, method, parse) {
    return apiFetch({
        url:url,
        body:data,
        method:method,
        parse:parse,
    });
}

/**
 * Construct Data Using FormData(Applicable for only grid view admin panel, Do not use this function on other projects)
 *
 * @param {object} object
 *
 */
export function constructFormData(object) {
    let formData = new FormData();

    for( const key in object ) {
        if( Array.isArray( object[key] ) ) {
            for( let value of object[key] ) {
                if( value?.hasOwnProperty('id') ) {
                    formData.append(`${key}[]`, value?.id);
                } else {
                    formData.append(`${key}[]`, value);
                }
            }
        } else {
            formData.append(`${key}`, object[key]);
        }
    }

    return formData;
}
