import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";

const useAuthorsQuery = (queryKeyValue, authorsDefaultParams) => {
    const [authorParams, setAuthorParams]            = useState(authorsDefaultParams);
    const [authors, setAuthors]                       = useState([]);
    const [isNextPageAvailable, setNextPageAvailable] = useState(true);

    const { isLoading:usersLoading, data:usersData } = useQuery([queryKeyValue, authorParams], ({queryKey}) => {
        let [_,params] = queryKey;
        return apiFetch({
            path: addQueryArgs(`wp/v2/users`, params),
            method: "GET",
            parse: false,
        }).then((data) => {
            return data.json();
        }).then((result) => {
            if(result?.length > 0) {
                setNextPageAvailable(true);
            } else {
                setNextPageAvailable(false);
            }
            return result;
        });
    }, {
        refetchOnWindowFocus:false
    });

    useEffect(() => {
        if( !usersLoading ) {
            const authorOptions = usersData?.map((author) => ({
                value: author.id,
                label: author.name,
            }));
            setAuthors((prev) => {
               return [...prev, ...authorOptions]
            });
        }
    }, [usersLoading, usersData]);

    return {usersLoading, setAuthorParams, authorParams, setAuthors, authors, isNextPageAvailable}
}

export default useAuthorsQuery;
