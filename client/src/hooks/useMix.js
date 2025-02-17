import { useState, useEffect } from 'react';
import { simpleFetch, simplePost, apiBuilder, simplePatch, APIS, simpleDelete } from '../api';

export const useMixes = () => {
  const [mixes, setMixes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.mix.getAll).get())
      .then(setMixes)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  const createMix = async (newMix) => {
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.mix.create).get(), newMix)
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
    simplePatch(apiBuilder(APIS.mix.updateOne).setId(updatedMix.id).get(), updatedMix)
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
  const deleteMix = async (id) => {
    setIsLoading(true);
    setError(null);
    simpleDelete(apiBuilder(APIS.plant.deleteOne).setId(id).get())
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

  return { mixes, isLoading, error, setError, createMix, updateMix, deleteMix };
};

export const useSoilParts = (initialParts) => {
  const [soilParts, setSoilParts] = useState(initialParts);
  const [isLoading, setIsLoading] = useState(true);

  return { soilParts, isLoading, setSoilParts, setIsLoading };
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