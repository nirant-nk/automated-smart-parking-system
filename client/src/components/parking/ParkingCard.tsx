import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Parking } from '@/lib/api';
import { 
  MapPin, 
  Car, 
  Truck, 
  Bike, 
  Clock, 
  CreditCard, 
  Shield,
  Navigation
} from 'lucide-react';

interface ParkingCardProps {
  parking: Parking;
  onVisit?: (parking: Parking) => void;
  onNavigate?: (parking: Parking) => void;
}

export const ParkingCard: React.FC<ParkingCardProps> = ({ 
  parking, 
  onVisit, 
  onNavigate 
}) => {
  const getAvailabilityColor = (percentage: number) => {
    if (percentage < 20) return 'text-danger';
    if (percentage < 50) return 'text-warning';
    return 'text-success';
  };

  const getAvailabilityText = (percentage: number) => {
    if (percentage === 0) return 'Full';
    if (percentage < 20) return 'Limited';
    if (percentage < 50) return 'Moderate';
    return 'Available';
  };

  const availabilityPercentage = 
    parking.capacity.car > 0 
      ? (parking.availableSpaces.car / parking.capacity.car) * 100 
      : 0;

  return (
    <Card className="w-full shadow-card hover:shadow-elegant transition-smooth bg-gradient-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{parking.name}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              <span>{parking.location.address.city}</span>
              {parking.distance && (
                <span className="ml-2">• {(parking.distance / 1000).toFixed(1)}km away</span>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            <Badge variant={parking.parkingType === 'closedsky' ? 'default' : 'secondary'}>
              {parking.parkingType === 'closedsky' ? 'Covered' : 'Open Sky'}
            </Badge>
            <Badge variant={parking.paymentType === 'paid' ? 'default' : 'secondary'}>
              {parking.paymentType === 'paid' ? 'Paid' : 'Free'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Availability Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Availability</span>
            <span className={`text-sm font-medium ${getAvailabilityColor(availabilityPercentage)}`}>
              {getAvailabilityText(availabilityPercentage)}
            </span>
          </div>
          <Progress 
            value={100 - parking.occupancyPercentage} 
            className="h-2"
          />
        </div>

        {/* Vehicle Spaces */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center space-y-1">
            <Car className="h-4 w-4 mx-auto text-muted-foreground" />
            <div className="text-xs text-muted-foreground">Cars</div>
            <div className="text-sm font-medium">
              {parking.availableSpaces.car}/{parking.capacity.car}
            </div>
          </div>
          <div className="text-center space-y-1">
            <Truck className="h-4 w-4 mx-auto text-muted-foreground" />
            <div className="text-xs text-muted-foreground">Trucks</div>
            <div className="text-sm font-medium">
              {parking.availableSpaces.bus_truck}/{parking.capacity.bus_truck}
            </div>
          </div>
          <div className="text-center space-y-1">
            <Bike className="h-4 w-4 mx-auto text-muted-foreground" />
            <div className="text-xs text-muted-foreground">Bikes</div>
            <div className="text-sm font-medium">
              {parking.availableSpaces.bike}/{parking.capacity.bike}
            </div>
          </div>
        </div>

        {/* Pricing */}
        {parking.paymentType === 'paid' && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <CreditCard className="mr-1 h-3 w-3 text-muted-foreground" />
              <span>₹{parking.hourlyRate.car}/hr</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
              <span>Hourly</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90"
            onClick={() => onVisit?.(parking)}
            disabled={parking.isFull}
          >
            <Shield className="mr-1 h-3 w-3" />
            Check In
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onNavigate?.(parking)}
          >
            <Navigation className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};