import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:5000';

/** Query for all meta. */
export const useMeta = () => {
  const [meta, setMeta] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeta = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/meta`);
        const data = await response.json();
        setMeta(data);
      } catch (error) {
        console.error('Error fetching meta:', error);
        setError('Failed to fetch meta. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeta();
  }, []);

  return { meta, isLoading, error };
};