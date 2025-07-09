import React from 'react'

import ModernBanner from './components/Banner'
import HomePage from './components/HomePage'

const page = () => {
  return (
    <div>
      <div className='mt-20'>
        <ModernBanner/>
        </div>
  <HomePage/>
      </div>
  )
}

export default page