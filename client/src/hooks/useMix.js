import { useState, useEffect } from 'react';
import { simpleFetch, simplePost, apiBuilder, APIS } from '../api';

export const useMixes = (query) => {
  const [mixes, setMixes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.mix.getAll).get())
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
    simplePost(apiBuilder(APIS.mix.updateOne).setId(updatedMix.id).get(), updatedMix)
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
    simplePost(apiBuilder(APIS.plant.deprecateOne).setId(id).get())
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