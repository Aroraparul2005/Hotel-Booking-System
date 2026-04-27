import React, { useState } from "react";
import { useAppContext } from "../appContext";
import { assets } from "../assets/assets";
import { toast } from "react-hot-toast";

const HotelReg = () => {
  const { axios, getToken, setShowHotelReg, setIsOwner, navigate } = useAppContext();

  const [form, setForm] = useState({
    name: "",
    address: "",
    contact: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);

  const cities = ["Gangtok", "Pelling", "Lachen", "Ravangla", "Namchi", "Gyalshing"];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/hotel", form, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        toast.success("Hotel registered successfully!");
        setIsOwner(true);
        setShowHotelReg(false);
        navigate("/owner");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        {/* Close */}
        <button
          onClick={() => setShowHotelReg(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <img src={assets.closeIcon} alt="close" className="h-5 w-5" />
        </button>

        <h2 className="font-playfair text-2xl font-bold mb-1">Register Your Hotel</h2>
        <p className="text-gray-500 text-sm mb-6">Fill in your hotel details to start listing rooms.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Hotel Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Mountain View Resort"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="Street address"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white"
            >
              <option value="">Select city</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Contact Number</label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
              placeholder="+91 98765 43210"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register Hotel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HotelReg;
