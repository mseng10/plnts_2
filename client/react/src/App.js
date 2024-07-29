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
import NewPlantForm from './pages/plant/NewPlantForm';
import SystemCreate from './pages/system/SystemCreate';
import NewTodoForm from './pages/todo/NewTodoForm';
import NewTypeForm from './pages/plant/type/NewTypeForm';
import NewLightForm from './pages/system/light/NewLightForm';
import NewGenusForm from './pages/plant/genus/NewGenusForm';
import UpdatePlantForm from './pages/plant/UpdatePlantForm';
import UpdateTodoForm from './pages/todo/UpdateTodoForm';
import SystemUpdate from './pages/system/SystemUpdate';
// import '@mui/x-date-pickers/styles';

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
            <Route path="/alerts" element={<Alerts />} />

            <Route path="/todo" element={<Todos />} />
            <Route path="/todo/:id" element={<UpdateTodoForm />} />
            <Route path="/todo/create" element={<NewTodoForm /> } />

            <Route path="/view" element={<Home />} />
            <Route path="/system/view" element={<Systems />} />
            <Route path="/system/:id" element={<SystemUpdate />} />
            <Route path="/plant/view" element={<Plants />} />
            <Route path="/plants/:id" element={<UpdatePlantForm />} />

            <Route path="/create" element={<Home />} />
            <Route path="/plant/create" element={<NewPlantForm />} />
            <Route path="/system/create" element={<SystemCreate />} />
            <Route path="/type/create" element={<NewTypeForm /> } />
            <Route path="/light/create" element={<NewLightForm /> } />
            <Route path="/genus/create" element={<NewGenusForm /> } />
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
