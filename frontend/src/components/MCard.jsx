import React from 'react'
import { assets } from "../assets/assets"

const MCard = ({ monastery }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
      <img
        src={monastery.Image_URLs}
        alt={monastery.name}
        className="h-48 w-full object-cover"
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=400&h=300&fit=crop";
        }}
      />
      <div className="p-4 flex flex-col">
        <h1 className="text-lg font-semibold text-gray-800">{monastery.name}</h1>
        <div className="flex items-center mt-2 text-gray-600 text-sm">
          <img src={assets.locationIcon} alt="location-icon" className="h-4 w-4 mr-2" />
          <p>{monastery.district}, Sikkim, India</p>
        </div>
        <div className="flex items-center mt-2 text-gray-600 text-sm">
          <img src={assets.calenderIcon} alt="calendar-icon" className="h-4 w-4 mr-2" />
          <p>Est. {monastery.established}</p>
        </div>
      </div>
    </div>
  )
}

export default MCard
