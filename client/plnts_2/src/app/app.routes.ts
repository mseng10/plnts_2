import { Routes } from '@angular/router';
import { PlantListComponent } from './components/plant-list/plant-list.component';
import { AddPlantComponent } from './components/add-plant/add-plant.component';

export const appRoutes: Routes = [
  { path: '', component: PlantListComponent },
  { path: 'add-plant', component: AddPlantComponent },
  { path: '**', redirectTo: '' },
];
