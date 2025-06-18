import React, { useState, useEffect } from 'react';
import axios from 'axios';
npm install @mui/icons-materialimport {
  Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Box,
  TablePagination, Button, Fade, Chip, ToggleButton, ToggleButtonGroup, Skeleton
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

Chart.register(...registerables);

const ELEMENTS = [
  { value: 'temperature_2m', label: 'Temperatura (°C)', icon: <ThermostatIcon color="error" /> },
  { value: 'precipitation', label: 'Precipitación (mm)', icon: <OpacityIcon color="primary" /> },
  { value: 'visibility', label: 'Visibilidad (m)', icon: <VisibilityIcon color="action" /> },
  { value: 'uv_index_max', label: 'UV Máx.', icon: <WbSunnyIcon color="warning" /> },
];

const CITIES = [
  { name: 'Quito', lat: -0.1807, lon: -78.4678 },
  { name: 'Guayaquil', lat: -2.170998, lon: -79.922359 },
  { name: 'Cuenca', lat: -2.90055, lon: -79.00453 },
  { name: 'Manta', lat: -0.967653, lon: -80.708910 },
];

function App() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [location, setLocation] = useState(CITIES[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState('temperature_2m');
  const [page, setPage] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const rowsPerPage = 6;

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
          params: {
            latitude: location.lat,
            longitude: location.lon,
            daily: 'uv_index_max,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunshine_duration,daylight_duration,sunset,sunrise,rain_sum,precipitation_sum,precipitation_hours,precipitation_probability_max',
            hourly: 'precipitation,visibility,temperature_2m,uv_index_max',
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure',
            timezone: 'auto',
            forecast_days: 14,
          },
        });
        setWeatherData(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
    setPage(0);
    setSelectedDay(0);
  }, [location]);

  if (loading) return (
    <Box sx={{ p: 5, textAlign: 'center' }}>
      <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={400} />
    </Box>
  );
  if (error) return <Box sx={{ p: 5, textAlign: 'center' }}><Typography color="error">Error: {error}</Typography></Box>;

  // Fechas disponibles (14 días)
  const dailyDates = weatherData.daily.time;
  const selectedDate = dailyDates[selectedDay];

  // Filtrar datos horarios para el día seleccionado
  const hoursForDay = weatherData.hourly.time
    .map((t: string, idx: number) => ({ t, idx }))
    .filter(({ t }) => t.startsWith(selectedDate));
  const labels = hoursForDay.map(({ t }) => t.slice(11, 16));
  const dataForElement = hoursForDay.map(({ idx }) => weatherData.hourly[selectedElement][idx]);

  // Paginación
  const paginatedLabels = labels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const paginatedData = dataForElement.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Datos para el gráfico
  const chartData = {
    labels,
    datasets: [
      {
        label: ELEMENTS.find(e => e.value === selectedElement)?.label,
        data: dataForElement,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.15)',
        tension: 0.4,
        pointRadius: 3,
        fill: true,
      },
    ],
  };

  // Indicadores diarios
  const daily = weatherData.daily;
  const dayIdx = selectedDay;
  const tempMax = daily.temperature_2m_max[dayIdx];
  const tempMin = daily.temperature_2m_min[dayIdx];
  const uvMax = daily.uv_index_max[dayIdx];
  const rain = daily.rain_sum[dayIdx];
  const sun = (daily.sunshine_duration[dayIdx] / 3600).toFixed(1);

  // Datos actuales
  const current = weatherData.current;

  return (
    <Box sx={{
      background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
      minHeight: "100vh", py: 4
    }}>
      <Grid container spacing={3} justifyContent="center">
        {/* Encabezado */}
        <Grid item xs={12}>
          <Paper elevation={6} sx={{
            p: 3, textAlign: 'center',
            background: "linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)",
            color: "#fff", borderRadius: 4, mb: 2
          }}>
            <Typography variant="h3" fontWeight="bold" sx={{ letterSpacing: 2, mb: 1 }}>
              <WbSunnyIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
              Dashboard del Clima
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Disfruta visualizando el clima de Ecuador con datos en tiempo real
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 1 }}>
              {CITIES.map(city => (
                <Fade in key={city.name}>
                  <Button
                    variant={location.name === city.name ? "contained" : "outlined"}
                    color="secondary"
                    size="large"
                    sx={{
                      borderRadius: 3,
                      fontWeight: 'bold',
                      boxShadow: location.name === city.name ? 4 : 0,
                      transition: '0.2s',
                      background: location.name === city.name
                        ? "linear-gradient(90deg, #42a5f5 0%, #1976d2 100%)"
                        : undefined,
                      color: location.name === city.name ? "#fff" : "#1976d2",
                      '&:hover': {
                        background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                        color: "#fff"
                      }
                    }}
                    onClick={() => setLocation(city)}
                  >
                    {city.name}
                  </Button>
                </Fade>
              ))}
            </Box>
            <Chip
              icon={<CalendarMonthIcon />}
              label={`Hoy: ${new Date(weatherData.current.time).toLocaleString('es-EC', { dateStyle: 'full', timeStyle: 'short' })}`}
              sx={{ background: "#fff", color: "#1976d2", fontWeight: 'bold', mt: 1 }}
            />
          </Paper>
        </Grid>

        {/* Alertas */}
        <Grid item xs={12}>
          <Paper sx={{
            p: 2, background: "linear-gradient(90deg, #ffe0b2 60%, #fff3e0 100%)",
            borderLeft: "6px solid #ffa726"
          }}>
            <Typography variant="body1">
              <strong>Alerta:</strong> No hay alertas meteorológicas activas.
            </Typography>
          </Paper>
        </Grid>

        {/* Selector de fecha y elemento */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="element-select-label">Elemento</InputLabel>
              <Select
                labelId="element-select-label"
                id="element-select"
                value={selectedElement}
                label="Elemento"
                onChange={(e) => { setSelectedElement(e.target.value); setPage(0); }}
              >
                {ELEMENTS.map(el => (
                  <MenuItem key={el.value} value={el.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {el.icon} {el.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ToggleButtonGroup
              value={selectedDay}
              exclusive
              onChange={(_, val) => { if (val !== null) { setSelectedDay(val); setPage(0); } }}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {dailyDates.map((date: string, idx: number) => (
                <ToggleButton
                  key={date}
                  value={idx}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    fontWeight: selectedDay === idx ? 'bold' : 'normal',
                    background: selectedDay === idx ? "#1976d2" : "#e3f2fd",
                    color: selectedDay === idx ? "#fff" : "#1976d2",
                    '&:hover': { background: "#42a5f5", color: "#fff" }
                  }}
                >
                  {new Date(date).toLocaleDateString('es-EC', { weekday: 'short', day: '2-digit', month: 'short' })}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Paper>
        </Grid>

        {/* Indicadores */}
        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 2, display: 'flex', flexDirection: 'column', gap: 1,
            background: "linear-gradient(120deg, #e3f2fd 60%, #bbdefb 100%)"
          }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Indicadores del día</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <Chip icon={<ThermostatIcon />} label={`Máx: ${tempMax}°C`} color="error" />
              <Chip icon={<ThermostatIcon />} label={`Mín: ${tempMin}°C`} color="primary" />
              <Chip icon={<OpacityIcon />} label={`Lluvia: ${rain} mm`} color="info" />
              <Chip icon={<WbSunnyIcon />} label={`Sol: ${sun} h`} color="warning" />
              <Chip icon={<WbSunnyIcon />} label={`UV Máx: ${uvMax}`} color="warning" />
            </Box>
            <Typography variant="body2" sx={{ mt: 1, color: "#1976d2" }}>
              <strong>Ahora:</strong> {current.temperature_2m}°C, {current.relative_humidity_2m}% humedad, {current.wind_speed_10m} km/h viento
            </Typography>
          </Paper>
        </Grid>

        {/* Gráfico */}
        <Grid item xs={12} md={7}>
          <Paper sx={{
            p: 2, background: "linear-gradient(120deg, #fffde7 60%, #e3f2fd 100%)",
            borderRadius: 4
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
              Gráfico de {ELEMENTS.find(e => e.value === selectedElement)?.label} ({new Date(selectedDate).toLocaleDateString('es-EC')})
            </Typography>
            <Line key={selectedElement + location.name + selectedDate} data={chartData} />
          </Paper>
        </Grid>

        {/* Tabla paginada */}
        <Grid item xs={12} md={5}>
          <Paper sx={{
            p: 2, background: "linear-gradient(120deg, #e3f2fd 60%, #fffde7 100%)",
            borderRadius: 4
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
              Tabla de {ELEMENTS.find(e => e.value === selectedElement)?.label}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Hora</TableCell>
                    <TableCell align="right">{ELEMENTS.find(e => e.value === selectedElement)?.label}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedLabels.map((time: string, idx: number) => (
                    <TableRow key={time}>
                      <TableCell>{time}</TableCell>
                      <TableCell align="right">{paginatedData[idx]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={labels.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[rowsPerPage]}
              sx={{ mt: 1 }}
            />
          </Paper>
        </Grid>

        {/* Información adicional */}
        <Grid item xs={12}>
          <Paper sx={{
            p: 2, background: "linear-gradient(90deg, #e3f2fd 60%, #fffde7 100%)",
            borderRadius: 4, textAlign: 'center'
          }}>
            <Typography variant="body2">
              <strong>Información adicional:</strong> Datos obtenidos de <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo API</a>.
              <br />
              <span style={{ color: "#1976d2" }}>¡Disfruta explorando el clima de Ecuador!</span>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;