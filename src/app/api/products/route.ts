import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'src/data/products.json');

const getProducts = () => {
  if (!fs.existsSync(PRODUCTS_FILE)) return [];
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  return JSON.parse(data);
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const sort = searchParams.get('sort') || 'newest';

  let products = getProducts();

  if (search) {
    products = products.filter((p: any) => 
      p.title.toLowerCase().includes(search) || 
      p.description.toLowerCase().includes(search) ||
      p.categories.some((c: string) => c.toLowerCase().includes(search))
    );
  }

  if (sort === 'price-asc') {
    products.sort((a: any, b: any) => a.price - b.price);
  } else if (sort === 'price-desc') {
    products.sort((a: any, b: any) => b.price - a.price);
  }

  return NextResponse.json(products);
}
