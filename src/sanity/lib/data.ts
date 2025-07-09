// /sanity/lib/data.ts
import { client } from './client';
import { 
  PRODUCTS_WITH_CATEGORIES_QUERY, 
  ALL_CATEGORIES_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  HOMEPAGE_PRODUCTS_QUERY
} from './queries';
import { unstable_cache } from 'next/cache';

export interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  description?: string;
  volume?: string[];
  onSale: boolean;
  newArrival: boolean;
  inStock: boolean;
  slug: { current: string };
  categories: Category[];
}

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  banner?: string;
}

export interface GroupedProducts {
  [categoryTitle: string]: {
    category: Category;
    products: Product[];
  };
}

// ISR: 60 seconds revalidation with tags for instant updates via webhook
export const getCachedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    return await client.fetch(PRODUCTS_WITH_CATEGORIES_QUERY);
  },
  ['products-with-categories'],
  {
    revalidate: 60, // ISR: 60 seconds
    tags: ['products', 'categories']
  }
);

export const getCachedHomepageProducts = unstable_cache(
  async (): Promise<Product[]> => {
    return await client.fetch(HOMEPAGE_PRODUCTS_QUERY);
  },
  ['homepage-products'],
  {
    revalidate: 60, // ISR: 60 seconds
    tags: ['products', 'homepage']
  }
);

export const getCachedCategories = unstable_cache(
  async (): Promise<Category[]> => {
    return await client.fetch(ALL_CATEGORIES_QUERY);
  },
  ['all-categories'],
  {
    revalidate: 60, // ISR: 60 seconds
    tags: ['categories']
  }
);

export const getCachedProductsByCategory = unstable_cache(
  async (categoryId: string): Promise<Product[]> => {
    return await client.fetch(PRODUCTS_BY_CATEGORY_QUERY, { categoryId });
  },
  ['products-by-category'],
  {
    revalidate: 60, // ISR: 60 seconds
    tags: ['products', 'categories']
  }
);

export const getCachedProductBySlug = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    return await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug });
  },
  ['product-by-slug'],
  {
    revalidate: 60, // ISR: 60 seconds
    tags: ['products']
  }
);

export const getCachedCategoryBySlug = unstable_cache(
  async (slug: string): Promise<Category | null> => {
    return await client.fetch(CATEGORY_BY_SLUG_QUERY, { slug });
  },
  ['category-by-slug'],
  {
    revalidate: 60, // ISR: 60 seconds
    tags: ['categories']
  }
);

// Group products by category
export function groupProductsByCategory(products: Product[]): GroupedProducts {
  const grouped: GroupedProducts = {};
  
  products.forEach(product => {
    if (product.categories && product.categories.length > 0) {
      product.categories.forEach(category => {
        if (!grouped[category.title]) {
          grouped[category.title] = {
            category,
            products: []
          };
        }
        grouped[category.title].products.push(product);
      });
    }
  });
  
  return grouped;
}

// Get limited products per category for homepage
export function getLimitedProductsByCategory(
  groupedProducts: GroupedProducts,
  limit: number = 5
): GroupedProducts {
  const limited: GroupedProducts = {};
  
  Object.keys(groupedProducts).forEach(categoryTitle => {
    limited[categoryTitle] = {
      category: groupedProducts[categoryTitle].category,
      products: groupedProducts[categoryTitle].products.slice(0, limit)
    };
  });
  
  return limited;
}

// Get display price (sale price if on sale, otherwise regular price)
export function getDisplayPrice(product: Product): number {
  return product.onSale && product.salePrice ? product.salePrice : product.price;
}

// Calculate discount percentage
export function getDiscountPercentage(product: Product): number {
  if (!product.onSale || !product.salePrice) return 0;
  return Math.round(((product.price - product.salePrice) / product.price) * 100);
}