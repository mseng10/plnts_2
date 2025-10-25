import { useState, useEffect } from 'react';
import { simplePost, simpleFetch, simplePatch,simpleDelete, APIS, apiBuilder } from '../api';

/** Query all plants and their related data. */
export const usePlants = (initialPlants) => {
  const [plants, setPlants] = useState([]);
  const [systems, setSystems] = useState([]);
  const [mixes, setMixes] = useState([]);
  const [carePlans, setCarePlans] = useState([]);
  const [species, setSpecies] = useState([]);
  // Separate loading states for clarity
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let fetchedPlants = [];
        if (!initialPlants) {
          fetchedPlants = await simpleFetch(apiBuilder(APIS.plant.getAll).get());
        } else {
          fetchedPlants = initialPlants;
        }

        // Fetch all related data in parallel
        const [fetchedSystems, fetchedSpecies, fetchedMixes, fetchedCarePlans] = await Promise.all([
          simpleFetch(apiBuilder(APIS.system.getAll).get()),
          simpleFetch(apiBuilder(APIS.species.getAll).get()),
          simpleFetch(apiBuilder(APIS.mix.getAll).get()),
          simpleFetch(apiBuilder(APIS.carePlans.getAll).get())
        ]);

        // Join all related data into plants
        const plantsWithData = fetchedPlants.map(plant => ({
          ...plant,
          species: fetchedSpecies.find(s => s.id === plant.species_id) || { name: 'Unknown Species' },
          system: fetchedSystems.find(s => s.id === plant.system_id) || { name: 'Unknown System' },
          mix: fetchedMixes.find(m => m.id === plant.mix_id) || { name: 'Unknown Mix' },
          carePlan: fetchedCarePlans.find(c => c.id === plant.care_plan_id) || { name: 'Unknown Care Plan' },
        }));

        setPlants(plantsWithData);
        setSystems(fetchedSystems);
        setMixes(fetchedMixes);
        setCarePlans(fetchedCarePlans);
        setSpecies(fetchedSpecies);

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
    setError(null); // Reset error before new action
    try {
      const createdPlant = await simplePost(apiBuilder(APIS.plant.create).get(), newPlant);
      // Manually join species to the newly created plant to update UI instantly
      const species = await simpleFetch(apiBuilder(APIS.species.getOne).setId(createdPlant.species_id).get());
      const newPlantWithSpecies = { ...createdPlant, species };
      setPlants(prevPlants => [...prevPlants, newPlantWithSpecies]);
    } catch (error) {
      setError(error.message || 'Failed to create plant.');
      throw error; // Re-throw for the component to handle
    } finally {
      setIsLoading(false);
    }
  };

  const deprecatePlant = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await simpleDelete(apiBuilder(APIS.plant.deleteOne).setId(id).get());
      setPlants(prevPlants => prevPlants.filter(p => p.id !== id));
    } catch (error) {
      setError(error.message || 'Failed to deprecate plant.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /** Update a plant with a new version.  */
  const updatePlant = async (updatedPlant) => {
    const id = updatedPlant.id;
    setIsLoading(true);
    setError(null);
    try {
      const data = await simplePatch(apiBuilder(APIS.plant.updateOne).setId(id).get(), updatedPlant);
      const species = await simpleFetch(apiBuilder(APIS.species.getOne).setId(data.species_id).get());
      const updatedPlantWithSpecies = { ...data, species };
      setPlants(prevPlants => prevPlants.map(plant => (plant.id === id ? updatedPlantWithSpecies : plant)));
    } catch (error) {
      setError(error.message || 'Failed to update plant.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { plants,
    setPlants,
    systems, 
    mixes,
    carePlans,
    species,
    isLoading,
    error,
    setError,
    createPlant,
    deprecatePlant,
    updatePlant
  };
};

/** Query a all genuses. */
export const useGenera = () => {
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

/** Query all species. */
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

  const createAll = async (newType) => {
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.species.createAll).get(), newType)
      .then(data => 
        setSpecies(prevSpecies => [...prevSpecies, data.species]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  
  return { species, isLoading, error, createSpecies, createAll, setError };
};