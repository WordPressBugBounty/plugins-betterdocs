import apiFetch from "@wordpress/api-fetch";
import { sprintf, __ } from "@wordpress/i18n";

class API {
    namespace = "/betterdocs";
    version = "v1";
    getPath = (path) => {
        return `${this.namespace}/${this.version}/${path}`;
    };
    post = (endpoint, data = {}, args = {}) => {
        let path = this.getPath(endpoint);
        args = { path, method: "POST", data, ...args };
        return apiFetch(args)
            .then((res) => res)
            .catch((err) => err);
    };
    delete = (endpoint, data = {}, args = {}) => {
        let path = this.getPath(endpoint);
        args = { path, method: "DELETE", data, ...args };
        return apiFetch(args)
            .then((res) => res)
            .catch((err) => console.error(err));
    };
    get = (endpoint, args = {}) => {
        let path = this.getPath(endpoint);
        args = { path, method: "GET", ...args };
        return apiFetch(args)
            .then((res) => res)
            .catch((err) => console.error(err));
    };
    useQuery = (search) => {
        search = search;
        return new URLSearchParams(search);
    };
    getParam = (param, d = null) => {
        const query = this.useQuery(location.search);
        return query.get(param) || d;
    };
}


export default new API;
