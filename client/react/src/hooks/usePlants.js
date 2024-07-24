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
        if (!initialPlants) {
          const plantsResponse = await fetch(`${API_BASE_URL}/plants`);
          setPlants(await plantsResponse.json());
        } else {
          setPlants(initialPlants);
        }
        const [genusResponse, systemResponse, typeResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/genus`),
          fetch(`${API_BASE_URL}/system`),
          fetch(`${API_BASE_URL}/type`)
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

  const killPlant = async (plantIds, cause) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plants/kill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ids:  plants.map((plant) => plant.id), cause: cause})
      });
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error killing plant:', error);
      setError('Failed to kill plant. Please try again later.');
      throw error;
    }
  };

  return { plants, setPlants, genuses, systems, types, isLoading, error, addPlant, killPlant };
};
