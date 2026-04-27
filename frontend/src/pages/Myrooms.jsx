import React, { useState, useEffect } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../appContext";
import { toast } from "react-hot-toast";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
    <span className="font-light select-none">{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input type="radio" name="sort" checked={selected} onChange={() => onChange(label)} />
    <span className="font-light select-none">{label}</span>
  </label>
);

function Myrooms() {
  const navigate = useNavigate();
  const { axios } = useAppContext();
  // Read query params set by the Hero search form
  const [searchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRanges, setSelectedRanges] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  // City filter pre-filled from search
  const [cityFilter, setCityFilter] = useState(searchParams.get("city") || "");

  const roomTypes = ["Single Bed", "Family Room", "Double Bed", "Luxury Room"];
  const priceRanges = ["0 to 500", "500 to 1000", "1000 to 2000", "2000 to 3000"];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get("/api/room");
        if (data.success) setRooms(data.rooms);
        else toast.error("Failed to load rooms");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // When URL search params change (e.g. from hero search), update city filter
  useEffect(() => {
    const city = searchParams.get("city");
    if (city) setCityFilter(city);
  }, [searchParams]);

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSelectedRanges([]);
    setSortOrder("");
    setCityFilter("");
  };

  const filteredRooms = rooms
    .filter((room) => !cityFilter || room.hotel?.city?.toLowerCase() === cityFilter.toLowerCase())
    .filter((room) => selectedTypes.length === 0 || selectedTypes.includes(room.roomType))
    .filter((room) => {
      if (selectedRanges.length === 0) return true;
      return selectedRanges.some((range) => {
        const [min, max] = range.split(" to ").map(Number);
        return room.pricePerNight >= min && room.pricePerNight <= max;
      });
    })
    .sort((a, b) => {
      if (sortOrder === "Low to High") return a.pricePerNight - b.pricePerNight;
      if (sortOrder === "High to Low") return b.pricePerNight - a.pricePerNight;
      return 0;
    });

  return (
    <div className="flex flex-col lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-col items-start text-left w-full lg:flex-1">
        <h1 className="font-playfair text-4xl md:text-[40px]">
          Our Hotel Rooms
          {cityFilter && <span className="text-indigo-600 ml-2 text-2xl">in {cityFilter}</span>}
        </h1>
        <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-xl">
          Take advantage of our limited time offers and special packages to enhance your stay and create unforgettable memories.
        </p>

        {loading ? (
          <div className="mt-16 text-gray-400">Loading rooms...</div>
        ) : filteredRooms.length === 0 ? (
          <div className="mt-16 text-gray-400">
            No rooms found{cityFilter ? ` in ${cityFilter}` : ""}. Try clearing filters.
          </div>
        ) : (
          <div className="w-full">
            {filteredRooms.map((room) => (
              <div
                key={room._id}
                className="flex flex-col md:flex-row py-10 px-6 border-b border-gray-200 last:border-0"
              >
                <img
                  onClick={() => navigate(`/rooms/${room._id}`)}
                  src={room.images?.[0]}
                  alt="room"
                  className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer hover:scale-[1.01] transition"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x260?text=No+Image"; }}
                />
                <div className="md:w-1/2 flex flex-col md:pl-6 mt-4 md:mt-0">
                  <p className="text-gray-500 text-sm">{room.hotel?.city}, Sikkim</p>
                  <p
                    onClick={() => navigate(`/rooms/${room._id}`)}
                    className="text-gray-800 text-3xl font-playfair cursor-pointer hover:text-indigo-600 transition mt-1"
                  >
                    {room.hotel?.name}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{room.roomType}</p>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <img src={assets.locationIcon} alt="" className="h-4" />
                    <p className="text-gray-500">{room.hotel?.address}</p>
                  </div>
                  <div className="flex flex-wrap mt-4 mb-5 gap-2">
                    {room.amenities?.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50/70">
                        <img
                          src={facilityIcons[item]}
                          alt={item}
                          className="h-5 w-5"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                        <p className="text-xs text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xl font-semibold text-gray-700">
                    ₹{room.pricePerNight}
                    <span className="text-sm font-normal text-gray-400"> /night</span>
                  </p>
                  <button
                    onClick={() => navigate(`/rooms/${room._id}`)}
                    className="mt-4 self-start px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <div className="bg-white w-80 border border-gray-200 rounded-xl max-lg:mb-8 lg:ml-8 lg:mt-16 shrink-0 shadow-sm">
        <div className={`flex items-center justify-between px-5 py-3 border-gray-200 ${isOpen ? "border-b" : "lg:border-b"}`}>
          <p className="font-medium text-gray-700">FILTERS</p>
          <div className="flex gap-3">
            <span
              className="lg:hidden cursor-pointer text-indigo-600 text-sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "Hide" : "Show"}
            </span>
            <span
              className="cursor-pointer text-indigo-600 text-sm"
              onClick={handleClearFilters}
            >
              Clear
            </span>
          </div>
        </div>

        <div className={`${isOpen ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-300`}>
          {cityFilter && (
            <div className="px-5 pt-4">
              <p className="font-medium text-gray-700 pb-1 text-sm">City</p>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">{cityFilter}</span>
                <button onClick={() => setCityFilter("")} className="text-gray-400 hover:text-gray-700 text-xs">✕</button>
              </div>
            </div>
          )}
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-700 pb-2 text-sm">Room Type</p>
            {roomTypes.map((room, i) => (
              <CheckBox
                key={i}
                label={room}
                selected={selectedTypes.includes(room)}
                onChange={(checked, label) =>
                  setSelectedTypes((prev) => checked ? [...prev, label] : prev.filter((t) => t !== label))
                }
              />
            ))}
          </div>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-700 pb-2 text-sm">Price Range (₹)</p>
            {priceRanges.map((range, i) => (
              <CheckBox
                key={i}
                label={range}
                selected={selectedRanges.includes(range)}
                onChange={(checked, label) =>
                  setSelectedRanges((prev) => checked ? [...prev, label] : prev.filter((r) => r !== label))
                }
              />
            ))}
          </div>
          <div className="px-5 pt-5 pb-6">
            <p className="font-medium text-gray-700 pb-2 text-sm">Sort by Price</p>
            {["Low to High", "High to Low"].map((label, i) => (
              <RadioButton key={i} label={label} selected={sortOrder === label} onChange={setSortOrder} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Myrooms;
