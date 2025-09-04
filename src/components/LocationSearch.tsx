import { useState } from 'react';
import { Search, X, MapPin, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface LocationSearchProps {
  onCitySelect: (city: string) => void;
  onClose: () => void;
}

const popularCities = [
  'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore', 'Los Angeles'
];

export function LocationSearch({ onCitySelect, onClose }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    await onCitySelect(searchQuery.trim());
    setIsSearching(false);
  };

  const handleCityClick = async (city: string) => {
    setIsSearching(true);
    await onCitySelect(city);
    setIsSearching(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-card p-6 w-full max-w-md shadow-weather">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Choose Location</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              disabled={isSearching}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        <div>
          <h4 className="text-sm text-white/80 mb-3">Popular Cities</h4>
          <div className="grid grid-cols-2 gap-2">
            {popularCities.map((city) => (
              <Button
                key={city}
                variant="outline"
                size="sm"
                onClick={() => handleCityClick(city)}
                disabled={isSearching}
                className="glass-card text-white border-white/20 hover:bg-white/10 justify-start"
              >
                <MapPin className="h-3 w-3 mr-2" />
                {city}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}