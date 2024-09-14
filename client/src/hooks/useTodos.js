import { useState, useEffect } from 'react';
import { simplePatch, simplePost, simpleFetch, APIS, apiBuilder, simpleDelete} from '../api';

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
    simpleDelete(apiBuilder(APIS.todo.deleteOne).setId(id).get())
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

export const useTasks = (initialTasks) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Resolve the todo's task. */
  const deprecateTask = async (id, eid) => {
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.task.deprecateOne).setId(id).setEmbedId(eid).get())
      .then(data => 
        setTasks(prevTasks => prevTasks.map(task => 
          task.id === id ? { ...task, ...data } : task
      )))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  /** Un-resolve the todo's task. */
  const updateTask = async (id, eid) => {
    setIsLoading(true);
    setError(null);
    simplePost(apiBuilder(APIS.task.updateOne).setId(id).setEmbedId(eid).get())
      .then(data => 
        setTasks(prevTasks => prevTasks.map(task => 
          task.id === id ? { ...task, ...data } : task
      )))
      .catch(error => {
        setError(error);
      })
      .finally(() => 
        setIsLoading(false))
  };

  return { tasks, isLoading, error, deprecateTask, updateTask };
};