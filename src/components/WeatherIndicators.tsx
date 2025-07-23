import React from 'react';
import type { WeatherData } from '../hooks/useWeatherData';

interface WeatherIndicatorsProps {
  weatherData: WeatherData;
}

export const WeatherIndicators: React.FC<WeatherIndicatorsProps> = ({ weatherData }) => {
  const indicators = [
    {
      label: 'Temperatura Actual',
      value: `${weatherData.current.temperature_2m}°C`,
      icon: '🌡️',
      color: '#ef4444'
    },
    {
      label: 'Precipitación',
      value: `${weatherData.current.rain} mm`,
      icon: '🌧️',
      color: '#3b82f6'
    },
    {
      label: 'Temp. Max Hoy',
      value: `${weatherData.daily.temperature_2m_max[0]}°C`,
      icon: '🔥',
      color: '#f59e0b'
    },
    {
      label: 'Temp. Min Hoy',
      value: `${weatherData.daily.temperature_2m_min[0]}°C`,
      icon: '❄️',
      color: '#06b6d4'
    },
    {
      label: 'Índice UV',
      value: `${weatherData.daily.uv_index_max[0]}`,
      icon: '☀️',
      color: '#f97316'
    },
    {
      label: 'Duración del Día',
      value: `${Math.round(weatherData.daily.daylight_duration[0] / 3600)}h`,
      icon: '🌅',
      color: '#8b5cf6'
    }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0fdf4', 
      borderRadius: '8px',
      border: '2px solid #16a34a'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#15803d', fontSize: '1.25rem' }}>
        📊 Indicadores Clave
      </h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px' 
      }}>
        {indicators.map((indicator, index) => (
          <div
            key={index}
            style={{
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: `2px solid ${indicator.color}`,
              textAlign: 'center',
              transition: 'transform 0.2s',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
              {indicator.icon}
            </div>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: indicator.color,
              marginBottom: '4px'
            }}>
              {indicator.value}
            </div>
            <div style={{ 
              fontSize: '0.85rem', 
              color: '#6b7280',
              fontWeight: '500'
            }}>
              {indicator.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};