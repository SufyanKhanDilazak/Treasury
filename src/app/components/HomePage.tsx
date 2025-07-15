'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useCallback, memo, useMemo } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getHomepageProducts } from '../../sanity/lib/actions'
import type { GroupedProducts, Product } from '@/sanity/lib/data'
import WhatsAppFloatingIcon from './WhatsaAppFloatingIcon' // Add this line

// Category configuration with predefined banners
const CATEGORY_CONFIG = {
  'summer': {
    title: 'SUMMER',
    description: 'Fresh and vibrant scents for the sunny season',
    textColor: 'text-white',
    route: '/categories/summer'
  },
  'men': {
    title: 'MEN',
    description: 'Bold and sophisticated fragrances for modern men',
    textColor: 'text-white',
    route: '/categories/men'
  },
  'women': {
    title: 'WOMEN',
    description: 'Elegant and captivating scents for every woman',
    textColor: 'text-white',
    route: '/categories/women'
  },
  'office': {
    title: 'OFFICE',
    description: 'Professional and refined fragrances for work',
    textColor: 'text-white',
    route: '/categories/office'
  },
  'oudh': {
    title: 'OUDH',
    description: 'Rich and luxurious traditional Middle Eastern scents',
    textColor: 'text-white',
    route: '/categories/oudh'
  },
  'gift_pack': {
    title: 'GIFT PACK',
    description: 'Beautifully curated sets perfect for gifting',
    textColor: 'text-white',
    route: '/categories/gift-pack'
  },
  'attar': {
    title: 'ATTAR',
    description: 'Pure and concentrated oil-based fragrances',
    textColor: 'text-white',
    route: '/categories/attar'
  },
  'bakhoor_candles': {
    title: 'BAKHOOR & CANDLES',
    description: 'Aromatic incense and scented candles',
    textColor: 'text-white',
    route: '/categories/bakhoor-candles'
  }
} as const

type CategoryKey = keyof typeof CATEGORY_CONFIG
type CategoryConfig = typeof CATEGORY_CONFIG[CategoryKey]

// Animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.96
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 20,
      duration: 0.4
    }
  }
}

const bannerVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -50,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 25,
      duration: 0.6
    }
  }
}

// Product Card Component
interface ProductCardProps {
  product: Product
  index: number
  isMobile?: boolean
}

const ProductCard = memo<ProductCardProps>(({ product, index, isMobile = false }) => {
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
  }, [])

  const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price
  const originalPrice = product.onSale && product.salePrice ? product.price : null
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0

  const cardClasses = useMemo(() => 
    `group ${isMobile ? 'w-[130px] flex-shrink-0  ' : ''}`
  , [isMobile])

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -6,
        transition: { type: "spring" as const, stiffness: 400, damping: 25 }
      }}
      className={cardClasses}
    >
      <Link href={`/product/${product._id}`} className="block">
        <motion.div 
          className="relative w-full aspect-[8/10] overflow-hidden bg-black border-[0.5px] border-[#A64D9D] rounded-xl shadow-lg"
          whileHover={{ 
            borderColor: "#D946EF",
            boxShadow: "0 8px 25px rgba(166, 77, 157, 0.3)"
          }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence>
            {imageLoading && (
              <motion.div 
                className="absolute inset-0 bg-gray-800 rounded-xl"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-xl"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {product.images && product.images.length > 0 ? (
            <motion.div
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: imageLoading ? 0 : 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl overflow-hidden"
            >
              <Image
                src={product.images[0] || '/api/placeholder/300/300'}
                alt={product.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105 rounded-xl"
                sizes="(max-width: 640px) 200px, (max-width: 768px) 250px, (max-width: 1024px) 280px, 260px"
                quality={85}
                onLoad={handleImageLoad}
                priority={index < 6}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-light bg-black rounded-xl">
              No Image Available
            </div>
          )}

          {/* Badges */}
          <motion.div 
            className="absolute top-3 left-3 flex flex-col gap-1.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {product.newArrival && (
              <motion.span 
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2.5 py-1 text-xs font-semibold rounded-lg shadow-lg border-[0.5px] border-green-400"
                whileHover={{ scale: 1.05 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" as const, stiffness: 200 }}
              >
                NEW
              </motion.span>
            )}
            {product.onSale && (
              <motion.span 
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2.5 py-1 text-xs font-semibold rounded-lg shadow-lg border-[0.5px] border-red-400"
                whileHover={{ scale: 1.05 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" as const, stiffness: 200 }}
              >
                -{discountPercentage}%
              </motion.span>
            )}
          </motion.div>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
            initial={false}
          />
        </motion.div>

        {/* Product info */}
        <motion.div 
          className="mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <motion.div 
            className="border-[0.5px] border-[#A64D9D] bg-black px-3 py-2.5 text-center transition-all duration-300 shadow-lg rounded-lg"
            whileHover={{ 
              borderColor: "#D946EF",
              boxShadow: "0 4px 12px rgba(166, 77, 157, 0.2)"
            }}
          >
            <motion.h4 
              className="text-sm text-white font-medium mb-1.5 line-clamp-1"
              whileHover={{ color: "#D946EF" }}
              transition={{ duration: 0.2 }}
            >
              {product.name}
            </motion.h4>
            
            <motion.div 
  className="flex items-center justify-center space-x-2"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.2 }}
>
  <motion.span 
    className="text-base font-semibold text-[#A64D9D]"
    whileHover={{ scale: 1.03, color: "#D946EF" }}
  >
    PKR {displayPrice.toFixed(2)}
  </motion.span>
  {originalPrice && (
    <motion.span 
      className="text-sm text-gray-400 line-through"
      initial={{ opacity: 0, x: 5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      PKR {originalPrice.toFixed(2)}
    </motion.span>
  )}
</motion.div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  )
})

ProductCard.displayName = 'ProductCard'

// Product Skeleton Component
const ProductSkeleton = memo<{ isMobile?: boolean }>(({ isMobile = false }) => {
  const skeletonClasses = useMemo(() => 
    `group ${isMobile ? 'w-[130px] flex-shrink-0' : ''}`
  , [isMobile])

  return (
    <motion.div 
      className={skeletonClasses}
      variants={cardVariants}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-800 border-[0.5px] border-gray-600 rounded-xl">
        <motion.div 
          className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-xl"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      </div>
      
      <div className="mt-3">
        <div className="border-[0.5px] border-gray-600 bg-black px-3 py-2.5 text-center rounded-lg">
          <motion.div 
            className="h-3 bg-gray-700 mb-1.5 rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <motion.div 
            className="h-3 bg-gray-700 w-12 mx-auto rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  )
})

ProductSkeleton.displayName = 'ProductSkeleton'

// Mobile Carousel Component with debugging
const MobileCarousel = memo<{ products: Product[]; categoryKey: string }>(({ products, categoryKey }) => {
  const displayProducts = useMemo(() => products.slice(0, 8), [products])
  
  return (
    <div className="w-full px-4 relative">
      <Carousel
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: false,
          containScroll: "trimSnaps",
        }}
        className="w-full max-w-full"
      >
        <CarouselContent className="flex gap-0 ml-0">
          {displayProducts.length > 0 ? (
            displayProducts.map((product, index) => (
              <CarouselItem key={product._id} className="basis-[156px] flex-shrink-0 min-w-0 snap-start">
                <ProductCard product={product} index={index} isMobile={true} />
              </CarouselItem>
            ))
          ) : (
            Array.from({ length: 4 }, (_, i) => (
              <CarouselItem key={`skeleton-${categoryKey}-${i}`} className="basis-[200px] flex-shrink-0 min-w-0 snap-start">
                <ProductSkeleton isMobile={true} />
              </CarouselItem>
            ))
          )}
        </CarouselContent>
                
        {/* Force buttons to be visible and centered higher */}
        <CarouselPrevious 
          className="absolute left-2 top-[40%] -translate-y-1/2 border-[#A64D9D] bg-black text-white hover:bg-[#A64D9D] hover:border-[#D946EF] z-10 w-8 h-8"
        />
        <CarouselNext 
          className="absolute right-2 top-[40%] -translate-y-1/2 border-[#A64D9D] bg-black text-white hover:bg-[#A64D9D] hover:border-[#D946EF] z-10 w-8 h-8"
        />
      </Carousel>
    </div>
  )
})
MobileCarousel.displayName = 'MobileCarousel'

// Category Banner Component
function CategoryBanner({ categoryKey, config, products }: { 
  categoryKey: CategoryKey; 
  config: CategoryConfig; 
  products: Product[] 
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const displayProducts = useMemo(() => products.slice(0, 4), [products])

  return (
    <motion.section 
      className="mb-12 w-full"
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Modern Banner */}
      <motion.div 
        className="w-full mb-6"
        whileHover={{ scale: 1.001 }}
        transition={{ type: "spring" as const, stiffness: 400, damping: 40 }}
      >
        <motion.div 
          className="relative h-28 md:h-40 overflow-hidden border-[0.5px] border-[#A64D9D] shadow-xl rounded-xl backdrop-blur-sm bg-black"
          whileHover={{ 
            borderColor: "#D946EF",
            boxShadow: "0 12px 35px rgba(166, 77, 157, 0.3)"
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl"
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
          >
            <motion.h2 
              className={`text-lg md:text-xl lg:text-2xl font-bold ${config.textColor} tracking-wide drop-shadow-sm mb-1`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {config.title}
            </motion.h2>
            
            <motion.p 
              className={`text-xs md:text-sm ${config.textColor} opacity-80 font-light mb-2 max-w-md`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {config.description}
            </motion.p>
            
            <Link href={config.route}>
              <motion.button
                className="bg-black bg-opacity-70 hover:bg-[#A64D9D] text-white px-4 py-1.5 text-xs font-medium border-[0.5px] border-[#A64D9D] hover:border-[#D946EF] transition-all duration-300 rounded-lg"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Collection
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Products Display */}
      <div className="w-full">
        {isMobile ? (
          <MobileCarousel products={products} categoryKey={categoryKey} />
        ) : (
          <motion.div 
            className="border-[0.5px] border-[#A64D9D] bg-black p-4 md:p-6 shadow-xl rounded-xl"
            whileHover={{ 
              borderColor: "#D946EF",
              boxShadow: "0 15px 40px rgba(166, 77, 157, 0.2)"
            }}
            transition={{ duration: 0.3 }}
          >
            {products.length > 0 ? (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {displayProducts.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {Array.from({ length: 4 }, (_, i) => (
                  <ProductSkeleton key={`skeleton-${categoryKey}-${i}`} />
                ))}
              </motion.div>
            )}
            
            {products.length === 0 && (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div 
                  className="bg-gray-900/80 border-[0.5px] border-gray-600 p-6 md:p-8 rounded-lg"
                  whileHover={{ 
                    borderColor: "#A64D9D",
                    backgroundColor: "rgba(166, 77, 157, 0.1)"
                  }}
                >
                  <motion.p 
                    className="text-gray-300 text-base md:text-lg mb-2 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    No products available
                  </motion.p>
                  <motion.p 
                    className="text-gray-400 text-sm font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Check back soon for new arrivals in {config.title}
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

// Main HomePage Component
export default function HomePage() {
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({})
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setError(null)
      const data = await getHomepageProducts()
      setGroupedProducts(data)
    } catch (error) {
      console.error('Error fetching homepage products:', error)
      setError('Failed to load products')
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Normalize category titles to match our config keys
  const normalizedProducts = useMemo(() => {
    const normalized: Record<string, Product[]> = {}
    
    Object.entries(groupedProducts).forEach(([categoryTitle, data]) => {
      const normalizedTitle = categoryTitle.toLowerCase().replace(/\s+/g, '_').replace('&', '')
      normalized[normalizedTitle] = data.products || []
    })
    
    return normalized
  }, [groupedProducts])

  const totalProducts = useMemo(() => 
    Object.values(normalizedProducts).flat().length
  , [normalizedProducts])

  if (error) {
    return (
      <motion.div 
        className="min-h-screen bg-[#222222] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="text-center border-[0.5px] border-red-500 bg-black p-8 rounded-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" as const, stiffness: 100, damping: 15 }}
        >
          <motion.p 
            className="text-red-400 mb-6 text-lg font-medium"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {error}
          </motion.p>
          <motion.button
            onClick={fetchProducts}
            className="px-6 py-2 border-[0.5px] border-[#A64D9D] text-[#A64D9D] hover:bg-[#A64D9D] hover:text-white transition-all font-medium rounded-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-[#222222]">
      <div className="w-full px-0 py-8 md:py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 bg-gradient-to-r from-white to-[#A64D9D] bg-clip-text text-transparent"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, type: "spring" as const, stiffness: 120 }}
          >
            Fragrance Collection
          </motion.h1>
          <motion.p 
            className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Discover our exquisite range of perfumes, attars, and fragrances crafted for every occasion
          </motion.p>
        </motion.div>

        {/* Category Sections */}
        <motion.div 
          className="space-y-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {Object.entries(CATEGORY_CONFIG).map(([categoryKey, config], sectionIndex) => {
            const products = normalizedProducts[categoryKey] || []
            
            return (
              <motion.div
                key={categoryKey}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: sectionIndex * 0.08,
                  duration: 0.6,
                  type: "spring" as const,
                  stiffness: 100
                }}
              >
                <CategoryBanner
                  categoryKey={categoryKey as CategoryKey}
                  config={config}
                  products={products}
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-16 pt-8 border-t-[0.5px] border-[#A64D9D] px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.p 
            className="text-gray-400 font-light"
            whileHover={{ color: "#A64D9D" }}
            transition={{ duration: 0.3 }}
          >
            Showing <motion.span 
              className="font-semibold text-[#A64D9D]"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {totalProducts}
            </motion.span> products across all categories
          </motion.p>
        </motion.div>
      </div>
      <WhatsAppFloatingIcon />
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}