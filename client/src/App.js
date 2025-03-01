import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme,  } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blueGrey, amber } from '@mui/material/colors';
import Plants from './pages/plant/Plants';
import Home from './pages/Home';
import Systems from './pages/system/Systems';
import Alerts from './pages/alert/Alerts';
import Todos from './pages/todo/Todos';
import Box from '@mui/material/Box';
import AppNavigation from './AppNavigation';
import PlantCreate from './pages/plant/PlantCreate';
import SystemCreate from './pages/system/SystemCreate';
// import TypeCreate from './pages/plant/type/TypeCreate';
import LightCreate from './pages/system/light/LightCreate';
// import GenusCreate from './pages/plant/genus/GenusCreate';
import PlantUpdate from './pages/plant/PlantUpdate';
import SystemUpdate from './pages/system/SystemUpdate';
import TodoCreate from './pages/todo/TodoCreate';
import TodoUpdate from './pages/todo/TodoUpdate';
import MixCreate from './pages/mix/MixCreate';
import MixUpdate from './pages/mix/MixUpdate';
import Stats from './pages/stat/Stats';
import Mixes from './pages/mix/Mixes';

const drawerWidth = 240;

const officalTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(to bottom right, #53e3a6 0%, #50a3a2 100%)',
          /* Replace with your preferred gradient colors and direction */
          /* You can also specify other background properties like size, repeat, etc. */
          height: '100vh', /* Adjust as needed */
          margin: 0, /* Remove default margin */
          padding: 0, /* Remove default padding */
          fontFamily: 'Roboto, sans-serif', /* Example: set global font-family */
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: "#53e3a6",
    },
    info: {
      main: blueGrey[500],
    },
    error: {
      main: amber[500],
    },
    fertilize: {
      main: '#ffffff',
    },
    repot: {
      main: '#ffffff',
    },
    light: {
      main: '#ffffff'
    },
    type: {
      main: '#ffffff',
    },
    genus: {
      main: '#ffffff',
    },
    lime: {
      main: '#ffffff',
    },
    view: {
      main: '#ffffff',
    }
  },
});

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#50a3a2',
//     },
//     secondary: {
//       main: "#53e3a6",
//     },
//     info: {
//       main: blueGrey[500],
//     },
//     error: {
//       main: pink[500],
//     },
//     fertilize: {
//       main: teal[500],
//     },
//     repot: {
//       main: brown[500],
//     },
//     light: {
//       main: yellow[500]
//     },
//     type: {
//       main: lightGreen[500]
//     },
//     genus: {
//       main: teal[500]
//     },
//     lime: {
//       main: lime[500]
//     },
//     view: {
//       main: deepPurple[500]
//     }
//   },
// });

function App() {

  return (
    <Box sx={{ display: 'flex' }}>
      <ThemeProvider theme={officalTheme}>
        <CssBaseline />
        <AppNavigation />
        <Box
          component="main"
          sx={{  zIndex: 2, flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/alerts" element={<Alerts />} />

            <Route path="/todos" element={<Todos />} />
            <Route path="/todos/:id" element={<TodoUpdate />} />
            <Route path="/todos/create" element={<TodoCreate /> } />

            <Route path="/systems" element={<Systems />} />
            <Route path="/systems/:id" element={<SystemUpdate />} />
            <Route path="/systems/create" element={<SystemCreate />} />

            <Route path="/lights/create" element={<LightCreate /> } />

            <Route path="/plants" element={<Plants />} />
            <Route path="/plants/:id" element={<PlantUpdate />} />
            <Route path="/plants/create" element={<PlantCreate />} />

            {/* <Route path="/species/create" element={<SpeciesCreate /> } /> */}

            {/* <Route path="/genera/create" element={<GeneraCreate /> } /> */}

            <Route path="/mixes" element={<Mixes />} />
            <Route path="/mixes/create" element={<MixCreate /> } />
            <Route path="/mixes/:id" element={<MixUpdate /> } />
          </Routes>
        </Box>
      </ThemeProvider>
      <ul className="bg-bubbles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </Box>
  );
}

export default App;
