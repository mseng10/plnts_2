import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea, CardHeader } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardActions from '@mui/material/CardActions';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTodos } from '../../../hooks/useTodos';
import { CARD_STYLE, AVATAR_STYLE } from '../../../constants';

const TodoCard = ({ todo, onResolve }) => (
  <Grid item>
    <Card sx={CARD_STYLE} borderRadius={20}>
      <CardActionArea>
        <CardHeader
          avatar={
            <Avatar sx={AVATAR_STYLE}>
              <FormatListNumberedIcon className="small_button" color='info'/>
            </Avatar>
          }
          title={todo.name}
          subheader={todo.created_on}
        />
        <CardContent>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {todo.description}
            </Typography>
          </Box>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton color="info" onClick={() => onResolve(todo.id)}>
            <CheckCircleOutlineIcon />
          </IconButton>
        </CardActions>
      </CardActionArea>
    </Card>
  </Grid>
);

const Todos = () => {
  const { todos, isLoading, error, resolveTodo } = useTodos();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (todos.length === 0) return <div>No TODOs!</div>;

  return (
    <div className="App">
      <Grid container justifyContent="center" spacing={4}>
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onResolve={resolveTodo} />
        ))}
      </Grid>
    </div>
  );
};

export default Todos;