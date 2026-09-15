import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import Home from '$pages/Home';
import ReactOnly from '$pages/ReactOnly';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#006d9c' },
    background: { default: '#f4f6f8' },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
  shape: { borderRadius: 10 },
});

export default function App() {
  const [hashPath, setHashPath] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHashPath(window.location.hash);

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {hashPath === '#/react-only' ? <ReactOnly /> : <Home />}
    </ThemeProvider>
  );
}
