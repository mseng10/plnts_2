import { useState, useEffect } from 'react';
import { simpleFetch, apiBuilder, APIS } from '../api';

/** Query a all soil matters. */
export const useSoils = () => {
  const [soils, setSoils] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.soil.getAll).get())
      .then(setSoils)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);
  
  return { soils, isLoading, error };
};