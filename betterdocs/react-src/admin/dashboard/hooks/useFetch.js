import { useEffect, useState } from "@wordpress/element";

const getData = async (path, parse = true) => {
    const response = await wp.apiFetch({ path, parse });

    if (!parse) {
        const data = await response.json();
        const totalPages = response.headers.get("x-wp-totalpages");
        const totalItems = response.headers.get("x-wp-total");
        return { data, totalPages, totalItems };
    }

    return { data: response };
};

const useFetch = (props, dependency = []) => {
    const { path, parse = true, currentPage } = props;
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState();
    const [totalItems, setTotalItems] = useState();
    const [refetch, setRefetch] = useState(false);

    useEffect(() => {
        getData(path, parse)
            .then(({ data, totalPages, totalItems }) => {
                setData(data);
                setTotalPages(totalPages);
                setTotalItems(totalItems);
                setIsLoading(false);
                setRefetch(false);
            })
            .finally(() => {
                setIsLoading(false);
                setRefetch(false)
            });
    }, [path, currentPage, ...dependency, refetch]);

    return { data, isLoading, error, totalPages, totalItems, setRefetch, setData, setIsLoading };
};

export default useFetch;
