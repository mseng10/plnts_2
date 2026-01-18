import { useState, useEffect } from 'react';
import { simpleFetch, simplePost, simplePatch, simpleDelete, apiBuilder, APIS } from '../api';

export const EXPENSE_CATEGORIES = {
  NEED: 'Need', // As per EXPENSE_CATEGORY enum
  CRAP: 'Crap'  // As per EXPENSE_CATEGORY enum
};

export const useBudget = (month) => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgets = async (fetchMonth) => {
    try {
      const url = `${apiBuilder(APIS.budget.getAll).get()}/month/${fetchMonth}`;
      const budgetsData = await simpleFetch(url);
      setBudgets(budgetsData);
    } catch (err) {
      console.error('Error fetching budget data:', err);
      setError('Failed to fetch budget data. Please try again later.');
    }
  };

  const fetchExpenses = async (fetchMonth) => {
    const url = apiBuilder(APIS.expense.getByMonth).setMonthStr(fetchMonth).get();
    return simpleFetch(url).then(setExpenses).catch(err => {
      setError('Failed to fetch expense data. Please try again later.');
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchBudgets(month),
          fetchExpenses(month)
        ]);
      } catch (err) {
        setError('Failed to fetch initial data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    if (month) fetchData();
  }, [month]);

  const createBudget = async (newBudget) => {
    setIsLoading(true);
    setError(null);
    return simplePost(apiBuilder(APIS.budget.create).get(), newBudget)
      .then(data => {
        setBudgets(prev => [...prev, data]);
        return data;
      })
      .catch(err => {
        setError(err);
        throw err;
      })
      .finally(() => setIsLoading(false));
  };

  const updateBudget = async (budgetData) => {
    const id = budgetData.id;
    setIsLoading(true);
    setError(null);
    // The Python model initializes `budget` from `cost`, so we send `cost`.
    const payload = { cost: budgetData.cost }; 
    return simplePatch(apiBuilder(APIS.budget.updateOne).setId(id).get(), payload)
      .then(data => {
        setBudgets(prev => prev.map(b => (b.id === id ? data : b)));
        return data;
      })
      .catch(err => {
        setError(err);
        throw err;
      })
      .finally(() => setIsLoading(false));
  };

  const createExpense = async (newExpense) => {
    setIsLoading(true);
    setError(null);
    return simplePost(apiBuilder(APIS.expense.create).get(), newExpense)
      .then(data => {
        setExpenses(prev => [...prev, data]);
        fetchBudgets(month); // Refetch budgets to update remaining amount
        return data;
      })
      .catch(err => {
        setError(err);
        throw err;
      })
      .finally(() => setIsLoading(false));
  };

  const updateExpense = async (updatedExpense) => {
    const id = updatedExpense.id;
    setIsLoading(true);
    setError(null);
    return simplePatch(apiBuilder(APIS.expense.updateOne).setId(id).get(), updatedExpense)
      .then(data => {
        setExpenses(prev => prev.map(e => (e.id === id ? { ...e, ...data } : e)));
        fetchBudgets(month); // Refetch budgets to update remaining amount
        return data;
      })
      .catch(err => {
        setError(err);
        throw err;
      })
      .finally(() => setIsLoading(false));
  };

  const deleteExpense = async (id) => {
    setIsLoading(true);
    setError(null);
    return simpleDelete(apiBuilder(APIS.expense.deprecateOne).setId(id).get())
      .then(() => {
        setExpenses(prev => prev.filter(e => e.id !== id));
        fetchBudgets(month); // Refetch budgets to update remaining amount
      })
      .catch(err => {
        setError(err);
        throw err;
      })
      .finally(() => setIsLoading(false));
  };

  return { budgets, expenses, isLoading, error, createBudget, updateBudget, createExpense, updateExpense, deleteExpense };
};