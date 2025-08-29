"use client";

import React from "react";

type SocialLinks = {
  instagram?: string;
  facebook?: string;
  whatsapp?: string; // e.g. https://wa.me/923001234567
};
type PolicyLinks = { privacy?: string; returns?: string; cookies?: string };
type ContactInfo = { email?: string; phone?: string; whatsapp?: string };

export type FooterProps = {
  brandName?: string;          // default "Treasury"
  social?: SocialLinks;
  policies?: PolicyLinks;
  contact?: ContactInfo;
  className?: string;
  goldHex?: string;            // default #D4AF37
};

const GOLD = "#D4AF37";

/** Always-clickable anchor. If href not provided, uses "#" (no disabled state). */
function LinkButton({
  href,
  children,
  title,
  gold = GOLD,
}: {
  href?: string;
  children: React.ReactNode;
  title?: string;
  gold?: string;
}) {
  const url = href && href.trim().length > 0 ? href : "#";
  const isExternal =
    /^https?:\/\//i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url);

  const base =
    "pointer-events-auto inline-flex items-center justify-center whitespace-nowrap " +
    "rounded-md px-3 py-2 text-sm font-medium transition duration-200 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const styles: React.CSSProperties = {
    border: `1px solid ${gold}66`,
    boxShadow: `0 6px 18px -12px ${gold}55`,
  };

  return (
    <a
      href={url}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      title={title}
      className={`${base} hover:opacity-90`}
      style={styles}
    >
      {children}
    </a>
  );
}

const Footer: React.FC<FooterProps> = ({
  brandName = "Treasury",
  social = {},
  policies = {},
  contact = {},
  className,
  goldHex = GOLD,
}) => {
  const gold = goldHex || GOLD;

  // Build contact hrefs (always return a string)
  const mailto =
    contact.email && contact.email.trim().length
      ? `mailto:${contact.email}`
      : "#";
  const tel =
    contact.phone && contact.phone.trim().length
      ? `tel:${contact.phone.replace(/\s+/g, "")}`
      : "#";
  const wa = contact.whatsapp && contact.whatsapp.trim().length ? contact.whatsapp : "#";

  return (
    <footer
      className={`w-full bg-black text-white ${className ?? ""} relative z-[10]`}
      aria-labelledby="site-footer-heading"
      style={{
        borderTop: `1px solid ${gold}66`,
        boxShadow: `0 -1px 0 ${gold}33 inset`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center pt-6 sm:pt-8 pb-3">
          <h2 id="site-footer-heading" className="text-lg sm:text-xl font-semibold tracking-tight">
            Stay Connected
          </h2>
          <div
            className="mx-auto mt-2 h-[3px] w-16 rounded-full"
            style={{ background: gold, boxShadow: `0 0 10px ${gold}66` }}
          />
        </div>

        {/* Mobile swipe stripe */}
        <div className="md:hidden mb-3">
          <div
            className="mx-auto w-full rounded-md px-3 py-1 text-center text-xs font-medium"
            style={{
              color: "#0a0a0a",
              background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
              boxShadow: `0 0 10px ${gold}55`,
            }}
          >
            <span style={{ color: "#000", fontWeight: 600 }}>Swipe</span>{" "}
            <span style={{ color: "#000", fontSize: 14, fontWeight: 700 }}>›</span>
          </div>
        </div>

        {/* CONTENT: mobile scroller + desktop 3 cols */}
        <div className="md:grid md:grid-cols-3 md:gap-8 md:py-6 relative isolate">
          {/* Mobile horizontal scroller */}
          <div
            className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 relative z-[2]"
            style={{ scrollbarWidth: "none" } as React.CSSProperties}
          >
            {/* Card 1 */}
            <section
              className="snap-center shrink-0 min-w-[260px] rounded-xl p-4 text-center pointer-events-auto"
              style={{
                border: `1px solid ${gold}44`,
                boxShadow: `0 10px 30px -18px rgba(0,0,0,0.6), 0 0 0.5px ${gold}44 inset`,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
              }}
              aria-labelledby="footer-social"
            >
              <h3 id="footer-social" className="mb-3 text-base font-semibold" style={{ color: gold }}>
                Social Media
              </h3>
              <div className="grid gap-2">
                <LinkButton href={social.instagram} title="Instagram" gold={gold}>
                  Instagram
                </LinkButton>
                <LinkButton href={social.facebook} title="Facebook" gold={gold}>
                  Facebook
                </LinkButton>
                <LinkButton href={social.whatsapp} title="WhatsApp" gold={gold}>
                  WhatsApp
                </LinkButton>
              </div>
            </section>

            {/* Card 2 */}
            <section
              className="snap-center shrink-0 min-w-[260px] rounded-xl p-4 text-center pointer-events-auto"
              style={{
                border: `1px solid ${gold}44`,
                boxShadow: `0 10px 30px -18px rgba(0,0,0,0.6), 0 0 0.5px ${gold}44 inset`,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
              }}
              aria-labelledby="footer-policies"
            >
              <h3 id="footer-policies" className="mb-3 text-base font-semibold" style={{ color: gold }}>
                Policies
              </h3>
              <div className="grid gap-2">
                <LinkButton href={policies.privacy} title="Privacy Policy" gold={gold}>
                  Privacy Policy
                </LinkButton>
                <LinkButton href={policies.returns} title="Return Policy" gold={gold}>
                  Return Policy
                </LinkButton>
                <LinkButton href={policies.cookies} title="Cookie Policy" gold={gold}>
                  Cookie Policy
                </LinkButton>
              </div>
            </section>

            {/* Card 3 */}
            <section
              className="snap-center shrink-0 min-w-[260px] rounded-xl p-4 text-center pointer-events-auto"
              style={{
                border: `1px solid ${gold}44`,
                boxShadow: `0 10px 30px -18px rgba(0,0,0,0.6), 0 0 0.5px ${gold}44 inset`,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
              }}
              aria-labelledby="footer-contact"
            >
              <h3 id="footer-contact" className="mb-3 text-base font-semibold" style={{ color: gold }}>
                Contact
              </h3>
              <div className="grid gap-2">
                <LinkButton href={mailto} title={contact.email} gold={gold}>
                  Email
                </LinkButton>
                <LinkButton href={tel} title={contact.phone} gold={gold}>
                  Number
                </LinkButton>
                <LinkButton href={wa} title="WhatsApp" gold={gold}>
                  WhatsApp
                </LinkButton>
              </div>
            </section>
          </div>

          {/* Desktop columns */}
          <div className="hidden md:contents relative z-[2]">
            <section
              className="text-center rounded-xl p-6 pointer-events-auto"
              style={{
                border: `1px solid ${gold}33`,
                boxShadow: `0 10px 30px -18px rgba(0,0,0,0.6), 0 0 0.5px ${gold}44 inset`,
                background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
              }}
            >
              <h3 className="mb-3 text-lg font-semibold" style={{ color: gold }}>
                Social Media
              </h3>
              <div className="mx-auto max-w-xs grid gap-3">
                <LinkButton href={social.instagram} title="Instagram" gold={gold}>
                  Instagram
                </LinkButton>
                <LinkButton href={social.facebook} title="Facebook" gold={gold}>
                  Facebook
                </LinkButton>
                <LinkButton href={social.whatsapp} title="WhatsApp" gold={gold}>
                  WhatsApp
                </LinkButton>
              </div>
            </section>

            <section
              className="text-center rounded-xl p-6 pointer-events-auto"
              style={{
                border: `1px solid ${gold}33`,
                boxShadow: `0 10px 30px -18px rgba(0,0,0,0.6), 0 0 0.5px ${gold}44 inset`,
                background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
              }}
            >
              <h3 className="mb-3 text-lg font-semibold" style={{ color: gold }}>
                Policies
              </h3>
              <div className="mx-auto max-w-xs grid gap-3">
                <LinkButton href={policies.privacy} title="Privacy Policy" gold={gold}>
                  Privacy Policy
                </LinkButton>
                <LinkButton href={policies.returns} title="Return Policy" gold={gold}>
                  Return Policy
                </LinkButton>
                <LinkButton href={policies.cookies} title="Cookie Policy" gold={gold}>
                  Cookie Policy
                </LinkButton>
              </div>
            </section>

            <section
              className="text-center rounded-xl p-6 pointer-events-auto"
              style={{
                border: `1px solid ${gold}33`,
                boxShadow: `0 10px 30px -18px rgba(0,0,0,0.6), 0 0 0.5px ${gold}44 inset`,
                background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
              }}
            >
              <h3 className="mb-3 text-lg font-semibold" style={{ color: gold }}>
                Contact
              </h3>
              <div className="mx-auto max-w-xs grid gap-3">
                <LinkButton href={mailto} title={contact.email} gold={gold}>
                  Email
                </LinkButton>
                <LinkButton href={tel} title={contact.phone} gold={gold}>
                  Number
                </LinkButton>
                <LinkButton href={wa} title="WhatsApp" gold={gold}>
                  WhatsApp
                </LinkButton>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom line */}
        <div
          className="pt-3 pb-5 sm:pt-4 sm:pb-6 text-center text-xs sm:text-sm relative z-[2]"
          style={{ borderTop: `1px dashed ${gold}44`, color: "#eaeaea" }}
        >
          <p className="leading-relaxed">
            <span style={{ color: gold }}>© 2025 {brandName}</span> — All rights reserved.{" "}
            Created by <span style={{ color: gold }}>Neuromotiontech</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
