import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/common/Layout";
import { useAuth } from "../hooks/useAuth";
import { useGeolocation } from "../hooks/useGeolocation";
import { getParkingById } from "../services/parkingService";
import { recordVisit } from "../services/visitService";

export default function ParkingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location: userLocation } = useGeolocation();
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const { data: parking, isLoading, error } = useQuery({
    queryKey: ["parking", id],
    queryFn: () => getParkingById(id!),
    enabled: !!id,
  });

  const handleCheckIn = async () => {
    if (!user || !parking || !userLocation) {
      toast.error("Unable to check in. Please ensure location access is enabled.");
      return;
    }

    setIsCheckingIn(true);
    try {
      const visitData = {
        parkingId: parking._id,
        location: {
          type: "Point" as const,
          coordinates: [userLocation.longitude, userLocation.latitude] as [number, number],
        },
        distance: 0, // This would be calculated based on distance from parking
      };

      await recordVisit(visitData);
      toast.success("Successfully checked in! You earned 10 coins.");
      // Refresh user data to update wallet
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to check in");
    } finally {
      setIsCheckingIn(false);
    }
  };

  const calculateDistance = (parkingCoords: [number, number], userCoords: [number, number]) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (userCoords[0] - parkingCoords[0]) * Math.PI / 180;
    const dLon = (userCoords[1] - parkingCoords[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(parkingCoords[0] * Math.PI / 180) * Math.cos(userCoords[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 1000); // Convert to meters
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
                <p className="mt-4 text-white text-lg">Loading parking details...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !parking) {
    return (
      <Layout>
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-red-400 text-lg">Parking not found</p>
                <button
                  onClick={() => navigate('/parkings')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Back to Parkings
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const distance = userLocation && parking.location.coordinates 
    ? calculateDistance(
        [parking.location.coordinates[1], parking.location.coordinates[0]], 
        [userLocation.latitude, userLocation.longitude]
      )
    : null;

  return (
    <Layout>
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{parking.name}</h1>
                <p className="text-gray-200">{parking.description}</p>
              </div>
              <button
                onClick={() => navigate('/parkings')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ← Back to Parkings
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Parking Status</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    parking.isFull 
                      ? 'bg-red-500 bg-opacity-20 text-red-300' 
                      : 'bg-green-500 bg-opacity-20 text-green-300'
                  }`}>
                    {parking.isFull ? 'Full' : 'Available'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{parking.capacity?.car || 0}</div>
                    <div className="text-gray-200 text-sm">Total Car Spots</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{parking.availableSpaces?.car || 0}</div>
                    <div className="text-gray-200 text-sm">Available Car Spots</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{parking.capacity?.bike || 0}</div>
                    <div className="text-gray-200 text-sm">Bike Spots</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{parking.capacity?.bus_truck || 0}</div>
                    <div className="text-gray-200 text-sm">Bus/Truck Spots</div>
                  </div>
                </div>
              </div>

              {/* Details Card */}
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-white mb-4">Parking Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm">Type</label>
                    <p className="text-white font-medium capitalize">{parking.parkingType}</p>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Payment</label>
                    <p className="text-white font-medium capitalize">{parking.paymentType}</p>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Ownership</label>
                    <p className="text-white font-medium capitalize">{parking.ownershipType}</p>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Last Updated</label>
                    <p className="text-white font-medium">
                      {new Date(parking.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {parking.location.address && (
                  <div className="mt-4">
                    <label className="text-gray-300 text-sm">Address</label>
                    <p className="text-white font-medium">
                      {parking.location.address.street}, {parking.location.address.city}, {parking.location.address.state}
                    </p>
                  </div>
                )}

                {distance !== null && (
                  <div className="mt-4">
                    <label className="text-gray-300 text-sm">Distance from you</label>
                    <p className="text-white font-medium">{distance}m away</p>
                  </div>
                )}
              </div>

              {/* Rates Card */}
              {parking.paymentType === 'paid' && (
                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
                  <h2 className="text-xl font-semibold text-white mb-4">Hourly Rates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">${parking.hourlyRate?.car || 0}</div>
                      <div className="text-gray-300 text-sm">Per Hour (Car)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">${parking.hourlyRate?.bike || 0}</div>
                      <div className="text-gray-300 text-sm">Per Hour (Bike)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">${parking.hourlyRate?.bus_truck || 0}</div>
                      <div className="text-gray-300 text-sm">Per Hour (Bus/Truck)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Check-in Card */}
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-white mb-4">Check In</h2>
                <p className="text-gray-300 text-sm mb-4">
                  Check in to earn coins and track your parking visits
                </p>
                <button
                  onClick={handleCheckIn}
                  disabled={isCheckingIn || parking.isFull || !userLocation}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors"
                >
                  {isCheckingIn ? 'Checking In...' : 'Check In & Earn Coins'}
                </button>
                {!userLocation && (
                  <p className="text-red-400 text-xs mt-2">
                    Location access required for check-in
                  </p>
                )}
              </div>

              {/* Owner Info */}
              {parking.owner && (
                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
                  <h2 className="text-xl font-semibold text-white mb-4">Parking Owner</h2>
                  <div className="space-y-2">
                    <div>
                      <label className="text-gray-300 text-sm">Name</label>
                      <p className="text-white font-medium">{parking.owner.name}</p>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Email</label>
                      <p className="text-white font-medium">{parking.owner.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-white mb-4">Statistics</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Visits</span>
                    <span className="text-white font-medium">{parking.statistics?.totalVisits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Average Occupancy</span>
                    <span className="text-white font-medium">{parking.statistics?.averageOccupancy || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Occupancy</span>
                    <span className="text-white font-medium">{parking.occupancyPercentage || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}