import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const useSystems = () => {
  const [systems, setSystems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSystems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/system`);
        const data = await response.json();
        setSystems(data);
      } catch (error) {
        console.error('Error fetching system data:', error);
        setError('Failed to fetch systems. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystems();
  }, []);

  return { systems, isLoading, error };
};