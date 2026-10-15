import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Product = CollectionEntry<'products'>;
export type Bundle = CollectionEntry<'bundles'>;
export type Accessory = CollectionEntry<'accessories'>;

export async function getSettings() {
  const entry = await getEntry('settings', 'settings');
  if (!entry) throw new Error('Missing src/content/settings.yaml');
  return entry.data;
}

export async function getHome() {
  const entry = await getEntry('home', 'home');
  if (!entry) throw new Error('Missing src/content/home.yaml');
  return entry.data;
}

export async function getFaqs() {
  const entry = await getEntry('faqs', 'faqs');
  if (!entry) throw new Error('Missing src/content/faqs.yaml');
  return entry.data;
}

export async function getCompare() {
  const entry = await getEntry('compare', 'compare');
  if (!entry) throw new Error('Missing src/content/compare.yaml');
  return entry.data;
}

function byOrder<T extends { data: { order: number }; id: string }>(items: T[]) {
  return [...items].sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}

export async function getProducts() {
  return byOrder(await getCollection('products')).filter((item) => item.data.status !== 'hidden');
}

export async function getActiveProducts() {
  return (await getProducts()).filter((item) => item.data.status === 'active');
}

export async function getBundles() {
  return byOrder(await getCollection('bundles')).filter((item) => item.data.status !== 'hidden');
}

export async function getActiveBundles() {
  return (await getBundles()).filter((item) => item.data.status === 'active');
}

export async function getAccessories() {
  return byOrder(await getCollection('accessories')).filter((item) => item.data.status !== 'hidden');
}

export function productHref(product: Product) {
  return product.data.status === 'active' ? `/products/${product.id}/` : '/products/#coming-soon';
}

export function bundleHref(bundle: Bundle) {
  return bundle.data.status === 'active' ? `/bundles/${bundle.id}/` : '/products/#bundles';
}

export function findProduct(products: Product[], id: string) {
  return products.find((item) => item.id === id);
}

export function findFaq(faqs: Awaited<ReturnType<typeof getFaqs>>, question: string) {
  for (const group of faqs.groups) {
    const match = group.items.find((item) => item.q === question);
    if (match) return match;
  }
  return undefined;
}
