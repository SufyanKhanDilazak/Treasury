'use client';

import Script from 'next/script';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

// TypeScript interface for the spline-viewer element
interface SplineViewerElement extends HTMLElement {
  shadowRoot: ShadowRoot | null;
}

// Props interface for the component
interface SplineBackgroundProps {
  /**
   * Container classes for styling the wrapper
   */
  containerClassName?: string;
  /**
   * Height of the container (default: 'h-[500px]')
   */
  height?: string;
  /**
   * Width of the container (default: 'w-full')
   */
  width?: string;
  /**
   * Whether to show loading state (default: true)
   */
  showLoading?: boolean;
  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode;
  /**
   * Whether to enable lazy loading (default: true)
   */
  lazyLoad?: boolean;
  /**
   * Border radius classes (default: 'rounded-lg')
   */
  borderRadius?: string;
  /**
   * Z-index for the container (default: 'z-10')
   */
  zIndex?: string;
}

// Custom hook for Spline logo hiding
const useSplineLogoHider = () => {
  const hideSplineLogo = useCallback(() => {
    const splineViewer = document.querySelector('spline-viewer') as SplineViewerElement;
    if (splineViewer?.shadowRoot) {
      const logo = splineViewer.shadowRoot.querySelector('#logo') as HTMLElement;
      if (logo) {
        logo.style.display = 'none';
        return true;
      }
    }
    return false;
  }, []);

  const setupLogoHider = useCallback(() => {
    // Multiple strategies to hide the logo
    const strategies = [
      // Strategy 1: Direct check with intervals
      () => {
        const interval = setInterval(() => {
          if (hideSplineLogo()) {
            clearInterval(interval);
          }
        }, 100);
        setTimeout(() => clearInterval(interval), 5000);
      },
      
      // Strategy 2: MutationObserver
      () => {
        const splineViewer = document.querySelector('spline-viewer') as SplineViewerElement;
        if (splineViewer) {
          const observer = new MutationObserver(() => {
            if (hideSplineLogo()) {
              observer.disconnect();
            }
          });
          observer.observe(splineViewer, { childList: true, subtree: true });
          setTimeout(() => observer.disconnect(), 5000);
        }
      },
      
      // Strategy 3: Event listeners
      () => {
        const splineViewer = document.querySelector('spline-viewer') as SplineViewerElement;
        if (splineViewer) {
          const onLoad = () => {
            setTimeout(hideSplineLogo, 100);
            setTimeout(hideSplineLogo, 500);
            setTimeout(hideSplineLogo, 1000);
          };
          splineViewer.addEventListener('load', onLoad);
          splineViewer.addEventListener('spline-viewer-load', onLoad);
          setTimeout(() => {
            splineViewer.removeEventListener('load', onLoad);
            splineViewer.removeEventListener('spline-viewer-load', onLoad);
          }, 5000);
        }
      }
    ];

    strategies.forEach(strategy => strategy());
  }, [hideSplineLogo]);

  return { hideSplineLogo, setupLogoHider };
};

export default function SplineBackground({
  containerClassName = '',
  height = 'h-[570px] sm:h-[600px]',
  width = 'w-full',
  showLoading = true,
  loadingComponent,
  lazyLoad = true,
  borderRadius = 'rounded-lg',
  zIndex = 'z-10'
}: SplineBackgroundProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const { setupLogoHider } = useSplineLogoHider();
  
  // Intersection Observer hook for lazy loading
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    skip: !lazyLoad
  });

  const handleScriptLoad = useCallback(() => {
    setIsScriptLoaded(true);
    setupLogoHider();
  }, [setupLogoHider]);

  const handleScriptError = useCallback(() => {
    setLoadError(true);
    console.error('Failed to load Spline viewer');
  }, []);

  // Setup logo hiding when spline loads
  useEffect(() => {
    if (isScriptLoaded) {
      const checkSplineReady = setInterval(() => {
        const splineViewer = document.querySelector('spline-viewer') as SplineViewerElement;
        if (splineViewer) {
          setIsSplineLoaded(true);
          setupLogoHider();
          clearInterval(checkSplineReady);
        }
      }, 100);

      setTimeout(() => clearInterval(checkSplineReady), 10000);
      return () => clearInterval(checkSplineReady);
    }
  }, [isScriptLoaded, setupLogoHider]);

  // Preload the Spline scene
  useEffect(() => {
    if ((lazyLoad ? inView : true) && !isScriptLoaded) {
      // Preload the scene data
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = 'https://prod.spline.design/Hqt1GHiVof6egfHt/scene.splinecode';
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [inView, isScriptLoaded, lazyLoad]);

  const defaultLoadingComponent = (
    <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
        <p className="text-white text-sm">Loading 3D scene...</p>
      </div>
    </div>
  );

  if (loadError) {
    return (
      <div className={`relative ${width} ${height} ${borderRadius} ${zIndex} bg-gray-900 flex items-center justify-center overflow-hidden ${containerClassName}`}>
        <div className="text-white text-center">
          <p className="text-sm mb-2">Failed to load 3D scene</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-3 py-1 bg-white text-black rounded text-sm hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        /* Aggressive CSS hiding for Spline logo */
        spline-viewer {
          --spline-viewer-logo-display: none !important;
        }
        
        spline-viewer::part(logo) {
          display: none !important;
        }

        /* Hide logo with CSS selector */
        spline-viewer #logo,
        spline-viewer [id*="logo"],
        spline-viewer [class*="logo"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }

        /* Performance optimizations */
        spline-viewer {
          will-change: transform;
          transform: translateZ(0);
          contain: layout style paint;
          content-visibility: auto;
        }

        spline-viewer canvas {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          transform: translateZ(0);
        }

        /* Reduce motion for better performance */
        @media (prefers-reduced-motion: reduce) {
          spline-viewer * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      
      <div 
        ref={ref}
        className={`relative ${width} ${height} ${borderRadius} ${zIndex} overflow-hidden flex items-center justify-center ${containerClassName}`}
      >
        {/* Loading states */}
        {showLoading && !isSplineLoaded && (
          loadingComponent || defaultLoadingComponent
        )}

        {/* Script loading */}
        {(lazyLoad ? inView : true) && (
          <>
            <Script 
              src="https://unpkg.com/@splinetool/viewer@1.10.27/build/spline-viewer.js" 
              type="module"
              strategy="lazyOnload"
              onLoad={handleScriptLoad}
              onError={handleScriptError}
            />
            
            {/* Preload the scene */}
            <link 
              rel="preload" 
              href="https://prod.spline.design/Hqt1GHiVof6egfHt/scene.splinecode" 
              as="fetch" 
              crossOrigin="anonymous"
            />
          </>
        )}
        
        {/* Spline viewer */}
        {isScriptLoaded && React.createElement('spline-viewer' as any, {
          url: 'https://prod.spline.design/Hqt1GHiVof6egfHt/scene.splinecode',
          className: 'w-full h-full block',
          loading: 'lazy',
          'data-performance': 'optimized',
          style: {
            contain: 'layout style paint',
            contentVisibility: 'auto',
            willChange: 'transform',
            transform: 'translateZ(0)'
          },
          onLoad: () => {
            setIsSplineLoaded(true);
            setupLogoHider();
          }
        })}
      </div>
    </>
  );
}