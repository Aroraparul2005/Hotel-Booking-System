import React, { useEffect, useState } from 'react'
import Homehero from '../components/Homehero'
import bigData from "../assets/monasteries_with_images.json"
import Title from "../components/Title"
import MCard from "../components/MCard"
import { useNavigate } from 'react-router-dom'
import { assets, facilityIcons } from '../assets/assets'
import StarIconFile from "../components/StarIconFile"
import { useAppContext } from '../appContext'
import { toast } from 'react-hot-toast'

const Home = () => {
  const navigate = useNavigate()
  const { axios } = useAppContext()
  const [rooms, setRooms] = useState([])

  const northgroup = bigData.filter((item) => item.district === "North Sikkim")[0]
  const eastgroup = bigData.filter((item) => item.district === "East Sikkim")[0]
  const west = bigData.filter((item) => item.district === "West Sikkim")[0]
  const southgroup = bigData.filter((item) => item.district === "South Sikkim")[0]

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get('/api/room')
        if (data.success) {
          // Show only first 4 rooms on homepage
          setRooms(data.rooms.slice(0, 4))
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    fetchRooms()
  }, [])

  return (
    <div>
      <Homehero />
      <div className='m-12'>
        <Title title="Most Visited Monasteries" subTitle="Among the chants of Buddhist monks and the calm of monasteries, the soul learns the art of serenity." align="center" />
        <div className="mt-10 px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {northgroup && <MCard monastery={northgroup} />}
            {eastgroup && <MCard monastery={eastgroup} />}
            {southgroup && <MCard monastery={southgroup} />}
            {west && <MCard monastery={west} />}
          </div>
          <div className="mt-10 flex justify-center">
            <button
              className="px-4 py-2 cursor-pointer bg-indigo-600 font-playfair text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition"
              onClick={() => navigate("/monastery")}
            >
              Explore
            </button>
          </div>
        </div>
      </div>

      <div className='m-12'>
        <Title title="Our Hotel Rooms" subTitle="Stay in comfort, explore with ease - your perfect getaway awaits!." align="center" />
        <div className="mt-10 px-6 md:px-12">
          {rooms.length === 0 ? (
            <p className='text-center text-gray-400'>Loading rooms...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  onClick={() => navigate(`/rooms/${room._id}`)}
                  className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer'
                >
                  <img src={room.images[0]} alt="room-image" className="h-48 w-full object-cover" />
                  <div className="p-4 flex flex-col">
                    <h1 className="text-lg font-semibold text-gray-800">{room.hotel?.name}</h1>
                    <div className="flex items-center mt-2 text-gray-600 text-sm">
                      <img src={assets.locationIcon} alt="location-icon" className="h-4 w-4 mr-2" />
                      <p>{room.hotel?.city}, Sikkim, India</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
                      <StarIconFile rating={4} />
                      <p>200+ Reviews</p>
                    </div>
                    <p className='mt-2 font-semibold text-gray-700'>₹{room.pricePerNight}<span className='text-sm font-normal'>/night</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-10 flex justify-center">
            <button
              className="px-4 py-2 cursor-pointer bg-indigo-600 font-playfair text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition"
              onClick={() => navigate("/rooms")}
            >
              Explore All Rooms
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
