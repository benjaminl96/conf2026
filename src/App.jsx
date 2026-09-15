import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
import { Dashboard, Route as RouteIcon, VisibilityOff } from '@mui/icons-material';
import { BrowserRouter, Link as RouterLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from '$pages/Home';
import HomeSubPage from '$pages/HomeSubPage';
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

const HOME_ROUTE = '/home';
const HOME_SUB_PAGE_HASH = '#/sub-page';
const REACT_ONLY_TOP_LEVEL_ROUTE = '/react-only';

const navItems = [
  {
    icon: <Dashboard />,
    isActive: ({ hash, pathname }) => pathname === HOME_ROUTE && hash !== HOME_SUB_PAGE_HASH,
    label: 'Home',
    to: HOME_ROUTE,
  },
  {
    icon: <RouteIcon />,
    isActive: ({ hash, pathname }) => pathname === HOME_ROUTE && hash === HOME_SUB_PAGE_HASH,
    label: 'Home sub-page',
    to: { pathname: HOME_ROUTE, hash: HOME_SUB_PAGE_HASH },
  },
  {
    icon: <VisibilityOff />,
    isActive: ({ pathname }) => pathname === REACT_ONLY_TOP_LEVEL_ROUTE,
    label: 'Top-level route',
    to: REACT_ONLY_TOP_LEVEL_ROUTE,
  },
];

function getSplunkAppBasename() {
  const appPathMatch = window.location.pathname.match(/^(.*\/app\/conf2026)(?:\/|$)/);

  return appPathMatch?.[1] ?? '';
}

function AppNavigation() {
  const location = useLocation();

  return (
    <AppBar position='sticky' color='inherit' elevation={0} sx={{ borderBottom: '1px solid #d9e2ec' }}>
      <Container maxWidth='lg'>
        <Toolbar disableGutters sx={{ minHeight: 68, gap: 3 }}>
          <Typography component='div' variant='h6' fontWeight={800} sx={{ flexShrink: 0 }}>
            Splunk React App
          </Typography>
          <Stack component='nav' direction='row' spacing={1} aria-label='React pages'>
            {navItems.map((item) => (
              <Button
                key={item.label}
                aria-current={item.isActive(location) ? 'page' : undefined}
                component={RouterLink}
                to={item.to}
                startIcon={item.icon}
                sx={{
                  bgcolor: item.isActive(location) ? 'primary.main' : 'transparent',
                  borderRadius: '8px',
                  color: item.isActive(location) ? 'common.white' : 'text.secondary',
                  px: 1.5,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function HomeRoute() {
  const { hash } = useLocation();

  return hash === HOME_SUB_PAGE_HASH ? <HomeSubPage /> : <Home />;
}

function AppRoutes() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppNavigation />
      <Routes>
        <Route path='/' element={<Navigate to={HOME_ROUTE} replace />} />
        <Route path={HOME_ROUTE} element={<HomeRoute />} />
        <Route path={REACT_ONLY_TOP_LEVEL_ROUTE} element={<ReactOnly />} />
        <Route path='*' element={<Navigate to={HOME_ROUTE} replace />} />
      </Routes>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={getSplunkAppBasename()}>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
