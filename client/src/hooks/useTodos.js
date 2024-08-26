import { useState, useEffect } from 'react';
import { simplePatch, simplePost, simpleFetch } from '../api';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(`/todos/`)
      .then(setTodos)
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false));
  }, []);

  /** Resolve the todo. */
  const resolveTodo = async (id) => {
    setIsLoading(true);
    setError(null);
    simplePost(`${API_BASE_URL}/todos/${id}/deprecate/`)
      .then(() => 
        setTodos(prevTodos => prevTodos.filter(todo => 
          todo.id !== id
      )))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  const createTodo = async (todoData) => {
    setIsLoading(true);
    setError(null);
    simplePost('/todos/', todoData)
      .then(data => 
        setTodos(prevTodos => [...prevTodos, data]))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  const updateTodo = async (updatedTodo) => {
    const id = updatedTodo.id;
    setIsLoading(true);
    setError(null);
    simplePatch(`/todos/${id}/`, updatedTodo)
      .then(data => 
        setTodos(prevTodos => prevTodos.map(todo => 
          todo.id === id ? { ...todo, ...data } : todo
      )))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  return { todos, isLoading, error, resolveTodo, createTodo, updateTodo };
};