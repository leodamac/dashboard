import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState({ lat: 52.52, lon: 13.41 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedElement, setSelectedElement] = useState('temperature_180m');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  Chart.register(...registerables);
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
        params: {
          latitude: location.lat,
          longitude: location.lon,
          hourly: 'rain,precipitation,visibility,temperature_180m,soil_temperature_0cm',
          timezone: 'auto',
        },
      });
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const handleLocationChange = (lat, lon) => {
    setLocation({ lat, lon });
    setLoading(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const currentWeather = weatherData.hourly;

  const data = {
    labels: Array.from({ length: currentWeather.time.length }, (_, i) => i),
    datasets: [
      {
        label: selectedElement,
        data: currentWeather[selectedElement],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">
  {/* Encabezado */}
  <Grid size={{ xs: 12, md: 12 }}>
    <h1>Dashboard del Clima</h1>
    <button onClick={() => handleLocationChange(40.7128, -74.0060)}>Nueva York</button>
    <button onClick={() => handleLocationChange(51.5074, -0.1278)}>Londres</button>
    <button onClick={() => handleLocationChange(48.8566, 2.3522)}>París</button>
    <p>Elemento: Encabezado</p>
  </Grid>

  {/* Alertas */}
  <Grid size={{ xs: 12, md: 12 }}>
    <h2>Alertas</h2>
    {currentWeather.rain[0] > 5 && <div style={{ backgroundColor: 'red', color: 'white' }}>Lluvia intensa</div>}
    <p>Elemento: Alertas</p>
  </Grid>

  {/* Selector */}
  <Grid size={{ xs: 12, md: 3 }}>
    <h2>Selector</h2>
    <select value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
      <option value="temperature_180m">Temperatura</option>
      <option value="precipitation">Precipitación</option>
      <option value="visibility">Visibilidad</option>
    </select>
    <p>Elemento: Selector</p>
  </Grid>

  {/* Indicadores */}
  <Grid size={{ xs: 12, md: 9 }}>
    <h2>Indicadores</h2>
    <p>Temperatura: {currentWeather.temperature_180m[0]}°C</p>
    <p>Precipitación: {currentWeather.precipitation[0]} mm</p>
    <p>Visibilidad: {currentWeather.visibility[0]} m</p>
    <p>Elemento: Indicadores</p>
  </Grid>

  {/* Gráfico */}
  <Grid size={{ xs: 12, md: 6 }}>
    <h2>Gráfico de {selectedElement}</h2>
    <Line key={selectedElement} data={data} />
    <p>Elemento: Gráfico</p>
  </Grid>

  {/* Tabla */}
  <Grid size={{ xs: 12, md: 6 }}>
    <h2>Tabla de datos</h2>
    <TableContainer component={Paper}>
      {/* ... tabla ... */}
    </TableContainer>
    <p>Elemento: Tabla</p>
  </Grid>

  {/* Información adicional */}
  <Grid size={{ xs: 12, md: 12 }}>
    <h2>Información adicional</h2>
    <p>Suelo temperatura: {currentWeather.soil_temperature_0cm[0]}°C</p>
    <p>Elemento: Información adicional</p>
  </Grid>
</Grid>
  );
}

export default App;