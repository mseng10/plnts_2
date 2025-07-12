import Grid from '@mui/material/Grid';
import { useTodos } from '../../hooks/useTodos';
import { NoData, ServerError, Loading } from '../../elements/Page';
import TodoCard from './TodoCard';

const Todos = () => {
  const { todos, isLoading, error, resolveTodo } = useTodos();

  if (isLoading) return <Loading/>;
  if (error) return <ServerError/>;
  if (todos.length === 0) return <NoData/>;

  return (
    <div className="App">
      <Grid container justifyContent="center" spacing={4}>
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onResolve={resolveTodo}/>
        ))}
      </Grid>
    </div>
  );
};

export default Todos;