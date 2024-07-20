import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme,  } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { pink, blueGrey, teal, brown, yellow, lightGreen, lime, deepPurple} from '@mui/material/colors';
import Plants from './pages/Plants';
import System from './models/System';
import Home from './pages/Home';
import Systems from './pages/Systems';
import Alerts from './pages/Alerts';
import Todos from './pages/Todos';
import Box from '@mui/material/Box';
import AppNavigation from './navigation/AppNavigation';
import NewPlantForm from './forms/create/NewPlantForm';
import NewSystemForm from './forms/create/NewSystemForm';
import NewTodoForm from './forms/create/NewTodoForm';
import NewTypeForm from './forms/create/NewTypeForm';
import NewLightForm from './forms/create/NewLightForm';
import NewGenusForm from './forms/create/NewGenusForm';

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
          sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/system" element={<System />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/todos" element={<Todos />} />

            <Route path="/view" element={<Home />} />
            <Route path="/system/view" element={<Systems />} />
            <Route path="/plant/view" element={<Plants />} />

            <Route path="/create" element={<Home />} />
            <Route path="/plant/create" element={<NewPlantForm />} />
            <Route path="/system/create" element={<NewSystemForm />} />
            <Route path="/todo/create" element={<NewTodoForm /> } />
            <Route path="/type/create" element={<NewTypeForm /> } />
            <Route path="/light/create" element={<NewLightForm /> } />
            <Route path="/genus/create" element={<NewGenusForm /> } />
          </Routes>
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
      </ThemeProvider>
    </Box>
  );
}

export default App;
