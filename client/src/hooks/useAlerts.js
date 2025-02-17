import { useState, useEffect } from 'react';
import { simpleFetch, simplePost, APIS, apiBuilder, simpleDelete } from '../api';

export const useAlerts = (initialAlerts = []) => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    simpleFetch(apiBuilder(APIS.alert.getAll).get())
      .then(setAlerts)
      .catch(error => 
        console.error('Error fetching alert data:', error));
    setIsLoading(false);
  }, []);

  /** Resolve the todo. */
  const resolveAlert = async (id) => {
    setIsLoading(true);
    setError(null);
    simpleDelete(apiBuilder(APIS.alert.deleteOne).setId(id).get())
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