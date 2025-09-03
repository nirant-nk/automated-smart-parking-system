import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/common/Layout";
import { useAuth } from "../hooks/useAuth";
import { useGeolocation } from "../hooks/useGeolocation";
import { createRequest, getUserRequests } from "../services/requestService";

export default function RequestPage() {
  const { user } = useAuth();
  const { location: userLocation } = useGeolocation();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    requestType: 'parking',
    title: '',
    description: '',
    location: {
      type: 'Point',
      coordinates: [0, 0],
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      }
    },
    parkingDetails: {
      name: '',
      capacity: {
        car: 0,
        bus_truck: 0,
        bike: 0
      },
      parkingType: 'opensky',
      paymentType: 'free',
      ownershipType: 'public',
      hourlyRate: {
        car: 0,
        bus_truck: 0,
        bike: 0
      },
      amenities: [],
      operatingHours: {
        open: '00:00',
        close: '23:59',
        is24Hours: true
      }
    }
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ['user-requests'],
    queryFn: () => getUserRequests(),
  });

  const createRequestMutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-requests'] });
      toast.success('Request submitted successfully!');
      setShowForm(false);
      setFormData({
        requestType: 'parking',
        title: '',
        description: '',
        location: {
          type: 'Point',
          coordinates: [0, 0],
          address: {
            street: '',
            city: '',
            state: '',
            country: '',
            postalCode: ''
          }
        },
        parkingDetails: {
          name: '',
          capacity: {
            car: 0,
            bus_truck: 0,
            bike: 0
          },
          parkingType: 'opensky',
          paymentType: 'free',
          ownershipType: 'public',
          hourlyRate: {
            car: 0,
            bus_truck: 0,
            bike: 0
          },
          amenities: [],
          operatingHours: {
            open: '00:00',
            close: '23:59',
            is24Hours: true
          }
        }
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userLocation) {
      toast.error('Please enable location access to submit a request');
      return;
    }

    const requestData = {
      requestType: formData.requestType as "parking" | "no_parking",
      title: formData.title,
      description: formData.description,
      location: {
        type: "Point" as const,
        coordinates: [userLocation.longitude, userLocation.latitude] as [number, number]
      },
      images: [],
      parkingDetails: formData.requestType === 'parking' ? {
        name: formData.parkingDetails.name,
        capacity: formData.parkingDetails.capacity,
        parkingType: formData.parkingDetails.parkingType as "opensky" | "closedsky",
        paymentType: formData.parkingDetails.paymentType as "paid" | "free",
        ownershipType: formData.parkingDetails.ownershipType as "private" | "public",
        hourlyRate: formData.parkingDetails.hourlyRate,
        amenities: formData.parkingDetails.amenities as string[],
        operatingHours: formData.parkingDetails.operatingHours
      } : undefined
    };

    createRequestMutation.mutate(requestData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 bg-opacity-20 text-yellow-300';
      case 'approved': return 'bg-green-500 bg-opacity-20 text-green-300';
      case 'denied': return 'bg-red-500 bg-opacity-20 text-red-300';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-300';
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-white">Please log in to manage requests</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">My Requests</h1>
                <p className="text-gray-500">Manage your parking requests and track their status</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-green-600 font-bold hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {showForm ? 'Cancel' : 'New Request'}
              </button>
            </div>
          </div>

          {/* New Request Form */}
          {showForm && (
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
              <h2 className="text-xl font-semibold text-black mb-4">Submit New Request</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 text-sm mb-2">Request Type</label>
                    <select
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg textblack ring-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="parking">New Parking Location</option>
                      <option value="no_parking">No Parking Zone</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-500 text-sm mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter request title"
                      className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg  placeholder-gray-400 focus:outline-none focus:ring-2 text-black ring-1 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 text-sm mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your request in detail..."
                    rows={4}
                    className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black ring-1 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                    required
                  />
                </div>

                {/* Location Information */}
                <div>
                  <label className="block text-gray-500 text-sm mb-2">Location Details</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="location.address.street"
                      value={formData.location.address.street}
                      onChange={handleInputChange}
                      placeholder="Street Address"
                      className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black ring-1 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                    />
                    <input
                      type="text"
                      name="location.address.city"
                      value={formData.location.address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black ring-1 placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                    />
                    <input
                      type="text"
                      name="location.address.state"
                      value={formData.location.address.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black ring-1 placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                    />
                    <input
                      type="text"
                      name="location.address.postalCode"
                      value={formData.location.address.postalCode}
                      onChange={handleInputChange}
                      placeholder="Postal Code"
                      className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black ring-1 placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                    />
                  </div>
                </div>

                {/* Parking Details (if parking request) */}
                {formData.requestType === 'parking' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-950">Parking Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-500 text-sm mb-2">Parking Name</label>
                        <input
                          type="text"
                          name="parkingDetails.name"
                          value={formData.parkingDetails.name}
                          onChange={handleInputChange}
                          placeholder="Parking lot name"
                          className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black ring-1 placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-500 text-sm mb-2">Parking Type</label>
                        <select
                          name="parkingDetails.parkingType"
                          value={formData.parkingDetails.parkingType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black ring-1 placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                        >
                          <option value="opensky">Open Sky</option>
                          <option value="closedsky">Closed Sky</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-500 text-sm mb-2">Payment Type</label>
                        <select
                          name="parkingDetails.paymentType"
                          value={formData.parkingDetails.paymentType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black ring-1 placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                        >
                          <option value="free">Free</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-500 text-sm mb-2">Car Capacity</label>
                        <input
                          type="number"
                          name="parkingDetails.capacity.car"
                          value={formData.parkingDetails.capacity.car<=0? 0 : formData.parkingDetails.capacity.car}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black ring-1 placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-500 text-sm mb-2">Bike Capacity</label>
                        <input
                          type="number"
                          name="parkingDetails.capacity.bike"
                          value={formData.parkingDetails.capacity.bike<=0? 0: formData.parkingDetails.capacity.bike }
                          onChange={handleInputChange}
                          placeholder="0"
                          className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black ring-1 placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-500 text-sm mb-2">Bus/Truck Capacity</label>
                        <input
                          type="number"
                          name="parkingDetails.capacity.bus_truck"
                          value={formData.parkingDetails.capacity.bus_truck<=0?0:formData.parkingDetails.capacity.bus_truck}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black ring-1 placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 bg-gray-600 font-bold hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createRequestMutation.isPending}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                  >
                    {createRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Requests List */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <h2 className="text-xl font-semibold text-black mb-4">Your Requests</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : requests && requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request: any) => (
                  <div key={request._id} className="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-800 text-sm mb-2">{request.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-800">
                          <span>Type: {request.requestType}</span>
                          <span>Submitted: {new Date(request.createdAt).toLocaleDateString()}</span>
                          {request.coinsAwarded > 0 && (
                            <span className="text-green-400">+{request.coinsAwarded} coins awarded</span>
                          )}
                        </div>
                      </div>
                      
                      {request.adminNotes && (
                        <div className="text-sm">
                          <p className="text-red-600 font-medium">Admin Notes:</p>
                          <p className="text-amber-300">{request.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-xl text-black mb-2">No requests found</p>
                <p className="text-gray-500">Submit your first parking request to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}