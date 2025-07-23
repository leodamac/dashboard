import React from 'react';
import type { WeatherData } from '../hooks/useWeatherData';

interface AdditionalInfoProps {
  weatherData: WeatherData;
}

export const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ weatherData }) => {
  const getWindDescription = (windSpeed: number) => {
    if (windSpeed < 5) return 'Calma';
    if (windSpeed < 15) return 'Brisa ligera';
    if (windSpeed < 25) return 'Brisa moderada';
    if (windSpeed < 35) return 'Brisa fuerte';
    return 'Viento fuerte';
  };

  const getUVRecommendation = (uvIndex: number) => {
    if (uvIndex <= 2) return 'Bajo - No se requiere protección';
    if (uvIndex <= 5) return 'Moderado - Use protector solar';
    if (uvIndex <= 7) return 'Alto - Protección necesaria';
    if (uvIndex <= 10) return 'Muy alto - Protección extra';
    return 'Extremo - Evite exposición directa';
  };

  const getCurrentHourData = () => {
    const currentHour = new Date().getHours();
    const hourIndex = weatherData.hourly.time.findIndex(time => 
      new Date(time).getHours() === currentHour
    );
    return hourIndex >= 0 ? hourIndex : 0;
  };

  const currentHourIndex = getCurrentHourData();
  const currentWindSpeed = weatherData.hourly.wind_speed_10m[currentHourIndex] || 0;
  const currentSoilTemp = weatherData.hourly.soil_temperature_0cm[currentHourIndex] || 0;

  const tips = [
    {
      icon: '💧',
      title: 'Hidratación',
      content: weatherData.current.temperature_2m > 25 
        ? 'Beba agua regularmente debido a las altas temperaturas'
        : 'Mantenga una hidratación normal'
    },
    {
      icon: '👕',
      title: 'Vestimenta',
      content: weatherData.current.temperature_2m > 25
        ? 'Ropa ligera y de colores claros recomendada'
        : weatherData.current.temperature_2m < 15
        ? 'Use ropa abrigada y en capas'
        : 'Ropa cómoda de temporada'
    },
    {
      icon: '🚗',
      title: 'Transporte',
      content: weatherData.current.rain > 0
        ? 'Conduzca con precaución debido a la lluvia'
        : currentWindSpeed > 20
        ? 'Vientos fuertes - Precaución en carretera'
        : 'Condiciones normales para conducir'
    }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#fffbeb', 
      borderRadius: '8px',
      border: '2px solid #f59e0b'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#92400e', fontSize: '1.25rem' }}>
        ℹ️ Información Adicional y Consejos
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {/* Datos técnicos */}
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #f59e0b'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#92400e', fontSize: '1.1rem' }}>
            📊 Datos Técnicos
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.9rem' }}>
              <strong>Viento:</strong> {currentWindSpeed.toFixed(1)} km/h ({getWindDescription(currentWindSpeed)})
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              <strong>Temperatura del suelo:</strong> {currentSoilTemp.toFixed(1)}°C
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              <strong>Recomendación UV:</strong> {getUVRecommendation(weatherData.daily.uv_index_max[0])}
            </div>
          </div>
        </div>

        {/* Consejos */}
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #f59e0b'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#92400e', fontSize: '1.1rem' }}>
            💡 Consejos del Día
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tips.map((tip, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '8px',
                fontSize: '0.9rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>{tip.icon}</span>
                <div>
                  <strong style={{ color: '#92400e' }}>{tip.title}:</strong>
                  <br />
                  {tip.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estadísticas adicionales */}
      <div style={{
        marginTop: '20px',
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #f59e0b'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#92400e', fontSize: '1.1rem' }}>
          📈 Estadísticas del Día
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '16px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: '#f59e0b', fontWeight: 'bold' }}>
              {Math.round(weatherData.daily.daylight_duration[0] / 3600)}h
            </div>
            <div style={{ fontSize: '0.8rem', color: '#92400e' }}>Duración del día</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: '#f59e0b', fontWeight: 'bold' }}>
              {(weatherData.daily.temperature_2m_max[0] - weatherData.daily.temperature_2m_min[0]).toFixed(1)}°C
            </div>
            <div style={{ fontSize: '0.8rem', color: '#92400e' }}>Variación térmica</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: '#f59e0b', fontWeight: 'bold' }}>
              {weatherData.hourly.rain.slice(0, 24).reduce((sum, rain) => sum + rain, 0).toFixed(1)}mm
            </div>
            <div style={{ fontSize: '0.8rem', color: '#92400e' }}>Lluvia acumulada (24h)</div>
          </div>
        </div>
      </div>
    </div>
  );
};