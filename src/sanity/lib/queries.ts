// /sanity/lib/queries.ts

// Main query for all products with categories (for homepage)
export const PRODUCTS_WITH_CATEGORIES_QUERY = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  name,
  price,
  "images": images[].asset->url,
  description,
  volume,
  onSale,
  newArrival,
  inStock,
  slug,
  "categories": categories[]-> {
    _id,
    title,
    slug,
    "categoryBanner": categoryBanner.asset->url,
    "categoryBannerAlt": categoryBanner.alt,
    "bannerImage": bannerImage.asset->url,
    "bannerImageAlt": bannerImage.alt
  }
}`;

// Query for products by specific category
export const PRODUCTS_BY_CATEGORY_QUERY = `*[_type == "product" && references($categoryId)] | order(_createdAt desc) {
  _id,
  name,
  price,
  "images": images[].asset->url,
  description,
  volume,
  onSale,
  newArrival,
  inStock,
  slug,
  "categories": categories[]-> {
    _id,
    title,
    slug,
    "banner": categoryBanner.asset->url,
    "bannerImage": bannerImage.asset->url
  }
}`;

// Query for single product by slug
export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  price,
  "images": images[].asset->url,
  description,
  volume,
  onSale,
  newArrival,
  inStock,
  slug,
  "categories": categories[]-> {
    _id,
    title,
    slug,
    "banner": categoryBanner.asset->url,
    "bannerImage": bannerImage.asset->url
  }
}`;

// Query for all categories
export const ALL_CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug,
  "categoryBanner": categoryBanner.asset->url,
  "categoryBannerAlt": categoryBanner.alt,
  "bannerImage": bannerImage.asset->url,
  "bannerImageAlt": bannerImage.alt
}`;

// Query for category by slug
export const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  "categoryBanner": categoryBanner.asset->url,
  "categoryBannerAlt": categoryBanner.alt,
  "bannerImage": bannerImage.asset->url,
  "bannerImageAlt": bannerImage.alt
}`;

// Query for featured/homepage products (limited per category)
export const HOMEPAGE_PRODUCTS_QUERY = `*[_type == "product" && inStock == true] | order(_createdAt desc) [0...36] {
  _id,
  name,
  price,
  "images": images[].asset->url,
  volume,
  onSale,
  newArrival,
  inStock,
  slug,
  "categories": categories[]-> {
    _id,
    title,
    slug,
    "banner": categoryBanner.asset->url,
    "bannerImage": bannerImage.asset->url
  }
}`;

// New query specifically for getting category with images
export const CATEGORY_WITH_IMAGES_QUERY = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  "categoryBanner": categoryBanner.asset->url,
  "categoryBannerAlt": categoryBanner.alt,
  "bannerImage": bannerImage.asset->url,
  "bannerImageAlt": bannerImage.alt
}`;

// Query specifically for banner category
export const BANNER_CATEGORY_QUERY = `*[_type == "category" && title == "banner" && defined(bannerImage)][0] {
  _id,
  title,
  slug,
  "bannerImageUrl": bannerImage.asset->url,
  "alt": bannerImage.alt
}`;