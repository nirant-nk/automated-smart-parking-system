import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deleteParking, getAllParkings } from "../../services/parkingService";

export default function ManageParking() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-parkings"], queryFn: () => getAllParkings({ limit: 100 }) });
  const parkings = data?.parkings ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteParking(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-parkings"] }),
  });

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">All Parkings</h2>
        <Link to="/owner/parkings/new" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">+ Add Parking</Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-300">Failed to load parkings</div>
      ) : parkings.length === 0 ? (
        <div className="text-gray-500">No parkings found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parkings.map((p: any) => (
            <div key={p._id} className="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-semibold">{p.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.isApproved ? "bg-green-500 bg-opacity-20 text-green-300" : "bg-yellow-500 bg-opacity-20 text-yellow-300"}`}>{p.isApproved ? "Approved" : "Pending"}</span>
              </div>
              <p className="text-gray-200 text-sm mb-3 line-clamp-2">{p.description}</p>
              <div className="flex gap-2">
                <Link to={`/parkings/${p._id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-center">View</Link>
                <Link to={`/owner/parkings/${p._id}/manage`} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-center">Manage</Link>
                <button onClick={() => deleteMutation.mutate(p._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
