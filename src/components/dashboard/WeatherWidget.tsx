'use client';

import { useEffect, useState } from 'react';
import { fetchWeatherByCoords, fetchWeatherByIP, WeatherData } from '@/lib/weather';
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, Moon, Snowflake, CloudFog } from 'lucide-react';

interface WeatherWidgetProps {
  className?: string;
}

export function WeatherWidget({ className }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getWeatherData() {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get the user's current position
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const data = await fetchWeatherByCoords(
                  position.coords.latitude,
                  position.coords.longitude
                );
                setWeather(data);
              } catch (err) {
                console.error('Error fetching weather by coords:', err);
                // Fallback to IP-based location
                const ipData = await fetchWeatherByIP();
                setWeather(ipData);
              } finally {
                setLoading(false);
              }
            },
            async (err) => {
              console.warn('Geolocation error:', err);
              // Fallback to IP-based location
              try {
                const ipData = await fetchWeatherByIP();
                setWeather(ipData);
              } catch (ipErr) {
                setError('Unable to determine your location');
              } finally {
                setLoading(false);
              }
            }
          );
        } else {
          // Browser doesn't support geolocation
          const ipData = await fetchWeatherByIP();
          setWeather(ipData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Weather widget error:', err);
        setError('Weather data unavailable');
        setLoading(false);
      }
    }

    getWeatherData();
  }, []);

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="h-6 w-6 text-blue-400" />;
    
    const iconCode = weather.icon;
    
    // Map OpenWeather icon codes to Lucide icons
    if (iconCode.includes('01d')) {
      return <Sun className="h-6 w-6 text-amber-400" />;
    } 
    else if (iconCode.includes('01n')) {
      return <Moon className="h-6 w-6 text-blue-400" />;
    }
    
    else if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) {
      return <Cloud className="h-6 w-6 text-blue-400" />;
    } else if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11')) {
      return <CloudRain className="h-6 w-6 text-blue-500" />;
    } else if (iconCode.includes('13')) {
      return <Snowflake className="h-6 w-6 text-blue-500" />;
    } else if (iconCode.includes('50')) {
      return <CloudFog className="h-6 w-6 text-blue-500" />;
    } else {
      return <Cloud className="h-6 w-6 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Cloud className="h-5 w-5 text-blue-400 animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading weather...</span>
      </div>
    );
  }

  if (error) {
    return null; // Don't show anything if there's an error
  }

  if (!weather) return null;

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2">
        {getWeatherIcon()}
        <div>
          <div className="flex items-center">
            <span className="text-sm font-medium">{weather.temperature}°C</span>
            <span className="mx-1 text-muted-foreground">in</span>
            <span className="text-sm font-medium">{weather.location}</span>
          </div>
          <p className="text-xs text-muted-foreground capitalize">{weather.description}</p>
        </div>
      </div>
      
    </div>
  );
} 