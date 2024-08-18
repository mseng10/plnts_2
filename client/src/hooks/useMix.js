import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const useMixes = (query) => {
  const [mixes, setMixes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMixes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/mix`);
      const data = await response.json();
      setMixes(data);
    } catch (error) {
      console.error('Error fetching mix data:', error);
      setError('Failed to fetch mixes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const createMix = async (mixData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/mix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mixData),
      });
      const data = await response.json();
      setMixes(prevMixes => [...prevMixes, data]);

      return data;
    } catch (error) {
      console.error('Error creating mix:', error);
      setError('Failed to create mix. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMix = async (updatedMix) => {
    try {
      const response = await fetch(`${API_BASE_URL}/mix/${updatedMix.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMix),
      });
      const data = await response.json();
      setMixes(prevMixes => prevMixes.map(mix => 
        mix.id === updatedMix.id ? { ...mix, ...data } : mix
      ));

      return data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  };

  const deprecateMix = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/mix/${id}/deprecate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      console.log(data);
      setMixes(preMixes => preMixes.filter(mix => mix.id !== id));
    } catch (error) {
      console.error('Error deprecating mix:', error);
      setError('Failed to deprecate mix. Please try again.');
    }
  };

  useEffect(() => {
    if (query) {
      fetchMixes();
    }
  }, [query]);

  return { mixes, isLoading, error, setError, createMix, updateMix, deprecateMix };
};

/** Query a all soil matters. */
export const useSoils = () => {
  const [soils, setSoils] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSoils = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/soil`);
        const data = await response.json();
        setSoils(data);
      } catch (error) {
        console.error('Error fetching soil data:', error);
        setError('Failed to fetch soil. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchSoils();
  }, []);
  
  return { soils, isLoading, error };
};