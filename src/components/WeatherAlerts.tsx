import React from 'react';

interface Alert {
  type: 'warning' | 'info' | 'danger';
  message: string;
}

interface WeatherAlertsProps {
  temperature: number;
  rain: number;
  uvIndex: number;
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ temperature, rain, uvIndex }) => {
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];

    if (temperature > 35) {
      alerts.push({ type: 'danger', message: '⚠️ Temperatura muy alta - Manténgase hidratado' });
    } else if (temperature < 5) {
      alerts.push({ type: 'warning', message: '🧥 Temperatura muy baja - Abríguese bien' });
    }

    if (rain > 5) {
      alerts.push({ type: 'info', message: '🌧️ Se registra precipitación - Lleve paraguas' });
    }

    if (uvIndex > 8) {
      alerts.push({ type: 'warning', message: '☀️ Índice UV alto - Use protector solar' });
    }

    if (alerts.length === 0) {
      alerts.push({ type: 'info', message: '✅ Condiciones climáticas normales' });
    }

    return alerts;
  };

  const alerts = generateAlerts();

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'danger': return '#fee2e2';
      case 'warning': return '#fef3c7';
      case 'info': return '#dbeafe';
      default: return '#f3f4f6';
    }
  };

  const getAlertBorder = (type: string) => {
    switch (type) {
      case 'danger': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '1.25rem' }}>
        🚨 Alertas Climáticas
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.map((alert, index) => (
          <div
            key={index}
            style={{
              padding: '12px 16px',
              backgroundColor: getAlertColor(alert.type),
              border: `2px solid ${getAlertBorder(alert.type)}`,
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </div>
  );
};