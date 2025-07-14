import React from 'react'
import SplineBackground from './components/Background'
import ModernBanner from './components/Banner'
import HomePage from './components/HomePage'

const page = () => {
  return (
    <div>
      <div className='mt-34'>
        <SplineBackground/>
        </div>
  <HomePage/>
      </div>
  )
}

export default page