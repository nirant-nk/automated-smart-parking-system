import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { parkingApi, visitApi, Parking } from '@/lib/api';
import { 
  MapPin, 
  Car, 
  Navigation, 
  RefreshCw,
  Crosshair,
  Layers,
  Filter,
  Info
} from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom parking icons
const createParkingIcon = (isFull: boolean, paymentType: string) => {
  const color = isFull ? '#ef4444' : paymentType === 'free' ? '#22c55e' : '#3b82f6';
  
  return L.divIcon({
    className: 'custom-parking-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        🚗
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Map controls component
const MapControls: React.FC<{
  onRefresh: () => void;
  onLocate: () => void;
  onToggleFilters: () => void;
}> = ({ onRefresh, onLocate, onToggleFilters }) => {
  return (
    <div className="absolute top-4 right-4 z-[1000] space-y-2">
      <Button
        size="sm"
        onClick={onRefresh}
        className="bg-white shadow-lg hover:bg-gray-50"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        onClick={onLocate}
        className="bg-white shadow-lg hover:bg-gray-50"
      >
        <Crosshair className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        onClick={onToggleFilters}
        className="bg-white shadow-lg hover:bg-gray-50"
      >
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Map legend component
const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg">
      <div className="text-sm font-medium mb-2">Legend</div>
      <div className="space-y-1 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Free Parking</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Paid Parking</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Full Parking</span>
        </div>
      </div>
    </div>
  );
};

// Location marker component
const LocationMarker: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);

  const locationIcon = L.divIcon({
    className: 'custom-location-marker',
    html: `
      <div style="
        background-color: #8b5cf6;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return <Marker position={position} icon={locationIcon} />;
};

// Parking marker component
const ParkingMarker: React.FC<{
  parking: Parking;
  onVisit: (parking: Parking) => void;
  onNavigate: (parking: Parking) => void;
  userLocation: [number, number] | null;
}> = ({ parking, onVisit, onNavigate, userLocation }) => {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
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

  const distance = userLocation 
    ? calculateDistance(userLocation, parking.location.coordinates)
    : null;

  const icon = createParkingIcon(parking.isFull, parking.paymentType);

  return (
    <Marker 
      position={parking.location.coordinates} 
      icon={icon}
      eventHandlers={{
        click: () => setShowPopup(true),
      }}
    >
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          className="parking-popup"
        >
          <div className="p-2 min-w-[250px]">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm">{parking.name}</h3>
              <Badge 
                variant={parking.isFull ? "destructive" : parking.paymentType === "free" ? "default" : "secondary"}
                className="text-xs"
              >
                {parking.isFull ? "Full" : parking.paymentType === "free" ? "Free" : "Paid"}
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">
              {parking.location.address.street}, {parking.location.address.city}
            </p>

            {distance && (
              <div className="text-xs text-muted-foreground mb-3">
                📍 {(distance / 1000).toFixed(1)} km away
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div>
                <span className="font-medium">Available:</span>
                <div className="text-muted-foreground">
                  🚗 {parking.availableSpaces.car} | 🚐 {parking.availableSpaces.bus_truck} | 🏍️ {parking.availableSpaces.bike}
                </div>
              </div>
              <div>
                <span className="font-medium">Rate:</span>
                <div className="text-muted-foreground">
                  ₹{parking.hourlyRate.car}/hr
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              {user && !parking.isFull && (
                <Button
                  size="sm"
                  onClick={() => {
                    onVisit(parking);
                    setShowPopup(false);
                  }}
                  className="flex-1 text-xs"
                >
                  Check In
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onNavigate(parking);
                  setShowPopup(false);
                }}
                className="text-xs"
              >
                <Navigation className="h-3 w-3 mr-1" />
                Navigate
              </Button>
            </div>
          </div>
        </Popup>
      )}
    </Marker>
  );
};

// Main ParkingMap component
export const ParkingMap: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const mapRef = useRef<L.Map | null>(null);
  
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    parkingType: 'all',
    paymentType: 'all',
    maxDistance: 'all'
  });

  useEffect(() => {
    requestLocation();
    loadParkings();
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
      setLoading(true);
      const response = await parkingApi.getAll({ page: 1, limit: 100 });
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

  const filteredParkings = parkings.filter(parking => {
    if (filters.parkingType !== 'all' && parking.parkingType !== filters.parkingType) {
      return false;
    }
    if (filters.paymentType !== 'all' && parking.paymentType !== filters.paymentType) {
      return false;
    }
    if (filters.maxDistance !== 'all' && userLocation) {
      const distance = calculateDistance(userLocation, parking.location.coordinates);
      const maxDistance = parseInt(filters.maxDistance);
      if (distance > maxDistance) {
        return false;
      }
    }
    return true;
  });

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-muted">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapContainer
        center={userLocation || [72.8777, 19.0760]}
        zoom={13}
        style={{ height: '600px', width: '100%' }}
        ref={mapRef}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        {userLocation && <LocationMarker position={userLocation} />}
        
        {/* Parking markers */}
        {filteredParkings.map(parking => (
          <ParkingMarker
            key={parking._id}
            parking={parking}
            onVisit={handleVisit}
            onNavigate={handleNavigate}
            userLocation={userLocation}
          />
        ))}
        
        {/* Distance circles for nearby parkings */}
        {userLocation && filters.maxDistance !== 'all' && (
          <Circle
            center={userLocation}
            radius={parseInt(filters.maxDistance)}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
              weight: 2
            }}
          />
        )}
      </MapContainer>

      {/* Map Controls */}
      <MapControls
        onRefresh={loadParkings}
        onLocate={requestLocation}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Map Legend */}
      <MapLegend />

      {/* Filters Panel */}
      {showFilters && (
        <Card className="absolute top-4 left-4 z-[1000] w-64">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium">Parking Type</label>
              <select
                value={filters.parkingType}
                onChange={(e) => setFilters(prev => ({ ...prev, parkingType: e.target.value }))}
                className="w-full mt-1 p-2 text-xs border rounded"
              >
                <option value="all">All Types</option>
                <option value="opensky">Open Sky</option>
                <option value="closedsky">Covered</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium">Payment Type</label>
              <select
                value={filters.paymentType}
                onChange={(e) => setFilters(prev => ({ ...prev, paymentType: e.target.value }))}
                className="w-full mt-1 p-2 text-xs border rounded"
              >
                <option value="all">All Payments</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium">Max Distance</label>
              <select
                value={filters.maxDistance}
                onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: e.target.value }))}
                className="w-full mt-1 p-2 text-xs border rounded"
              >
                <option value="all">Any Distance</option>
                <option value="1000">1 km</option>
                <option value="3000">3 km</option>
                <option value="5000">5 km</option>
                <option value="10000">10 km</option>
              </select>
            </div>
            
            <Button
              size="sm"
              onClick={() => setFilters({ parkingType: 'all', paymentType: 'all', maxDistance: 'all' })}
              variant="outline"
              className="w-full text-xs"
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Panel */}
      <Card className="absolute bottom-4 right-4 z-[1000] w-48">
        <CardContent className="p-3">
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Total Parkings:</span>
              <span className="font-medium">{filteredParkings.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Available:</span>
              <span className="font-medium text-green-600">
                {filteredParkings.filter(p => !p.isFull).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Full:</span>
              <span className="font-medium text-red-600">
                {filteredParkings.filter(p => p.isFull).length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
