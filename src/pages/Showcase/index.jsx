import { useMemo, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  LinearProgress,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Check, Flag, Refresh } from '@mui/icons-material';
import EditOutlined from '@mui/icons-material/EditOutlined';
import useKVStore from '$hooks/useKVStore';
import useLog from '$hooks/useLog';
import useSearchJob from '$hooks/useSearchJob';

const seed = [
  [
    'American Snout',
    'Libytheana carinenta',
    'Nymphalidae',
    true,
    false,
    'brown',
    'orange',
    'Often found near hackberry trees',
  ],
  ['Common Buckeye', 'Junonia coenia', 'Nymphalidae', false, true, 'brown', 'orange', 'Look for eyespots on the wings'],
  [
    'Eastern Tiger Swallowtail',
    'Papilio glaucus',
    'Papilionidae',
    true,
    false,
    'yellow',
    'black',
    'Large and easy to identify',
  ],
  ['Cabbage White', 'Pieris rapae', 'Pieridae', true, false, 'white', 'gray', 'Common garden visitor'],
  ['Spring Azure', 'Celastrina ladon', 'Lycaenidae', false, true, 'blue', 'gray', 'Small blue butterfly'],
  [
    'Common Checkered-Skipper',
    'Pyrgus communis',
    'Hesperiidae',
    false,
    false,
    'gray',
    'white',
    'Often rests with wings spread',
  ],
  ['Red-spotted Purple', 'Limenitis arthemis', 'Nymphalidae', true, true, 'blue', 'red', 'Dark wings with red spots'],
  [
    'Eight-spotted Forester',
    'Alypia octomaculata',
    'Hedylidae',
    false,
    true,
    'black',
    'white',
    'Distinct white wing spots',
  ],
  [
    'Red-banded Hairstreak',
    'Calycopis cecrops',
    'Lycaenidae',
    false,
    false,
    'brown',
    'red',
    'Often found near oak trees',
  ],
  ['Northern Metalmark', 'Calephelis borealis', 'Riodinidae', false, true, 'orange', 'brown', 'Prefers rocky habitats'],
].map((row, index) => ({
  id: index + 1,
  commonName: row[0],
  scientificName: row[1],
  family: row[2],
  collected: row[3],
  priority: row[4],
  primaryColor: row[5],
  secondaryColor: row[6],
  notes: row[7],
}));

const familyNames = ['Hedylidae', 'Hesperiidae', 'Lycaenidae', 'Nymphalidae', 'Papilionidae', 'Pieridae', 'Riodinidae'];

export default function Home() {
  const { data: rows, save } = useKVStore('butterflies', seed);
  const { events, log } = useLog();
  const { searchJob } = useSearchJob();
  const [selection, setSelection] = useState({ type: 'include', ids: new Set() });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const stats = useMemo(() => {
    const collected = rows.filter((row) => row.collected).length;
    const priority = rows.filter((row) => row.priority).length;
    const families = familyNames.map((family) => rows.filter((row) => row.family === family).length);
    const colors = ['blue', 'brown', 'orange', 'yellow', 'white', 'black', 'gray'].map(
      (color) => rows.filter((row) => row.primaryColor === color).length
    );
    return { collected, priority, families, colors, completion: Math.round((collected / rows.length) * 100) };
  }, [rows]);
  const updateRows = (nextRows, message) => {
    save(nextRows);
    log(message, { count: nextRows.length });
    searchJob({ id: 'butterfly-dashboard', data: nextRows });
  };
  const bulkUpdate = (field, value) => {
    console.log('[action] bulk update', { field, value, ids: [...selection.ids] });
    updateRows(
      rows.map((row) => (selection.ids.has(row.id) ? { ...row, [field]: value } : row)),
      `Updated ${selection.ids.size} butterflies`
    );
    setSelection({ type: 'include', ids: new Set() });
  };
  const processRowUpdate = (updated) => {
    console.log('[action] inline edit', updated);
    updateRows(
      rows.map((row) => (row.id === updated.id ? updated : row)),
      `Updated ${updated.commonName}`
    );
    return updated;
  };
  const filterBy = (field, value) => {
    console.log('[action] chart filter', { field, value });
    setFilterModel({ items: [{ field, operator: 'equals', value }] });
  };
  const familyChartData = familyNames.map((family) => ({
    id: family,
    value: rows.filter((row) => row.family === family).length,
    label: family,
  }));
  const colorNames = ['blue', 'brown', 'orange', 'yellow', 'white', 'black', 'gray'];
  const colorValues = { blue: '#32a6ff', brown: '#a1624c', yellow: '#ffe26b', orange: '#f08533', white: '#f4e5c8' };
  const colorChartData = colorNames.map((color) => ({
    id: color,
    value: rows.filter((row) => row.primaryColor === color).length,
    label: color,
    color: colorValues[color] || color,
  }));
  const editableHeader = (label) => (
    <Stack direction='row' alignItems='center' gap={0.5}>
      <span>{label}</span>
      <EditOutlined fontSize='inherit' sx={{ color: 'text.secondary' }} />
    </Stack>
  );
  const columns = [
    { field: 'commonName', headerName: 'Common name', flex: 1.2, minWidth: 180 },
    { field: 'scientificName', headerName: 'Scientific name', flex: 1.1, minWidth: 170 },
    { field: 'family', headerName: 'Family', flex: 1, minWidth: 145 },
    {
      field: 'primaryColor',
      headerName: 'Primary color',
      width: 125,
      renderCell: ({ value }) => <Chip size='small' label={value} sx={{ textTransform: 'capitalize' }} />,
    },
    { field: 'collected', headerName: 'Collected', type: 'boolean', width: 105 },
    { field: 'priority', headerName: 'Priority', type: 'boolean', width: 95 },
    {
      field: 'notes',
      headerName: 'Notes',
      flex: 1.5,
      minWidth: 240,
      editable: true,
      renderHeader: () => editableHeader('Notes'),
    },
  ];
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 4 }}>
      <Container maxWidth='xl'>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent='space-between'
          alignItems={{ md: 'center' }}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant='overline' color='primary'>
              Showcase
            </Typography>
            <Typography variant='h3' fontWeight={700}>
              Butterfly Field Journal
            </Typography>
            <Typography color='text.secondary'>
              A reactive collection dashboard powered by hooks, charts, and a free MUI DataGrid.
            </Typography>
          </Box>
          <Chip icon={<Refresh />} label='Local KV Store demo' color='success' variant='outlined' />
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 2,
          }}
        >
          <Card>
            <CardContent>
              <Typography color='text.secondary'>Collection progress</Typography>
              <Typography variant='h4'>{stats.completion}%</Typography>
              <LinearProgress variant='determinate' value={stats.completion} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color='text.secondary'>Collected</Typography>
              <Typography variant='h4'>
                {stats.collected} / {rows.length}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color='text.secondary'>Priority species</Typography>
              <Typography variant='h4'>{stats.priority}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color='text.secondary'>Families</Typography>
              <Typography variant='h4'>{new Set(rows.map((row) => row.family)).size}</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
          <Card>
            <CardContent>
              <Typography fontWeight={700}>Species by family</Typography>
              <PieChart
                height={220}
                series={[{ data: familyChartData }]}
                onItemClick={(_, item) => filterBy('family', familyChartData[item.dataIndex].id)}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography fontWeight={700}>Primary colors</Typography>
              <PieChart
                height={220}
                series={[{ data: colorChartData }]}
                onItemClick={(_, item) => filterBy('primaryColor', colorChartData[item.dataIndex].id)}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography fontWeight={700}>Recent activity</Typography>
              {events.length ? (
                events.map((event) => (
                  <Typography key={event.id} variant='body2' sx={{ mt: 1 }}>
                    {event.message}
                  </Typography>
                ))
              ) : (
                <Typography color='text.secondary' sx={{ mt: 2 }}>
                  Edit a note or use a bulk action to create activity.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
        <Card>
          <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ flexGrow: 1 }} fontWeight={700}>
              Butterfly catalog
            </Typography>
            <Button
              size='small'
              startIcon={<Check />}
              disabled={!selection.ids.size}
              onClick={() => bulkUpdate('collected', true)}
            >
              Mark collected
            </Button>
            <Button
              size='small'
              startIcon={<Flag />}
              disabled={!selection.ids.size}
              onClick={() => bulkUpdate('priority', true)}
            >
              Mark priority
            </Button>
          </Toolbar>
          <Box sx={{ height: 560, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              showToolbar
              filterModel={filterModel}
              onFilterModelChange={(model) => {
                console.log('[action] grid filter', model);
                setFilterModel(model);
              }}
              onRowSelectionModelChange={(model) => {
                console.log('[action] selection', model);
                setSelection(model);
              }}
              rowSelectionModel={selection}
              processRowUpdate={processRowUpdate}
              pageSizeOptions={[5, 10]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            />
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
