import { useState, useEffect } from 'react';
import { simpleFetch, simplePost, simplePatch, apiBuilder, APIS, simpleDelete } from '../api';

/** Query and api functionality for all systems. */
export const useSystems = () => {
  const [systems, setSystems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Create the provided system. */
  const createSystem = async (newSystem) => {
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.system.create).get(), newSystem)
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
      simpleDelete(apiBuilder(APIS.system.deleteOne).setId(id).get())
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