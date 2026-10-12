import { useQuery } from "@tanstack/react-query";

const useDocCategoriesQuery = (queryKeyValue, docCategoriesDefaultParams) => {
    const [docCategoriesParams, setDocCategoriesParams] = useState(docCategoriesDefaultParams);
    const [docCategories, setDocCategories]             = useState([]);
    const [isNextPageAvailable, setNextPageAvailable]   = useState(true);

    const { isLoading:docCategoriesLoading, data:docCategoriesData } = useQuery([queryKeyValue, docCategoriesParams], ({queryKey}) => {
        let [_,params] = queryKey;
        return apiFetch({
            path: addQueryArgs(`wp/v2/doc_category`, params),
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
    });

    useEffect(() => {
        if( !docCategoriesLoading ) {
            const authorOptions = docCategoriesData?.map((author) => ({
                value: author.id,
                label: author.name,
            }));
            setDocCategories((prev) => {
               return [...prev, ...authorOptions]
            });
        }
    }, [docCategoriesLoading, docCategoriesData]);

    return {docCategoriesLoading, setDocCategoriesParams, docCategoriesParams, setDocCategories, docCategories, isNextPageAvailable}
}

export default useDocCategoriesQuery;
