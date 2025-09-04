import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import ParkingMap from '../components/map/ParkingMap';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();


  const handleParkingSelect = (parking: any) => {
    navigate(`/parkings/${parking._id}`);
  };

  if (!user) {
    return (
      <Layout showNavigation={false}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Welcome to ParkSmart</h1>
            <p className="text-xl text-gray-200 mb-8">
              Find and manage parking spots with ease
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Get Started
              </button>
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">Find Parking Near You</h1>
                    <p className="text-white">Discover available parking spots in your area</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white ring-1 bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-black border-opacity-20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search for a location..."
                  className="w-full ring-1 ring-gray-300 px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30"
                />
              </div>
              <div className="flex gap-2">
                <select className="px-4 py-3 ring-1 ring-gray-300 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30">
                  <option value="">Parking Type</option>
                  <option value="opensky">Open Sky</option>
                  <option value="closedsky">Closed Sky</option>
                </select>
                <select className="px-4 py-3 ring-1 ring-gray-300 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30">
                  <option value="">Payment Type</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white ring-1 bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-black border-opacity-20">
            <ParkingMap onParkingSelect={handleParkingSelect} />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white ring-1 bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-black border-opacity-20">
              <div className="text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-black">Request New Parking</h3>
                <p className="text-neutral-900 mb-4 text-xl">Suggest a new parking location in your area</p>
                <button
                  onClick={() => navigate('/requests')}
                  className="bg-green-600 hover:bg-green-700 font-bold text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Make a Request
                </button>
              </div>
            </div>

            <div className="bg-white ring-1 bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-black border-opacity-20">
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-black">Wallet & Rewards</h3>
                <p className="text-neutral-900 mb-4 text-xl">Check your coin balance and transaction history</p>
                <button
                  onClick={() => navigate('/wallet')}
                  className="bg-yellow-600 hover:bg-yellow-700 font-bold text-white px-6 py-2 rounded-lg transition-colors"
                >
                  View Wallet
                </button>
              </div>
            </div>

            <div className="bg-white ring-1 bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-black border-opacity-20">
              <div className="text-center">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-semibold text-black ">Profile & Dashboard</h3>
                <p className="text-neutral-900 text-xl mb-4">Your account analytics and preferences</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-purple-600 hover:bg-purple-700 font-bold text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}