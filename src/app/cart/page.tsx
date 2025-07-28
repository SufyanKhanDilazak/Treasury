"use client";

import { useCart } from "../components/CartContext";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const { cartItems, cartQuantity, addToCart, removeFromCart, clearCart } = useCart();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!isSignedIn) {
      toast.info("Please sign in to proceed to checkout");
      setTimeout(() => router.push("/sign-in?redirectUrl=/checkout"), 1000);
      return;
    }
    router.push("/checkout");
  };

  const handleIncrement = (item: (typeof cartItems)[0]) => {
    addToCart({ ...item, quantity: 1 });
  };

  const handleDecrement = (item: (typeof cartItems)[0]) => {
    removeFromCart(item._id, item.selectedSize, item.selectedColor);
  };

  const bgPrimary = "bg-white/80";
  const bgSecondary = "bg-black/5";
  const bgHover = "hover:bg-white/90";
  const bgHoverButton = "hover:bg-black/10";
  const textPrimary = "text-black";
  const textSecondary = "text-black/60";
  const textMuted = "text-black/50";
  const textSubtle = "text-black/70";
  const border = "border-black/10";
  const borderStrong = "border-black/20";
  const separator = "bg-black/20";
  const primaryButton = "bg-[#A64D9D] hover:bg-[#A64D9D]";
  const outlineButton = "border-[#A64D9D] text-black hover:bg-[#A64D9D] hover:text-black hover:border-[#A64D9D]";
  const shippingNotice = "bg-[#A64D9D] border-[#A64D9D] text-black";
  const iconColor = "text-black";
  const priceColor = "text-[#bd1f1f]";

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 px-4 bg-gray-50/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto py-16 text-center">
          <div className={`${bgPrimary} backdrop-blur-md rounded-lg ${border} p-8 sm:p-12`}>
            <div className={`w-24 h-24 mx-auto mb-6 ${bgSecondary} rounded-full flex items-center justify-center`}>
              <ShoppingBag className={`w-12 h-12 ${iconColor}`} />
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${textPrimary}`}>Your Cart is Empty</h1>
            <p className={`${textSecondary} mb-8 text-sm sm:text-base max-w-md mx-auto`}>
              Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link href="/categories/all_product">
              <Button className={`${primaryButton} text-white px-6 py-3 text-sm sm:text-base transition-all duration-300 hover:scale-105`}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 bg-gray-50/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto py-6 sm:py-8">
        <div className={`${bgPrimary} backdrop-blur-md rounded-lg ${border} p-4 sm:p-6 mb-6`}>
          <h1 className={`text-2xl sm:text-3xl font-bold ${textPrimary}`}>
            Shopping Cart
            <span className={`text-lg sm:text-xl font-normal ${textSecondary} ml-2`}>
              ({cartQuantity} {cartQuantity === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          <div className="xl:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item._id}-${item.selectedSize || "default"}-${item.selectedColor || "default"}`}
                className={`${bgPrimary} backdrop-blur-md p-4 sm:p-6 rounded-lg ${border} transition-all duration-300 hover:shadow-lg ${bgHover}`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {item.imageUrl && (
                    <div className={`relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg border ${borderStrong}`}>
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name || "Product image"}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 640px) 80px, 96px"
                      />
                    </div>
                  )}
                  <div className="flex-grow min-w-0 w-full sm:w-auto">
                    <h3 className={`text-base sm:text-lg font-semibold ${textPrimary} truncate mb-1`}>{item.name}</h3>
                    <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm ${textMuted} mb-2`}>
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    </div>
                    <p className={`text-base sm:text-lg font-semibold ${priceColor}`}>PKR {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className={`flex items-center gap-1 ${bgSecondary} backdrop-blur-sm rounded-lg border ${border}`}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${bgHoverButton} ${textPrimary}`}
                        onClick={() => handleDecrement(item)}
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <span className={`w-8 text-center text-sm font-medium ${textPrimary}`}>{item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${bgHoverButton} ${textPrimary}`}
                        onClick={() => handleIncrement(item)}
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    <p className={`text-sm sm:text-base font-semibold ${priceColor}`}>PKR {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className={`${bgPrimary} backdrop-blur-md rounded-lg ${border} p-4 sm:p-6`}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className={`flex items-center gap-2 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 bg-white/50 backdrop-blur-sm w-full sm:w-auto hover:bg-red-50 transition-all duration-300`}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </Button>
                <Link href="/categories/all_product" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className={`w-full bg-white/50 backdrop-blur-sm ${outlineButton} transition-all duration-300`}
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className={`${bgPrimary} backdrop-blur-md p-4 sm:p-6 rounded-lg ${border} h-fit sticky top-24`}>
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 ${textPrimary}`}>Order Summary</h2>
            <div className="space-y-3">
              <div className={`flex justify-between text-sm sm:text-base ${textSubtle}`}>
                <span>Subtotal ({cartQuantity} items)</span>
                <span className={`${priceColor}`}>PKR {subtotal.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between text-sm sm:text-base ${textSubtle}`}>
                <span>Shipping</span>
                <span className={shipping === 0 ? `text-green-600 font-medium` : `${priceColor}`}>
                  {shipping === 0 ? "Free" : `PKR ${shipping.toFixed(2)}`}
                </span>
              </div>
              <Separator className={`my-4 ${separator}`} />
              <div className={`flex justify-between text-lg sm:text-xl font-semibold ${priceColor}`}>
                <span>Total</span>
                <span>PKR {total.toFixed(2)}</span>
              </div>
            </div>
            {subtotal < 100 && (
              <div className={`mt-4 p-3 ${shippingNotice} backdrop-blur-sm rounded-lg border`}>
                <p className="text-xs sm:text-sm text-center">
                  💰 Add <span className="font-semibold">PKR {(100 - subtotal).toFixed(2)}</span> more for free shipping!
                </p>
              </div>
            )}
            <Button
              onClick={handleCheckout}
              className={`w-full mt-6 ${primaryButton} text-white py-3 text-sm sm:text-base font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
            >
              Proceed to Checkout
            </Button>
            <div className="mt-4 text-center">
              <p className={`text-xs ${textMuted}`}>🔒 Secure checkout powered by SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}