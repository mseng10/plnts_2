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
import { useTasks } from '../../hooks/useTodos';
import { CARD_STYLE, AVATAR_STYLE } from '../../constants';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { EditSharp } from '@mui/icons-material';

const TodoCard = ({ todo, onResolve }) => {
  const navigate = useNavigate();
  const isPastDue = dayjs(todo.due_on).isBefore(dayjs(), 'day');
  const { tasks, resolveTask, unresolveTask } = useTasks(todo.tasks);

  const handleToggle = (task) => () => {
    if (task.resolved) {
      unresolveTask(todo.id, task.id);
    } else {
      resolveTask(todo.id, task.id)
    }
  };

  return (
    <Card sx={{...CARD_STYLE, width: 300}}>
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
                  <ListItem disableGutters secondaryAction={<Checkbox edge="end" onChange={(handleToggle(task))} checked={task.resolved} color='success' />}>
                    <ListItemText primary={task.description} style={{ color: "black" }}/>
                  </ListItem>
                  <Divider sx={{width: '100%' }}  component="li" />
                </div>
              ))}
            </List>
            </Box>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton color="info" onClick={() => navigate(`/todos/${todo.id}`)}><EditSharp /></IconButton>
            <IconButton color="info" onClick={() => onResolve(todo.id)}><CheckCircleOutlineIcon /></IconButton>
          </CardActions>
        </CardActionArea>
    </Card>
  );
};

export default TodoCard;