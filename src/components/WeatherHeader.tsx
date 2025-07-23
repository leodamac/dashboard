import React from 'react';

interface WeatherHeaderProps {
  locationName: string;
  currentTime: string;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({ locationName, currentTime }) => {
  return (
    <div style={{ 
      padding: '24px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '2.5rem', fontWeight: 'bold' }}>
        Dashboard Climático
      </h1>
      <p style={{ margin: '0', fontSize: '1.1rem', opacity: '0.9' }}>
        Monitoreo en tiempo real de métricas climáticas para {locationName}
      </p>
      <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', opacity: '0.8' }}>
        Última actualización: {currentTime}
      </p>
    </div>
  );
};