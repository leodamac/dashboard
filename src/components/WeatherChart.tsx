import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WeatherData } from '../hooks/useWeatherData';

interface WeatherChartProps {
  weatherData: WeatherData;
}

type ChartType = 'temperature' | 'rain' | 'wind' | 'soil';

export const WeatherChart: React.FC<WeatherChartProps> = ({ weatherData }) => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('temperature');

  const prepareChartData = () => {
    const data = weatherData.hourly.time.slice(0, 24).map((time, index) => {
      const hour = new Date(time).getHours();
      return {
        time: `${hour}:00`,
        temperature: weatherData.hourly.temperature_2m[index],
        rain: weatherData.hourly.rain[index],
        wind: weatherData.hourly.wind_speed_10m[index],
        soil: weatherData.hourly.soil_temperature_0cm[index],
      };
    });
    return data;
  };

  const chartData = prepareChartData();

  const chartConfigs = {
    temperature: {
      title: 'Temperatura (°C)',
      dataKey: 'temperature',
      color: '#ef4444',
      icon: '🌡️'
    },
    rain: {
      title: 'Precipitación (mm)',
      dataKey: 'rain',
      color: '#3b82f6',
      icon: '🌧️'
    },
    wind: {
      title: 'Velocidad del Viento (km/h)',
      dataKey: 'wind',
      color: '#10b981',
      icon: '💨'
    },
    soil: {
      title: 'Temperatura del Suelo (°C)',
      dataKey: 'soil',
      color: '#8b5cf6',
      icon: '🌱'
    }
  };

  const currentConfig = chartConfigs[selectedChart];

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8fafc', 
      borderRadius: '8px',
      border: '2px solid #6b7280'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '1.25rem' }}>
          📈 Gráfico Climático (Próximas 24h)
        </h3>
        
        {/* Selector de tipo de gráfico */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          flexWrap: 'wrap',
          marginBottom: '16px'
        }}>
          {Object.entries(chartConfigs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedChart(key as ChartType)}
              style={{
                padding: '8px 16px',
                border: selectedChart === key ? `2px solid ${config.color}` : '2px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: selectedChart === key ? config.color : 'white',
                color: selectedChart === key ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedChart !== key) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedChart !== key) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              {config.icon} {config.title}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: `2px solid ${currentConfig.color}`,
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
              labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={currentConfig.dataKey}
              stroke={currentConfig.color}
              strokeWidth={3}
              dot={{ fill: currentConfig.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name={currentConfig.title}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};