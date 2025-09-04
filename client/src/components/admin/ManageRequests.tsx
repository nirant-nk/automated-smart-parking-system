import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveRequest, denyRequest, getAllRequests } from "../../services/requestService";

export default function ManageRequests() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-requests"], queryFn: () => getAllRequests({ limit: 100 }) });
  const requests = data?.requests ?? data ?? [];

  const approveMutation = useMutation({
    mutationFn: (vars: { id: string; coinsAwarded: number; notes?: string }) => approveRequest(vars.id, { coinsAwarded: vars.coinsAwarded, adminNotes: vars.notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
      queryClient.invalidateQueries({ queryKey: ["user-requests"] });
    },
  });
  const denyMutation = useMutation({
    mutationFn: (vars: { id: string; notes: string }) => denyRequest(vars.id, { adminNotes: vars.notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
      queryClient.invalidateQueries({ queryKey: ["user-requests"] });
    },
  });

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
      <h2 className="text-xl font-semibold text-black mb-4">User Requests</h2>
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-300">Failed to load requests</div>
      ) : requests.length === 0 ? (
        <div className="text-gray-500">No requests</div>
      ) : (
        <div className="space-y-3">
          {requests.map((r: any) => (
            <div key={r._id} className="bg-white bg-opacity-5 rounded-lg p-4 border border-gray-300 ring-1 border-opacity-10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-black font-semibold">{r.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${r.status === 'approved' ? 'bg-green-500 bg-opacity-20 ' : r.status === 'denied' ? 'bg-red-500 bg-opacity-20' : 'bg-yellow-500 bg-opacity-20 '}`}>{r.status}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{r.description}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>Type: {r.requestType}</div>
                  <div>By: {r.user?.name}</div>
                </div>
              </div>
              {r.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => approveMutation.mutate({ id: r._id, coinsAwarded: 50 })} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg">Approve</button>
                  <button onClick={() => denyMutation.mutate({ id: r._id, notes: 'Not suitable' })} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg">Deny</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
