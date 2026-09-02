import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Home from '$pages/Home';

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  );
}
