import { Grid } from '@mui/material';
import { useCarePlans } from '../../hooks/useCarePlans'; // Assuming this hook exists
import { NoData, ServerError, Loading } from '../../elements/Page';
import CarePlanCard from './CarePlanCard';

const CarePlans = () => {
    const { carePlans, isLoading, error } = useCarePlans();

    if (isLoading) return <Loading />;
    if (error) return <ServerError />;
    if (!carePlans || carePlans.length === 0) return <NoData />;

    return (
        <div className="App">
            <Grid container justifyContent="center" spacing={4}>
                {carePlans.map((plan) => (
                    <Grid item key={plan.id}>
                        <CarePlanCard carePlan={plan} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default CarePlans;