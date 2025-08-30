"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from "react";
import NextImage from "next/image";
import { gsap } from "gsap";

export type MasonryItemData = {
  id: string;
  src: string;
  height: number; // layout hint (px)
  alt?: string;
  priority?: boolean;
  unoptimized?: boolean;
};

type GridItem = MasonryItemData & { x: number; y: number; w: number; h: number };

type MasonryProps = {
  items?: MasonryItemData[];
  title?: string;
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "bottom" | "top" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  gap?: number; // desktop/tablet gap
  className?: string;
};

const GOLD = "#D4AF37";
const BLACK = "#000";

const DEFAULT_ITEMS: MasonryItemData[] = [
  { id: "1",  src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop", height: 420, alt: "Mountain range" },
  { id: "2",  src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400&auto=format&fit=crop", height: 260, alt: "Forest trail" },
  { id: "3",  src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop", height: 540, alt: "River stream" },
  { id: "4",  src: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1400&auto=format&fit=crop", height: 320, alt: "Rocky coast" },
  { id: "5",  src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1400&auto=format&fit=crop", height: 300, alt: "City block" },
  { id: "6",  src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop", height: 260, alt: "Skyscraper" },
  { id: "7",  src: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=1400&auto=format&fit=crop", height: 580, alt: "Waterfall" },
  { id: "8",  src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1400&auto=format&fit=crop", height: 360, alt: "Cliffs" },
  { id: "9",  src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop", height: 280, alt: "Shoreline" },
  { id: "10", src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1400&auto=format&fit=crop", height: 460, alt: "Cove" },
];

/* ---------------- hooks ---------------- */
const useMedia = (queries: string[], values: number[], fallback: number) => {
  const get = () => {
    if (typeof window === "undefined") return fallback;
    const i = queries.findIndex((q) => window.matchMedia(q).matches);
    return values[i] ?? fallback;
  };
  const [val, setVal] = useState<number>(get);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqls = queries.map((q) => window.matchMedia(q));
    const handler = () => setVal(get());
    mqls.forEach((m) => m.addEventListener("change", handler));
    return () => mqls.forEach((m) => m.removeEventListener("change", handler));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return val;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
};

const preloadImages = async (urls: string[]) => {
  if (typeof window === "undefined") return;
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

/* ---------------- component ---------------- */
const Masonry: React.FC<MasonryProps> = ({
  items,
  title = "Gallery",
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.98,
  blurToFocus = true,
  gap = 14, // keep same layout as your version
  className,
}) => {
  const data = items?.length ? items : DEFAULT_ITEMS;

  // SAME GRID as your version (no layout changes)
  const columns = useMedia(
    ["(min-width:1600px)", "(min-width:1200px)", "(min-width:900px)", "(min-width:640px)"],
    [4, 3, 3, 2],
    2
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    preloadImages(data.map((i) => i.src)).then(() => setImagesReady(true));
  }, [data]);

  const isMobile = (width || 0) < 640;
  const effectiveGap = isMobile ? 8 : gap;

  // ✅ memoized; include containerRef to satisfy ESLint deps
  const getInitialPosition = useCallback(
    (item: GridItem) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: item.x, y: item.y };
      const dir =
        animateFrom === "random"
          ? (["top", "bottom", "left", "right"] as const)[Math.floor(Math.random() * 4)]
          : animateFrom;
      switch (dir) {
        case "top": return { x: item.x, y: -200 };
        case "bottom": return { x: item.x, y: (typeof window !== "undefined" ? window.innerHeight : 800) + 200 };
        case "left": return { x: -200, y: item.y };
        case "right": return { x: (typeof window !== "undefined" ? window.innerWidth : 1200) + 200, y: item.y };
        case "center": return { x: rect.width / 2 - item.w / 2, y: rect.height / 2 - item.h / 2 };
        default: return { x: item.x, y: item.y + 100 };
      }
    },
    [animateFrom, containerRef]
  );

  // collage rules (unchanged logic)
  const mobileHeightScale = (idx: number) => [1.15, 0.92, 1.05, 0.88][idx % 4];
  const isMobileFullSpan = (idx: number) => idx % 6 === 0;

  const grid = useMemo<GridItem[]>(() => {
    if (!width || columns < 1) return [];
    const colHeights = new Array(columns).fill(0);
    const totalGaps = (columns - 1) * effectiveGap;
    const columnWidth = (width - totalGaps) / columns;

    return data.map((child, idx) => {
      if (isMobile && isMobileFullSpan(idx)) {
        const y = Math.min(...colHeights);
        const h = Math.max(160, Math.round(child.height * 1.15));
        colHeights.fill(y + h + effectiveGap);
        return { ...child, x: 0, y, w: width, h };
      }
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + effectiveGap);
      const baseH = child.height;
      const h = isMobile ? Math.max(140, Math.round(baseH * mobileHeightScale(idx))) : baseH;
      const y = colHeights[col];
      colHeights[col] += h + effectiveGap;
      return { ...child, x, y, w: columnWidth, h };
    });
  }, [columns, width, effectiveGap, data, isMobile]);

  useLayoutEffect(() => {
    if (!imagesReady) return;
    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };
      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(10px)" }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: Math.max(duration, 0.6),
            ease: ease || "power3.out",
            delay: index * (stagger ?? 0),
          }
        );
      } else {
        gsap.to(selector, { ...animProps, duration, ease, overwrite: "auto" });
      }
    });
    hasMounted.current = true;
  }, [grid, imagesReady, stagger, blurToFocus, duration, ease, getInitialPosition]);

  const onEnter = (id: string) => {
    if (scaleOnHover) gsap.to(`[data-key="${id}"]`, { scale: hoverScale, duration: 0.18, ease: "power2.out" });
  };
  const onLeave = (id: string) => {
    if (scaleOnHover) gsap.to(`[data-key="${id}"]`, { scale: 1, duration: 0.18, ease: "power2.out" });
  };

  const containerHeight = useMemo(() => (grid.length ? Math.max(...grid.map((g) => g.y + g.h)) : 0), [grid]);

  return (
    <div
      className={`w-full ${className ?? ""}`}
      style={{
        background: "radial-gradient(900px 200px at 50% -70px, rgba(0,0,0,0.05), transparent 70%)",
      }}
    >
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-6 text-center">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-black"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.25)" }}
        >
          {title}
        </h1>
        <div
          className="mx-auto mt-3 h-[3px] w-24 rounded-full"
          style={{ background: GOLD, boxShadow: `0 0 10px ${BLACK}55` }}
        />
      </header>

      <section
        ref={containerRef}
        className="relative mx-auto max-w-7xl px-2 sm:px-4 lg:px-6"
        aria-label="Masonry gallery"
        style={{ minHeight: containerHeight }}
      >
        {grid.map((item) => (
          <article
            key={item.id}
            data-key={item.id}
            className="absolute box-content will-change-transform group"
            style={{ willChange: "transform, width, height, opacity" }}
            onMouseEnter={() => onEnter(item.id)}
            onMouseLeave={() => onLeave(item.id)}
          >
            <figure
              className="relative w-full h-full overflow-hidden rounded-[14px] bg-white"
              style={{
                border: `1.5px solid ${BLACK}`,
                boxShadow: `0 14px 40px -14px rgba(0,0,0,0.45), inset 0 0 1px ${GOLD}`,
              }}
            >
              <NextImage
                src={item.src}
                alt={item.alt ?? ""}
                fill
                sizes="(min-width:1600px) 25vw, (min-width:1200px) 33vw, (min-width:900px) 33vw, (min-width:640px) 50vw, 50vw"
                style={{ objectFit: "cover" }}
                priority={item.priority}
                unoptimized={item.unoptimized}
              />
              <span
                className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{ boxShadow: `inset 0 0 0 2px ${GOLD}66` }}
              />
            </figure>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Masonry;
