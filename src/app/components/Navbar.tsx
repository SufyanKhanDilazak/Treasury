// app/components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  User,
  ChevronDown,
  ShoppingCart,
  Menu,
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Sparkles,
} from 'lucide-react';
import { useCart } from './CartContext';
import type { CartItem } from './Interface';

/* ========= ROUTES (EXACTLY AS YOUR FOLDERS) ========= */

type NavLink = { readonly name: string; readonly href: string };
type Section = { readonly label: 'PERFUME' | 'FOOTWEAR' | 'BAGS'; readonly items: readonly NavLink[] };

const PERFUME_LINKS = [
  { name: 'Unisex Perfumes', href: '/categories/perfumes/unisex-perfumes' },
  { name: 'Perfume Kits', href: '/categories/perfumes/perfume-kits' },
] as const satisfies readonly NavLink[];

const FOOTWEAR_LINKS = [
  { name: 'Heels', href: '/categories/footwear/heels' },
  { name: 'Flats', href: '/categories/footwear/flats' },
] as const satisfies readonly NavLink[];

const BAG_BASE_LINKS = [
  { name: 'Clutch Bags', href: '/categories/bags/clutch' }, // label will render as "Clutch"
  { name: 'Tote Bags', href: '/categories/bags/tote-bags' },
  { name: 'Shoulder Bags', href: '/categories/bags/shoulder-bags' },
  { name: 'Crossbody Bags', href: '/categories/bags/crossbody-bags' },
  { name: 'Top Handle Bags', href: '/categories/bags/top-handle-bags' },
] as const satisfies readonly NavLink[];

const NAV_RIGHT = [
  { name: 'ABOUT', href: '/about' },
  { name: 'CONTACT', href: '/contact' },
] as const satisfies readonly NavLink[];

/* ===================================================== */

export function Header() {
  const { cartItems, cartQuantity, shouldGlow, addToCart, removeFromCart, clearCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [hovered, setHovered] = useState<Section['label'] | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  // Display “Clutch” instead of “Clutch Bags”
  const bagLinksDisplay = useMemo<readonly NavLink[]>(
    () => BAG_BASE_LINKS.map((l) => (/clutch bags/i.test(l.name) ? { ...l, name: 'Clutch' } : l)),
    []
  );

  const SECTIONS = useMemo<readonly Section[]>(
    () => [
      { label: 'PERFUME', items: PERFUME_LINKS },
      { label: 'FOOTWEAR', items: FOOTWEAR_LINKS },
      { label: 'BAGS', items: bagLinksDisplay },
    ],
    [bagLinksDisplay]
  );

  const handleRemoveFromCart = useCallback(
    (item: CartItem) => removeFromCart(item._id, item.selectedSize, item.selectedColor),
    [removeFromCart]
  );

  const handleViewCart = useCallback(() => {
    setCartOpen(false);
    router.push('/cart');
  }, [router]);

  const handleCheckout = useCallback(() => {
    setCartOpen(false);
    router.push('/checkout');
  }, [router]);

  if (!mounted) return null;

  return (
    <>
      {/* ======= Styles (same design/colors) ======= */}
      <style jsx global>{`
        :root {
          --gold-primary: #d4af37;
          --gold-light: #e6c44d;
          --glass-bg: rgba(0, 0, 0, 0.9);
          --glass-border: rgba(212, 175, 55, 0.15);
        }
        .glass-header {
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(10, 10, 10, 0.9) 50%,
            rgba(0, 0, 0, 0.98) 100%
          );
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border-bottom: 1px solid var(--glass-border);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.02);
        }
        .golden-line {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(212, 175, 55, 0.3) 25%,
            var(--gold-primary) 50%,
            rgba(212, 175, 55, 0.3) 75%,
            transparent 100%
          );
          height: 1px;
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
        .nav-link {
          position: relative;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          color: white;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--gold-primary), var(--gold-light));
          border-radius: 1px;
          transition: width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
        }
        .nav-link:hover {
          color: var(--gold-primary);
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .glass-button {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(20, 20, 20, 0.8) 100%);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(16px);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          color: white;
        }
        .glass-button:hover {
          border-color: rgba(212, 175, 55, 0.4);
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(30, 30, 30, 0.9) 100%);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px rgba(212, 175, 55, 0.15);
          transform: translateY(-1px);
          color: white;
        }
        .dropdown-menu {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 15, 15, 0.95) 100%);
          backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
          animation: dropdown-enter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes dropdown-enter {
          0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .category-item {
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
          color: rgba(255, 255, 255, 0.9);
        }
        .category-item::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.15) 100%);
          border-radius: 8px;
          opacity: 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .category-item:hover::before {
          opacity: 1;
          transform: scaleX(1);
        }
        .category-item:hover {
          color: var(--gold-primary);
        }
        .cart-glow {
          animation: cart-pulse 2s ease-in-out infinite;
        }
        @keyframes cart-pulse {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.6);
          }
        }
        .sheet-content {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.96) 0%, rgba(10, 10, 10, 0.94) 100%);
          backdrop-filter: blur(32px);
          border-left: 1px solid var(--glass-border);
        }
        .cl-userButtonBox {
          border: 1px solid var(--glass-border) !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%) !important;
          backdrop-filter: blur(16px) !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        .cl-userButtonBox:hover {
          border-color: rgba(212, 175, 55, 0.5) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.2) !important;
          transform: translateY(-1px) !important;
        }
      `}</style>

      <header className="fixed left-0 top-0 z-50 h-20 w-full">
        <div className="glass-header relative h-full">
          {/* Top golden line */}
          <div className="golden-line absolute left-0 top-0 w-full" />

          <div className="container mx-auto flex h-full max-w-7xl items-center justify-between px-6">
            {/* ===== Mobile Menu Button ===== */}
            <div className="flex items-center lg:hidden">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="glass-button h-10 w-10 rounded-xl"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="sheet-content w-80 p-0">
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between p-6">
                      <SheetTitle className="flex items-center gap-3 text-lg font-bold tracking-wide text-white">
                        <span className="rounded-lg border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 p-2">
                          <Sparkles className="h-5 w-5 text-[#D4AF37]" />
                        </span>
                        TREASURY
                      </SheetTitle>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="glass-button rounded-lg" aria-label="Close menu">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>

                    <nav className="flex-1 space-y-1 overflow-auto px-6 pb-6">
                      <Link
                        href="/"
                        className={`nav-link block py-3 text-sm font-semibold tracking-wider ${
                          isActive('/') ? 'text-[#D4AF37]' : ''
                        }`}
                      >
                        HOME
                      </Link>
                      <Link
                        href="/categories/brands"
                        className={`nav-link block py-3 text-sm font-semibold tracking-wider ${
                          isActive('/categories/brands') ? 'text-[#D4AF37]' : ''
                        }`}
                      >
                        BRANDS
                      </Link>

                      {/* Mobile: separate dropdowns */}
                      <Accordion type="single" collapsible className="w-full">
                        {SECTIONS.map((section) => (
                          <AccordionItem key={section.label} value={section.label} className="border-none">
                            <AccordionTrigger className="nav-link py-3 text-left text-sm font-semibold tracking-wider hover:no-underline">
                              {section.label}
                            </AccordionTrigger>
                            <AccordionContent className="pt-2">
                              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                                {section.items.map((link) => (
                                  <Link
                                    key={link.href}
                                    href={link.href}
                                    className="category-item relative block border-b border-white/5 px-4 py-3 text-sm last:border-b-0"
                                  >
                                    {link.name}
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>

                      {NAV_RIGHT.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`nav-link block py-3 text-sm font-semibold tracking-wider ${
                            isActive(link.href) ? 'text-[#D4AF37]' : ''
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}

                      {/* Account (mobile) */}
                      <div className="mt-6 border-t border-white/10 pt-6">
                        <SignedIn>
                          <div className="flex items-center gap-4 py-3">
                            <div className="glass-button rounded-xl border border-white/10 p-2">
                              <User className="h-5 w-5 text-[#D4AF37]" />
                            </div>
                            <UserButton afterSignOutUrl="/" />
                          </div>
                        </SignedIn>
                        <SignedOut>
                          <SignInButton mode="modal">
                            <Button
                              variant="ghost"
                              className="glass-button group w-full justify-start px-0 py-3 text-sm font-semibold tracking-wider text-white hover:bg-transparent hover:text-[#D4AF37]"
                            >
                              <span className="mr-4 rounded-xl border border-white/10 p-2">
                                <User className="h-5 w-5 text-[#D4AF37]" />
                              </span>
                              ACCOUNT
                            </Button>
                          </SignInButton>
                        </SignedOut>
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* ===== Center Logo ===== */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/" aria-label="Treasury Home" className="group block">
                <div className="relative h-36 w-36 transition-transform duration-300 group-hover:scale-110">
                  <Image src="/logo.png" alt="Treasury logo" fill className="object-contain" priority />
                </div>
              </Link>
            </div>

            {/* ===== Desktop Navigation ===== */}
            <nav className="hidden items-center gap-10 lg:flex">
              <Link
                href="/"
                className={`nav-link text-sm font-bold tracking-wider ${isActive('/') ? 'text-[#D4AF37]' : ''}`}
              >
                HOME
              </Link>

              {SECTIONS.map((section) => (
                <div
                  key={section.label}
                  className="relative"
                  onMouseEnter={() => setHovered(section.label)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <button
                    className="nav-link inline-flex items-center text-sm font-bold tracking-wider focus:outline-none"
                    aria-haspopup="menu"
                    aria-expanded={hovered === section.label}
                  >
                    {section.label}
                    <ChevronDown
                      className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                        hovered === section.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`dropdown-menu absolute left-0 top-full mt-2 w-64 p-4 transition-all duration-300 ${
                      hovered === section.label
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible -translate-y-2 opacity-0 pointer-events-none'
                    }`}
                    role="menu"
                  >
                    <div className="space-y-1">
                      {section.items.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="category-item relative block rounded-lg px-4 py-3 text-sm font-medium"
                          role="menuitem"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/categories/brands"
                className={`nav-link text-sm font-bold tracking-wider ${
                  isActive('/categories/brands') ? 'text-[#D4AF37]' : ''
                }`}
              >
                BRANDS
              </Link>
            </nav>

            {/* ===== Right (About/Contact) ===== */}
            <div className="ml-auto mr-6 hidden items-center gap-10 lg:flex">
              {NAV_RIGHT.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-sm font-bold tracking-wider ${
                    isActive(link.href) ? 'text-[#D4AF37]' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* ===== Actions (Cart + Account) ===== */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`glass-button h-11 w-11 rounded-xl ${shouldGlow ? 'cart-glow' : ''}`}
                      aria-label="Open cart"
                    >
                      <ShoppingCart className="h-5 w-5 text-white" />
                      {cartQuantity > 0 && (
                        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] text-xs font-bold text-black shadow-lg">
                          {cartQuantity}
                        </span>
                      )}
                    </Button>
                  </div>
                </SheetTrigger>

                <SheetContent side="right" className="sheet-content w-96 p-0">
                  <div className="flex h-full flex-col">
                    <div className="p-6">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-3 text-lg font-bold tracking-wide text-white">
                          <span className="rounded-lg border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 p-2">
                            <ShoppingCart className="h-5 w-5 text-[#D4AF37]" />
                          </span>
                          YOUR TREASURY ({cartQuantity})
                        </SheetTitle>
                      </SheetHeader>
                    </div>

                    <div className="flex flex-1 flex-col overflow-hidden">
                      {cartItems.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center p-8">
                          <div className="mb-6 rounded-full border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 p-8">
                            <ShoppingBag className="h-16 w-16 text-[#D4AF37]" />
                          </div>
                          <p className="mb-6 text-center text-base text-white/60">Your treasury is empty</p>
                          <SheetClose asChild>
                            <Button className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C44D] px-8 py-3 text-sm font-bold text-black shadow-lg hover:from-[#E6C44D] hover:to-[#D4AF37]">
                              CONTINUE SHOPPING
                            </Button>
                          </SheetClose>
                        </div>
                      ) : (
                        <>
                          <div className="flex-grow space-y-4 overflow-y-auto px-6 pb-6">
                            {cartItems.map((item) => (
                              <div
                                key={`${item._id}-${item.selectedSize || 'default'}-${item.selectedColor || 'default'}`}
                                className="glass-button flex items-center gap-4 rounded-xl p-4"
                              >
                                {item.imageUrl && (
                                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-white/20">
                                    <Image
                                      src={item.imageUrl}
                                      alt={item.name}
                                      fill
                                      sizes="64px"
                                      className="object-cover"
                                    />
                                  </div>
                                )}

                                <div className="min-w-0 flex-grow">
                                  <h3 className="truncate text-sm font-bold text-white">{item.name}</h3>
                                  {item.selectedSize && (
                                    <p className="mt-1 text-xs text-white/70">Size: {item.selectedSize}</p>
                                  )}
                                  {item.selectedColor && (
                                    <p className="text-xs text-white/70">Color: {item.selectedColor}</p>
                                  )}
                                  <p className="mt-1 text-sm font-bold text-[#D4AF37]">
                                    PKR {item.price.toFixed(2)}
                                  </p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                  <div className="glass-button flex items-center gap-1 rounded-full px-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-white hover:bg-transparent hover:text-[#D4AF37]"
                                      onClick={() => handleRemoveFromCart(item)}
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-white hover:bg-transparent hover:text-[#D4AF37]"
                                      onClick={() => addToCart({ ...item, quantity: 1 })}
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <p className="text-xs font-bold text-[#D4AF37]">
                                    PKR {(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="px-6 pb-6">
                            <Separator className="my-4 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <div className="mb-6 flex items-center justify-between text-base font-bold">
                              <span className="text-white/80">Subtotal</span>
                              <span className="text-lg text-[#D4AF37]">PKR {subtotal.toFixed(2)}</span>
                            </div>

                            <div className="space-y-3">
                              <Button
                                onClick={handleViewCart}
                                variant="outline"
                                className="glass-button w-full rounded-xl border-white/20 py-3 text-sm font-bold text-white hover:border-[#D4AF37]/60 hover:text-[#D4AF37]"
                              >
                                VIEW CART
                              </Button>
                              <Button
                                onClick={handleCheckout}
                                className="w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C44D] py-3 text-sm font-bold text-black shadow-lg hover:from-[#E6C44D] hover:to-[#D4AF37]"
                              >
                                CHECKOUT
                              </Button>
                              <Button
                                onClick={clearCart}
                                variant="ghost"
                                className="w-full rounded-xl py-3 text-sm font-bold text-white/60 hover:bg-red-500/10 hover:text-red-400"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                CLEAR CART
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Account (desktop) */}
              <div className="hidden lg:block">
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      size="icon"
                      className="glass-button h-11 w-11 rounded-xl"
                      aria-label="Sign in"
                    >
                      <User className="h-5 w-5 text-white" />
                    </Button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>

          {/* Bottom golden line */}
          <div className="golden-line absolute bottom-0 left-0 w-full" />
        </div>
      </header>
    </>
  );
}
