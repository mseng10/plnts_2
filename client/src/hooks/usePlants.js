import { useState, useEffect } from 'react';

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
          const plantsResponse = await fetch(`${API_BASE_URL}/plants`);
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

  const addPlant = async (newPlant) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlant)
      });
      const data = await response.json();
      setPlants(prevPlants => [...prevPlants, data]);

      return data;
    } catch (error) {
      console.error('Error posting plant data:', error);
      setError('Failed to add new plant. Please try again later.');
      
      throw error;
    }
  };

  const killPlant = async (cause, when) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plants/kill`, {
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
      const response = await fetch(`${API_BASE_URL}/plants/water`, {
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

  const updatePlant = async (id, updatedPlant) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlant),
      });
      const data = await response.json();
      setPlants(prevPlants => prevPlants.map(plant => 
        plant.id === id ? { ...plant, ...data } : plant
      ));

      return data;
    } catch (error) {
      console.error('Error updating plant:', error);
      throw error;
    }
  };

  return { plants,
    setPlants,
    genuses,
    systems, 
    types,
    isLoading,
    error,
    addPlant,
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
  
  useEffect(() => {
    const fetchGenuses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/genuses`);
        const data = await response.json();
        setGenuses(data);
      } catch (error) {
        console.error('Error fetching genus data:', error);
        setError('Failed to fetch genuses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchGenuses();
  }, []);

  const createGenus = async (newPlant) => {
    try {
      const response = await fetch(`${API_BASE_URL}/genuses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlant)
      });
      const data = await response.json();
      setGenuses(prevGenuses => [...prevGenuses, data]);

      return data;
    } catch (error) {
      console.error('Error posting genuses data:', error);
      setError('Failed to add new genus. Please try again later.');
      
      throw error;
    }
  };
  
  return { genuses, isLoading, error, createGenus, setError };
};

/** Query a all types. */
export const useTypes = () => {
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTypes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/genuses`);
        const data = await response.json();
        setTypes(data);
      } catch (error) {
        console.error('Error fetching genus data:', error);
        setError('Failed to fetch genuses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTypes();
  }, []);

  const createType = async (newType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newType)
      });
      const data = await response.json();
      setTypes(prevTypes => [...prevTypes, data]);

      return data;
    } catch (error) {
      console.error('Error posting types data:', error);
      setError('Failed to add new type. Please try again later.');
      
      throw error;
    }
  };
  
  return { types, isLoading, error, createType, setError };
};