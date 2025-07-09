// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useCart } from "../components/CartContext";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "../components/Interface";
import {
  Truck,
  AlertCircle,
  ArrowLeft,
  Package,
  MapPin,
  User,
  Mail,
  Phone,
  Minus,
  Plus,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, setIsLoading] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);

  const isBuyNow = searchParams.get("buyNow") === "true";

  useEffect(() => {
    let itemsToProcess: CartItem[] = [];
    let totalToProcess = 0;

    if (isBuyNow) {
      const buyNowItemStr = sessionStorage.getItem("buyNowItem");
      if (buyNowItemStr) {
        const buyNowItem = JSON.parse(buyNowItemStr);
        itemsToProcess = [buyNowItem];
        const itemSubtotal = buyNowItem.price * buyNowItem.quantity;
        const itemShipping = itemSubtotal > 10000 ? 0 : 500;
        const itemTax = itemSubtotal * 0.13;
        totalToProcess = itemSubtotal + itemShipping + itemTax;
      } else {
        router.push("/categories/all_product");
        return;
      }
    } else {
      if (cartItems.length === 0) {
        router.push("/payment-success");
        return;
      }
      itemsToProcess = cartItems;
      totalToProcess = total;
    }

    setCheckoutItems(itemsToProcess);
    setCheckoutTotal(totalToProcess);
  }, [router, isBuyNow, cartItems, total]);

  const handleWhatsAppChat = () => {
    const message = encodeURIComponent(
      `Order On Whatsapp . Order Total: PKR ${checkoutTotal.toFixed(2)}`
    );
    window.open(`https://wa.me/923310199646?text=${message}`, '_blank');
  };

  if (!isBuyNow && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#222222]">
        <div className="container mx-auto px-4 py-20 text-center pt-24">
          <div className="max-w-md mx-auto bg-black border-[0.5px] border-[#A64D9D] rounded-xl p-8 shadow-xl">
            <ShoppingBag className="h-16 w-16 text-[#A64D9D] mx-auto mb-4" />
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Your cart is empty</h1>
            <p className="text-gray-300 mb-6 text-sm md:text-base">Add some items to your cart before checking out.</p>
            <Link href="/categories/all_product">
              <Button className="bg-[#A64D9D] hover:bg-[#D946EF] text-white px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222222]">
      <div className="container mx-auto px-2 sm:px-4 py-6 pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-2">
              <OrderForm 
                total={checkoutTotal} 
                items={checkoutItems} 
                isBuyNow={isBuyNow}
                clearCart={clearCart}
                onWhatsAppChat={handleWhatsAppChat}
              />
            </div>
            <div className="lg:col-span-1 lg:mt-20">
              <div className="bg-black border-[0.5px] border-[#A64D9D] rounded-xl p-4 lg:p-6 shadow-xl lg:sticky lg:top-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <Package className="h-5 w-5 text-[#A64D9D]" />
                  Order Summary
                </h2>
                <div className="text-sm text-gray-300 mb-4">
                  {checkoutItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  {checkoutItems.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "items"}
                </div>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {checkoutItems.map((item, index) => (
                    <OrderItem
                      key={`${item._id}-${item.selectedSize || "default"}-${item.selectedColor || "default"}-${index}`}
                      item={item}
                      isBuyNow={isBuyNow}
                    />
                  ))}
                </div>
                <Separator className="my-4 bg-[#A64D9D]" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>PKR {checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Shipping
                    </span>
                    <span
                      className={
                        checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) > 10000
                          ? "text-green-400"
                          : ""
                      }
                    >
                      {checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) > 10000 ? "Free" : "PKR 500.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (13%)</span>
                    <span>
                      PKR {(checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.13).toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-3 bg-[#A64D9D]" />
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total</span>
                    <span className="text-[#A64D9D]">PKR {checkoutTotal.toFixed(2)}</span>
                  </div>
                </div>
                {checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) < 10000 && (
                  <div className="mt-4 p-3 bg-[#A64D9D]/10 border border-[#A64D9D] rounded-lg">
                    <p className="text-sm text-[#A64D9D]">
                      Add PKR {(3000 - checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(2)}{" "}
                      more for free shipping!
                    </p>
                  </div>
                )}
                
                {/* WhatsApp Help Button */}
                <div className="mt-4 pt-4 border-t border-[#A64D9D]/30">
                  <Button
                    onClick={handleWhatsAppChat}
                    className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 py-2 rounded-lg transition-all duration-300"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  icon: Icon,
  error,
  className = "",
  ...props
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={props.id} className="flex items-center gap-2 text-sm font-medium text-white">
        <Icon className="h-4 w-4 text-[#A64D9D]" />
        {label}
      </Label>
      <Input
        {...props}
        className={`w-full px-3 py-2 sm:py-3 border rounded-lg bg-black text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-[#A64D9D] focus:border-[#D946EF] focus:ring-[#A64D9D]/20 hover:border-[#D946EF]"
        }`}
      />
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function OrderItem({ item, isBuyNow = false }: { item: CartItem; isBuyNow?: boolean }) {
  const { addToCart, removeFromCart } = useCart();

  const handleIncrement = () => {
    if (!isBuyNow) addToCart({ ...item, quantity: 1 });
  };

  const handleDecrement = () => {
    if (!isBuyNow) removeFromCart(item._id, item.selectedSize, item.selectedColor);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-[#333333] border border-[#A64D9D]/30 rounded-lg hover:border-[#A64D9D] transition-all duration-300">
      <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-lg border border-[#A64D9D]/30">
        <Image 
          src={item.imageUrl || "/placeholder.svg"} 
          alt={item.name || "Product"} 
          fill 
          className="object-cover" 
          sizes="(max-width: 640px) 48px, 64px" 
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white text-sm truncate">{item.name}</h4>
        <div className="space-y-0.5">
          {item.selectedSize && <p className="text-xs text-gray-400">Size: {item.selectedSize}</p>}
          {item.selectedColor && <p className="text-xs text-gray-400">Color: {item.selectedColor}</p>}
          <p className="text-sm font-medium text-[#A64D9D]">PKR {item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {!isBuyNow ? (
          <div className="flex items-center gap-1 bg-black border border-[#A64D9D] rounded-md">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-white hover:bg-[#A64D9D] hover:text-white" 
              onClick={handleDecrement} 
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 sm:w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-white hover:bg-[#A64D9D] hover:text-white" 
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <span className="w-6 sm:w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
        )}
        <p className="font-semibold text-white text-sm">PKR {(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
}

function OrderForm({ 
  total, 
  items, 
  isBuyNow = false,
  clearCart,
  onWhatsAppChat
}: { 
  total: number; 
  items: CartItem[]; 
  isBuyNow?: boolean;
  clearCart: () => void;
  onWhatsAppChat: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    address: "", 
    city: "", 
    state: "", 
    zip: "" 
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) setValidationErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email address";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zip.trim()) errors.zip = "ZIP code is required";
    else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) errors.zip = "Invalid ZIP code";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please correct the errors above.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const itemsSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemsShipping = itemsSubtotal > 10000 ? 0 : 500;
      const itemsTax = itemsSubtotal * 0.13;
      const itemsTotal = itemsSubtotal + itemsShipping + itemsTax;

      const orderData = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        items: items.map((item) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          imageUrl: item.imageUrl,
        })),
        subtotal: itemsSubtotal,
        tax: itemsTax,
        shipping: itemsShipping,
        total: itemsTotal,
      };

      const saveOrderResponse = await fetch("/api/save-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!saveOrderResponse.ok) {
        const errorData = await saveOrderResponse.json();
        throw new Error(errorData.error || "Failed to save order");
      }

      if (!isBuyNow) clearCart();
      sessionStorage.removeItem("buyNowItem");
      router.push("/payment-success");
    } catch (err) {
      console.error("Order submission error:", err);
      setError("An error occurred during order submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-20 sm:mt-24">
        <Link href={isBuyNow ? "/cart" : "/payment-success"}>
          <Button variant="ghost" size="sm" className="gap-2 text-gray-300 hover:text-white hover:bg-[#A64D9D] self-start">
            <ArrowLeft className="h-4 w-4" />
            {isBuyNow ? "Back to Product" : "Back to Cart"}
          </Button>
        </Link>
        <h1 className="text-lg sm:text-xl font-bold text-white">Place Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="bg-black border-[0.5px] border-[#A64D9D] p-4 sm:p-6 rounded-xl shadow-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <User className="h-5 w-5 text-[#A64D9D]" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              icon={User}
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={validationErrors.name}
            />
            <FormField
              label="Phone Number"
              icon={Phone}
              id="phone"
              type="tel"
              placeholder="+92-1234567890"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={validationErrors.phone}
            />
          </div>
          <FormField
            label="Email Address"
            icon={Mail}
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={validationErrors.email}
            className="mt-4"
          />
        </div>

        <div className="bg-black border-[0.5px] border-[#A64D9D] p-4 sm:p-6 rounded-xl shadow-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5 text-[#A64D9D]" />
            Shipping Address
          </h2>
          <div className="space-y-4">
            <FormField
              label="Street Address"
              icon={MapPin}
              id="address"
              type="text"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              error={validationErrors.address}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                label="City"
                icon={MapPin}
                id="city"
                type="text"
                placeholder="Karachi"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                error={validationErrors.city}
              />
              <FormField
                label="State"
                icon={MapPin}
                id="state"
                type="text"
                placeholder="Sindh"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                error={validationErrors.state}
              />
              <FormField
                label="ZIP Code"
                icon={MapPin}
                id="zip"
                type="text"
                placeholder="10001"
                value={formData.zip}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                error={validationErrors.zip}
              />
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-400 text-sm mt-1">{error}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 h-12 text-base font-medium bg-[#A64D9D] hover:bg-[#D946EF] text-white transition-all duration-300 disabled:opacity-50 rounded-lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Processing Order...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Place Order - PKR {total.toFixed(2)}
              </div>
            )}
          </Button>
          
          <Button
            type="button"
            onClick={onWhatsAppChat}
            className="h-12 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 sm:px-6 rounded-lg transition-all duration-300"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Whatsapp Help</span>
            <span className="sm:hidden">Help</span>
          </Button>
        </div>
      </form>
    </div>
  );
}