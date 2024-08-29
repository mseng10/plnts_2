import { useState, useEffect } from 'react';
import { simpleFetch, APIS, apiBuilder } from '../api';

/** Query for all meta. */
export const useMeta = () => {
  const [meta, setMeta] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.meta.getOne).get())
      .then(setMeta)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  return { meta, isLoading, error };
};