import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer } from 'lucide-react';
import { Card } from './ui/card';
import { WeatherData } from '@/lib/weatherApi';

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="h-16 w-16 text-yellow-300 animate-pulse-glow" />;
      case 'clouds':
      case 'cloudy':
        return <Cloud className="h-16 w-16 text-white animate-float" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="h-16 w-16 text-blue-300 animate-float" />;
      case 'snow':
        return <CloudSnow className="h-16 w-16 text-white animate-float" />;
      default:
        return <Sun className="h-16 w-16 text-yellow-300" />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Card className="glass-card p-8 shadow-weather transition-all duration-300 hover:shadow-glow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-6xl font-light text-white">
              {Math.round(weather.current.temperature)}
            </span>
            <span className="text-2xl text-white/70">°C</span>
          </div>
          <div className="text-lg text-white/80 mb-1 capitalize">
            {weather.current.description}
          </div>
          <div className="text-sm text-white/60">
            Feels like {Math.round(weather.current.feelsLike)}°C
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          {getWeatherIcon(weather.current.condition)}
          <div className="text-sm text-white/60 mt-2 text-center">
            {weather.location.name}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/80">
            <Thermometer className="h-4 w-4" />
            <span className="text-sm">High: {Math.round(weather.current.tempMax)}°C</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Thermometer className="h-4 w-4" />
            <span className="text-sm">Low: {Math.round(weather.current.tempMin)}°C</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/80">
            <Sun className="h-4 w-4" />
            <span className="text-sm">Sunrise: {formatTime(weather.current.sunrise)}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Sun className="h-4 w-4" />
            <span className="text-sm">Sunset: {formatTime(weather.current.sunset)}</span>
          </div>
        </div>
      </div>
      
      {weather.current.uvIndex && (
        <div className="mt-6 p-4 bg-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-white/80">UV Index</span>
            <span className="text-white font-semibold">{weather.current.uvIndex}</span>
          </div>
          <div className="text-xs text-white/60 mt-1">
            {weather.current.uvIndex <= 2 ? 'Low' : 
             weather.current.uvIndex <= 5 ? 'Moderate' : 
             weather.current.uvIndex <= 7 ? 'High' : 'Very High'}
          </div>
        </div>
      )}
    </Card>
  );
}