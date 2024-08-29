import { useState, useEffect } from 'react';
import { simpleFetch, APIS, apiBuilder } from '../api';

export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.stats.getOne).get())
      .then(setStats)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  return { stats, isLoading, error, };
};