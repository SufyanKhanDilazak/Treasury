'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { User, ChevronDown, ShoppingCart, Menu, Trash2, ShoppingBag, Plus, Minus, X } from 'lucide-react';
import { useCart } from './CartContext';
import { CartItem } from './Interface';

export function Header() {
  const { cartItems, cartQuantity, shouldGlow, addToCart, removeFromCart, clearCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMenuSheetOpen(false);
  }, [pathname]);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
  const isActive = useCallback((path: string) => pathname === path, [pathname]);
  const logoSrc = '/logo.png';

  const navLinks = useMemo(() => [
    { name: 'ABOUT', href: '/about' },
    { name: 'CONTACT', href: '/contact' },
  ], []);

  const categoryLinks = useMemo(() => [
    { name: 'SUMMER', href: '/categories/summer' },
    { name: 'MEN', href: '/categories/men' },
    { name: 'WOMEN', href: '/categories/women' },
    { name: 'OFFICE', href: '/categories/office' },
    { name: 'OUDH', href: '/categories/oudh' },
  ], []);

  const handleRemoveFromCart = useCallback((item: CartItem) => {
    removeFromCart(item._id, item.selectedSize, item.selectedColor);
  }, [removeFromCart]);

  const handleViewCart = useCallback(() => {
    setIsCartSheetOpen(false);
    router.push('/cart');
  }, [router]);

  const handleCheckout = useCallback(() => {
    setIsCartSheetOpen(false);
    router.push('/checkout');
  }, [router]);

  const handleClearCart = useCallback(() => clearCart(), [clearCart]);

  const userButtonStyles = useMemo(() => {
    if (!isMounted) return {};
    return {
      '--user-button-size': '32px',
      '--user-button-border': '#A64D9D',
      '--user-button-bg': 'rgb(17, 24, 39)',
      '--user-button-bg-hover': 'rgb(31, 41, 55)',
      '--user-button-shadow': '0 0 8px rgba(166, 77, 157, 0.4)',
    } as React.CSSProperties;
  }, [isMounted]);

  return (
    <>
      {isMounted && (
        <style jsx global>{`
          :root {
            --primary-color: #A64D9D;
            --primary-hover: #9A4591;
          }
          .nav-user-button .cl-userButtonTrigger { width: var(--user-button-size); height: var(--user-button-size); }
          .cl-userButtonBox {
            border: 1px solid transparent; border-radius: 9999px; transition: all 0.3s ease-in-out;
            width: var(--user-button-size); height: var(--user-button-size);
            background-color: var(--user-button-bg);
          }
          .cl-userButtonBox:hover {
            border: 1px solid var(--user-button-border); transform: scale(1.05) rotate(-5deg);
            box-shadow: var(--user-button-shadow);
            background-color: var(--user-button-bg-hover);
          }
        `}</style>
      )}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-gray-800 bg-black transition-colors duration-300 ease-in-out h-20">
        <div className="container mx-auto max-w-7xl px-4 h-full flex items-center justify-between overflow-x-hidden">
          {/* Mobile Menu */}
          <div className="flex items-center lg:hidden">
            <Sheet open={isMenuSheetOpen} onOpenChange={setIsMenuSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-transparent hover:bg-gray-800 transition-all duration-300 ease-in-out text-white h-8 w-8 hover:scale-110 hover:-rotate-12">
                  <Menu className="h-[1.4rem] w-[1.4rem]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-black border-r border-gray-800 p-0 transition-all duration-300 ease-in-out">
                <div className="h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A64D9D] to-transparent shadow-[0_0_10px_2px_#A64D9D] opacity-70" />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A64D9D] to-transparent shadow-[0_0_10px_2px_#A64D9D] opacity-70" />
                  <div className="flex items-center justify-between p-6">
                    <SheetTitle className="text-xl uppercase text-white font-bold">MENU</SheetTitle>
                    <SheetClose asChild>
                      <button className="absolute right-4 top-4 rounded-sm opacity-70 transition-all duration-300 ease-in-out hover:opacity-100 hover:rotate-90 focus:outline-none text-white">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </button>
                    </SheetClose>
                  </div>
                  <nav className="flex flex-col space-y-6 px-6 pb-6 flex-1 overflow-auto">
                    <Link href="/" className={`relative py-2 font-bold transition-all duration-300 ease-in-out ${isActive('/') ? 'text-[#A64D9D]' : 'text-white'} hover:text-[#A64D9D] hover:translate-x-1`}>
                      HOME
                      {isActive('/') && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A64D9D] to-transparent shadow-[0_0_10px_2px_#A64D9D]" />}
                    </Link>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="categories" className="border-none">
                        <AccordionTrigger className="py-2 font-bold uppercase text-white hover:text-[#A64D9D] transition-all duration-300 ease-in-out no-underline hover:no-underline hover:translate-x-1">
                          CATEGORIES
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4 transition-all duration-500 ease-in-out">
                          <div className="flex flex-col space-y-2 bg-gray-900/50 rounded-md p-3">
                            {categoryLinks.map((link) => (
                              <Link key={link.href} href={link.href} className="block py-2 px-3 text-sm font-medium text-gray-300 hover:text-[#A64D9D] transition-all duration-200 ease-in-out rounded-md hover:bg-gray-800/50 hover:scale-105 hover:translate-x-1">
                                {link.name}
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className={`relative py-2 font-bold uppercase transition-all duration-300 ease-in-out ${isActive(link.href) ? 'text-[#A64D9D]' : 'text-white'} hover:text-[#A64D9D] hover:translate-x-1`}>
                        {link.name}
                        {isActive(link.href) && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A64D9D] to-transparent shadow-[0_0_10px_2px_#A64D9D]" />}
                      </Link>
                    ))}
                    <div className="pt-4">
                      <SignedIn>
                        <div className="flex items-center gap-2 py-2 text-white">
                          <User className="h-5 w-5" />
                          <UserButton afterSignOutUrl="/" />
                        </div>
                      </SignedIn>
                      <SignedOut>
                        <SignInButton mode="modal">
                          <Button variant="ghost" className="w-full justify-start pl-0 font-bold uppercase text-white hover:text-[#A64D9D] transition-all duration-300 ease-in-out hover:scale-105">
                            <User className="h-5 w-5 mr-2" />
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 flex-shrink-0">
            <Link href="/" className={`relative group font-bold uppercase transition-all duration-300 ease-in-out ${isActive('/') ? 'text-[#A64D9D]' : 'text-white'} hover:text-[#A64D9D] hover:-translate-y-0.5 hover:scale-105`}>
              HOME
              <span className={`absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#A64D9D] to-transparent shadow-[0_0_10px_2px_#A64D9D] transition-all duration-300 ease-in-out ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center group font-bold uppercase text-white hover:text-[#A64D9D] transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-0.5 focus:bg-transparent">
                  CATEGORIES
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-black border border-gray-800 shadow-lg rounded-xl p-4 transition-all duration-200 ease-in-out" align="start" sideOffset={8} alignOffset={-4}>
                <div className="grid grid-cols-2 gap-2">
                  {categoryLinks.map((link) => (
                    <DropdownMenuItem key={link.href} className="focus:bg-gray-900 cursor-pointer uppercase rounded-md transition-all duration-200 ease-in-out p-0">
                      <Link href={link.href} className="w-full text-sm font-semibold text-white hover:text-[#A64D9D] py-3 px-4 block hover:bg-gray-800/50 rounded-md hover:scale-105 hover:translate-x-1 transition-all duration-200 ease-in-out">
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center flex-shrink-0">
            <Link href="/" className="block transition-transform duration-300 ease-in-out hover:scale-105">
              <div className="relative h-24 w-20 sm:h-24 sm:w-22 md:h-28 md:w-22 lg:w-22 transition-all duration-500 ease-in-out hover:-rotate-1">
                <Image src={logoSrc} alt="Niche Club" fill className="object-contain" priority />
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8 ml-auto mr-4 flex-shrink-0">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`relative group font-bold uppercase transition-all duration-300 ease-in-out ${isActive(link.href) ? 'text-[#A64D9D]' : 'text-white'} hover:text-[#A64D9D] hover:-translate-y-0.5 hover:scale-105`}>
                {link.name}
                <span className={`absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#A64D9D] to-transparent shadow-[0_0_10px_2px_#A64D9D] transition-all duration-300 ease-in-out ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 ml-2 flex-shrink-0">
            <Sheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen}>
              <SheetTrigger asChild>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-8 w-8 bg-black hover:bg-gray-800 transition-all duration-300 ease-in-out border border-gray-700 rounded-full hover:scale-110 hover:-rotate-12 text-white ${shouldGlow ? 'animate-pulse' : ''}`}
                  >
                    <ShoppingCart className="h-[1.3rem] w-[1.3rem]" />
                    {cartQuantity > 0 && (
                      <span className={`absolute -top-1 -right-1 bg-[#A64D9D] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-all duration-300 ease-in-out ${shouldGlow ? 'animate-pulse' : ''}`}>
                        {cartQuantity}
                      </span>
                    )}
                  </Button>
                </div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[380px] bg-black border-l border-gray-800 p-0 transition-all duration-300 ease-in-out">
                <div className="h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A64D9D] to-transparent shadow-[0_0_10px_2px_#A64D9D] opacity-70" />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A64D9D] to-transparent shadow-[0_0_10px_2px_#A64D9D] opacity-70" />
                  <div className="p-4 sm:p-6">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold uppercase text-white">
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                        YOUR CART ({cartQuantity})
                      </SheetTitle>
                    </SheetHeader>
                  </div>
                  <div className="flex-1 overflow-hidden flex flex-col">
                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center flex-1 p-4 sm:p-6">
                        <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
                        <p className="text-gray-400 text-center mb-4 text-sm sm:text-base font-medium uppercase">Your cart is empty</p>
                        <SheetClose asChild>
                          <Button className="bg-[#A64D9D] hover:bg-[#9A4591] text-white font-bold uppercase transition-all duration-300 ease-in-out hover:scale-105 text-sm">CONTINUE SHOPPING</Button>
                        </SheetClose>
                      </div>
                    ) : (
                      <>
                        <div className="flex-grow overflow-y-auto space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                          {cartItems.map((item) => (
                            <div key={`${item._id}-${item.selectedSize || 'default'}-${item.selectedColor || 'default'}`} className="bg-gray-900 p-2 sm:p-3 rounded-lg shadow-sm border border-gray-800 flex items-center gap-2 sm:gap-3 transition-transform duration-300 ease-in-out hover:scale-105">
                              {item.imageUrl && (
                                <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-md transition-transform duration-300 ease-in-out hover:scale-105">
                                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 48px, 64px" />
                                </div>
                              )}
                              <div className="flex-grow min-w-0">
                                <h3 className="text-xs sm:text-sm text-white font-medium truncate">{item.name}</h3>
                                {item.selectedSize && <p className="text-xs text-gray-400">Size: {item.selectedSize}</p>}
                                {item.selectedColor && <p className="text-xs text-gray-400">Color: {item.selectedColor}</p>}
                                <p className="text-xs sm:text-sm text-white font-semibold">PKR {item.price.toFixed(2)}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1 bg-gray-800 rounded-md">
                                  <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:scale-90 transition-transform duration-200 ease-in-out text-white" onClick={() => handleRemoveFromCart(item)}>
                                    <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  </Button>
                                  <span className="w-5 sm:w-6 text-center text-xs sm:text-sm text-white font-medium">{item.quantity}</span>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:scale-90 transition-transform duration-200 ease-in-out text-white" onClick={() => addToCart({...item, quantity: 1})}>
                                    <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  </Button>
                                </div>
                                <p className="text-xs text-white font-semibold">PKR {(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 sm:p-6 pt-0">
                          <Separator className="my-3 sm:my-4 bg-gray-800" />
                          <div className="mb-3 sm:mb-4">
                            <div className="flex justify-between mb-2 text-xs sm:text-sm font-bold uppercase">
                              <span className="text-gray-400">Subtotal</span>
                              <span className="text-white">PKR {subtotal.toFixed(2)}</span>
                            </div>

                          </div>
                          <div className="space-y-2 sm:space-y-3">
                            <Button onClick={handleViewCart} variant="outline" className="w-full border-gray-700 text-black font-bold uppercase transition-all duration-300 ease-in-out hover:scale-105 text-xs sm:text-sm">VIEW CART</Button>
                            <Button onClick={handleCheckout} className="w-full bg-[#A64D9D] hover:bg-[#9A4591] text-white font-bold uppercase transition-all duration-300 ease-in-out hover:scale-105 text-xs sm:text-sm">CHECKOUT</Button>
                            <Button onClick={handleClearCart} variant="ghost" className="w-full flex items-center justify-center text-gray-400 hover:text-red-400 font-bold uppercase transition-all duration-300 ease-in-out hover:scale-105 text-xs sm:text-sm">
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
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

            <div className="hidden lg:block flex-shrink-0">
              <SignedIn>
                <div className="nav-user-button" style={userButtonStyles}>
                  <div className="transition-all duration-300 ease-in-out hover:scale-110 hover:-rotate-12">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-black hover:bg-gray-800 transition-all duration-300 ease-in-out border border-gray-700 rounded-full hover:scale-110 hover:-rotate-12 text-white">
                    <User className="h-[1.3rem] w-[1.3rem]" />
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A64D9D] to-transparent shadow-[0_0_10px_2px_#A64D9D] opacity-70" />
      </header>
    </>
  );
}