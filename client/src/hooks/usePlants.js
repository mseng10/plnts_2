import { useState, useEffect } from 'react';
import { simplePost, simpleFetch, simplePatch } from '../api';

const API_BASE_URL = 'http://127.0.0.1:5000';

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
          const plantsResponse = await fetch(`${API_BASE_URL}/plants/`);
          setPlants(await plantsResponse.json());
        } else {
          setPlants(initialPlants);
        }
        const [genusResponse, systemResponse, typeResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/genuses`),
          fetch(`${API_BASE_URL}/systems`),
          fetch(`${API_BASE_URL}/types`)
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
    simplePost('/plants/', newPlant)
      .then(data => 
        setSystems(prevPlants => [...prevPlants, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  const killPlant = async (cause, when) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plants/kill/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ids:  plants.map((plant) => plant.id), cause: cause, killed_on: when})
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error killing plant:', error);
      setError('Failed to kill plant. Please try again later.');
      throw error;
    }
  };

  const waterPlants = async (when) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plants/water/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ids:  plants.map((plant) => plant.id), watered_on: when})
      });
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error watering plants:', error);
      setError('Failed to water plants. Please try again later.');
      throw error;
    }
  };

  /** Update a system with a new version.  */
  const updatePlant = async (updatedPlant) => {
    const id = updatedPlant.id;
    setIsLoading(true);
    setError(null);
    simplePatch(`/plants/${id}/`, updatedPlant)
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
    killPlant,
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
    simpleFetch(`/genuses/`)
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
    simplePost(/genuses/, newGenus)
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
    simpleFetch(`/types/`)
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
    simplePost(/types/, newType)
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