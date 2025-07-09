// scripts/createCategories.js
// Run this script to create all category documents first

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'azf40qso', // Replace with your actual project ID
  dataset: 'production',
  token: 'skvY73gHS2gRn59IFyAd6LwKwy1NKRn0Phfq4Sk2MIVDyq15fGMX32AkvowkF0gJrLFYFHgsca5eoUivdbYgfM8xiow5DbEafqjbyAUHdZx0aMCBrGvdh8jSIEEjrL36l0PIUKLs48rOAc5UTGalPw9lneicZLcDYztyOQaeLr3RZdEYm9nf', // Replace with your token
  useCdn: false,
  apiVersion: '2025-05-03'
})

const categories = [
  {
    _id: 'summer-category',
    _type: 'category',
    slug: {
      _type: 'slug',
      current: 'summer-category'
    }
  },
  {
    _id: 'men-category',
    _type: 'category',
    slug: {
      _type: 'slug',
      current: 'men-category'
    }
  },
  {
    _id: 'women-category',
    _type: 'category',
    slug: {
      _type: 'slug',
      current: 'women-category'
    }
  },
  {
    _id: 'office-category',
    _type: 'category',
    slug: {
      _type: 'slug',
      current: 'office-category'
    }
  },
  {
    _id: 'oudh-category',
    _type: 'category',
    slug: {
      _type: 'slug',
      current: 'oudh-category'
    }
  },
  {
    _id: 'gift-pack-category',
    _type: 'category',
    slug: {
      _type: 'slug',
      current: 'gift-pack-category'
    }
  },
  {
    _id: 'attar-category',
    _type: 'category',
    slug: {
      _type: 'slug',
      current: 'attar-category'
    }
  },
  {
    _id: 'bakhoor-category',
    _type: 'category',
    slug: {
      _type: 'slug',
      current: 'bakhoor-category'
    }
  },
  {
    _id: 'candles-category',
    _type: 'category',
    slug: {
      _type: 'slug',
      current: 'candles-category'
    }
  }
]

async function createCategories() {
  try {
    const transaction = client.transaction()
    
    categories.forEach(category => {
      transaction.createOrReplace(category)
    })
    
    const result = await transaction.commit()
    console.log('Categories created successfully:', result)
  } catch (error) {
    console.error('Error creating categories:', error)
  }
}

createCategories()