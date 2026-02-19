import { productDB } from './db';

const OFF_API_BASE = 'https://world.openfoodfacts.org/api/v2';

export interface NutrientLevels {
  fat?: string;
  salt?: string;
  'saturated-fat'?: string;
  sugars?: string;
}

export interface Product {
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  image_front_url?: string;
  nutrient_levels?: NutrientLevels;
  nutriments?: {
    'energy-kcal_100g'?: number;
    fat_100g?: number;
    'saturated-fat_100g'?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
    proteins_100g?: number;
    salt_100g?: number;
    sodium_100g?: number;
  };
  ingredients_text?: string;
  allergens?: string;
  categories?: string;
  labels?: string;
  countries?: string;
}

export interface ProductResponse {
  status: number;
  product?: Product;
}

export async function fetchProduct(barcode: string): Promise<Product | null> {
  const cached = await productDB.getProduct(barcode);
  if (cached) {
    console.log('Returning cached product for', barcode);
    return cached.data;
  }

  try {
    const response = await fetch(`${OFF_API_BASE}/product/${barcode}.json`, {
      headers: {
        'User-Agent': 'SuriPinoy/1.0 (Philippine Food Scanner)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductResponse = await response.json();

    if (data.status === 1 && data.product) {
      await productDB.saveProduct(barcode, data.product);
      return data.product;
    }

    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export function hasSangkapPinoyLabel(product: Product): boolean {
  if (!product.labels) return false;
  const labels = product.labels.toLowerCase();
  return labels.includes('sangkap pinoy') || labels.includes('sangkap-pinoy');
}

export function hasHighSugar(product: Product): boolean {
  if (!product.nutriments?.sugars_100g) return false;
  return product.nutriments.sugars_100g > 10;
}

export function hasHighSodium(product: Product): boolean {
  const sodium = product.nutriments?.sodium_100g ||
                 (product.nutriments?.salt_100g ? product.nutriments.salt_100g / 2.5 : 0);
  return sodium > 0.3;
}

export function isPhilippineProduct(product: Product): boolean {
  if (!product.countries) return false;
  const countries = product.countries.toLowerCase();
  return countries.includes('philippines') || countries.includes('pilipinas');
}
