"use client";
import React from "react";

// Utility function
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const GOLD = "#D4AF37";
const BLACK = "#000000";

/* ---------------- Marquee ---------------- */
interface MarqueeProps {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  reverse?: boolean;
  className?: string;
}
const Marquee: React.FC<MarqueeProps> = ({
  children,
  pauseOnHover = false,
  reverse = false,
  className = "",
}) => {
  return (
    <div className={cn("flex w-full overflow-hidden", className)}>
      <div
        className={cn(
          "flex animate-marquee items-center justify-center whitespace-nowrap",
          reverse && "animate-marquee-reverse",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{ animationDuration: "var(--duration, 40s)" }}
      >
        {children}
        {children}
      </div>
    </div>
  );
};

/* ---------------- Data ---------------- */
const reviews = [
  { name: "Jack", username: "@jack", body: "I've never seen anything like this before. It's amazing. I love it.", img: "https://avatar.vercel.sh/jack" },
  { name: "Jill", username: "@jill", body: "I don't know what to say. I'm speechless. This is amazing.", img: "https://avatar.vercel.sh/jill" },
  { name: "John", username: "@john", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://avatar.vercel.sh/john" },
  { name: "Jane", username: "@jane", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://avatar.vercel.sh/jane" },
  { name: "Jenny", username: "@jenny", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://avatar.vercel.sh/jenny" },
  { name: "James", username: "@james", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://avatar.vercel.sh/james" },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

/* ---------------- Card ---------------- */
const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl p-4 mx-2 transition-transform hover:-translate-y-[2px]",
        "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90",
        "shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
      )}
      style={{
        border: `1.5px solid ${BLACK}`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.25), inset 0 0 1px ${GOLD}`,
      }}
    >
      <div className="flex flex-col items-center text-center">
        <img
          className="rounded-full"
          width={40}
          height={40}
          alt={name}
          src={img}
          style={{
            boxShadow: `0 0 0 2px ${GOLD}, 0 2px 6px rgba(0,0,0,0.3)`,
          }}
        />
        <figcaption className="mt-2 text-sm font-semibold text-black">
          {name}
        </figcaption>
        <p className="text-xs font-medium text-neutral-600">{username}</p>
      </div>
      <blockquote className="mt-2 text-sm text-neutral-900 leading-relaxed text-center">
        {body}
      </blockquote>
      <div
        className="mt-3 h-[2px] rounded-full"
        style={{ background: GOLD }}
      />
    </figure>
  );
};

/* ---------------- Section ---------------- */
export function MarqueeDemo() {
  return (
    <section
      className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8 sm:py-10"
      style={{
        background:
          "radial-gradient(900px 200px at 50% -60px, rgba(0,0,0,0.05), transparent 70%)",
      }}
    >
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee { animation: marquee linear infinite; }
        .animate-marquee-reverse { animation: marquee-reverse linear infinite; }
      `}</style>

      {/* Heading */}
      <header className="text-center mb-6 sm:mb-8">
        <h2
          className="text-2xl sm:text-3xl font-semibold tracking-tight"
          style={{
            color: BLACK,
            textShadow: "0 1px 2px rgba(0,0,0,0.25)",
          }}
        >
          Reviews
        </h2>
        <div
          className="mx-auto mt-2 h-[3px] w-20 rounded-full"
          style={{
            background: GOLD,
            boxShadow: `0 0 8px ${BLACK}55`,
          }}
        />
      </header>

      {/* Rows */}
      <div className="mb-6">
  <Marquee pauseOnHover className="[--duration:20s]">
    {firstRow.map((review) => (
      <ReviewCard key={review.username} {...review} />
    ))}
  </Marquee>
</div>
<div className="mt-6">
  <Marquee reverse pauseOnHover className="[--duration:20s]">
    {secondRow.map((review) => (
      <ReviewCard key={review.username} {...review} />
    ))}
  </Marquee>
</div>


      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white"></div>
    </section>
  );
}

export default MarqueeDemo;
