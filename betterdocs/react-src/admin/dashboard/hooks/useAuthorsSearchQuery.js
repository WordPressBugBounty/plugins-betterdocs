import { useState, useEffect } from "react";
import useDebounce from "./useDebounce";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";

const useAuthorsSearchQuery = () => {
    const [userSearchValue, setUserSearchValue] = useState('');
    const debouncedSearchValue                  = useDebounce(userSearchValue);
    const [searchedUsers, setSeachedUsers]      = useState([]);
    const [searchLoading, setSearchLoading]     = useState(false);

    useEffect(() => {
        if( debouncedSearchValue != '' ){
            setSearchLoading(true);
            apiFetch({
                path: addQueryArgs(`wp/v2/users`, {'search':debouncedSearchValue}),
                method: "GET",
            }).then((data) => {
                if(data?.length > 0){
                    let result = data?.map((author) => ({
                        value: author.id,
                        label: author.name,
                    }));
                    setSeachedUsers(result);
                }
                setSearchLoading(false);
            })
        } else {
            setSeachedUsers([]);
        }
    }, [debouncedSearchValue]);

    return {setUserSearchValue, searchedUsers, searchLoading}
}

export default useAuthorsSearchQuery;
