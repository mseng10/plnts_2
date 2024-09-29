import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea, CardHeader } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardActions from '@mui/material/CardActions';
import { CARD_STYLE, AVATAR_STYLE } from '../../constants';
import { EditSharp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { NoData, ServerError, Loading } from '../../elements/Page';
import { useMixes } from '../../hooks/useMix';
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import PieChartOutlineSharpIcon from '@mui/icons-material/PieChartOutlineSharp';

const MixCard = ({ mix, deprecateMix }) => {
  const navigate = useNavigate();

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
            {mix.description}
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