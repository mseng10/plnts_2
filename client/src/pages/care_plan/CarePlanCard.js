import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardHeader, Avatar, CardContent, List, ListItem, ListItemText, CardActions, IconButton, Typography } from '@mui/material';
import { EditSharp } from '@mui/icons-material';
import { CARD_STYLE, AVATAR_STYLE } from '../../constants';
import IconFactory from '../../elements/IconFactory';

const CarePlanCard = ({ carePlan }) => {
    const navigate = useNavigate();

    // Helper to create a list of care actions that have a value
    const careActions = [
        { label: 'Watering', value: carePlan.watering },
        { label: 'Fertilizing', value: carePlan.fertilizing },
        { label: 'Cleaning', value: carePlan.cleaning },
        { label: 'Potting', value: carePlan.potting },
    ].filter(action => action.value); // Only include actions with a defined frequency

    return (
        <Card sx={{ ...CARD_STYLE, width: 300 }}>
            <CardActionArea>
                <CardHeader
                    avatar={
                        <Avatar sx={AVATAR_STYLE}>
                            <IconFactory icon="care_plan" color='info' size="md" />
                        </Avatar>
                    }
                    title={carePlan.name}
                    titleTypographyProps={{ variant: 'h6' }}
                />
                <CardContent>
                    {careActions.length > 0 ? (
                        <List dense>
                            {careActions.map((action) => (
                                <ListItem key={action.label} disableGutters>
                                    <ListItemText
                                        primary={action.label}
                                        secondary={`Every ${action.value} days`}
                                        primaryTypographyProps={{ color: 'text.primary' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No care frequencies defined.
                        </Typography>
                    )}
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton color="info" onClick={() => navigate(`/care_plans/${carePlan.id}`)}>
                        <EditSharp />
                    </IconButton>
                </CardActions>
            </CardActionArea>
        </Card>
    );
};

export default CarePlanCard;