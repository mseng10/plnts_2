import { useState, useEffect } from 'react';
import { APIS, apiBuilder, simpleFetch } from '../api';

export const useMeta = () => {
    const [meta, setMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        simpleFetch(apiBuilder(APIS.meta.getOne).get())
            .then(data => {
                setMeta(data);
            })
            .catch(error => {
                setError(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return {
        meta,
        isLoading,
        error,
    };
};