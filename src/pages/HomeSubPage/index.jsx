import { ArrowBack, CheckCircle, Route } from '@mui/icons-material';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const checkpoints = [
  'The Splunk server loads the existing home.xml template.',
  'React Router takes over after the single page app mounts.',
  'The hash fragment stays in the browser, so it does not need another Splunk view.',
];

export default function HomeSubPage() {
  return (
    <Box
      component='main'
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fbff',
        backgroundImage:
          'linear-gradient(135deg, rgba(0,109,156,0.10), transparent 46%), linear-gradient(90deg, rgba(39,171,131,0.10), transparent 58%)',
      }}
    >
      <Container maxWidth='lg' sx={{ py: { xs: 6, md: 9 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={5} alignItems='center'>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography component='h1' variant='h2' fontWeight={800} gutterBottom>
              This sub-page routes safely inside the Home view.
            </Typography>
            <Typography variant='h6' sx={{ color: '#486581', lineHeight: 1.6, maxWidth: 760 }}>
              The URL is <strong>/en-US/app/conf2026/home#/sub-page</strong>. Splunk only receives the registered Home
              view path, then React Router uses the browser fragment to show this page.
            </Typography>
            <Button
              component={RouterLink}
              to='/home'
              variant='contained'
              startIcon={<ArrowBack />}
              sx={{ mt: 4, borderRadius: '8px' }}
            >
              Back to Home
            </Button>
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 280,
              p: 3,
              borderRadius: '8px',
              bgcolor: 'rgba(255,255,255,0.82)',
              border: '1px solid #d9e2ec',
              boxShadow: '0 18px 48px rgba(15, 23, 42, 0.10)',
            }}
          >
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#006d9c' }}>
                <Route />
                <Typography variant='h5' fontWeight={800}>
                  Correct SPA path shape
                </Typography>
              </Box>
              {checkpoints.map((checkpoint) => (
                <Box key={checkpoint} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <CheckCircle sx={{ color: '#27ab83', mt: 0.25 }} />
                  <Typography color='text.secondary'>{checkpoint}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
