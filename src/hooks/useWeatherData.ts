import { useState, useEffect } from 'react';
import axios from 'axios';

export interface WeatherData {
  current: {
    temperature_2m: number;
    rain: number;
    time: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunset: string[];
    sunrise: string[];
    daylight_duration: number[];
    uv_index_max: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    rain: number[];
    wind_speed_10m: number[];
    temperature_80m: number[];
    soil_temperature_0cm: number[];
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location>({
    latitude: -2.1962,
    longitude: -79.8862,
    name: 'Guayaquil, Ecuador'
  });

  const fetchWeatherData = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunset,sunrise,daylight_duration,uv_index_max&hourly=temperature_2m,rain,wind_speed_10m,temperature_80m,soil_temperature_0cm&current=temperature_2m,rain&timezone=America%2FSao_Paulo`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError('Error al cargar datos del clima');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(location.latitude, location.longitude);
  }, [location]);

  const updateLocation = (newLocation: Location) => {
    setLocation(newLocation);
  };

  return {
    weatherData,
    loading,
    error,
    location,
    updateLocation,
    refetch: () => fetchWeatherData(location.latitude, location.longitude)
  };
};