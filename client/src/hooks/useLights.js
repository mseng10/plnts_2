import { useState, useEffect } from 'react';
import { simpleFetch, simplePost, apiBuilder, APIS } from '../api';

/** Query all lights.  */
export const useLights = () => {
  const [lights, setLights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Initialize the lights. */
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.light.getAll).get())
      .then(setLights)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  /** Create the provided light. */
  const createLight = async (newLight) => {
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.light.create).get(), newLight)
      .then(data => 
        setLights(prevLights => [...prevLights, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  return { lights, isLoading, error, createLight};
};