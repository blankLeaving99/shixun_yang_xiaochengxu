import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number;
  image_url: string;
  description: string;
  stock: number;
  sales_count: number;
  is_hot: boolean;
  category: string;
  created_at: string;
}

@Injectable()
export class ProductsService {
  async findAll(): Promise<Product[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('sales_count', { ascending: false })
      .limit(20);
    
    if (error) throw new Error(`查询商品失败: ${error.message}`);
    return data as Product[];
  }

  async findOne(id: string): Promise<Product | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw new Error(`查询商品详情失败: ${error.message}`);
    return data as Product | null;
  }

  async findHot(): Promise<Product[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('is_hot', true)
      .order('sales_count', { ascending: false })
      .limit(10);
    
    if (error) throw new Error(`查询热销商品失败: ${error.message}`);
    return data as Product[];
  }
}