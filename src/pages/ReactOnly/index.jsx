import { AutoAwesome, Hub, Layers, LinkOff } from '@mui/icons-material';
import { Box, Chip, Container, Stack, Typography } from '@mui/material';

const signalCards = [
  { icon: <Layers />, label: 'React route', value: 'Client-side' },
  { icon: <Hub />, label: 'Splunk view file', value: 'None' },
  { icon: <LinkOff />, label: 'Navigation entry', value: 'Unavailable' },
];

export default function ReactOnly() {
  return (
    <Box
      component='main'
      sx={{
        minHeight: '100vh',
        overflow: 'hidden',
        color: '#0f172a',
        background:
          'radial-gradient(circle at 18% 22%, rgba(247, 201, 72, 0.32) 0 18%, transparent 19%), linear-gradient(135deg, #f8fbff 0%, #eef7fb 46%, #f7fbef 100%)',
      }}
    >
      <Container maxWidth='lg' sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={5}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems='center'>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Chip
                icon={<AutoAwesome />}
                label='Single page app route'
                sx={{ mb: 3, borderRadius: '8px', bgcolor: '#0f172a', color: 'common.white' }}
              />
              <Typography component='h1' variant='h2' fontWeight={800} gutterBottom>
                React can show more than Splunk navigation knows about.
              </Typography>
              <Typography variant='h6' sx={{ maxWidth: 720, color: '#486581', lineHeight: 1.6 }}>
                This page does not have a Splunk XML template, so it cannot be navigated to through a Splunk nav link.
                It is rendered only after the React app loads and the client-side route changes.
              </Typography>
            </Box>

            <Box
              aria-hidden='true'
              sx={{
                position: 'relative',
                width: { xs: '100%', md: 390 },
                aspectRatio: '1 / 1',
                flex: '0 0 auto',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: '8%',
                  borderRadius: '50%',
                  background: 'conic-gradient(from 210deg, #006d9c, #00a4c7, #f7c948, #27ab83, #006d9c)',
                  boxShadow: '0 30px 80px rgba(15, 23, 42, 0.18)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: '24%',
                  borderRadius: '50%',
                  bgcolor: '#ffffff',
                  border: '1px solid #d9e2ec',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: '8%',
                  right: '8%',
                  top: '42%',
                  height: 22,
                  borderRadius: '8px',
                  bgcolor: '#0f172a',
                  transform: 'rotate(-10deg)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: '18%',
                  right: '18%',
                  top: '54%',
                  height: 18,
                  borderRadius: '8px',
                  bgcolor: '#ffffff',
                  border: '1px solid #bcccdc',
                  transform: 'rotate(14deg)',
                }}
              />
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {signalCards.map((card) => (
              <Box
                key={card.label}
                sx={{
                  flex: 1,
                  p: 3,
                  minHeight: 146,
                  borderRadius: '8px',
                  bgcolor: 'rgba(255,255,255,0.78)',
                  border: '1px solid #d9e2ec',
                  boxShadow: '0 14px 40px rgba(15, 23, 42, 0.08)',
                }}
              >
                <Box sx={{ color: '#006d9c', display: 'flex', mb: 2 }}>{card.icon}</Box>
                <Typography variant='body2' color='text.secondary' fontWeight={700}>
                  {card.label}
                </Typography>
                <Typography variant='h5' fontWeight={800} sx={{ mt: 0.5 }}>
                  {card.value}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
