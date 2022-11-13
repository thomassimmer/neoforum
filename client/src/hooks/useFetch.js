import { useState, useEffect, useCallback } from "react";
import debounce from 'lodash.debounce';

import { prepareHeaders } from "../index";

const useFetch = () => {
    const [data, setData] = useState({
        slug: "",
        channels: [],
        users: [],
        loading: false,
    });

    const runQuery = async (slug) => {
        if (slug !== '') {
            try {
                setData({ ...data, slug: slug, loading: true });
                const res = await fetch(`/search/${slug}`, {
                    headers: prepareHeaders(),
                });
                const json = await res.json();
                setData({ ...data, loading: false, slug: slug, users: json.users, channels: json.channels });
            } catch (err) {
                console.error(err);
            }
        } else {
            setData({ ...data, loading: false, slug: slug, users: [], channels: [] });
        }
    };

    const debouncedSearch = useCallback(
        debounce(slug => runQuery(slug), 500),
        [], // will be created only once initially
    );

    useEffect(() => {
        setData({ ...data, loading: true });
        debouncedSearch(data.slug);
    }, [data.slug]);

    return { data, setData };
};

export default useFetch;
