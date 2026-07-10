import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export interface Address {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  is_default: boolean;
}

@Injectable()
export class AddressesService {
  private tempUserId = '00000000-0000-0000-0000-000000000001';

  async findAll(): Promise<Address[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('addresses')
      .select('*')
      .eq('user_id', this.tempUserId)
      .order('is_default', { ascending: false });
    
    if (error) throw new Error(`查询地址失败: ${error.message}`);
    return data as Address[];
  }

  async findOne(id: string): Promise<Address | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('addresses')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw new Error(`查询地址详情失败: ${error.message}`);
    return data as Address | null;
  }

  async create(address: Omit<Address, 'id' | 'user_id'>): Promise<Address> {
    const client = getSupabaseClient();
    
    // 如果设置为默认，先取消其他默认地址
    if (address.is_default) {
      await client
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', this.tempUserId)
        .eq('is_default', true);
    }
    
    const { data, error } = await client
      .from('addresses')
      .insert({
        user_id: this.tempUserId,
        ...address,
      })
      .select()
      .maybeSingle();
    
    if (error) throw new Error(`创建地址失败: ${error.message}`);
    return data as Address;
  }

  async update(id: string, address: Partial<Address>): Promise<Address> {
    const client = getSupabaseClient();
    
    // 如果设置为默认，先取消其他默认地址
    if (address.is_default) {
      await client
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', this.tempUserId)
        .eq('is_default', true);
    }
    
    const { data, error } = await client
      .from('addresses')
      .update(address)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw new Error(`更新地址失败: ${error.message}`);
    return data as Address;
  }

  async remove(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('addresses')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(`删除地址失败: ${error.message}`);
  }

  async setDefault(id: string): Promise<Address> {
    return this.update(id, { is_default: true });
  }
}