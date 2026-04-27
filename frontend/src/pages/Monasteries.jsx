import React, { useState } from "react";
import MonasteryBg from "../assets/Monasterybg.jpg";
import bigData from "../assets/monasteries_with_images.json";

const DISTRICTS = ["All", "East Sikkim", "West Sikkim", "North Sikkim", "South Sikkim"];

const MonasteryCard = ({ m }) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
    <div className="relative h-48 overflow-hidden">
      <img
        src={m.Image_URLs}
        alt={m.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=400&h=300&fit=crop";
        }}
      />
      <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">
        {m.district}
      </span>
    </div>
    <div className="p-4">
      <h3 className="font-playfair text-lg font-semibold text-gray-800 leading-tight">{m.name}</h3>
      {m.established && (
        <p className="text-xs text-indigo-500 mt-1">Est. {m.established}</p>
      )}
      <p className="text-gray-500 text-sm mt-2 line-clamp-3">{m.description}</p>
      <div className="mt-3 flex flex-col gap-1 text-xs text-gray-400">
        {m.opening && (
          <div className="flex items-start gap-1">
            <span className="text-gray-500">🕐</span>
            <span>{m.opening}</span>
          </div>
        )}
        {m.transport && (
          <div className="flex items-start gap-1">
            <span className="text-gray-500">🚌</span>
            <span className="line-clamp-2">{m.transport}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const Monasteries = () => {
  const [activeDistrict, setActiveDistrict] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = bigData.filter((m) => {
    const matchDistrict = activeDistrict === "All" || m.district === activeDistrict;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchDistrict && matchSearch;
  });

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="relative flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white h-[60vh] bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${MonasteryBg})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <p className="bg-indigo-500/70 text-white text-sm px-4 py-1.5 rounded-full inline-block mb-4">
            Buddhism in Sikkim
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold leading-tight">
            Sacred Monasteries
          </h1>
          <p className="text-gray-200 max-w-xl mt-3 text-base leading-relaxed">
            Explore over 100 monasteries across the four districts of Sikkim — each a living chapter of Buddhist history.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-white shadow-sm px-4 md:px-16 lg:px-24 xl:px-32 py-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* District tabs */}
        <div className="flex flex-wrap gap-2">
          {DISTRICTS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDistrict(d)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeDistrict === d
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        {/* Search */}
        <input
          type="text"
          placeholder="Search monastery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 w-full md:w-64"
        />
      </div>

      {/* Grid */}
      <div className="px-4 md:px-16 lg:px-24 xl:px-32 py-10">
        <p className="text-sm text-gray-400 mb-6">
          Showing {filtered.length} {activeDistrict !== "All" ? `in ${activeDistrict}` : "monasteries"}
        </p>
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No monasteries found. Try a different search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((m) => (
              <MonasteryCard key={m.id} m={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Monasteries;
