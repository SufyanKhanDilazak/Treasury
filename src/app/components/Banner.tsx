"use client";

import React, { memo, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
}

const AnimatedBackground = memo(() => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Primary gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#a64d9d]/15 via-black/90 to-[#8a4185]/15" />
    
    {/* Secondary gradient for depth */}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
    
    {/* Subtle animated gradient bands */}
    <motion.div 
      className="absolute inset-0 opacity-30"
      animate={{
        background: [
          "linear-gradient(45deg, transparent 0%, rgba(166, 77, 157, 0.1) 50%, transparent 100%)",
          "linear-gradient(45deg, transparent 0%, rgba(138, 65, 133, 0.1) 50%, transparent 100%)",
          "linear-gradient(45deg, transparent 0%, rgba(166, 77, 157, 0.1) 50%, transparent 100%)"
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
  title = "Scent Studio",
  subtitle = "Premium Fragrances",
  description = "Discover the finest collection of premium fragrances crafted for every moment",
  primaryButtonText = "Explore Collection",
  secondaryButtonText = "View Gift Sets",
  onPrimaryClick,
  onSecondaryClick,
  showBadge = true,
  badgeText = "Explore Collection",
  className = ""
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const handlePrimaryClick = useCallback(() => {
    onPrimaryClick?.();
  }, [onPrimaryClick]);

  const handleSecondaryClick = useCallback(() => {
    onSecondaryClick?.();
  }, [onSecondaryClick]);

  return (
    <motion.section
      ref={ref}
      className={`relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] overflow-hidden bg-black mt-8 sm:mt-12 md:mt-16 lg:mt-20 ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto w-full text-center">
          
          {/* Badge */}
          {showBadge && (
            <motion.div
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge 
                variant="outline" 
                className="border-[#a64d9d] text-[#a64d9d] bg-[#a64d9d]/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-[#a64d9d]/20 transition-colors duration-300 inline-flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3" />
                {badgeText}
              </Badge>
            </motion.div>
          )}

          {/* Main Title */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-white via-[#a64d9d] to-white bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            
            {/* Decorative line */}
            <motion.div 
              className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#a64d9d] to-transparent w-16 sm:w-20 md:w-24" />
              <div className="w-2 h-2 bg-[#a64d9d] rounded-full" />
              <div className="h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#8a4185] to-transparent w-16 sm:w-20 md:w-24" />
            </motion.div>

            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-[#a64d9d] font-light"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {subtitle}
            </motion.p>
          </motion.div>

          {/* Description */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 md:mb-12 px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {description}
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
  className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-md sm:max-w-none mx-auto"
  initial={{ opacity: 0, y: 20 }}
  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
  transition={{ duration: 0.8, delay: 1.1 }}
>
  {/* Primary Button */}
  <Button
    onClick={handlePrimaryClick}
    size="lg"
    className="w-full sm:w-auto border border-[#a64d9d] text-white bg-[#a64d9d]/10 hover:bg-[#a64d9d]/20 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-medium transition-all duration-300 group min-w-[180px] sm:min-w-[200px] rounded-none backdrop-blur-sm"
  >
    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
    {primaryButtonText}
  </Button>

  {/* Secondary Button */}
  <Button
    onClick={handleSecondaryClick}
    size="lg"
    className="w-full sm:w-auto border border-[#a64d9d] text-white bg-[#a64d9d]/10 hover:bg-[#a64d9d]/20 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-medium transition-all duration-300 group min-w-[180px] sm:min-w-[200px] rounded-none backdrop-blur-sm"
  >
    <Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
    {secondaryButtonText}
  </Button>
</motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-[#222222] to-transparent" />
    </motion.section>
  );
});

ModernBanner.displayName = 'ModernBanner';

export default ModernBanner;