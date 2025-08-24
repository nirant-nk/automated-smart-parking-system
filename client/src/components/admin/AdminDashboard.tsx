import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { parkingApi, requestApi, visitApi, Parking, Request, Visit } from '@/lib/api';
import { 
  Users, 
  Car, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  Coins,
  Clock,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalParkings: 0,
    totalUsers: 0,
    totalRequests: 0,
    totalVisits: 0,
    pendingRequests: 0,
    activeParkings: 0
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load parkings
      const parkingResponse = await parkingApi.getAll({ page: 1, limit: 50 });
      setParkings(parkingResponse.parkings);
      
      // Load requests
      const requestResponse = await requestApi.getUserRequests(1, 50);
      setRequests(requestResponse.requests);
      
      // Load visits
      const visitResponse = await visitApi.getUserVisits(1, 50);
      setVisits(visitResponse.visits);
      
      // Calculate stats
      setStats({
        totalParkings: parkingResponse.parkings.length,
        totalUsers: 0, // Would need user API
        totalRequests: requestResponse.requests.length,
        totalVisits: visitResponse.visits.length,
        pendingRequests: requestResponse.requests.filter(r => r.status === 'pending').length,
        activeParkings: parkingResponse.parkings.filter(p => p.isActive).length
      });
      
    } catch (error) {
      toast({
        title: "Error loading admin data",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await requestApi.approve(requestId, { coinsAwarded: 50, adminNotes: "Approved by admin" });
      toast({
        title: "Request approved",
        description: "The parking request has been approved",
      });
      loadAdminData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error approving request",
        description: "Failed to approve the request",
        variant: "destructive",
      });
    }
  };

  const handleDenyRequest = async (requestId: string) => {
    try {
      await requestApi.deny(requestId, { adminNotes: "Denied by admin" });
      toast({
        title: "Request denied",
        description: "The parking request has been denied",
      });
      loadAdminData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error denying request",
        description: "Failed to deny the request",
        variant: "destructive",
      });
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Admin access required.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-lg p-6 text-primary-foreground">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-primary-foreground/80">
          Manage parking system, users, and requests
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parkings</CardTitle>
            <Car className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParkings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeParkings} active
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Need approval
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <TrendingUp className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="parkings">Parkings</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Parking Requests</h2>
            <Badge variant="secondary">
              {requests.length} total requests
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {requests.map(request => (
              <Card key={request._id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{request.title}</h3>
                        <Badge 
                          variant={request.status === 'pending' ? 'secondary' : request.status === 'approved' ? 'default' : 'destructive'}
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Type: {request.requestType}</span>
                        <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                        <span>Age: {request.ageInDays} days</span>
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveRequest(request._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDenyRequest(request._id)}
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Deny
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Parkings Tab */}
        <TabsContent value="parkings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Parking Management</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Parking
            </Button>
          </div>
          
          <div className="grid gap-4">
            {parkings.map(parking => (
              <Card key={parking._id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{parking.name}</h3>
                        <Badge variant={parking.isActive ? 'default' : 'secondary'}>
                          {parking.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant={parking.isFull ? 'destructive' : 'default'}>
                          {parking.isFull ? 'Full' : 'Available'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{parking.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Type: {parking.parkingType}</span>
                        <span>Payment: {parking.paymentType}</span>
                        <span>Capacity: {parking.capacity.car} cars</span>
                        <span>Available: {parking.availableSpaces.car} cars</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive">
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Visits Tab */}
        <TabsContent value="visits" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Visit History</h2>
            <Badge variant="secondary">
              {visits.length} total visits
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {visits.map(visit => (
              <Card key={visit._id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{visit.parking.name}</h3>
                        <Badge variant={visit.isVerified ? 'default' : 'secondary'}>
                          {visit.isVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Date: {visit.formattedVisitDate}</span>
                        <span>Distance: {(visit.distance / 1000).toFixed(1)} km</span>
                        <span>Coins: {visit.coinsEarned}</span>
                      </div>
                    </div>
                    
                    <div className="text-right text-sm">
                      <div className="font-medium">{visit.parking.parkingType}</div>
                      <div className="text-muted-foreground">{visit.parking.paymentType}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
          
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">User Management</h3>
            <p className="text-muted-foreground">
              User management features coming soon. This will include user listing, 
              role management, and user statistics.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
