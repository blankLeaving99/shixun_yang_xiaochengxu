import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: number;
  quantity: number;
  selected: boolean;
  product?: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

@Injectable()
export class CartService {
  // 临时用户ID（实际项目应从认证获取）
  private tempUserId = '00000000-0000-0000-0000-000000000001';

  async getCart(): Promise<CartItem[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_url,
          stock
        )
      `)
      .eq('user_id', this.tempUserId);
    
    if (error) throw new Error(`查询购物车失败: ${error.message}`);
    return data as CartItem[];
  }

  async addToCart(productId: number, quantity: number): Promise<CartItem> {
    const client = getSupabaseClient();
    
    // 先检查是否已存在
    const { data: existing, error: checkError } = await client
      .from('cart_items')
      .select('*')
      .eq('user_id', this.tempUserId)
      .eq('product_id', productId)
      .maybeSingle();
    
    if (checkError) throw new Error(`检查购物车失败: ${checkError.message}`);
    
    if (existing) {
      // 更新数量
      const newQuantity = existing.quantity + quantity;
      const { data, error } = await client
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existing.id)
        .select()
        .maybeSingle();
      
      if (error) throw new Error(`更新购物车失败: ${error.message}`);
      return data as CartItem;
    } else {
      // 新增
      const { data, error } = await client
        .from('cart_items')
        .insert({
          user_id: this.tempUserId,
          product_id: productId,
          quantity,
          selected: true,
        })
        .select()
        .maybeSingle();
      
      if (error) throw new Error(`添加到购物车失败: ${error.message}`);
      return data as CartItem;
    }
  }

  async updateQuantity(id: string, quantity: number): Promise<CartItem> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(`更新数量失败: ${error.message}`);
    return data as CartItem;
  }

  async updateSelected(id: string, selected: boolean): Promise<CartItem> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('cart_items')
      .update({ selected })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(`更新选中状态失败: ${error.message}`);
    return data as CartItem;
  }

  async removeFromCart(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('cart_items')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(`删除购物车项失败: ${error.message}`);
  }

  async clearCart(): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('cart_items')
      .delete()
      .eq('user_id', this.tempUserId);
    
    if (error) throw new Error(`清空购物车失败: ${error.message}`);
  }
}