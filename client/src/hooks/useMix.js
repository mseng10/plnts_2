import { useState, useEffect } from 'react';
import { simpleFetch, simplePost } from '../api';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const useMixes = (query) => {
  const [mixes, setMixes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    setIsLoading(true);
    setError(null);
    simpleFetch('/mixes/')
      .then(setMixes)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, [query]);

  const createMix = async (newMix) => {
    setIsLoading(true);
    setError(null);
    simplePost("/mixes/", newMix)
      .then(data => 
        setMixes(prevMixes => [...prevMixes, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  const updateMix = async (updatedMix) => {
    setIsLoading(true);
    setError(null);
    simplePost(`/mixes/${updatedMix.id}/`, updatedMix)
      .then(data => 
        setMixes(prevMixes => prevMixes.map(mix => 
          mix.id === updatedMix.id ? { ...mix, ...data } : mix
      )))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  /** Deprecate the mix */
  const deprecateMix = async (id) => {
    setIsLoading(true);
    setError(null);
    simplePost(`${API_BASE_URL}/mixes/${id}/deprecate/`)
      .then(() => 
        setMixes(prevMixes => prevMixes.filter(mix => 
          mix.id !== id
      )))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  return { mixes, isLoading, error, setError, createMix, updateMix, deprecateMix };
};

/** Query a all soil matters. */
export const useSoils = () => {
  const [soils, setSoils] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch('/soils/')
      .then(setSoils)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);
  
  return { soils, isLoading, error };
};