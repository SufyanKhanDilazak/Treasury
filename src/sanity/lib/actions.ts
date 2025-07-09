// src/lib/actions.ts
'use server'

import { 
  getCachedProducts, 
  getCachedHomepageProducts,
  getCachedCategories,
  getCachedProductsByCategory,
  getCachedProductBySlug,
  getCachedCategoryBySlug,
  groupProductsByCategory, 
  getLimitedProductsByCategory,
  type Product, 
  type Category,
  type GroupedProducts 
} from '@/sanity/lib/data';

// Get products grouped by category for homepage (5 products per category)
export async function getHomepageProducts(): Promise<GroupedProducts> {
  try {
    const products = await getCachedHomepageProducts();
    
    // Filter out products without proper data
    const validProducts = products.filter(product => 
      product && 
      product._id && 
      product.name && 
      typeof product.price === 'number' &&
      product.inStock !== false // Include products that are in stock or stock status is undefined
    );

    const grouped = groupProductsByCategory(validProducts);
    
    // Ensure we have at least some products per category, but limit to 5 for homepage
    const limited = getLimitedProductsByCategory(grouped, 5);
    
    return limited;
  } catch (error) {
    console.error('Error fetching homepage products:', error);
    // Return empty structure instead of throwing to prevent page crashes
    return {};
  }
}

// Get all products grouped by category
export async function getProductsGroupedByCategory(): Promise<GroupedProducts> {
  try {
    const products = await getCachedProducts();
    
    // Filter and validate products
    const validProducts = products.filter(product => 
      product && 
      product._id && 
      product.name && 
      typeof product.price === 'number'
    );

    return groupProductsByCategory(validProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return {};
  }
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await getCachedProducts();
    
    // Filter and validate products
    return products.filter(product => 
      product && 
      product._id && 
      product.name && 
      typeof product.price === 'number'
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await getCachedCategories();
    
    // Filter and validate categories
    return categories.filter(category => 
      category && 
      category._id && 
      category.title && 
      category.slug?.current
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Get products by specific category
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    if (!categoryId) {
      return [];
    }

    const products = await getCachedProductsByCategory(categoryId);
    
    // Filter and validate products
    return products.filter(product => 
      product && 
      product._id && 
      product.name && 
      typeof product.price === 'number'
    );
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Get single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    if (!slug) {
      return null;
    }

    const product = await getCachedProductBySlug(slug);
    
    // Validate product data
    if (product && product._id && product.name && typeof product.price === 'number') {
      return product;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    if (!slug) {
      return null;
    }

    const category = await getCachedCategoryBySlug(slug);
    
    // Validate category data
    if (category && category._id && category.title && category.slug?.current) {
      return category;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}