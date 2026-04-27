import React from 'react'

function Homehero() {
  return (
    <div
      className="relative flex flex-col items-start justify-center 
           px-6 md:px-16 lg:px-24 xl:px-32 
           text-white h-screen 
           bg-no-repeat bg-cover bg-center"
      // FIX: was using /src/assets/... path which doesn't work in production builds
      // Use the public folder image or import it properly
      style={{ backgroundImage: `url('/heroImage.png')` }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <p className="relative z-10 bg-[#49B9FF]/70 text-white text-sm md:text-base font-medium px-4 py-1.5 rounded-full inline-block mt-12 shadow-md">
        Let's Explore Buddhism in Sikkim
      </p>
      <h1 className="relative z-10 font-playfair text-4xl md:text-6xl leading-snug md:leading-[64px] font-extrabold mt-6">
        Monasteries
      </h1>
      <p className="relative z-10 max-w-lg mt-2 text-gray-200 text-base md:text-lg leading-relaxed">
        In Sikkim, every journey is a lesson in beauty, and every corner holds a story waiting to be told.
      </p>
    </div>
  )
}

export default Homehero
