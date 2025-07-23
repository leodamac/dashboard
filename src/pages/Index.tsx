import { useWeatherData } from '../hooks/useWeatherData';
import { WeatherHeader } from '../components/WeatherHeader';
import { WeatherAlerts } from '../components/WeatherAlerts';
import { LocationSelector } from '../components/LocationSelector';
import { WeatherIndicators } from '../components/WeatherIndicators';
import { WeatherChart } from '../components/WeatherChart';
import { WeatherTable } from '../components/WeatherTable';
import { AdditionalInfo } from '../components/AdditionalInfo';

const Index = () => {
  const { weatherData, loading, error, location, updateLocation } = useWeatherData();

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: '#6b7280'
      }}>
        🌦️ Cargando datos climáticos...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        color: '#dc2626'
      }}>
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <div style={{ fontSize: '1.2rem' }}>Error: {error}</div>
        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          Por favor, verifique su conexión a internet e intente nuevamente
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: '#6b7280'
      }}>
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px', 
      padding: '16px',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>

      {/* Encabezado */}
      <WeatherHeader 
        locationName={location.name}
        currentTime={new Date().toLocaleString('es-ES')}
      />

      {/* Alertas */}
      <WeatherAlerts 
        temperature={weatherData.current.temperature_2m}
        rain={weatherData.current.rain}
        uvIndex={weatherData.daily.uv_index_max[0]}
      />

      {/* Selector */}
      <LocationSelector 
        currentLocation={location}
        onLocationChange={updateLocation}
        loading={loading}
      />

      {/* Indicadores */}
      <WeatherIndicators weatherData={weatherData} />

      {/* Gráfico y Tabla */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Gráfico */}
        <div style={{ flex: '1', minWidth: '400px' }}>
          <WeatherChart weatherData={weatherData} />
        </div>

        {/* Tabla */}
        <div style={{ flex: '1', minWidth: '400px' }}>
          <WeatherTable weatherData={weatherData} />
        </div>
      </div>

      {/* Información adicional */}
      <AdditionalInfo weatherData={weatherData} />

    </div>
  );
};

export default Index;