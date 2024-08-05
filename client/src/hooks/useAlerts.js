// useAlerts.js
import { useState, useEffect } from 'react';
import { fetchAlerts } from '../api';

export const useAlerts = (initialAlerts = []) => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts()
      .then(setAlerts)
      .catch(error => console.error('Error fetching alert data:', error));
    setIsLoading(false);
  }, []);

  const resolveAlert = async (alert) => {
    try {
      resolveAlert(alert.id);
      setAlerts(prevAlerts => prevAlerts.filter(_a => _a.id !== alert.id));
    } catch (error) {
      console.error('Error resolving alert:', error);
      setError('Failed to resolve alert. Please try again.');
    }
  };

  return { alerts, isLoading, error, resolveAlert };
};