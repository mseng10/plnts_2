import { useState, useEffect } from 'react';
import { simpleFetch, simplePost, simplePatch, apiBuilder, APIS } from '../api';

/** Query and api functionality for all systems. */
export const useSystems = () => {
  const [systems, setSystems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Create the provided system. */
  const createSystem = async (newSystem) => {
    setIsLoading(true);
    setError(null);
    simplePost("/systems/", newSystem)
      .then(data => 
        setSystems(prevSystems => [...prevSystems, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  /** Update a system with a new version.  */
  const updateSystem = async (updatedSystem) => {
    const id = updatedSystem.id;
    setIsLoading(true);
    setError(null);
    simplePatch(apiBuilder(APIS.system.updateOne).setId(id).get(), updatedSystem)
      .then(data => 
        setSystems(prevSystems => prevSystems.map(system => 
          system.id === id ? { ...system, ...data } : system
      )))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

    /** Deprecate the system */
    const deprecateSystem = async (id) => {
      setIsLoading(true);
      setError(null);
      simplePost(apiBuilder(APIS.system.deprecateOne).setId(id).get())
        .then(() => 
          setSystems(prevSystems => prevSystems.filter(system => 
            system.id !== id
        )))
        .catch(error => {
          setError(error);
        })
        .finally(() => 
          setIsLoading(false))
    };

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.system.getAll).get())
      .then(setSystems)
      .catch(error => {
        console.log(error);
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  return { systems, isLoading, error, createSystem, updateSystem, deprecateSystem };
};

/** Query a system for it's respective plants. */
export const useSystemsPlants = (system) => {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.system.plants).setId(system.id).get())
      .then(setPlants)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  return { plants, isLoading, error };
};

/** Query a system for it's respective alerts. */
export const useSystemAlerts = (system) => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.system.alerts).setId(system.id).get())
      .then(setAlerts)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  return { alerts, isLoading, error };
};

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