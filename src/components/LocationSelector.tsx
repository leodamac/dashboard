import React from 'react';
import type { Location } from '../hooks/useWeatherData';

interface LocationSelectorProps {
  currentLocation: Location;
  onLocationChange: (location: Location) => void;
  loading: boolean;
}

const predefinedLocations: Location[] = [
  { latitude: -2.1962, longitude: -79.8862, name: 'Guayaquil, Ecuador' },
  { latitude: -0.1807, longitude: -78.4678, name: 'Quito, Ecuador' },
  { latitude: 40.7128, longitude: -74.0060, name: 'Nueva York, EE.UU.' },
  { latitude: 51.5074, longitude: -0.1278, name: 'Londres, Reino Unido' },
  { latitude: 35.6762, longitude: 139.6503, name: 'Tokio, Japón' },
  { latitude: -34.6118, longitude: -58.3960, name: 'Buenos Aires, Argentina' },
  { latitude: 25.2048, longitude: 55.2708, name: 'Dubái, EAU' },
  { latitude: -33.8688, longitude: 151.2093, name: 'Sídney, Australia' },
];

export const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  currentLocation, 
  onLocationChange, 
  loading 
}) => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#e0f2fe', 
      borderRadius: '8px',
      border: '2px solid #0288d1',
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#01579b', fontSize: '1.25rem' }}>
        🌍 Selector de Ubicación
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#01579b' }}>
          Seleccione una ubicación:
        </label>
        <select
          value={`${currentLocation.latitude},${currentLocation.longitude}`}
          onChange={(e) => {
            const [lat, lng] = e.target.value.split(',').map(Number);
            const location = predefinedLocations.find(
              loc => loc.latitude === lat && loc.longitude === lng
            );
            if (location) {
              onLocationChange(location);
            }
          }}
          disabled={loading}
          style={{
            padding: '12px',
            borderRadius: '6px',
            border: '2px solid #0288d1',
            fontSize: '1rem',
            backgroundColor: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            color: 'black',
          }}
        >
          {predefinedLocations.map((location) => (
            <option 
              key={`${location.latitude},${location.longitude}`}
              value={`${location.latitude},${location.longitude}`}
            >
              {location.name}
            </option>
          ))}
        </select>
        <div style={{ 
          fontSize: '0.85rem', 
          color: '#0277bd',
          backgroundColor: 'white',
          padding: '8px 12px',
          borderRadius: '4px'
        }}>
          📍 Ubicación actual: {currentLocation.name}
        </div>
        {loading && (
          <div style={{ 
            fontSize: '0.9rem', 
            color: '#0288d1',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            🔄 Cargando datos...
          </div>
        )}
      </div>
    </div>
  );
};