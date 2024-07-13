import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea, CardHeader } from '@mui/material';
import Avatar from '@mui/material/Avatar';
// import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
// import IconButton from '@mui/material/IconButton';
// import CardActions from '@mui/material/CardActions';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import Typography from '@mui/material/Typography';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Todo = ({ todo, full }) => {
  console.log(full);
  if (!todo) {
    // Handle case when todo data is not available
    return <div></div>;
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe">
              <FormatListNumberedIcon/>
            </Avatar>
          }
          title={todo.created_on}
        />
        <CardContent>
          <Box full>
            <Typography variant="body2" color="text.secondary">
              {todo.description}
            </Typography>
          </Box>
        </CardContent>
        {/* <CardActions disableSpacing>
          <IconButton color="info">
            <CheckCircleOutlineIcon />
          </IconButton>
          <IconButton color="info">
            <GrassOutlinedIcon />
          </IconButton>
        </CardActions> */}
      </CardActionArea>
    </Card>
  );
};

export default Todo;
