import React from 'react'
import TreasureBackground from '../app/components/Banner'

import { MarqueeDemo } from './components/Marquee';
import Masonry, { MasonryItemData } from "./components/Masonry";
import Footer from "./components/footer"
import MensCollection from './components/Bag-Collection';
import PerfumeCollection from './components/Perfume-Collection';
import FootwearCollection from './components/Footwear-Collection';
const page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Treasure Background - Edge to edge */}
      <div className="w-full mt-20">
        <TreasureBackground />
      </div>

      {/* HomePage Content - Separated and contained */}
      <div>
        <div>
          <MensCollection />
        </div>
        <div>
          <PerfumeCollection />
        </div>
        <div>
          <FootwearCollection />
        </div>
        <div>
        <Masonry />
        </div>
        <div className='mt-20'>
          <MarqueeDemo/>
        </div>
        <div className='mt-20'>
          <Footer/>
        </div>
      </div>
    </div>
  )
}

export default page