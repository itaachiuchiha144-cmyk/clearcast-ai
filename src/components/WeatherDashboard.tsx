import { useState, useEffect } from 'react';
import { MapPin, Search, Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';
import { WeatherCard } from './WeatherCard';
import { ForecastCard } from './ForecastCard';
import { LocationSearch } from './LocationSearch';
import { AISummary } from './AISummary';
import { getWeatherByLocation, getWeatherByCity, WeatherData } from '@/lib/weatherApi';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';

interface Location {
  lat: number;
  lon: number;
  name: string;
}

export function WeatherDashboard() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          });
        });
        
        const { latitude, longitude } = position.coords;
        const weather = await getWeatherByLocation(latitude, longitude);
        
        setCurrentWeather(weather);
        setLocation({
          lat: latitude,
          lon: longitude,
          name: weather.location.name
        });
        setLoading(false);
      } catch (error) {
        console.error('Geolocation error:', error);
        // Fallback to a default city
        handleCitySelect('London');
      }
    } else {
      handleCitySelect('London');
    }
  };

  const handleCitySelect = async (cityName: string) => {
    setLoading(true);
    try {
      const weather = await getWeatherByCity(cityName);
      setCurrentWeather(weather);
      setLocation({
        lat: weather.location.lat,
        lon: weather.location.lon,
        name: weather.location.name
      });
      setShowSearch(false);
      toast({
        title: "Location Updated",
        description: `Weather for ${weather.location.name} loaded successfully.`,
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      toast({
        title: "Error",
        description: "Unable to fetch weather data. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const getWeatherGradient = (condition: string) => {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;
    
    if (isNight) return 'bg-gradient-night';
    
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return hour < 8 || hour > 16 ? 'bg-gradient-sunset' : 'bg-gradient-clear';
      case 'clouds':
      case 'cloudy':
        return 'bg-gradient-cloudy';
      case 'rain':
      case 'drizzle':
        return 'bg-gradient-rain';
      default:
        return 'bg-gradient-clear';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-clear flex items-center justify-center">
        <Card className="glass-card p-8 shadow-weather">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded-lg w-48"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-cloudy flex items-center justify-center">
        <Card className="glass-card p-8 shadow-weather text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load weather data</h2>
          <Button onClick={getCurrentLocation} className="mb-4">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => setShowSearch(true)}>
            Search for a City
          </Button>
        </Card>
      </div>
    );
  }

  const gradientClass = getWeatherGradient(currentWeather.current.condition);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${gradientClass}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5" />
            <span className="text-lg font-medium">{location?.name}</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSearch(true)}
            className="glass-card text-foreground border-border hover:bg-muted/20"
          >
            <Search className="h-4 w-4 mr-2" />
            Change Location
          </Button>
        </div>

        {/* Search Overlay */}
        {showSearch && (
          <LocationSearch
            onCitySelect={handleCitySelect}
            onClose={() => setShowSearch(false)}
          />
        )}

        {/* Main Weather Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Weather - Takes up 2 columns on desktop */}
          <div className="lg:col-span-2">
            <WeatherCard weather={currentWeather} />
          </div>

          {/* AI Summary */}
          <div className="lg:col-span-1">
            <AISummary weather={currentWeather} />
          </div>
        </div>

        {/* Forecast Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">7-Day Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {currentWeather.forecast.map((day, index) => (
              <ForecastCard key={index} forecast={day} />
            ))}
          </div>
        </div>

        {/* Additional Weather Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card p-4 shadow-card">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{currentWeather.current.humidity}%</div>
              <div className="text-sm text-muted-foreground">Humidity</div>
            </div>
          </Card>
          
          <Card className="glass-card p-4 shadow-card">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{currentWeather.current.windSpeed} km/h</div>
              <div className="text-sm text-muted-foreground">Wind Speed</div>
            </div>
          </Card>
          
          <Card className="glass-card p-4 shadow-card">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{currentWeather.current.pressure} hPa</div>
              <div className="text-sm text-muted-foreground">Pressure</div>
            </div>
          </Card>
          
          <Card className="glass-card p-4 shadow-card">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{currentWeather.current.visibility} km</div>
              <div className="text-sm text-muted-foreground">Visibility</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}