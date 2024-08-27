import { useState, useEffect } from 'react';
import { simplePatch, simplePost, simpleFetch, APIS, apiBuilder} from '../api';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    simpleFetch(apiBuilder(APIS.todo.getAll).get())
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
    simplePost(apiBuilder(APIS.todo.deprecateOne).setId(id).get())
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
    simplePost(apiBuilder(APIS.todo.create).get(), todoData)
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
    simplePatch(apiBuilder(APIS.todo.updateOne).setId(id).get(), updatedTodo)
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