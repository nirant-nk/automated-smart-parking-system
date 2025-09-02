import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { useAuth } from "../hooks/useAuth";
import { getOwnedParkings } from "../services/parkingService";

export default function OwnerParkingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Layout>
        <div className="p-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-white">Please log in to view owner dashboard</p>
          </div>
        </div>
      </Layout>
    );
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["owner-parkings"],
    queryFn: () => getOwnedParkings(),
  });

  const parkings = data?.parkings || [];

  return (
    <Layout>
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">My Parkings</h1>
                <p className="text-gray-200">Manage your owned parking locations</p>
              </div>
              <button
                onClick={() => navigate("/owner/parkings/new")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Add Parking
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-300">Failed to load parkings</div>
          ) : parkings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-white mb-2">No owned parkings yet</p>
              <p className="text-gray-200 mb-6">Create your first parking to become an owner</p>
              <button
                onClick={() => navigate("/owner/parkings/new")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Parking
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parkings.map((p: any) => (
                <div key={p._id} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">{p.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.isApproved ? "bg-green-500 bg-opacity-20 text-green-300" : "bg-yellow-500 bg-opacity-20 text-yellow-300"}`}>
                      {p.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm mb-3 line-clamp-2">{p.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                    <div className="text-center">
                      <div className="text-white font-semibold">{p.capacity?.car ?? 0}</div>
                      <div className="text-gray-200">Car spots</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-semibold">{p.currentCount?.car ?? 0}</div>
                      <div className="text-gray-200">Occupied</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-semibold">{p.availableSpaces?.car ?? 0}</div>
                      <div className="text-gray-200">Available</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/parkings/${p._id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition-colors">View</Link>
                    <Link to={`/owner/parkings/${p._id}/manage`} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-center transition-colors">Manage</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
