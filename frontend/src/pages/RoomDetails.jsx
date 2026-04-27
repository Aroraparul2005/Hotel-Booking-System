import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets'
import { useAppContext } from '../appContext'
import { toast } from 'react-hot-toast'

const RoomDetails = () => {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [mainImg, setMainImg] = useState(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [isAvailable, setIsAvailable] = useState(null)
  const [loading, setLoading] = useState(true)

  const { axios, getToken, user } = useAppContext()

  // Fetch room from backend
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get('/api/room')
        if (data.success) {
          const found = data.rooms.find(r => r._id === id)
          if (found) {
            setRoom(found)
            setMainImg(found.images[0])
          } else {
            toast.error('Room not found')
          }
        }
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRoom()
  }, [id])

  const handleCheckAvailability = async (e) => {
    e.preventDefault()
    if (!checkIn || !checkOut) return toast.error('Please select dates')
    if (new Date(checkIn) >= new Date(checkOut)) return toast.error('Check-out must be after check-in')
    try {
      const { data } = await axios.post('/api/bookings/check-availability', {
        room: id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      })
      if (data.success) {
        setIsAvailable(data.isAvailable)
        if (data.isAvailable) toast.success('Room is available!')
        else toast.error('Not available for selected dates')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleBooking = async () => {
    if (!user) return toast.error('Please login to book')
    if (!isAvailable) return toast.error('Check availability first')
    try {
      const { data } = await axios.post(
        '/api/bookings/book',
        { room: id, checkInDate: checkIn, checkOutDate: checkOut, guests },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )
      if (data.success) {
        toast.success('Booking confirmed!')
        setIsAvailable(null)
        setCheckIn('')
        setCheckOut('')
        setGuests(1)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (loading) return <p className="text-center py-32 text-gray-400">Loading room details...</p>
  if (!room) return <p className="text-center py-32 text-gray-500">Room not found.</p>

  return (
    <div className="py-28 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="font-playfair text-3xl font-bold">{room.hotel?.name}</h1>
        <span className="text-gray-500 text-lg">&mdash; {room.roomType}</span>
        <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">20% off</span>
      </div>
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
        <img src={assets.locationIcon} alt='location-icon' className="h-4" />
        <p>{room.hotel?.address}, {room.hotel?.city}, Sikkim</p>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <img src={mainImg} alt='main-image' className="w-full h-80 object-cover rounded-xl shadow" />
        <div className="grid grid-cols-2 gap-2">
          {room.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt='room-image'
              onClick={() => setMainImg(image)}
              className={`w-full h-36 object-cover rounded-lg cursor-pointer border-2 transition ${mainImg === image ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Details */}
        <div className="lg:col-span-2">
          <h2 className="font-playfair text-2xl font-bold mb-4">Explore Luxury like never before</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {room.amenities?.map((item, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg">
                <img src={facilityIcons[item]} alt={`${item}-icon`} className="h-5 w-5" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-2xl font-semibold text-gray-800 mb-6">
            ₹{room.pricePerNight} <span className="text-base font-normal text-gray-500">/ night</span>
          </p>

          {roomCommonData?.map((spec, index) => (
            <div key={index} className="flex items-start gap-3 mb-4">
              <img src={spec.icon} alt={`${spec.title}-icon`} className="h-6 w-6 mt-1" />
              <div>
                <p className="font-medium">{spec.title}</p>
                <p className="text-gray-500 text-sm">{spec.description}</p>
              </div>
            </div>
          ))}

          <p className="mt-4 text-gray-600 leading-relaxed">
            Step into comfort and elegance with our {room.roomType}, designed for travelers who value both relaxation and style. The room offers a panoramic mountain view, blending modern amenities with a cozy ambiance.
          </p>

          {room.hotel?.owner && (
            <div className="flex items-center gap-4 mt-8 border-t pt-6">
              <img src={room.hotel.owner.image} alt="host" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <p className="font-semibold">Hosted by {room.hotel.owner.userName || 'Hotel Owner'}</p>
                <p className="text-gray-500 text-sm">200+ Ratings</p>
              </div>
              <button className="ml-auto px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition">
                Contact Now
              </button>
            </div>
          )}
        </div>

        {/* Right: Booking Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit sticky top-24">
          <h3 className="font-playfair text-xl font-bold mb-4">Book This Room</h3>
          <form onSubmit={handleCheckAvailability} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block" htmlFor="checkIn">Check In</label>
              <input
                type='date'
                id='checkIn'
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => { setCheckIn(e.target.value); setIsAvailable(null) }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block" htmlFor="checkOut">Check Out</label>
              <input
                type='date'
                id='checkOut'
                value={checkOut}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => { setCheckOut(e.target.value); setIsAvailable(null) }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block" htmlFor="guests">Guests</label>
              <input
                type='number'
                id='guests'
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min={1}
                max={10}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
                required
              />
            </div>
            <button type='submit' className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition">
              Check Availability
            </button>
          </form>

          {isAvailable === true && (
            <button
              onClick={handleBooking}
              className="w-full mt-3 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Book Now
            </button>
          )}
          {isAvailable === false && (
            <p className="mt-3 text-center text-red-500 text-sm font-medium">Not available for selected dates</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RoomDetails
