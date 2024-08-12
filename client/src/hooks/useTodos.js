import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/todo`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todo data:', error);
      setError('Failed to fetch todos. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const resolveTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todo/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      console.log(data);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error resolving todo:', error);
      setError('Failed to resolve todo. Please try again.');
    }
  };

  const createTodo = async (todoData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/todo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData),
      });
      const data = await response.json();
      setTodos(prevTodos => [...prevTodos, data]);

      return data;
    } catch (error) {
      console.error('Error creating todo:', error);
      setError('Failed to create todo. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async (updatedTodo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todo/${updatedTodo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
      const data = await response.json();
      setTodos(prevTodos => prevTodos.map(todo => 
        todo.id === updatedTodo.id ? { ...todo, ...data } : todo
      ));

      return data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return { todos, isLoading, error, resolveTodo, createTodo, updateTodo };
};