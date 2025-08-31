import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllParkings } from "../services/parkingService";
import Layout from "../components/common/Layout";
import ParkingMap from "../components/map/ParkingMap";
import { useNavigate } from "react-router-dom";

export default function ParkingListPage() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [filters, setFilters] = useState({
    parkingType: '',
    paymentType: '',
    isFull: '',
    search: ''
  });
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["parkings"],
    queryFn: () => getAllParkings()
  });

  const handleParkingSelect = (parking: any) => {
    navigate(`/parkings/${parking._id}`);
  };

  const filteredParkings = data?.parkings?.filter((parking: any) => {
    if (filters.parkingType && parking.parkingType !== filters.parkingType) return false;
    if (filters.paymentType && parking.paymentType !== filters.paymentType) return false;
    if (filters.isFull === 'true' && !parking.isFull) return false;
    if (filters.isFull === 'false' && parking.isFull) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        parking.name.toLowerCase().includes(searchLower) ||
        parking.description?.toLowerCase().includes(searchLower) ||
        parking.location.address?.street?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  }) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
                <p className="mt-4 text-white text-lg">Loading parking spaces...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-red-400 text-lg">Error loading parking spaces</p>
                <p className="text-gray-300">Please try again later</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Parking Spaces</h1>
                <p className="text-gray-300">Find the perfect parking spot for your vehicle</p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex bg-white bg-opacity-10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🗺️ Map
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  📋 List
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Search parkings..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
              />
              
              <select
                value={filters.parkingType}
                onChange={(e) => setFilters({ ...filters, parkingType: e.target.value })}
                className="px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="opensky">Open Sky</option>
                <option value="closedsky">Closed Sky</option>
              </select>
              
              <select
                value={filters.paymentType}
                onChange={(e) => setFilters({ ...filters, paymentType: e.target.value })}
                className="px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Payment</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
              
              <select
                value={filters.isFull}
                onChange={(e) => setFilters({ ...filters, isFull: e.target.value })}
                className="px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="false">Available</option>
                <option value="true">Full</option>
              </select>
              
              <button
                onClick={() => setFilters({ parkingType: '', paymentType: '', isFull: '', search: '' })}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-300">
              Found {filteredParkings.length} parking space{filteredParkings.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Content */}
          {viewMode === 'map' ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
              <ParkingMap onParkingSelect={handleParkingSelect} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParkings.map((parking: any) => (
                <div key={parking._id} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white">{parking.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parking.isFull ? 'bg-red-500 bg-opacity-20 text-red-300' : 'bg-green-500 bg-opacity-20 text-green-300'
                    }`}>
                      {parking.isFull ? 'Full' : 'Available'}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{parking.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Type:</span>
                      <span className="text-white capitalize">{parking.parkingType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Payment:</span>
                      <span className="text-white capitalize">{parking.paymentType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Capacity:</span>
                      <span className="text-white">{parking.capacity?.car || 0} cars</span>
                    </div>
                    {parking.availableSpaces && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Available:</span>
                        <span className="text-white">{parking.availableSpaces.car} cars</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => navigate(`/parkings/${parking._id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}

          {filteredParkings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚗</div>
              <p className="text-xl text-white mb-2">No parking spaces found</p>
              <p className="text-gray-300">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}