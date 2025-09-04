import { useState, useEffect } from 'react';
import { Brain, Sparkles, Umbrella, Sun as SunIcon, Wind, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { WeatherData } from '@/lib/weatherApi';
import { Badge } from './ui/badge';

interface AISummaryProps {
  weather: WeatherData;
}

export function AISummary({ weather }: AISummaryProps) {
  const [summary, setSummary] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateAISummary();
  }, [weather]);

  const generateAISummary = () => {
    setIsLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const temp = weather.current.temperature;
      const condition = weather.current.condition.toLowerCase();
      const humidity = weather.current.humidity;
      const windSpeed = weather.current.windSpeed;
      const uvIndex = weather.current.uvIndex || 0;
      
      // Generate natural language summary
      let summaryText = '';
      
      if (temp < 0) {
        summaryText = `It's freezing cold at ${Math.round(temp)}°C. Bundle up in layers and watch for icy conditions.`;
      } else if (temp < 10) {
        summaryText = `Chilly weather at ${Math.round(temp)}°C. You'll want a warm jacket when heading out.`;
      } else if (temp < 20) {
        summaryText = `Cool and comfortable at ${Math.round(temp)}°C. Perfect weather for a light jacket or sweater.`;
      } else if (temp < 30) {
        summaryText = `Pleasant ${Math.round(temp)}°C weather. Great conditions for outdoor activities.`;
      } else {
        summaryText = `Hot day at ${Math.round(temp)}°C. Stay hydrated and seek shade during peak hours.`;
      }

      // Add condition-specific details
      if (condition.includes('rain')) {
        summaryText += ' Rain is expected, so keep an umbrella handy.';
      } else if (condition.includes('cloud')) {
        summaryText += ' Cloudy skies provide natural shade today.';
      } else if (condition.includes('clear') || condition.includes('sun')) {
        summaryText += ' Clear skies make it a beautiful day to be outside.';
      }

      setSummary(summaryText);

      // Generate AI recommendations
      const newRecommendations = [];

      if (condition.includes('rain')) {
        newRecommendations.push('Carry an umbrella or raincoat');
        newRecommendations.push('Allow extra time for travel');
      }

      if (uvIndex > 6) {
        newRecommendations.push('Apply sunscreen (SPF 30+)');
        newRecommendations.push('Wear sunglasses and a hat');
      }

      if (temp > 25) {
        newRecommendations.push('Stay hydrated - drink plenty of water');
        newRecommendations.push('Wear light, breathable clothing');
      }

      if (temp < 5) {
        newRecommendations.push('Dress in warm layers');
        newRecommendations.push('Cover exposed skin to prevent frostbite');
      }

      if (windSpeed > 20) {
        newRecommendations.push('Secure loose items outdoors');
        newRecommendations.push('Be cautious when driving');
      }

      if (humidity > 80) {
        newRecommendations.push('Expect muggy conditions');
        newRecommendations.push('Choose moisture-wicking fabrics');
      }

      if (humidity < 30) {
        newRecommendations.push('Use moisturizer for dry skin');
        newRecommendations.push('Stay hydrated to combat dry air');
      }

      // Ensure we have at least one recommendation
      if (newRecommendations.length === 0) {
        newRecommendations.push('Enjoy the pleasant weather conditions');
      }

      setRecommendations(newRecommendations.slice(0, 4)); // Limit to 4 recommendations
      setIsLoading(false);
    }, 1500);
  };

  const getRecommendationIcon = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('umbrella') || recommendation.toLowerCase().includes('rain')) {
      return <Umbrella className="h-3 w-3" />;
    }
    if (recommendation.toLowerCase().includes('sun') || recommendation.toLowerCase().includes('hat')) {
      return <SunIcon className="h-3 w-3" />;
    }
    if (recommendation.toLowerCase().includes('wind') || recommendation.toLowerCase().includes('secure')) {
      return <Wind className="h-3 w-3" />;
    }
    if (recommendation.toLowerCase().includes('caution') || recommendation.toLowerCase().includes('careful')) {
      return <AlertTriangle className="h-3 w-3" />;
    }
    return <Sparkles className="h-3 w-3" />;
  };

  return (
    <Card className="glass-card p-6 shadow-weather h-fit">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-primary-glow" />
        <h3 className="text-lg font-semibold text-white">AI Weather Insights</h3>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-4 bg-white/10 rounded mb-2 w-4/5"></div>
            <div className="h-4 bg-white/10 rounded w-3/5"></div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-white/10 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-white/90 text-sm leading-relaxed">
            {summary}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white/80 flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              Smart Recommendations
            </h4>
            {recommendations.map((rec, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-white/10 text-white border-white/20 text-xs flex items-center gap-1 w-full justify-start p-2"
              >
                {getRecommendationIcon(rec)}
                {rec}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}