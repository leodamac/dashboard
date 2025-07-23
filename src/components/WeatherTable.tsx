import React from 'react';
import type { WeatherData } from '../hooks/useWeatherData';

interface WeatherTableProps {
  weatherData: WeatherData;
}

export const WeatherTable: React.FC<WeatherTableProps> = ({ weatherData }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '🌨️';
    if (code <= 82) return '🌦️';
    return '⛈️';
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const headerStyle = {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '12px 8px',
    textAlign: 'left' as const,
    fontSize: '0.9rem',
    fontWeight: 'bold'
  };

  const cellStyle = {
    padding: '10px 8px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.85rem'
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#fef2f2', 
      borderRadius: '8px',
      border: '2px solid #dc2626'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#991b1b', fontSize: '1.25rem' }}>
        📅 Pronóstico de 7 Días
      </h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>Fecha</th>
              <th style={headerStyle}>Clima</th>
              <th style={headerStyle}>Max/Min (°C)</th>
              <th style={headerStyle}>Sensación (°C)</th>
              <th style={headerStyle}>Amanecer</th>
              <th style={headerStyle}>Atardecer</th>
              <th style={headerStyle}>UV</th>
            </tr>
          </thead>
          <tbody>
            {weatherData.daily.time.slice(0, 7).map((date, index) => (
              <tr 
                key={index}
                style={{ 
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#fef7f7',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fecaca';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#fef7f7';
                }}
              >
                <td style={cellStyle}>
                  <strong>{formatDate(date)}</strong>
                </td>
                <td style={cellStyle}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {getWeatherIcon(weatherData.daily.weather_code[index])}
                  </span>
                </td>
                <td style={cellStyle}>
                  <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
                    {weatherData.daily.temperature_2m_max[index]}°
                  </span>
                  {' / '}
                  <span style={{ color: '#2563eb', fontWeight: 'bold' }}>
                    {weatherData.daily.temperature_2m_min[index]}°
                  </span>
                </td>
                <td style={cellStyle}>
                  <span style={{ color: '#dc2626' }}>
                    {weatherData.daily.apparent_temperature_max[index]}°
                  </span>
                  {' / '}
                  <span style={{ color: '#2563eb' }}>
                    {weatherData.daily.apparent_temperature_min[index]}°
                  </span>
                </td>
                <td style={cellStyle}>
                  🌅 {formatTime(weatherData.daily.sunrise[index])}
                </td>
                <td style={cellStyle}>
                  🌇 {formatTime(weatherData.daily.sunset[index])}
                </td>
                <td style={cellStyle}>
                  <span style={{ 
                    color: weatherData.daily.uv_index_max[index] > 7 ? '#dc2626' : 
                           weatherData.daily.uv_index_max[index] > 5 ? '#f59e0b' : '#16a34a',
                    fontWeight: 'bold'
                  }}>
                    {weatherData.daily.uv_index_max[index]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};