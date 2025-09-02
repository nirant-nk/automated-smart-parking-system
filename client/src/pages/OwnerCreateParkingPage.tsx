import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { createParking } from "../services/parkingService";

export default function OwnerCreateParkingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    longitude: "",
    latitude: "",
    parkingType: "opensky" as "opensky" | "closedsky",
    paymentType: "free" as "free" | "paid",
    ownershipType: "private" as "private" | "public",
    capacityCar: "0",
    capacityBike: "0",
    capacityBusTruck: "0",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const longitude = parseFloat(form.longitude);
      const latitude = parseFloat(form.latitude);
      if (Number.isNaN(longitude) || Number.isNaN(latitude)) {
        alert("Please enter valid coordinates");
        return;
      }
      const res = await createParking({
        name: form.name,
        description: form.description || undefined,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        parkingType: form.parkingType,
        paymentType: form.paymentType,
        ownershipType: form.ownershipType,
        capacity: {
          car: parseInt(form.capacityCar || "0", 10),
          bike: parseInt(form.capacityBike || "0", 10),
          bus_truck: parseInt(form.capacityBusTruck || "0", 10),
        },
        hourlyRate: {
          car: 0,
          bike: 0,
          bus_truck: 0,
        },
      });
      navigate(`/owner/parkings`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="max-w-3xl mx-auto bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
          <h1 className="text-2xl font-bold text-white mb-4">Add New Parking</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-200 text-sm mb-2">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30" placeholder="Parking name" required />
            </div>
            <div>
              <label className="block text-gray-200 text-sm mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30" placeholder="Optional description" rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-200 text-sm mb-2">Longitude</label>
                <input name="longitude" value={form.longitude} onChange={handleChange} className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30" placeholder="e.g. 72.8777" required />
              </div>
              <div>
                <label className="block text-gray-200 text-sm mb-2">Latitude</label>
                <input name="latitude" value={form.latitude} onChange={handleChange} className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30" placeholder="e.g. 19.0760" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-200 text-sm mb-2">Parking Type</label>
                <select name="parkingType" value={form.parkingType} onChange={handleChange} className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30">
                  <option value="opensky">Open Sky</option>
                  <option value="closedsky">Closed Sky</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-2 00 text-sm mb-2">Payment</label>
                <select name="paymentType" value={form.paymentType} onChange={handleChange} className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30">
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-200 text-sm mb-2">Ownership</label>
                <select name="ownershipType" value={form.ownershipType} onChange={handleChange} className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30">
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-200 text-sm mb-2">Car Capacity</label>
                <input name="capacityCar" value={form.capacityCar} onChange={handleChange} className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30" placeholder="0" />
              </div>
              <div>
                <label className="block text-gray-200 text-sm mb-2">Bike Capacity</label>
                <input name="capacityBike" value={form.capacityBike} onChange={handleChange} className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30" placeholder="0" />
              </div>
              <div>
                <label className="block text-gray-200 text-sm mb-2">Bus/Truck Capacity</label>
                <input name="capacityBusTruck" value={form.capacityBusTruck} onChange={handleChange} className="w-full px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white focus:bg-opacity-30" placeholder="0" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">Cancel</button>
              <button disabled={loading} className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg">{loading ? "Saving..." : "Create"}</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
