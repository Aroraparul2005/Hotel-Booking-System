import React, { useState, useEffect } from "react";
import { useAppContext } from "../appContext";
import { assets, facilityIcons } from "../assets/assets";
import { toast } from "react-hot-toast";

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: assets.dashboardIcon },
    { id: "rooms",     label: "My Rooms",  icon: assets.listIcon },
    { id: "addRoom",   label: "Add Room",  icon: assets.addIcon },
    { id: "bookings",  label: "Bookings",  icon: assets.totalBookingIcon },
  ];
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col pt-8 shrink-0">
      <div className="px-6 mb-8">
        <h1 className="font-playfair text-xl font-bold text-gray-800">Owner Panel</h1>
      </div>
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => setActive(tab.id)}
          className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
            active === tab.id
              ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}>
          <img src={tab.icon} alt={tab.label} className="h-5 w-5 opacity-70" />
          {tab.label}
        </button>
      ))}
    </aside>
  );
};

// ─── Dashboard Overview ───────────────────────────────────────────────────────
const DashboardOverview = ({ hotel, dashboardData, loading }) => {
  if (loading) return <p className="text-gray-400 mt-10">Loading dashboard...</p>;
  return (
    <div>
      <h2 className="font-playfair text-2xl font-bold mb-1">{hotel?.name || "Your Hotel"}</h2>
      <p className="text-gray-500 text-sm mb-6">{hotel?.city} · {hotel?.address}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-indigo-50 rounded-xl p-6 flex items-center gap-4">
          <img src={assets.totalBookingIcon} alt="" className="h-10 w-10" />
          <div>
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-800">{dashboardData?.totalBookings ?? 0}</p>
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-6 flex items-center gap-4">
          <img src={assets.totalRevenueIcon} alt="" className="h-10 w-10" />
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-800">₹{dashboardData?.totalRevenue ?? 0}</p>
          </div>
        </div>
      </div>
      <h3 className="font-semibold text-gray-700 mb-3">Recent Bookings</h3>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Guest</th><th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Check-In</th><th className="px-4 py-3">Check-Out</th>
              <th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(dashboardData?.bookings || []).slice(0, 5).map((b) => (
              <tr key={b._id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">{b.user?.userName || "Guest"}</td>
                <td className="px-4 py-3">{b.room?.roomType || "—"}</td>
                <td className="px-4 py-3">{new Date(b.checkInDate).toDateString()}</td>
                <td className="px-4 py-3">{new Date(b.checkOutDate).toDateString()}</td>
                <td className="px-4 py-3 font-medium">₹{b.totalPrice}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    b.status === "Confirmed" ? "bg-green-100 text-green-700"
                    : b.status === "Cancelled" ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"}`}>
                    {b.status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
            {!dashboardData?.bookings?.length && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No bookings yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── My Rooms ─────────────────────────────────────────────────────────────────
const MyRooms = ({ rooms, onToggle, loading }) => {
  if (loading) return <p className="text-gray-400 mt-10">Loading rooms...</p>;
  return (
    <div>
      <h2 className="font-playfair text-2xl font-bold mb-6">My Rooms</h2>
      {rooms.length === 0 ? (
        <p className="text-gray-400">No rooms yet. Use "Add Room" to get started.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Image</th><th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price/night</th><th className="px-4 py-3">Amenities</th>
                <th className="px-4 py-3">Available</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img src={room.images?.[0]} alt="room"
                      className="h-14 w-20 object-cover rounded-lg"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/80x56?text=No+Image"; }} />
                  </td>
                  <td className="px-4 py-3 font-medium">{room.roomType}</td>
                  <td className="px-4 py-3">₹{room.pricePerNight}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {room.amenities?.map((a) => (
                        <span key={a} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{a}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => onToggle(room._id)}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 ${room.isAvailable ? "bg-green-500" : "bg-gray-300"}`}>
                      <span className={`inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow transform transition-transform duration-200 ${room.isAvailable ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── Add Room ─────────────────────────────────────────────────────────────────
const AddRoom = ({ onRoomAdded }) => {
  const { axios, getToken } = useAppContext();
  const [form, setForm] = useState({ roomType: "Single Bed", pricePerNight: "", amenities: [] });
  const [images, setImages] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);

  const roomTypes = ["Single Bed", "Double Bed", "Family Room", "Luxury Room"];
  const amenityList = ["Free WiFi", "Free Breakfast", "Room Service", "Mountain View", "Pool Access"];

  const handleAmenity = (item) =>
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(item) ? p.amenities.filter((a) => a !== item) : [...p.amenities, item],
    }));

  const handleImageChange = (i, file) => {
    const updated = [...images];
    updated[i] = file;
    setImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validImages = images.filter(Boolean);
    if (validImages.length === 0) return toast.error("Please upload at least one image");
    if (form.amenities.length === 0) return toast.error("Select at least one amenity");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("roomType", form.roomType);
      formData.append("pricePerNight", form.pricePerNight);
      formData.append("amenities", JSON.stringify(form.amenities));
      validImages.forEach((img) => formData.append("images", img));
      const { data } = await axios.post("/api/room", formData, {
        headers: { Authorization: `Bearer ${await getToken()}`, "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success("Room added!");
        setForm({ roomType: "Single Bed", pricePerNight: "", amenities: [] });
        setImages([null, null, null, null]);
        onRoomAdded();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-playfair text-2xl font-bold mb-6">Add New Room</h2>
      <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-5">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Room Type</label>
          <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white">
            {roomTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Price Per Night (₹)</label>
          <input type="number" min={1} value={form.pricePerNight} required placeholder="e.g. 1500"
            onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenityList.map((item) => (
              <button key={item} type="button" onClick={() => handleAmenity(item)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition ${
                  form.amenities.includes(item)
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "text-gray-600 border-gray-300 hover:border-indigo-400"}`}>
                {facilityIcons[item] && (
                  <img src={facilityIcons[item]} alt="" className="h-4 w-4"
                    style={{ filter: form.amenities.includes(item) ? "brightness(0) invert(1)" : "none" }} />
                )}
                {item}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Room Images (up to 4)</label>
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <label key={i} className="cursor-pointer">
                <div className={`h-28 w-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition ${img ? "border-indigo-300" : "border-gray-300 hover:border-indigo-300"}`}>
                  {img ? (
                    <img src={URL.createObjectURL(img)} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 text-xs gap-1">
                      <img src={assets.uploadArea} alt="" className="h-8 opacity-40" />
                      Upload
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files[0] && handleImageChange(i, e.target.files[0])} />
              </label>
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60">
          {loading ? "Adding Room..." : "Add Room"}
        </button>
      </form>
    </div>
  );
};

// ─── All Bookings ─────────────────────────────────────────────────────────────
const AllBookings = ({ bookings, loading }) => {
  if (loading) return <p className="text-gray-400 mt-10">Loading bookings...</p>;
  return (
    <div>
      <h2 className="font-playfair text-2xl font-bold mb-6">All Bookings</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Guest</th><th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Check-In</th><th className="px-4 py-3">Check-Out</th>
              <th className="px-4 py-3">Guests</th><th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Paid</th><th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {b.user?.image && <img src={b.user.image} alt="" className="h-7 w-7 rounded-full object-cover" />}
                    <span>{b.user?.userName || "Guest"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{b.room?.roomType || "—"}</td>
                <td className="px-4 py-3">{new Date(b.checkInDate).toDateString()}</td>
                <td className="px-4 py-3">{new Date(b.checkOutDate).toDateString()}</td>
                <td className="px-4 py-3">{b.guests}</td>
                <td className="px-4 py-3 font-medium">₹{b.totalPrice}</td>
                <td className="px-4 py-3">
                  <span className={`h-2.5 w-2.5 rounded-full inline-block ${b.isPaid ? "bg-green-500" : "bg-red-400"}`} />
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    b.status === "Confirmed" ? "bg-green-100 text-green-700"
                    : b.status === "Cancelled" ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"}`}>
                    {b.status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
            {!bookings.length && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No bookings yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const OwnerDashboard = () => {
  const { axios, getToken, isOwner, navigate, user } = useAppContext();
  const [active, setActive] = useState("dashboard");
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  // FIX: track whether context has finished loading so we don't redirect prematurely
  const [contextReady, setContextReady] = useState(false);

  // Wait until user is resolved before deciding to redirect
  useEffect(() => {
    if (user !== undefined) setContextReady(true);
  }, [user]);

  // FIX: only redirect after context is ready AND user is loaded AND not an owner
  useEffect(() => {
    if (contextReady && !isOwner) navigate("/");
  }, [contextReady, isOwner]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [hotelRes, roomsRes, bookingsRes] = await Promise.all([
        axios.get("/api/hotel", { headers }),
        axios.get("/api/room/owner", { headers }),
        axios.get("/api/bookings/hotel", { headers }),
      ]);
      if (hotelRes.data.success) setHotel(hotelRes.data.hotel);
      if (roomsRes.data.success) setRooms(roomsRes.data.rooms);
      if (bookingsRes.data.success) setDashboardData(bookingsRes.data.dashboardData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner) fetchAll();
  }, [isOwner]);

  const handleToggle = async (roomId) => {
    try {
      const { data } = await axios.post(
        "/api/room/toggle-room-availability",
        { roomId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        setRooms((prev) => prev.map((r) => r._id === roomId ? { ...r, isAvailable: !r.isAvailable } : r));
        toast.success("Availability updated");
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!contextReady || (contextReady && !isOwner)) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1 p-8 overflow-auto">
        <button onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
          ← Back to Site
        </button>
        {active === "dashboard" && <DashboardOverview hotel={hotel} dashboardData={dashboardData} loading={loading} />}
        {active === "rooms" && <MyRooms rooms={rooms} onToggle={handleToggle} loading={loading} />}
        {active === "addRoom" && <AddRoom onRoomAdded={() => { fetchAll(); setActive("rooms"); }} />}
        {active === "bookings" && <AllBookings bookings={dashboardData?.bookings || []} loading={loading} />}
      </main>
    </div>
  );
};

export default OwnerDashboard;
