import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../appContext'
import { toast } from 'react-hot-toast'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const { axios, getToken, user } = useAppContext()

  useEffect(() => {
    if (!user) return
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('/api/bookings/user', {
          headers: { Authorization: `Bearer ${await getToken()}` }
        })
        if (data.success) {
          setBookings(data.bookings)
        } else {
          toast.error(data.message || 'Failed to load bookings')
        }
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [user])

  if (!user) return (
    <div className='py-32 text-center text-gray-500'>
      Please login to view your bookings.
    </div>
  )

  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks"
        align='left'
      />

      <div className='max-w-6xl mt-8 w-full text-gray-800'>
        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
          <div>Hotels</div>
          <div>Date & Timings</div>
          <div>Payment</div>
        </div>

        {loading ? (
          <p className='text-center py-12 text-gray-400'>Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <p className='text-center py-12 text-gray-400'>No bookings yet.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6'>
              <div className='flex flex-col md:flex-row'>
                <img
                  src={booking.room?.images?.[0]}
                  alt='hotel-img'
                  className='w-40 h-28 rounded shadow object-cover'
                />
                <div className='flex flex-col gap-1.5 max-md:mt-3 md:ml-4'>
                  <p className='font-playfair text-2xl'>
                    {booking.hotel?.name}
                    <span className='font-inter text-sm ml-2 text-gray-500'>({booking.room?.roomType})</span>
                  </p>
                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.locationIcon} alt='location' className='h-4' />
                    <span>{booking.hotel?.address}</span>
                  </div>
                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.guestsIcon} alt='guests' className='h-4' />
                    <span>Guests: {booking.guests}</span>
                  </div>
                  <p className='text-base font-medium'>Total: ₹{booking.totalPrice}</p>
                </div>
              </div>

              <div>
                <div className='flex flex-row md:flex-col md:gap-4 mt-3 gap-8'>
                  <div>
                    <p className='text-sm font-medium'>Check-In</p>
                    <p className='text-gray-500 text-sm'>{new Date(booking.checkInDate).toDateString()}</p>
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Check-Out</p>
                    <p className='text-gray-500 text-sm'>{new Date(booking.checkOutDate).toDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start justify-center pt-3">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></span>
                  <p className={`text-sm font-medium ${booking.isPaid ? "text-green-600" : "text-red-600"}`}>
                    {booking.isPaid ? "Paid" : "Not Paid"}
                  </p>
                </div>
                <p className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                  booking.status === 'Confirmed' ? 'bg-green-100 text-green-700'
                  : booking.status === 'Cancelled' ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
                }`}>{booking.status}</p>
                {!booking.isPaid && (
                  <button className="px-4 py-1.5 mt-3 text-xs font-medium border border-gray-300 text-gray-700 rounded-full shadow-sm hover:bg-gray-100 transition">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyBookings
