// Weather API integration and data types

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temperature: number;
    feelsLike: number;
    tempMin: number;
    tempMax: number;
    condition: string;
    description: string;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
    uvIndex?: number;
    sunrise: number;
    sunset: number;
  };
  forecast: Array<{
    date: string;
    condition: string;
    temperature: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    description: string;
  }>;
}

// Using OpenWeatherMap API (free tier)
const API_KEY = 'demo_key'; // In production, this should come from environment variables
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// For demo purposes, we'll use mock data since we don't have API keys set up
const generateMockWeatherData = (locationName: string, lat?: number, lon?: number): WeatherData => {
  const conditions = ['clear', 'clouds', 'rain', 'snow'];
  const descriptions = {
    clear: ['sunny', 'clear sky', 'bright sunshine'],
    clouds: ['partly cloudy', 'overcast', 'scattered clouds'],
    rain: ['light rain', 'heavy rain', 'drizzle'],
    snow: ['light snow', 'heavy snow', 'snow showers']
  };

  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const randomTemp = Math.floor(Math.random() * 40) - 5; // -5 to 35°C
  const randomDescription = descriptions[randomCondition as keyof typeof descriptions][
    Math.floor(Math.random() * descriptions[randomCondition as keyof typeof descriptions].length)
  ];

  const now = new Date();
  const sunrise = new Date(now);
  sunrise.setHours(6, 30, 0, 0);
  const sunset = new Date(now);
  sunset.setHours(18, 45, 0, 0);

  // Generate 7-day forecast
  const forecast = Array.from({ length: 7 }, (_, i) => {
    const forecastDate = new Date(now);
    forecastDate.setDate(now.getDate() + i);
    
    const conditionIndex = Math.floor(Math.random() * conditions.length);
    const condition = conditions[conditionIndex];
    const temp = randomTemp + Math.floor(Math.random() * 10) - 5;
    
    return {
      date: forecastDate.toISOString(),
      condition,
      temperature: temp,
      tempMin: temp - Math.floor(Math.random() * 8) - 2,
      tempMax: temp + Math.floor(Math.random() * 8) + 2,
      humidity: Math.floor(Math.random() * 40) + 40,
      description: descriptions[condition as keyof typeof descriptions][0]
    };
  });

  return {
    location: {
      name: locationName,
      country: 'Demo',
      lat: lat || 51.5074,
      lon: lon || -0.1278
    },
    current: {
      temperature: randomTemp,
      feelsLike: randomTemp + Math.floor(Math.random() * 6) - 3,
      tempMin: randomTemp - 5,
      tempMax: randomTemp + 5,
      condition: randomCondition,
      description: randomDescription,
      humidity: Math.floor(Math.random() * 40) + 40,
      pressure: Math.floor(Math.random() * 100) + 1000,
      windSpeed: Math.floor(Math.random() * 30) + 5,
      windDirection: Math.floor(Math.random() * 360),
      visibility: Math.floor(Math.random() * 20) + 5,
      uvIndex: Math.floor(Math.random() * 11),
      sunrise: Math.floor(sunrise.getTime() / 1000),
      sunset: Math.floor(sunset.getTime() / 1000)
    },
    forecast
  };
};

export const getWeatherByLocation = async (lat: number, lon: number): Promise<WeatherData> => {
  // For demo purposes, return mock data
  // In production, this would make actual API calls
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock reverse geocoding to get city name from coordinates
    const cityNames = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
    const randomCity = cityNames[Math.floor(Math.random() * cityNames.length)];
    
    return generateMockWeatherData(randomCity, lat, lon);
  } catch (error) {
    console.error('Weather API error:', error);
    throw new Error('Failed to fetch weather data');
  }
};

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  // For demo purposes, return mock data
  // In production, this would make actual API calls
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return generateMockWeatherData(city);
  } catch (error) {
    console.error('Weather API error:', error);
    throw new Error('Failed to fetch weather data');
  }
};

// Real API implementation (commented out for demo)
/*
export const getWeatherByLocation = async (lat: number, lon: number): Promise<WeatherData> => {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error('Weather API request failed');
  }
  
  const data = await response.json();
  
  // Transform API response to our WeatherData format
  return transformApiResponse(data);
};

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error('Weather API request failed');
  }
  
  const data = await response.json();
  
  return transformApiResponse(data);
};

const transformApiResponse = (data: any): WeatherData => {
  // Transform OpenWeatherMap API response to our WeatherData format
  return {
    location: {
      name: data.name,
      country: data.sys.country,
      lat: data.coord.lat,
      lon: data.coord.lon
    },
    current: {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind?.speed * 3.6 || 0, // Convert m/s to km/h
      windDirection: data.wind?.deg || 0,
      visibility: data.visibility / 1000, // Convert m to km
      uvIndex: data.uvi,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset
    },
    forecast: [] // Would need separate API call for forecast
  };
};
*/