import { View, Text } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Network } from '@/network';
import { Card, CardContent } from '@/components/ui/card';
import { User, MapPin, Package, Heart, Settings, ChevronRight } from 'lucide-react-taro';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  is_default: boolean;
}

const ProfilePage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await Network.request({ url: '/api/addresses', method: 'GET' });
      console.log('地址列表响应:', res.data);
      if (res.data?.data) {
        setAddresses(res.data.data as Address[]);
      }
    } catch (error) {
      console.error('获取地址失败:', error);
    }
  };

  const goToAddressManage = () => {
    Taro.navigateTo({ url: '/pages/address/index' });
  };

  const defaultAddress = addresses.find(a => a.is_default);

  return (
    <View className="flex flex-col h-full bg-gray-50">
      {/* 用户信息头部 */}
      <View className="flex flex-col items-center py-6 bg-gradient-to-b from-rose-600 to-rose-500">
        <View className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3">
          <User size={32} color="#E11D48" />
        </View>
        <Text className="block text-white text-lg font-bold">福理工用户</Text>
        <Text className="block text-white text-sm opacity-90 mt-1">欢迎使用在线商城</Text>
      </View>

      {/* 功能入口 */}
      <View className="px-3 py-4">
        {/* 我的订单 */}
        <Card className="rounded-xl mb-3">
          <CardContent className="p-0">
            <View className="flex flex-row items-center justify-between p-4">
              <View className="flex flex-row items-center gap-3">
                <Package size={20} color="#E11D48" />
                <Text className="block text-sm font-medium text-gray-900">我的订单</Text>
              </View>
              <ChevronRight size={16} color="#999" />
            </View>
            <View className="flex flex-row justify-around py-3 border-t border-gray-100">
              <View className="flex flex-col items-center">
                <Text className="block text-xs text-gray-500">待付款</Text>
                <Text className="block text-base font-bold text-gray-900 mt-1">0</Text>
              </View>
              <View className="flex flex-col items-center">
                <Text className="block text-xs text-gray-500">待发货</Text>
                <Text className="block text-base font-bold text-gray-900 mt-1">0</Text>
              </View>
              <View className="flex flex-col items-center">
                <Text className="block text-xs text-gray-500">待收货</Text>
                <Text className="block text-base font-bold text-gray-900 mt-1">0</Text>
              </View>
              <View className="flex flex-col items-center">
                <Text className="block text-xs text-gray-500">已完成</Text>
                <Text className="block text-base font-bold text-gray-900 mt-1">0</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 地址管理 */}
        <Card className="rounded-xl mb-3" onClick={goToAddressManage}>
          <CardContent className="p-0">
            <View className="flex flex-row items-center justify-between p-4">
              <View className="flex flex-row items-center gap-3">
                <MapPin size={20} color="#E11D48" />
                <Text className="block text-sm font-medium text-gray-900">地址管理</Text>
              </View>
              <View className="flex flex-row items-center gap-2">
                {defaultAddress && (
                  <Text className="block text-xs text-gray-500 truncate max-w-24">
                    {defaultAddress.address}
                  </Text>
                )}
                <ChevronRight size={16} color="#999" />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 其他功能 */}
        <Card className="rounded-xl mb-3">
          <CardContent className="p-0">
            <View className="flex flex-row items-center justify-between p-4 border-b border-gray-100">
              <View className="flex flex-row items-center gap-3">
                <Heart size={20} color="#E11D48" />
                <Text className="block text-sm font-medium text-gray-900">我的收藏</Text>
              </View>
              <ChevronRight size={16} color="#999" />
            </View>
            <View className="flex flex-row items-center justify-between p-4">
              <View className="flex flex-row items-center gap-3">
                <Settings size={20} color="#E11D48" />
                <Text className="block text-sm font-medium text-gray-900">设置</Text>
              </View>
              <ChevronRight size={16} color="#999" />
            </View>
          </CardContent>
        </Card>
      </View>
    </View>
  );
};

export default ProfilePage;