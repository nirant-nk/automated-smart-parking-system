import { ParkingCard } from '@/components/parking/ParkingCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Parking, parkingApi, visitApi } from '@/lib/api';
import {
    Car,
    History,
    MapPin,
    ParkingCircle,
    Plus,
    Search,
    TrendingUp,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [nearbyParkings, setNearbyParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    loadInitialData();
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(coords);
          loadNearbyParkings(coords);
        },
        (error) => {
          console.error('Location access denied:', error);
          // Use default Mumbai coordinates
          const defaultCoords: [number, number] = [72.8777, 19.0760];
          setUserLocation(defaultCoords);
          loadNearbyParkings(defaultCoords);
        }
      );
    }
  };

  const loadInitialData = async () => {
    try {
      const response = await parkingApi.getAll({ page: 1, limit: 20 });
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

  const loadNearbyParkings = async (coords: [number, number]) => {
    try {
      const response = await parkingApi.getNearby(coords, 5000);
      setNearbyParkings(response.parkings);
    } catch (error) {
      console.error('Failed to load nearby parkings:', error);
    }
  };

  const handleVisit = async (parking: Parking) => {
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

  const filteredParkings = parkings.filter(parking =>
    parking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parking.location.address.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-lg p-6 text-primary-foreground">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-primary-foreground/80">
          Find and manage parking spaces effortlessly
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.wallet.coins || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nearby Parkings</CardTitle>
            <MapPin className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nearbyParkings.length}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
            <ParkingCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nearbyParkings.reduce((sum, p) => sum + p.availableSpaces.car, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Users className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.wallet.transactions.length || 0}</div>
            <p className="text-xs text-muted-foreground">Transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search parkings by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Parking Tabs */}
      <Tabs defaultValue="nearby" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="all">All Parkings</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nearby" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Nearby Parkings</h2>
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={() => userLocation && loadNearbyParkings(userLocation)}>
                <MapPin className="mr-2 h-4 w-4" />
                Refresh Location
              </Button>
              <Link to="/map">
                <Button size="sm" variant="outline">
                  <Map className="mr-2 h-4 w-4" />
                  Map View
                </Button>
              </Link>
            </div>
          </div>
          
          {nearbyParkings.length === 0 ? (
            <Card className="p-8 text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No nearby parkings found</h3>
              <p className="text-muted-foreground">
                Enable location access to see parkings near you
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearbyParkings.map(parking => (
                <ParkingCard
                  key={parking._id}
                  parking={parking}
                  onVisit={handleVisit}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Parkings</h2>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Parking
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParkings.map(parking => (
              <ParkingCard
                key={parking._id}
                parking={parking}
                onVisit={handleVisit}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card className="p-8 text-center">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Favorites feature coming soon</h3>
            <p className="text-muted-foreground">
              Save your frequently used parkings for quick access
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};