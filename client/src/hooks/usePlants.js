import { useState, useEffect } from 'react';
import { simplePost, simpleFetch, simplePatch, APIS, apiBuilder } from '../api';

export const usePlants = (initialPlants) => {
  const [plants, setPlants] = useState([]);
  const [systems, setSystems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!initialPlants) {
          const plantsResponse = await fetch(apiBuilder(APIS.plant.getAll).get());
          setPlants(await plantsResponse.json());
        } else {
          setPlants(initialPlants);
        }
        const [systemResponse] = await Promise.all([
          fetch(apiBuilder(APIS.system.getAll).get())
        ]);
        setSystems(await systemResponse.json());
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
    systems, 
    isLoading,
    error,
    createPlant,
    deprecatePlants,
    waterPlants,
    updatePlant
  };
};

/** Query a all genuses. */
export const useGeneraTypes = () => {
  const [genera, setGenera] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  /** Initialize the genuses. */
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.genus.getAll).get())
      .then(setGenera)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  /** Create the provided genus. */
  const createGenera = async (newGenus) => {
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.genus.getAll).get(), newGenus)
      .then(data => 
        setGenera(prevGenuses => [...prevGenuses, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };
  
  return { genera, isLoading, error, createGenera, setError };
};

export const useSpecies = () => {
  const [species, setSpecies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.species.getAll).get())
      .then(setSpecies)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  /** Create the provided type. */
  const createSpecies = async (newType) => {
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.species.create).get(), newType)
      .then(data => 
        setSpecies(prevSpecies => [...prevSpecies, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };
  
  return { species, isLoading, error, createSpecies, setError };
};