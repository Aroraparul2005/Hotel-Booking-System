import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    // Build query params and navigate to rooms page with filters
    const params = new URLSearchParams();
    if (destination) params.set("city", destination);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    navigate(`/rooms?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url("/heroImage.png")` }}
    >
      <p className="bg-[#49B9FF]/70 text-white text-sm md:text-base font-medium px-4 py-1.5 rounded-full inline-block mt-12 shadow-md">
        The Ultimate Hotel Experience
      </p>
      <h1 className="font-playfair text-3xl md:text-6xl leading-snug md:leading-[64px] font-extrabold mt-6">
        Discover Your Perfect<br />Gateway Destinations
      </h1>
      <p className="max-w-lg mt-4 text-gray-200 text-base md:text-lg leading-relaxed">
        In Sikkim, every journey is a lesson in beauty, and every corner holds a story waiting to be told.
      </p>

      {/* Search Form — now wired up */}
      <form
        onSubmit={handleSearch}
        className="bg-white text-gray-500 rounded-xl mt-11 px-6 py-4 flex flex-col md:flex-row gap-4 max-md:mx-auto shadow-xl"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src={assets.locationIcon} alt="" className="h-4 opacity-70" />
            <label className="text-xs font-medium text-gray-600">Destination</label>
          </div>
          <input
            list="destinations"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 text-sm outline-none w-36 focus:border-indigo-400"
            placeholder="Any city"
          />
          <datalist id="destinations">
            {cities.map((city, i) => <option value={city} key={i} />)}
          </datalist>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src={assets.calenderIcon} alt="" className="h-4 opacity-70" />
            <label className="text-xs font-medium text-gray-600">Check In</label>
          </div>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value > checkOut) setCheckOut(""); }}
            className="rounded border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src={assets.calenderIcon} alt="" className="h-4 opacity-70" />
            <label className="text-xs font-medium text-gray-600">Check Out</label>
          </div>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <img src={assets.guestsIcon} alt="" className="h-4 opacity-70" />
            <label className="text-xs font-medium text-gray-600">Guests</label>
          </div>
          <input
            type="number"
            min={1}
            max={10}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 text-sm outline-none w-16 focus:border-indigo-400"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition py-2.5 px-5 text-white font-medium my-auto max-md:w-full"
        >
          <img src={assets.searchIcon} alt="" className="h-5 brightness-0 invert" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;
