import { Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';
import { Card } from './ui/card';

interface ForecastData {
  date: string;
  condition: string;
  temperature: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  description: string;
}

interface ForecastCardProps {
  forecast: ForecastData;
}

export function ForecastCard({ forecast }: ForecastCardProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-300" />;
      case 'clouds':
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-white" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="h-6 w-6 text-blue-300" />;
      case 'snow':
        return <CloudSnow className="h-6 w-6 text-white" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-300" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  return (
    <Card className="glass-card p-4 shadow-card transition-all duration-300 hover:shadow-weather hover:scale-105">
      <div className="text-center space-y-3">
        <div className="text-sm text-white/80 font-medium">
          {formatDate(forecast.date)}
        </div>
        
        <div className="flex justify-center">
          {getWeatherIcon(forecast.condition)}
        </div>
        
        <div className="space-y-1">
          <div className="text-lg font-semibold text-white">
            {Math.round(forecast.tempMax)}°
          </div>
          <div className="text-sm text-white/60">
            {Math.round(forecast.tempMin)}°
          </div>
        </div>
        
        <div className="text-xs text-white/60 capitalize">
          {forecast.description}
        </div>
        
        <div className="text-xs text-white/50">
          {forecast.humidity}% humidity
        </div>
      </div>
    </Card>
  );
}