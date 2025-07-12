import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

const WhatsAppFloatingIcon = () => {
  const handleWhatsAppClick = () => {
    // Replace with your WhatsApp number (include country code without + sign)
    const phoneNumber = '923310199646' // Example: Pakistan number
    const message = encodeURIComponent('Hello! I am interested in your fragrance collection.')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <motion.div
      className="fixed left-4 md:left-6 bottom-6 md:bottom-8 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        delay: 1,
        type: "spring",
        stiffness: 200,
        damping: 20 
      }}
    >
      <motion.button
        onClick={handleWhatsAppClick}
        className="group relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg hover:shadow-xl border-2 border-green-400 flex items-center justify-center overflow-hidden"
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 8px 25px rgba(34, 197, 94, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Animated background pulse */}
        <motion.div
          className="absolute inset-0 bg-green-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0.4, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* WhatsApp Icon */}
        <MessageCircle 
          className="relative z-10 w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform duration-200" 
          fill="currentColor"
        />
        
        {/* Hover tooltip */}
        <motion.div
          className="absolute left-full ml-3 px-3 py-1.5 bg-black bg-opacity-90 text-white text-xs md:text-sm font-medium rounded-lg shadow-lg border border-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={{ x: -10, opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Chat with us on WhatsApp
          <div className="absolute left-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-black bg-opacity-90 rotate-45 border-l border-b border-gray-600"></div>
        </motion.div>
      </motion.button>
    </motion.div>
  )
}

export default WhatsAppFloatingIcon