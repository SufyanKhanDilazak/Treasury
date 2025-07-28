"use client";

import React, { memo, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { getBannerCategory } from '../../sanity/lib/actions';
import { getCategoryBannerImage, getCategoryBannerAlt, type Category } from '@/sanity/lib/data';

interface BannerProps {
  height?: string;
  className?: string;
  fallbackImageUrl?: string;
  fallbackImageAlt?: string;
}

const AnimatedBackground = memo(() => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Primary gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#a64d9d]/10 via-black/80 to-[#8a4185]/10" />
    
    {/* Secondary gradient for depth */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
    
    {/* Subtle animated gradient bands */}
    <motion.div 
      className="absolute inset-0 opacity-20"
      animate={{
        background: [
          "linear-gradient(45deg, transparent 0%, rgba(166, 77, 157, 0.08) 50%, transparent 100%)",
          "linear-gradient(45deg, transparent 0%, rgba(138, 65, 133, 0.08) 50%, transparent 100%)",
          "linear-gradient(45deg, transparent 0%, rgba(166, 77, 157, 0.08) 50%, transparent 100%)"
        ]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </div>
));

AnimatedBackground.displayName = 'AnimatedBackground';

const ModernBanner: React.FC<BannerProps> = memo(({
  height = "h-[40vh] sm:h-[50vh] md:h-[70vh] lg:h-[85vh]", // Mobile-first responsive heights
  className = "",
  fallbackImageUrl = "/default-banner.jpg",
  fallbackImageAlt = "Premium Fragrance Collection"
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  
  const [bannerData, setBannerData] = useState<{
    imageUrl: string;
    imageAlt: string;
    isLoading: boolean;
  }>({
    imageUrl: fallbackImageUrl,
    imageAlt: fallbackImageAlt,
    isLoading: true
  });

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const bannerCategory = await getBannerCategory();
        
        if (bannerCategory) {
          const imageUrl = getCategoryBannerImage(bannerCategory);
          const imageAlt = getCategoryBannerAlt(bannerCategory);
          
          setBannerData({
            imageUrl: imageUrl || fallbackImageUrl,
            imageAlt: imageAlt || fallbackImageAlt,
            isLoading: false
          });
        } else {
          // No banner category found, use fallback
          setBannerData({
            imageUrl: fallbackImageUrl,
            imageAlt: fallbackImageAlt,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Error fetching banner data:', error);
        // Use fallback on error
        setBannerData({
          imageUrl: fallbackImageUrl,
          imageAlt: fallbackImageAlt,
          isLoading: false
        });
      }
    };

    fetchBannerData();
  }, [fallbackImageUrl, fallbackImageAlt]);

  return (
    <motion.section
      ref={ref}
      className={`relative w-full ${height} min-h-[280px] sm:min-h-[320px] md:min-h-[400px] max-h-[800px] overflow-hidden bg-black ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Full-width Stretched Image */}
      <motion.div
        className={`relative z-10 w-full h-full ${height} min-h-[280px] sm:min-h-[320px] md:min-h-[400px] max-h-[800px]`}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {/* Main stretched image */}
        <div className={`relative w-full h-full ${height} min-h-[280px] sm:min-h-[320px] md:min-h-[400px] max-h-[800px] overflow-hidden`}>
          {/* Loading state */}
          {bannerData.isLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#a64d9d]/20 via-black/90 to-[#8a4185]/20 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#a64d9d] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Banner Image */}
          <img
            src={bannerData.imageUrl}
            alt={bannerData.imageAlt}
            className={`w-full h-full object-cover object-center transition-all duration-500 hover:scale-[1.02] sm:hover:scale-105 ${
              bannerData.isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
            style={{
              objectPosition: 'center center',
            }}
            onLoad={() => {
              // Ensure loading state is cleared when image loads
              if (bannerData.isLoading) {
                setBannerData(prev => ({ ...prev, isLoading: false }));
              }
            }}
            onError={() => {
              // Handle image load error - fallback to default
              console.error('Banner image failed to load, using fallback');
              setBannerData({
                imageUrl: fallbackImageUrl,
                imageAlt: fallbackImageAlt,
                isLoading: false
              });
            }}
          />
          
          {/* Mobile-optimized overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-black/15 sm:from-black/20 sm:via-transparent sm:to-black/10" />
          
          {/* Subtle edge glow effects - more prominent on mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#a64d9d]/15 via-transparent to-[#8a4185]/15 sm:from-[#a64d9d]/10 sm:to-[#8a4185]/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#a64d9d]/8 sm:to-[#a64d9d]/5" />
          
          {/* Mobile-specific bottom gradient for better text readability if needed */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent sm:h-12 sm:from-black/20 md:hidden" />
        </div>

        {/* Touch-friendly interaction zone for mobile */}
        <div className="absolute inset-0 cursor-pointer sm:cursor-default" 
             onClick={() => {
               // Mobile tap handling can be added here if needed
             }}
        />
      </motion.div>

      {/* Bottom gradient fade - responsive sizing */}
      <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 md:h-12 bg-gradient-to-t from-[#222222] to-transparent" />
      
      {/* Preload banner image for performance */}
      {!bannerData.isLoading && (
        <link rel="preload" as="image" href={bannerData.imageUrl} />
      )}
    </motion.section>
  );
});

ModernBanner.displayName = 'ModernBanner';

export default ModernBanner;