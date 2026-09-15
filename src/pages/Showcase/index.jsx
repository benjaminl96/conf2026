import { useCallback, useEffect, useMemo, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Alert,
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

const COLLECTION = 'butterfly_journal';
const COLUMN_STORAGE_KEY = 'conf2026:showcase:columnVisibility';

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
  _key: String(index + 1),
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
export default function Showcase() {
  const { error, isLoading, getCollection, editCollectionEntry, postCollectionEntries } = useKVStore();
  const [rows, setRows] = useState([]);
  const { log } = useLog();
  const { searchJob } = useSearchJob();
  const [events, setEvents] = useState([]);
  const [selection, setSelection] = useState({ type: 'include', ids: new Set() });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const selectedKeys =
    selection.type === 'exclude'
      ? rows.map((row) => row._key).filter((key) => !selection.ids.has(key))
      : [...selection.ids];
  const selectedKeySet = new Set(selectedKeys);
  const selectedRows = rows.filter((row) => selectedKeySet.has(row._key));
  const allSelectedCollected = selectedRows.length > 0 && selectedRows.every((row) => row.collected);
  const allSelectedPriority = selectedRows.length > 0 && selectedRows.every((row) => row.priority);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(COLUMN_STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  });
  const refreshActivity = useCallback(async () => {
    console.log('[action] refresh recent activity');
    const { results } = await searchJob({
      search:
        'search index=main sourcetype=butterfly_journal | spath input=_raw path=message output=activity_message | sort 0 - _time | head 5 | eval activity_date=strftime(_time, "%a %b %d"), activity_time=strftime(_time, "%I:%M:%S %p") | table activity_date activity_time activity_message',
    });
    setEvents(
      results.map((event, index) => ({ id: `${event.activity_date}-${event.activity_time}-${index}`, ...event }))
    );
  }, [searchJob]);
  const appendPendingActivity = useCallback(
    (message, sid) => {
      setEvents((current) =>
        [
          { id: sid, activity_date: 'Pending indexing', activity_time: '—', activity_message: message },
          ...current,
        ].slice(0, 5)
      );
      window.setTimeout(() => {
        refreshActivity().catch((activityError) =>
          console.error('[action] delayed activity refresh failed', activityError)
        );
      }, 2000);
    },
    [refreshActivity]
  );
  useEffect(() => {
    refreshActivity().catch((activityError) => console.error('[action] recent activity failed', activityError));
  }, [refreshActivity]);
  useEffect(() => {
    localStorage.removeItem('conf2026:butterflies');
    let active = true;
    const load = async () => {
      let records = await getCollection(COLLECTION);
      if (!records.length) {
        console.log('[action] seed KV Store', { collection: COLLECTION, count: seed.length });
        await postCollectionEntries(COLLECTION, seed);
        records = await getCollection(COLLECTION);
      }
      if (active) setRows(records);
    };
    load().catch((loadError) => console.error('[action] load butterflies failed', loadError));
    return () => {
      active = false;
    };
  }, [getCollection, postCollectionEntries]);
  const stats = useMemo(() => {
    const collected = rows.filter((row) => row.collected).length;
    const priority = rows.filter((row) => row.priority).length;
    const families = familyNames.map((family) => rows.filter((row) => row.family === family).length);
    const colors = ['blue', 'brown', 'orange', 'yellow', 'white', 'black', 'gray'].map(
      (color) => rows.filter((row) => row.primaryColor === color).length
    );
    return {
      collected,
      priority,
      families,
      colors,
      completion: rows.length ? Math.round((collected / rows.length) * 100) : 0,
    };
  }, [rows]);
  const bulkUpdate = async (field, value) => {
    console.log('[action] bulk update', { field, value, ids: selectedKeys });
    const changed = rows.filter((row) => selectedKeySet.has(row._key)).map((row) => ({ ...row, [field]: value }));
    await postCollectionEntries(COLLECTION, changed);
    setRows(rows.map((row) => (selectedKeySet.has(row._key) ? { ...row, [field]: value } : row)));
    const verb = field === 'collected' ? (value ? 'Obtained' : 'Removed') : value ? 'Prioritized' : 'Deprioritized';
    const suffix = field === 'collected' && !value ? ' from collection' : '';
    const subject = changed.length === 1 ? changed[0].commonName : `${changed.length} species`;
    const message = `${verb} ${subject}${suffix}`;
    const { sid } = await log({
      action: 'bulk_update',
      message,
      details: { field, value, keys: selectedKeys },
      sourcetype: 'butterfly_journal',
      source: 'Butterfly Field Journal',
    });
    appendPendingActivity(message, sid);
    setSelection({ type: 'include', ids: new Set() });
  };
  const processRowUpdate = async (updated) => {
    console.log('[action] inline edit', updated);
    const original = rows.find((row) => row._key === updated._key);
    const changedFields = Object.keys(updated).filter(
      (field) => updated[field] !== original?.[field] && field !== '_key'
    );
    const { _key, ...values } = updated;
    await editCollectionEntry(COLLECTION, _key, values);
    setRows(rows.map((row) => (row._key === _key ? updated : row)));
    const fieldLabel = changedFields.map((field) => field.charAt(0).toUpperCase() + field.slice(1)).join(', ');
    const message = `Updated ${updated.commonName}'s ${fieldLabel}`;
    const { sid } = await log({
      action: 'edit',
      message,
      details: { key: _key, fields: changedFields },
      sourcetype: 'butterfly_journal',
      source: 'Butterfly Field Journal',
    });
    appendPendingActivity(message, sid);
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
  const activityGroups = events.reduce((groups, event) => {
    const date = event.activity_date;
    const existingGroup = groups.find((group) => group.date === date);
    if (existingGroup) existingGroup.events.push(event);
    else groups.push({ date, events: [event] });
    return groups;
  }, []);
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
              A reactive collection dashboard powered by splunk utils, hooks, a KV store, and MUI charts and DataGrid.
            </Typography>
          </Box>
          <Chip
            icon={<Refresh />}
            label={isLoading ? 'Syncing butterfly_journal…' : 'KV Store: butterfly_journal'}
            color={error ? 'error' : 'success'}
            variant='outlined'
          />
        </Stack>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}
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
              {activityGroups.length ? (
                activityGroups.map((group) => (
                  <Box key={group.date} sx={{ mt: 1.5 }}>
                    <Typography variant='caption' fontWeight={700} color='text.secondary'>
                      {group.date}
                    </Typography>
                    {group.events.map((event) => (
                      <Stack key={event.id} direction='row' spacing={1.25} sx={{ mt: 0.75 }}>
                        <Typography component='time' variant='body2' color='text.secondary' sx={{ flexShrink: 0 }}>
                          {event.activity_time}
                        </Typography>
                        <Typography variant='body2'>{event.activity_message}</Typography>
                      </Stack>
                    ))}
                  </Box>
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
              disabled={!selectedKeys.length}
              onClick={() => bulkUpdate('collected', !allSelectedCollected)}
            >
              {allSelectedCollected ? 'Remove' : 'Mark collected'}
            </Button>
            <Button
              size='small'
              startIcon={<Flag />}
              disabled={!selectedKeys.length}
              onClick={() => bulkUpdate('priority', !allSelectedPriority)}
            >
              {allSelectedPriority ? 'Deprioritize' : 'Mark priority'}
            </Button>
          </Toolbar>
          <Box sx={{ height: 560, width: '100%' }}>
            <DataGrid
              rows={rows}
              getRowId={(row) => row._key}
              columns={columns}
              loading={isLoading}
              checkboxSelection
              disableRowSelectionOnClick
              showToolbar
              filterModel={filterModel}
              columnVisibilityModel={columnVisibilityModel}
              onColumnVisibilityModelChange={(model) => {
                console.log('[action] column visibility', model);
                localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(model));
                setColumnVisibilityModel(model);
              }}
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
