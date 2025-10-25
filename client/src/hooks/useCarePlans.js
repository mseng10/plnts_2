import { useState, useEffect } from 'react';
import { simpleFetch, simplePost, APIS, apiBuilder, simplePatch, simpleDelete } from '../api';

export const useCarePlans = (initialCarePlans = []) => {
  const [carePlans, setCarePlans] = useState(initialCarePlans);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    simpleFetch(apiBuilder(APIS.carePlans.getAll).get())
      .then(setCarePlans)
      .catch(error => 
        console.error('Error fetching care plan data:', error));
    setIsLoading(false);
  }, []);

    const createCarePlan = async (newCarePlan) => {
      setIsLoading(true);
      setError(null);
      return simplePost(apiBuilder(APIS.carePlans.create).get(), newCarePlan)
          .then(data => {
              setCarePlans(prev => [...prev, data]);
              return data;
          })
          .catch(err => {
              setError(err);
          throw err;
          })
          .finally(() => setIsLoading(false));
    };

    const updateCarePlan = async (updatedCarePlan) => {
      const id = updatedCarePlan.id;
      setIsLoading(true);
      setError(null);
      return simplePatch(apiBuilder(APIS.carePlans.updateOne).setId(id).get(), updatedCarePlan)
          .then(data => {
          setCarePlans(prev => prev.map(e => (e.id === id ? { ...e, ...data } : e)));
              return data;
          })
          .catch(err => {
          setError(err);
              throw err;
          })
          .finally(() => setIsLoading(false));
    };

  /** Deprecate the care plan */
  const deleteCarePlan = async (id) => {
    setIsLoading(true);
    setError(null);
    simpleDelete(apiBuilder(APIS.carePlans.deleteOne).setId(id).get())
      .then(() => 
        setCarePlans(prevCarePlans => prevCarePlans.filter(carePlan => 
          carePlan.id !== id
      )))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  return { carePlans, isLoading, error, updateCarePlan, createCarePlan, deleteCarePlan };
};