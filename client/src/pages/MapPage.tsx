import React from 'react';
import { ParkingMap } from '@/components/map/ParkingMap';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MapPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">Interactive Parking Map</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Info Card */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Info className="mr-2 h-5 w-5" />
              Interactive Parking Map Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">📍 Real-time Location</h4>
                <p className="text-muted-foreground">
                  Get your current location and find nearby parking spots with GPS accuracy
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">🎯 Smart Filtering</h4>
                <p className="text-muted-foreground">
                  Filter by parking type, payment method, and distance from your location
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">🚗 Check-in System</h4>
                <p className="text-muted-foreground">
                  Check in to parking spots and earn rewards when you're within 500m
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Component */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Find Parking Near You</h2>
            <div className="text-sm text-muted-foreground">
              Click on markers to see details and check in
            </div>
          </div>
          
          <ParkingMap />
        </div>

        {/* Legend and Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Map Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm">Free Parking Available</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm">Paid Parking Available</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm">Parking Full</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="text-sm">Your Current Location</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</div>
                <div className="text-sm">
                  <span className="font-medium">Enable Location:</span> Allow location access to see nearby parkings
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</div>
                <div className="text-sm">
                  <span className="font-medium">Click Markers:</span> Tap on parking markers to see details and rates
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">3</div>
                <div className="text-sm">
                  <span className="font-medium">Check In:</span> Use the check-in button when you're at the parking location
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">4</div>
                <div className="text-sm">
                  <span className="font-medium">Navigate:</span> Use the navigate button to get directions via Google Maps
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
