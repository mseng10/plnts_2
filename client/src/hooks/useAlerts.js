// useAlerts.js
import { useState, useEffect } from 'react';
import { simpleFetch, simplePost } from '../api';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const useAlerts = (initialAlerts = []) => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    simpleFetch('/alerts/check/')
      .then(setAlerts)
      .catch(error => 
        console.error('Error fetching alert data:', error));
    setIsLoading(false);
  }, []);

  /** Resolve the todo. */
  const resolveAlert = async (id) => {
    setIsLoading(true);
    setError(null);
    simplePost(`${API_BASE_URL}/alerts/${id}/deprecate/`)
      .then(() => 
      setAlerts(prevAlerts => prevAlerts.filter(alert => 
        alert.id !== id
      )))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
    };

  return { alerts, isLoading, error, resolveAlert };
};