import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { green, pink, lightBlue, blueGrey, teal, brown } from '@mui/material/colors';
import Plants from './pages/Plants';
import System from './pages/System';
import Home from './pages/Home';
import Systems from './pages/Systems';

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
    }
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/system" element={<System />} />
        <Route path="/systems" element={<Systems />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
