import { ParkingCard } from '@/components/parking/ParkingCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Parking, parkingApi, visitApi } from '@/lib/api';
import {
    ArrowLeft,
    Car,
    MapPin,
    Search,
    SlidersHorizontal
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // Filters
  const [parkingTypeFilter, setParkingTypeFilter] = useState<string>('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('all');
  const [distanceFilter, setDistanceFilter] = useState<string>('all');

  useEffect(() => {
    requestLocation();
    loadParkings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [parkings, searchQuery, parkingTypeFilter, paymentTypeFilter, distanceFilter]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(coords);
        },
        (error) => {
          console.error('Location access denied:', error);
          // Use default Mumbai coordinates
          const defaultCoords: [number, number] = [72.8777, 19.0760];
          setUserLocation(defaultCoords);
        }
      );
    }
  };

  const loadParkings = async () => {
    try {
      const response = await parkingApi.getAll({ page: 1, limit: 50 });
      setParkings(response.parkings);
    } catch (error) {
      toast({
        title: "Error loading parkings",
        description: "Failed to load parking data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = parkings;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(parking =>
        parking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parking.location.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parking.location.address.street.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Parking type filter
    if (parkingTypeFilter !== 'all') {
      filtered = filtered.filter(parking => parking.parkingType === parkingTypeFilter);
    }

    // Payment type filter
    if (paymentTypeFilter !== 'all') {
      filtered = filtered.filter(parking => parking.paymentType === paymentTypeFilter);
    }

    // Distance filter (if user location is available)
    if (distanceFilter !== 'all' && userLocation) {
      const maxDistance = parseInt(distanceFilter);
      filtered = filtered.filter(parking => {
        const distance = calculateDistance(userLocation, parking.location.coordinates);
        return distance <= maxDistance;
      });
    }

    setFilteredParkings(filtered);
  };

  const calculateDistance = (
    coord1: [number, number], 
    coord2: [number, number]
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = coord1[1] * Math.PI/180;
    const φ2 = coord2[1] * Math.PI/180;
    const Δφ = (coord2[1]-coord1[1]) * Math.PI/180;
    const Δλ = (coord2[0]-coord1[0]) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const handleVisit = async (parking: Parking) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to check in to parkings",
        variant: "destructive",
      });
      return;
    }

    if (!userLocation) {
      toast({
        title: "Location required",
        description: "Please enable location access to check in",
        variant: "destructive",
      });
      return;
    }

    try {
      const distance = calculateDistance(userLocation, parking.location.coordinates);
      
      if (distance > 500) { // 500 meters threshold
        toast({
          title: "Too far from parking",
          description: "You need to be within 500m of the parking to check in",
          variant: "destructive",
        });
        return;
      }

      await visitApi.record({
        parkingId: parking.parkingId,
        location: {
          type: 'Point',
          coordinates: userLocation
        },
        distance: distance
      });

      toast({
        title: "Check-in successful!",
        description: `You've earned coins for visiting ${parking.name}`,
      });
    } catch (error) {
      toast({
        title: "Check-in failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleNavigate = (parking: Parking) => {
    const [lng, lat] = parking.location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Car className="h-12 w-12 mx-auto text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading parking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 mr-6">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">Find Parking</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/map">
              <Button size="sm" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Map View
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Search and Filters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search & Filter Parkings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Parking Type</label>
                <Select value={parkingTypeFilter} onValueChange={setParkingTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="opensky">Open Sky</SelectItem>
                    <SelectItem value="closedsky">Covered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Type</label>
                <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All payments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Distance</label>
                <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Distance</SelectItem>
                    <SelectItem value="1000">Within 1km</SelectItem>
                    <SelectItem value="3000">Within 3km</SelectItem>
                    <SelectItem value="5000">Within 5km</SelectItem>
                    <SelectItem value="10000">Within 10km</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setParkingTypeFilter('all');
                    setPaymentTypeFilter('all');
                    setDistanceFilter('all');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">Available Parkings</h2>
            <Badge variant="secondary">
              {filteredParkings.length} results
            </Badge>
          </div>
          
          {userLocation && (
            <Button size="sm" onClick={requestLocation}>
              <MapPin className="mr-2 h-4 w-4" />
              Update Location
            </Button>
          )}
        </div>

        {/* Parkings Grid */}
        {filteredParkings.length === 0 ? (
          <Card className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No parkings found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more results.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParkings.map(parking => (
              <ParkingCard
                key={parking._id}
                parking={{
                  ...parking,
                  distance: userLocation 
                    ? calculateDistance(userLocation, parking.location.coordinates)
                    : undefined
                }}
                onVisit={handleVisit}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;