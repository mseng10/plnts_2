import { useState, useEffect } from 'react';
import { simplePatch, simplePost, simpleFetch, APIS, apiBuilder} from '../api';

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.goals.getAll).get())
      .then(setGoals)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  const createGoal = async (goalData) => {
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.goals.create).get(), goalData)
      .then(data => 
        setGoals(prevGoals => [...prevGoals, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  const updateGoal = async (updatedGoal) => {
    const id = updatedGoal.id;
    setIsLoading(true);
    setError(null);
    simplePatch(apiBuilder(APIS.goals.updateOne).setId(id).get(), updatedGoal)
      .then(data => 
        setGoals(prevGoals => prevGoals.map(goal => 
          goal.id === id ? { ...goal, ...data } : goal
      )))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  return { goals, isLoading, error, createGoal, updateGoal };
};
