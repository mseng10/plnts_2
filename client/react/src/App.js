import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { green, pink, lightBlue, blueGrey, teal, brown, yellow, lightGreen, lime, deepPurple} from '@mui/material/colors';
import Plants from './pages/Plants';
import System from './models/System';
import Home from './pages/Home';
import Systems from './pages/Systems';
import Alerts from './pages/Alerts';
import Todos from './pages/Todos';
import Box from '@mui/material/Box';
import AppNavigation from './AppNavigation';
import NewPlantForm from './forms/create/NewPlantForm';
import NewSystemForm from './forms/create/NewSystemForm';
import NewTodoForm from './forms/create/NewTodoForm';
import NewTypeForm from './forms/create/NewTypeForm';
import NewLightForm from './forms/create/NewLightForm';
import NewGenusForm from './forms/create/NewGenusForm';

const drawerWidth = 240;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: green[500],
    },
    secondary: {
      main: lightBlue[500],
    },
    info: {
      main: blueGrey[500],
    },
    error: {
      main: pink[500],
    },
    fertilize: {
      main: teal[500],
    },
    repot: {
      main: brown[500],
    },
    light: {
      main: yellow[500]
    },
    type: {
      main: lightGreen[500]
    },
    genus: {
      main: teal[500]
    },
    lime: {
      main: lime[500]
    },
    view: {
      main: deepPurple[500]
    }
  },
});

function App() {
  console.log("CALLED");

  return (
    <Box sx={{ display: 'flex' }}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppNavigation />
        <Box
          component="main"
          sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/system" element={<System />} />
            <Route path="/systems" element={<Systems />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/plant/create" element={<NewPlantForm />} />
            <Route path="/system/create" element={<NewSystemForm />} />
            <Route path="/todo/create" element={<NewTodoForm /> } />
            <Route path="/type/create" element={<NewTypeForm /> } />
            <Route path="/light/create" element={<NewLightForm /> } />
            <Route path="/genus/create" element={<NewGenusForm /> } />
          </Routes>
        </Box>
      </ThemeProvider>
    </Box>
  );
}

export default App;
