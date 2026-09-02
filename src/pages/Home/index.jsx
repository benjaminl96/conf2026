import { ArrowForward, Code, RocketLaunch } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, Container, Stack, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box component='main' sx={{ minHeight: '100vh' }}>
      <Box
        sx={{
          color: 'common.white',
          background: 'linear-gradient(120deg, #003b5c 0%, #006d9c 55%, #00a4c7 100%)',
          py: { xs: 7, md: 10 },
        }}
      >
        <Container maxWidth='lg'>
          <Chip label='React + Vite + Splunk' sx={{ mb: 3, color: 'common.white', bgcolor: '#ffffff26' }} />
          <Typography component='h1' variant='h2' fontWeight={700} gutterBottom>
            Hello, Splunk!
          </Typography>
          <Typography variant='h5' sx={{ maxWidth: 720, color: '#ffffffcc' }}>
            A clean starting point for building React applications that run inside Splunk.
          </Typography>
          <Button
            variant='contained'
            color='inherit'
            endIcon={<ArrowForward />}
            href='https://dev.splunk.com/'
            sx={{ mt: 4, color: 'primary.main' }}
          >
            Start building
          </Button>
        </Container>
      </Box>

      <Container maxWidth='lg' sx={{ py: 5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <RocketLaunch color='primary' fontSize='large' />
              <Typography variant='h5' fontWeight={700} sx={{ mt: 2 }}>
                Splunk-ready
              </Typography>
              <Typography color='text.secondary' sx={{ mt: 1 }}>
                Builds directly into the standard Splunk app packaging layout.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Code color='primary' fontSize='large' />
              <Typography variant='h5' fontWeight={700} sx={{ mt: 2 }}>
                Team conventions included
              </Typography>
              <Typography color='text.secondary' sx={{ mt: 1 }}>
                Atlas-derived build, lint, test, release, package, and AppInspect workflows.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
