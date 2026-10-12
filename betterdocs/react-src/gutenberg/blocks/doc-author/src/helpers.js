export function getCurrentDate() {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return `Updated on ${date.toLocaleDateString('en-US', options)}`;
}

