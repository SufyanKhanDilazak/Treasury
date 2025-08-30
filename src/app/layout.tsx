import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import './globals.css';
import { CartProvider } from './components/CartContext';
import { Header } from './components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const SITE_TITLE = 'Treasury — Premium Bags, Perfumes & Footwear';
const SITE_DESC =
  'Shop premium bags, perfumes, and footwear at Treasury. Discover clutch, tote, shoulder, crossbody & top-handle bags; unisex perfumes & kits; heels & flats. Fast shipping & easy returns.';

export const metadata: Metadata = {
  // Set this to your production URL if you have it:
  // e.g. NEXT_PUBLIC_SITE_URL=https://treasury.yourdomain.com
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: SITE_TITLE,
    template: '%s | Treasury',
  },
  description: SITE_DESC,
  applicationName: 'Treasury',
  keywords: [
    'Treasury',
    'bags',
    'handbags',
    'clutch',
    'tote bags',
    'shoulder bags',
    'crossbody bags',
    'top handle bags',
    'perfumes',
    'unisex perfumes',
    'perfume kits',
    'footwear',
    'heels',
    'flats',
    'premium store',
    'luxury accessories',
    'fashion',
    'ecommerce',
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    url: '/',
    siteName: 'Treasury',
    type: 'website',
    images: [
      {
        url: '/logo.png', // replace with a dedicated OG image if you have one
        width: 512,
        height: 512,
        alt: 'Treasury',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ['/logo.png'],
  },
  themeColor: '#D4AF37',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white">
        <ClerkProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
