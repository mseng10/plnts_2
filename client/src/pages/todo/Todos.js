import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { CardActionArea, CardHeader } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardActions from '@mui/material/CardActions';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTodos, useTasks } from '../../hooks/useTodos';
import { CARD_STYLE, AVATAR_STYLE } from '../../constants';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { EditSharp } from '@mui/icons-material';
import { NoData, ServerError, Loading } from '../../elements/Page';

const TodoCard = ({ todo, onResolve }) => {
  const navigate = useNavigate();
  const isPastDue = dayjs(todo.due_on).isBefore(dayjs(), 'day');
  const { tasks, updateTask } = useTasks(todo.tasks);

  const handleToggle = (task) => () => {
    if (task.resolved) {
      task.resolved = false;
      task.resolved_on = null;
      updateTask(todo.id, task);
    } else {
      task.resolved = true;
      task.resolved_on = new Date();
      updateTask(todo.id, task);
    }
  };

  return (
    <Grid item width={300}>
      <Card sx={CARD_STYLE} borderRadius={20}>
        <CardActionArea>
          <CardHeader
            avatar={
              <Avatar sx={AVATAR_STYLE}>
                <FormatListNumberedIcon className="small_button" color='info'/>
              </Avatar>
            }
            title={todo.name}
            subheader={
              <span style={{ color: isPastDue ? 'error.main' : 'text.secondary' }}>
                {dayjs(todo.due_on).format('MMM D, YYYY')}
              </span>
            }
            subheaderTypographyProps={{
              sx: { color: isPastDue ? 'error.main' : 'text.secondary' }
            }}
          />
          <CardContent>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {todo.description}
              </Typography>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <Divider sx={{width: '100%' }}  component="li" />
              {tasks && tasks.map((task) => (
                <div key={task.id}>
                  <ListItem
                    disableGutters
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={(handleToggle(task))}
                        checked={task.resolved}
                        color='primary'
                      />
                    }
                  >
                    <ListItemText primary={task.description} style={{ color: "black" }}/>
                  </ListItem>
                  <Divider sx={{width: '100%' }}  component="li" />
                </div>
              ))}
            </List>
            </Box>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton color="info" onClick={() => navigate(`/todos/${todo.id}`)}>
              <EditSharp />
            </IconButton>
            <IconButton color="info" onClick={() => onResolve(todo.id)}>
              <CheckCircleOutlineIcon />
            </IconButton>
          </CardActions>
        </CardActionArea>
      </Card>
    </Grid>
  )
};

const Todos = () => {
  const { todos, isLoading, error, resolveTodo } = useTodos();

  if (isLoading) return <Loading/>;
  if (error) return <ServerError/>;
  if (todos.length === 0) return <NoData/>;

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