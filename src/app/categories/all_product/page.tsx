'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useCallback, memo, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllProducts } from '@/sanity/lib/actions'
import type { Product } from '@/sanity/lib/data'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
} as const

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  }
} as const

const headerVariants = {
  hidden: { 
    opacity: 0, 
    y: -30
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      duration: 0.8
    }
  }
} as const

// Product Card Component
interface ProductCardProps {
  product: Product
  index: number
}

const ProductCard = memo<ProductCardProps>(({ product, index }) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
  }, [])

  const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price
  const originalPrice = product.onSale && product.salePrice ? product.price : null
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0

  return (
    <motion.div
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        y: -8,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="group"
    >
      <Link href={`/product/${product._id}`} className="block">
        <motion.div 
          className="relative w-full aspect-[4/5] overflow-hidden bg-black border-[0.5px] border-[#A64D9D] shadow-lg"
          whileHover={{ 
            borderColor: "#D946EF",
            boxShadow: "0 10px 30px rgba(166, 77, 157, 0.3)"
          }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence>
            {imageLoading && (
              <motion.div 
                className="absolute inset-0 bg-gray-800"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {product.images && product.images.length > 0 ? (
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: imageLoading ? 0 : 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={product.images[0] || '/api/placeholder/300/300'}
                alt={product.name}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                quality={90}
                onLoad={handleImageLoad}
                priority={index < 8}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-base font-light bg-black">
              No Image Available
            </div>
          )}

          <motion.div 
            className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {product.newArrival && (
              <motion.span 
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold shadow-lg border-[0.5px] border-green-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                NEW
              </motion.span>
            )}
            {product.onSale && (
              <motion.span 
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold shadow-lg border-[0.5px] border-red-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                -{discountPercentage}%
              </motion.span>
            )}
          </motion.div>

          {/* Stock Status Indicator */}
          {!product.inStock && (
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span 
                className="bg-red-600 text-white px-4 py-2 text-sm font-bold border-[0.5px] border-red-400"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                OUT OF STOCK
              </motion.span>
            </motion.div>
          )}

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          />
        </motion.div>

        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div 
          className="border-[0.5px] border-[#A64D9D] bg-white px-2 py-1 text-center transition-all duration-300 shadow-lg"

            whileHover={{ 
              borderColor: "#D946EF",
              boxShadow: "0 5px 15px rgba(166, 77, 157, 0.2)"
            }}
          >
            <motion.h4 
              className="text-sm sm:text-base md:text-lg text-black font-medium mb-1 line-clamp-1"
              whileHover={{ color: "#D946EF" }}
              transition={{ duration: 0.2 }}
            >
              {product.name}
            </motion.h4>
            
            {/* Volume Options */}
            {product.volume && product.volume.length > 0 && (
              <motion.div 
                className="flex items-center justify-center space-x-1 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {product.volume.slice(0, 3).map((vol, index) => (
                  <motion.span
                    key={index}
                    className="text-xs text-black px-1.5 py-0.5 border-[0.5px] border-[#A64D9D]"
                    whileHover={{ borderColor: "#A64D9D", color: "#A64D9D" }}
                  >
                    {vol}ml
                  </motion.span>
                ))}
                {product.volume.length > 3 && (
                  <motion.span
                    className="text-xs text-gray-400"
                    whileHover={{ color: "#A64D9D" }}
                  >
                    +{product.volume.length - 3}
                  </motion.span>
                )}
              </motion.div>
            )}
            
            <motion.div 
              className="flex items-center justify-center space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.span 
                className="text-lg sm:text-xl font-semibold text-[#bd1f1f]"
                whileHover={{ scale: 1.05, color: "#bd1f1f" }}
              >
                PKR {displayPrice.toFixed(2)}
              </motion.span>
              {originalPrice && (
                <motion.span 
                  className="text-sm text-gray-400 line-through"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  ${originalPrice.toFixed(2)}
                </motion.span>
              )}
            </motion.div>

            {/* Stock Status */}
            <motion.div 
              className="mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {product.inStock ? (
                <motion.span 
                  className="text-xs text-green-400 font-medium"
                  whileHover={{ color: "#10B981" }}
                >
                  ✓ In Stock
                </motion.span>
              ) : (
                <motion.span 
                  className="text-xs text-red-400 font-medium"
                  whileHover={{ color: "#EF4444" }}
                >
                  ✗ Out of Stock
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
interface ProductSkeletonProps {
  // Empty interface for skeleton component
}

const ProductSkeleton = memo<ProductSkeletonProps>(() => (
  <motion.div 
    className="group"
    variants={cardVariants}
  >
    <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-800 border-[0.5px] border-gray-600">
      <motion.div 
        className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
    </div>
    
    <div className="mt-4">
      <div className="border-[0.5px] border-gray-600 bg-black px-2 py-1 text-center">
        <motion.div 
          className="h-4 bg-gray-700 mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <motion.div 
          className="h-3 bg-gray-700 w-24 mx-auto mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
        />
        <motion.div 
          className="h-4 bg-gray-700 w-16 mx-auto"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
        />
      </div>
    </div>
  </motion.div>
))

ProductSkeleton.displayName = 'ProductSkeleton'

// Filter and Sort Component
interface FilterSortProps {
  sortBy: string
  setSortBy: (value: string) => void
  filterBy: string
  setFilterBy: (value: string) => void
  totalProducts: number
}

const FilterSort = memo<FilterSortProps>(({ 
  sortBy, 
  setSortBy, 
  filterBy, 
  setFilterBy, 
  totalProducts 
}) => (
  <motion.div 
    className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between mb-8 px-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.6 }}
  >
    <motion.div 
      className="text-black font-medium"
      whileHover={{ color: "#A64D9D" }}
    >
      Showing <span className="text-[#A64D9D] font-semibold">{totalProducts}</span> products
    </motion.div>
    
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Filter */}
      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
      >
        <label className="text-sm text-black font-medium">Filter:</label>
        <motion.select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="bg-black border-[0.5px] border-[#A64D9D] text-white px-3 py-2 text-sm focus:border-[#D946EF] focus:outline-none transition-colors"
          whileFocus={{ borderColor: "#D946EF" }}
        >
          <option value="all">All Products</option>
          <option value="inStock">In Stock</option>
          <option value="onSale">On Sale</option>
          <option value="newArrival">New Arrivals</option>
        </motion.select>
      </motion.div>

      {/* Sort */}
      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
      >
        <label className="text-sm text-black font-medium">Sort:</label>
        <motion.select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-black border-[0.5px] border-[#A64D9D] text-white px-3 py-2 text-sm focus:border-[#D946EF] focus:outline-none transition-colors"
          whileFocus={{ borderColor: "#D946EF" }}
        >
          <option value="newest">Newest First</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </motion.select>
      </motion.div>
    </div>
  </motion.div>
))

FilterSort.displayName = 'FilterSort'

// Error Component
interface ErrorDisplayProps {
  error: string
  onRetry: () => void
}

const ErrorDisplay = memo<ErrorDisplayProps>(({ error, onRetry }) => (
  <motion.div 
    className="min-h-screen bg-white flex items-center justify-center px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div 
      className="text-center border-[0.5px] border-red-500 bg-black p-8 max-w-md w-full"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <motion.p 
        className="text-red-400 mb-6 text-xl font-medium"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {error}
      </motion.p>
      <motion.button
        onClick={onRetry}
        className="px-8 py-3 border-[0.5px] border-[#A64D9D] text-[#A64D9D] hover:bg-[#A64D9D] hover:text-white transition-all font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Try Again
      </motion.button>
    </motion.div>
  </motion.div>
))

ErrorDisplay.displayName = 'ErrorDisplay'

// Main All Products Page Component
export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('all')

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get all products
      const productsData = await getAllProducts()
      setProducts(productsData)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let filtered = [...products]

    // Apply filters
    switch (filterBy) {
      case 'inStock':
        filtered = filtered.filter(product => product.inStock)
        break
      case 'onSale':
        filtered = filtered.filter(product => product.onSale)
        break
      case 'newArrival':
        filtered = filtered.filter(product => product.newArrival)
        break
      default:
        break
    }

    // Apply sorting
    switch (sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => {
          const priceA = a.onSale && a.salePrice ? a.salePrice : a.price
          const priceB = b.onSale && b.salePrice ? b.salePrice : b.price
          return priceA - priceB
        })
        break
      case 'priceHigh':
        filtered.sort((a, b) => {
          const priceA = a.onSale && a.salePrice ? a.salePrice : a.price
          const priceB = b.onSale && b.salePrice ? b.salePrice : b.price
          return priceB - priceA
        })
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
      default:
        // Products are already sorted by creation date from the query
        break
    }

    return filtered
  }, [products, sortBy, filterBy])

  const memoizedProducts = useMemo(() => 
    processedProducts.map((product, index) => (
      <ProductCard key={product._id} product={product} index={index} />
    )), [processedProducts]
  )

  const memoizedSkeletons = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => (
      <ProductSkeleton key={`skeleton-${i}`} />
    )), []
  )

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchData} />
  }

  return (
    <div className="min-h-screen bg-white mt-16">
      <div className="w-full px-0 py-8 sm:py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 px-4"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-black text-black mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
            >
              ALL PRODUCTS
            </motion.h1>
            
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-6"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
          
          <motion.p 
            className="text-lg sm:text-xl text-black max-w-2xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Discover our complete collection of premium fragrances, including traditional attars, 
            modern perfumes, and aromatic accessories from around the world.
          </motion.p>
        </motion.div>

        {/* Filter and Sort */}
        {!isLoading && (
          <FilterSort
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            totalProducts={processedProducts.length}
          />
        )}

        {/* Products Grid */}
        <motion.div 
          className="border-[0.5px] border-[#A64D9D] bg-white backdrop-blur-md mx-0 sm:mx-4 lg:mx-8 p-6 sm:p-8 shadow-2xl"
          whileHover={{ 
            borderColor: "#D946EF",
            boxShadow: "0 20px 50px rgba(166, 77, 157, 0.3)",
            transition: { duration: 0.3 }
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            transition: { delay: 0.3, duration: 0.8 }
          }}
        >
          {isLoading ? (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {memoizedSkeletons}
            </motion.div>
          ) : processedProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {memoizedProducts}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="bg-gray-900/80 border-[0.5px] border-gray-600 p-12 max-w-md mx-auto"
                whileHover={{ 
                  borderColor: "#A64D9D",
                  backgroundColor: "rgba(166, 77, 157, 0.1)"
                }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🛍️
                </motion.div>
                <motion.p 
                  className="text-black text-xl mb-3 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {filterBy === 'all' ? 'No products available' : `No products match "${filterBy}" filter`}
                </motion.p>
                <motion.p 
                  className="text-black text-sm font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {filterBy !== 'all' ? 'Try adjusting your filters' : 'Check back soon for new arrivals'}
                </motion.p>
                {filterBy !== 'all' && (
                  <motion.button
                    onClick={() => setFilterBy('all')}
                    className="mt-4 px-6 py-2 border-[0.5px] border-[#A64D9D] text-[#A64D9D] hover:bg-[#A64D9D] hover:text-black transition-all font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    Clear Filters
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer Stats */}
        {!isLoading && processedProducts.length > 0 && (
          <motion.div 
            className="text-center mt-12 pt-8 border-t-[0.5px] border-[#A64D9D] px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-black font-light"
              whileHover={{ color: "#A64D9D" }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                whileHover={{ scale: 1.05, color: "#D946EF" }}
              >
                <span className="font-semibold text-black">{processedProducts.length}</span> Products Shown
              </motion.span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <motion.span
                whileHover={{ scale: 1.05, color: "#D946EF" }}
              >
                <span className="font-semibold text-black">{products.filter(p => p.inStock).length}</span> In Stock
              </motion.span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <motion.span
                whileHover={{ scale: 1.05, color: "#D946EF" }}
              >
                <span className="font-semibold text-black">{products.filter(p => p.onSale).length}</span> On Sale
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}