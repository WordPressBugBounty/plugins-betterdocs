/**
 * Builds Doc Edit URL
 *
 * @param {integer} id
 * @returns {string}
 */
export const gutenbergEditScreenUrl = (id)  => {
    return  `${betterdocs_admin?.admin_url}post.php?post=${id}&action=edit`
}

/**
 * Converts Date Into ISO8601 Format
 *
 * @param {string} date
 * @return {string} iso8601
 */
export const ISO8601 = (originalData) => {
    let iso8601;
    let dateObj    = new Date(originalData);
    var timeString = dateObj.toLocaleTimeString();
    iso8601        = originalData + "T" + timeString;
    return iso8601;
}

/**
 * Delete Property From Object Based On Previous And New Object
 *
 * @param {object} previousObject
 * @param {object} newObject
 * @param {array} registeredProps
 *
 * @returns previousObject
 */
export const objectDifference = (previousObject, newObject, registeredProps) => {
    for( let key of registeredProps ){
        if( previousObject[key] != '' && newObject[key] == undefined ){
            delete previousObject[key];
        }
    }
    return previousObject;
}
