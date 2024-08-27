import { useState, useEffect } from 'react';
import { simplePost, simpleFetch, simplePatch, APIS, apiBuilder } from '../api';

export const usePlants = (initialPlants) => {
  const [plants, setPlants] = useState([]);
  const [genuses, setGenuses] = useState([]);
  const [systems, setSystems] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(initialPlants);
        if (!initialPlants) {
          const plantsResponse = await fetch(apiBuilder(APIS.plant.getAll).get());
          setPlants(await plantsResponse.json());
        } else {
          setPlants(initialPlants);
        }
        const [genusResponse, systemResponse, typeResponse] = await Promise.all([
          fetch(apiBuilder(APIS.genus.getAll).get()),
          fetch(apiBuilder(APIS.system.getAll).get()),
          fetch(apiBuilder(APIS.type.getAll).get())
        ]);
        setGenuses(await genusResponse.json());
        setSystems(await systemResponse.json());
        setTypes(await typeResponse.json());
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [initialPlants]);

  const createPlant = async (newPlant) => {
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.plant.create).get(), newPlant)
      .then(data => 
        setSystems(prevPlants => [...prevPlants, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  const deprecatePlants = async (cause, when) => {
    const request = {ids:  plants.map((plant) => plant.id), cause: cause, deprecated_on: when};
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.plant.deprecateMany).get(), request)
      .then(data => 
        setSystems(prevPlants => [...prevPlants, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  const waterPlants = async (when) => {
    const request = {ids:  plants.map((plant) => plant.id), watered_on: when};
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.plant.w).get(), request)
      .then(data => 
        setSystems(prevPlants => [...prevPlants, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  /** Update a system with a new version.  */
  const updatePlant = async (updatedPlant) => {
    const id = updatedPlant.id;
    setIsLoading(true);
    setError(null);
    simplePatch(apiBuilder(APIS.plant.updateOne).setId(id).get(), updatedPlant)
      .then(data => 
        setSystems(prevPlants => prevPlants.map(plant => 
          plant.id === id ? { ...plant, ...data } : plant
      )))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  return { plants,
    setPlants,
    genuses,
    systems, 
    types,
    isLoading,
    error,
    createPlant,
    deprecatePlants,
    waterPlants,
    updatePlant
  };
};

/** Query a all genuses. */
export const useGenuses = () => {
  const [genuses, setGenuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  /** Initialize the genuses. */
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.genus.getAll).get())
      .then(setGenuses)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  /** Create the provided genus. */
  const createGenus = async (newGenus) => {
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.genus.getAll).get(), newGenus)
      .then(data => 
        setGenuses(prevGenuses => [...prevGenuses, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };
  
  return { genuses, isLoading, error, createGenus, setError };
};

/** Query a all types. */
export const useTypes = () => {
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  /** Initialize the types. */
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.type.getAll).get())
      .then(setTypes)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  /** Create the provided type. */
  const createType = async (newType) => {
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.type.create).get(), newType)
      .then(data => 
        setTypes(prevGenuses => [...prevGenuses, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };
  
  return { types, isLoading, error, createType, setError };
};