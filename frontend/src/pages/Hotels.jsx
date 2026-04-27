import React from 'react'
// FIX: was importing 'hero' (lowercase) but file is Hero.jsx (uppercase H) - case sensitive
import Hero from '../components/Hero'
import Myrooms from './Myrooms'

const Hotels = () => {
  return (
    <div>
      <Hero />
      <Myrooms />
    </div>
  )
}

export default Hotels
