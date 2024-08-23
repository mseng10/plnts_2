import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:5000';

/** Query for all systems. */
export const useSystems = () => {
  const [systems, setSystems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const createSystem = async (system) => {
    try {
      const response = await fetch(`${API_BASE_URL}/systems/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(system)
      });
      const data = await response.json();
      setSystems(prevSystems => [...prevSystems, data]);

      return data;
    } catch (error) {
      console.error('Error posting system data:', error);
      setError('Failed to add new system. Please try again later.');
      
      throw error;
    }
  };

  const updateSystem = async (id, updatedSystem) => {
    try {
      const response = await fetch(`${API_BASE_URL}/systems/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSystem),
      });
      const data = await response.json();
      setSystems(prevSystems => prevSystems.map(system => 
        system.id === id ? { ...system, ...data } : system
      ));

      return data;
    } catch (error) {
      console.error('Error updating system:', error);
      throw error;
    }
  };

  const deprecateSystem = async(id, deprecateSystem) => {
    try {
      const response = await fetch(`${API_BASE_URL}/systems/${id}/deprecate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deprecateSystem),
      });
      const data = await response.json();
      setSystems(prevSystems => prevSystems.filter(system => 
        system.id !== id
      ));

      return data;
    } catch (error) {
      console.error('Error updating system:', error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchSystems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/systems`);
        const data = await response.json();
        setSystems(data);
      } catch (error) {
        console.error('Error fetching system data:', error);
        setError('Failed to fetch systems. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystems();
  }, []);

  return { systems, isLoading, error, createSystem, updateSystem, deprecateSystem };
};

/** Query a system for it's respective plants. */
export const useSystemsPlants = (system) => {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSystems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/systems/${system.id}/plants/`);
        const data = await response.json();
        setPlants(data);
      } catch (error) {
        console.error('Error fetching system data:', error);
        setError('Failed to fetch systems. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystems();
  }, []);

  return { plants, isLoading, error };
};

/** Query a system for it's respective alerts. */
export const useSystemAlerts = (system) => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSystems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/systems/${system.id}/alerts/`);
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching system data:', error);
        setError('Failed to fetch systems. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystems();
  }, []);

  return { alerts, isLoading, error };
};

/** Query all lights.  */
export const useLights = () => {
  const [lights, setLights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const createLight = async (newLight) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plants/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLight)
      });
      const data = await response.json();
      setLights(prevLights => [...prevLights, data]);

      return data;
    } catch (error) {
      console.error('Error posting light data:', error);
      setError('Failed to add new light. Please try again later.');
      
      throw error;
    }
  };


  useEffect(() => {
    const fetchSystems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/lights/`);
        const data = await response.json();
        setLights(data);
      } catch (error) {
        console.error('Error fetching light data:', error);
        setError('Failed to fetch lights. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystems();
  }, []);

  return { lights, isLoading, error, createLight};
};

// Target temperature marks
export const temperatureMarks = [
  {
    value: 48,
    label: '48',
  },
  {
    value: 68,
    label: '68°F',
  },
  {
    value: 80,
    label: '80°F',
  }
];

// Target humidity field marks
export const humidityMarks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 60,
    label: '60%',
  },
  {
    value: 100,
    label: '100%',
  }
];

// Target lighting duration field marks
export const durationMarks = [
  {
    value: 6,
    label: '6',
  },
  {
    value: 12,
    label: '12',
  },
  {
    value: 18,
    label: '18',
  }
];

// Target lighting distance field marks
export const distanceMarks = [
  {
    value: 12,
    label: '12"',
  },
  {
    value: 24,
    label: '24"',
  },
  {
    value: 36,
    label: '36"',
  }
];