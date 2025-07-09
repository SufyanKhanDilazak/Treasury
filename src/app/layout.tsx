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

export const metadata: Metadata = {
  title: {
    default: 'Scent Studio - Premium Fragrances & Perfumes',
    template: '%s | Scent Studio',
  },
  description: 'Discover exclusive fragrances and premium perfumes at Scent Studio.',
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
      <body className="min-h-screen bg-[#222222]">
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