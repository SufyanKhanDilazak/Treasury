"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "../../components/Interface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  ShoppingCart,
  Eye,
  Zap,
} from "lucide-react";
import { useCart } from "../../components/CartContext";
import { toast } from "sonner";

// Types
interface ProductImage {
  _key: string;
  asset: { _ref: string; _type: string };
  alt: string;
}

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images: ProductImage[];
  description?: string;
  onSale: boolean;
  newArrival: boolean;
  volume?: string[];
  categories?: Category[];
}

interface RelatedProduct {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images: ProductImage[];
  onSale: boolean;
  newArrival: boolean;
}

interface Props {
  product: Product;
  relatedProducts: RelatedProduct[];
}

// Animation variants - Fixed TypeScript error
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.96
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const, // Fix: Add 'as const' to make it a literal type
      stiffness: 120,
      damping: 20,
      duration: 0.4
    }
  }
};

// Related Product Card Component
const RelatedProductCard = ({ relatedProduct, index }: { relatedProduct: RelatedProduct; index: number }) => {
  const [imageLoading, setImageLoading] = useState(true);
  
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -6,
        transition: { type: "spring" as const, stiffness: 400, damping: 25 }
      }}
    >
      <Link href={`/product/${relatedProduct.slug.current}`} className="block">
        <motion.div 
          className="relative w-full aspect-[8/10] overflow-hidden bg-black border-[0.5px] border-[#A64D9D] rounded-xl shadow-lg"
          whileHover={{ 
            borderColor: "#D946EF",
            boxShadow: "0 8px 25px rgba(166, 77, 157, 0.3)"
          }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence>
            {imageLoading && (
              <motion.div 
                className="absolute inset-0 bg-gray-800 rounded-xl"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-xl"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {relatedProduct.images?.[0]?.asset ? (
            <motion.div
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: imageLoading ? 0 : 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl overflow-hidden"
            >
              <Image
                src={urlFor(relatedProduct.images[0]).url()}
                alt={relatedProduct.images[0].alt || relatedProduct.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105 rounded-xl"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={85}
                onLoad={handleImageLoad}
                priority={index < 4}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-light bg-black rounded-xl">
              No Image Available
            </div>
          )}

          {/* Badges */}
          <motion.div 
            className="absolute top-3 left-3 flex flex-col gap-1.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {relatedProduct.newArrival && (
              <motion.span 
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2.5 py-1 text-xs font-semibold rounded-lg shadow-lg border-[0.5px] border-green-400"
                whileHover={{ scale: 1.05 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" as const, stiffness: 200 }}
              >
                NEW
              </motion.span>
            )}
            {relatedProduct.onSale && (
              <motion.span 
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2.5 py-1 text-xs font-semibold rounded-lg shadow-lg border-[0.5px] border-red-400"
                whileHover={{ scale: 1.05 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" as const, stiffness: 200 }}
              >
                SALE
              </motion.span>
            )}
          </motion.div>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
            initial={false}
          />
        </motion.div>

        {/* Product info */}
        <motion.div 
          className="mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <motion.div 
            className="border-[0.5px] border-[#A64D9D] bg-black px-3 py-2.5 text-center transition-all duration-300 shadow-lg rounded-lg"
            whileHover={{ 
              borderColor: "#D946EF",
              boxShadow: "0 4px 12px rgba(166, 77, 157, 0.2)"
            }}
          >
            <motion.h4 
              className="text-sm text-white font-medium mb-1.5 line-clamp-1"
              whileHover={{ color: "#D946EF" }}
              transition={{ duration: 0.2 }}
            >
              {relatedProduct.name}
            </motion.h4>
            
            <motion.div 
              className="flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span 
                className="text-base font-semibold text-[#A64D9D]"
                whileHover={{ scale: 1.03, color: "#D946EF" }}
              >
                PKR {relatedProduct.price.toFixed(2)}
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default function ProductClient({ product, relatedProducts }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVolume, setSelectedVolume] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { addToCart } = useCart();
  const router = useRouter();

  const currentImage = useMemo(() => product.images[selectedImageIndex], [product.images, selectedImageIndex]);
  
  // Use the product price directly
  const displayPrice = product.price;
  const subtotal = useMemo(() => displayPrice * quantity, [displayPrice, quantity]);

  const isVolumeRequired = product.volume && product.volume.length > 0;
  const isSelectionComplete = !isVolumeRequired || selectedVolume;

  const handleAddToCart = useCallback(async () => {
    if (!isSelectionComplete) return;
    setIsAddingToCart(true);

    const cartItem: CartItem = {
      _id: product._id,
      name: product.name,
      price: displayPrice,
      selectedVolume: selectedVolume || undefined,
      quantity,
      imageUrl: product.images[0] ? urlFor(product.images[0]).url() : undefined,
      timestamp: Date.now(),
      description: product.description,
      slug: product.slug,
      onSale: product.onSale,
      newArrival: product.newArrival
    };

    try {
      addToCart(cartItem);
      toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, selectedVolume, quantity, addToCart, isSelectionComplete, displayPrice]);

  const handleBuyNow = useCallback(() => {
    if (!isSelectionComplete) return;
  
    const buyNowItem: CartItem = {
      _id: product._id,
      name: product.name,
      price: displayPrice,
      selectedVolume: selectedVolume || undefined,
      quantity,
      imageUrl: product.images[0] ? urlFor(product.images[0]).url() : undefined,
      timestamp: Date.now(),
      description: product.description,
      slug: product.slug,
      onSale: product.onSale,
      newArrival: product.newArrival
    };
  
    sessionStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
    router.push("/checkout?buyNow=true");
  }, [product, selectedVolume, quantity, router, isSelectionComplete, displayPrice]);
  const handleShare = useCallback(async () => {
    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        toast.success("Product shared!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share product");
    }
  }, [product.name]);

  const handleImageNavigation = useCallback(
    (direction: "prev" | "next") => {
      setSelectedImageIndex((prev) =>
        direction === "prev"
          ? prev === 0
            ? product.images.length - 1
            : prev - 1
          : prev === product.images.length - 1
          ? 0
          : prev + 1
      );
    },
    [product.images.length]
  );

  const adjustQuantity = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  }, []);

  return (
    <div className="min-h-screen bg-[#222222] pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8" aria-label="Breadcrumb">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <Link href="/" className="text-white hover:text-[#A64D9D] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-white" />
            <Link href="/products" className="text-white hover:text-[#A64D9D] transition-colors">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-white" />
            <span className="text-white font-semibold">{product.name}</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          <div className="space-y-4">
            <div className="group relative max-w-sm mx-auto overflow-hidden rounded-xl shadow-lg">
              <div className="relative aspect-[4/5] border-[0.5px] border-[#A64D9D] rounded-xl overflow-hidden">
                {currentImage?.asset ? (
                  <Image
                    src={urlFor(currentImage).url()}
                    alt={currentImage.alt || product.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105 p-2 rounded-xl"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black rounded-xl">
                    <div className="text-center">
                      <Eye className="h-16 w-16 text-white mx-auto mb-4" />
                      <p className="text-white">No Image Available</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {product.newArrival && (
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg rounded-lg">
                      <Zap className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  )}
                  {product.onSale && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg rounded-lg">
                      Sale
                    </Badge>
                  )}
                </div>
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation("prev")}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/90 hover:bg-black rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleImageNavigation("next")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/90 hover:bg-black rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opa city"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4 text-white" />
                    </button>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {selectedImageIndex + 1} / {product.images.length}
                    </div>
                  </>
                )}
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-w-md mx-auto">
                {product.images.map((image, index) => (
                  <button
                    key={image._key}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-[0.5px] transition-all ${
                      selectedImageIndex === index
                        ? "border-[#A64D9D] shadow-md"
                        : "border-[#A64D9D]/50 hover:border-[#A64D9D]"
                    }`}
                  >
                    {image.asset ? (
                      <Image
                        src={urlFor(image).url()}
                        alt={image.alt || `${product.name} ${index + 1}`}
                        fill
                        className="object-contain p-1 rounded-lg"
                        sizes="(max-width: 1024px) 20vw, 10vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black rounded-lg">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">{product.name}</h1>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="rounded-full border-[0.5px] border-[#A64D9D] hover:border-[#D946EF] transition-all hover:scale-105 bg-transparent hover:bg-[#A64D9D]/10"
                  >
                    <Share2 className="h-4 w-4 text-white fill-white" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-white">PKR {displayPrice.toFixed(2)}</span>
                </div>
                {product.categories && product.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/category/${category.slug.current}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#A64D9D]/20 text-white hover:bg-[#A64D9D]/40 transition-all"
                      >
                        {category.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Separator className="bg-[#A64D9D]/50" />
            {product.description && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Description</h3>
                <div className="prose prose-gray max-w-none">
                  <p
                    className={`text-white leading-relaxed ${
                      !showFullDescription && product.description.length > 200 ? "line-clamp-3" : ""
                    }`}
                  >
                    {product.description}
                  </p>
                  {product.description.length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-[#A64D9D] hover:text-[#D946EF] font-medium mt-2 transition-colors"
                    >
                      {showFullDescription ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            )}
            {product.volume && product.volume.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Volume (ML)</h3>
                <div className="grid grid-cols-6 gap-2">
                  {product.volume.map((vol) => (
                    <button
                      key={vol}
                      onClick={() => setSelectedVolume(vol)}
                      className={`relative py-2 px-3 text-sm font-semibold rounded-lg border-[0.5px] transition-all ${
                        selectedVolume === vol
                          ? "border-[#A64D9D] bg-[#A64D9D]/20 text-white"
                          : "border-[#A64D9D]/50 hover:border-[#A64D9D] text-white"
                      }`}
                    >
                      {vol}
                      {selectedVolume === vol && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#A64D9D] rounded-full flex items-center justify-center">
                          <Check className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-[0.5px] border-[#A64D9D] rounded-lg overflow-hidden">
                  <button
                    onClick={() => adjustQuantity(-1)}
                    className="px-3 py-2 text-white hover:bg-[#A64D9D]/20 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-lg font-semibold text-white border-x-[0.5px] border-[#A64D9D] min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => adjustQuantity(1)}
                    className="px-3 py-2 text-white hover:bg-[#A64D9D]/20 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm text-white">
                  <span className="text-green-400 font-medium">✓ In Stock</span>
                  <br />
                  Ready to ship
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!isSelectionComplete || isAddingToCart}
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-[#A64D9D] to-[#D946EF] text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart - PKR {subtotal.toFixed(2)}
                  </div>
                )}
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={!isSelectionComplete}
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Buy Now
                </div>
              </Button>
            </div>
            <div className="border-[0.5px] border-[#A64D9D] rounded-lg p-4 space-y-3 bg-black/30">
              <h3 className="text-lg font-semibold text-white">Why Choose Us?</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Truck, title: "Free Shipping", desc: "On orders over PKR 2000" },
                  { icon: RotateCcw, title: "Easy Returns", desc: "30 day policy" },
                  { icon: Shield, title: "Secure Payment", desc: "Data protected" },
                  { icon: Headphones, title: "24/7 Support", desc: "Always available" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#A64D9D]/10 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-[#A64D9D]/20">
                      <Icon className="h-4 w-4 text-[#A64D9D]" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{title}</p>
                      <p className="text-xs text-white/80">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="mt-16 w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">You Might Also Like</h2>
            <p className="text-white/80">Discover more amazing products</p>
          </div>
          <div className="bg-[#222222] border-t-[0.5px] border-b-[0.5px] border-[#A64D9D] py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
                  <RelatedProductCard key={relatedProduct._id} relatedProduct={relatedProduct} index={index} />
                ))}
              </div>

              {/* Mobile Carousel */}
              <div className="md:hidden">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {relatedProducts.map((relatedProduct, index) => (
                      <CarouselItem key={relatedProduct._id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3">
                        <RelatedProductCard relatedProduct={relatedProduct} index={index} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex -left-12 border-[#A64D9D] bg-black/50 hover:bg-[#A64D9D]/20 text-white" />
                  <CarouselNext className="hidden sm:flex -right-12 border-[#A64D9D] bg-black/50 hover:bg-[#A64D9D]/20 text-white" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}