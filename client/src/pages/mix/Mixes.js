import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { CardActionArea, CardHeader } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardActions from '@mui/material/CardActions';
import { CARD_STYLE, AVATAR_STYLE } from '../../constants';
import { EditSharp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { NoData, ServerError, Loading } from '../../elements/Page';
import { useMixes, useSoilParts, useSoils } from '../../hooks/useMix';
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import PieChartOutlineSharpIcon from '@mui/icons-material/PieChartOutlineSharp';
import Typography from '@mui/material/Typography';


const MixCard = ({ mix, deprecateMix }) => {
  const navigate = useNavigate();

  const { soilParts } = useSoilParts(mix.soil_parts); 
  const { soils } = useSoils();

  return (
    <>
      <Card sx={CARD_STYLE}>
        <CardActionArea>
          <CardHeader
            avatar={
              <Avatar sx={AVATAR_STYLE}>
                <PieChartOutlineSharpIcon className="small_button" color='info'/>
              </Avatar>
            }
            title={mix.name}
            subheader={mix.created_on}
          />
          <CardContent>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {mix.description}
              </Typography>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <Divider sx={{width: '100%' }}  component="li" />
              {soilParts && soilParts.map((sp) => (
                <div key={sp.id}>
                  <ListItem
                    disableGutters
                    secondaryAction={sp.parts}
                  >
                    <ListItemText 
                      primary={soils && soils.length > 0 ? soils.find(s => s.id === sp.soil_id).name : ""}
                      secondaryAction={sp.parts}
                    />
                  </ListItem>
                  <Divider sx={{width: '100%' }}  component="li" />
                </div>
              ))}
            </List>
            </Box>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton color="info" onClick={() => navigate(`/mixes/${mix.id}`)}>
              <EditSharp />
            </IconButton>
            <IconButton color="error" onClick={() => deprecateMix(mix.id)}>
              <DeleteOutlineSharpIcon />
            </IconButton>
          </CardActions>
        </CardActionArea>
      </Card>
    </>
  );
};

const Mixes = () => {
  const { mixes, isLoading, error, deprecateMix } = useMixes();

  if (isLoading) return <Loading/>;
  if (error) return <ServerError/>;
  if (mixes.length == 0) return <NoData/>;

  return (
    <Grid container justifyContent="center" spacing={4}>
      {mixes.map((mix) => (
        <Grid key={mix.id} item>
          <MixCard mix={mix} deprecateMi={deprecateMix}/>
        </Grid>
      ))}
    </Grid>
  );
};

export default Mixes;