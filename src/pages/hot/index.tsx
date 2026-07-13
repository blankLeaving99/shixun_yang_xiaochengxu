import { View, Text, Image } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Network } from '@/network';
import { Flame } from 'lucide-react-taro';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number;
  image_url: string;
  sales_count: number;
  is_hot: boolean;
}

const HotPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotProducts();
  }, []);

  const fetchHotProducts = async () => {
    try {
      const res = await Network.request({ url: '/api/products/hot', method: 'GET' });
      console.log('热销商品响应:', res.data);
      if (res.data?.data) {
        setProducts(res.data.data as Product[]);
      }
    } catch (error) {
      console.error('获取热销商品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${id}` });
  };

  return (
    <View className="px-4 py-3 bg-[#f8f8fc] min-h-screen pb-24">
      <View className="flex items-center mb-3">
        <Flame size={18} color="#ff3b30" className="mr-2" />
        <Text className="text-base font-semibold text-gray-800">热销排行榜</Text>
      </View>

      {loading ? (
        <View className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <View key={i} className="bg-white rounded-2xl overflow-hidden">
              <View className="w-full h-28 bg-gray-100" />
              <View className="p-3">
                <View className="w-full h-4 bg-gray-100 rounded mb-2" />
                <View className="w-3/4 h-3 bg-gray-100 rounded" />
              </View>
            </View>
          ))}
        </View>
      ) : products.length === 0 ? (
        <View className="flex flex-col justify-center items-center h-48">
          <Text className="block text-gray-400 text-sm">暂无热销商品</Text>
        </View>
      ) : (
        <View className="grid grid-cols-2 gap-3">
          {products.map((product, index) => (
            <View
              key={product.id}
              className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 active:opacity-80"
              onClick={() => goToDetail(product.id)}
            >
              <View className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-28 rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                  <Image
                    className="w-full h-full rounded-xl"
                    src={product.image_url}
                    mode="aspectFill"
                  />
                ) : (
                  <Flame size={32} color="#999" />
                )}
                {index < 3 && (
                  <View
                    className="absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: index === 0 ? '#E11D48' : index === 1 ? '#F59E0B' : '#2563EB' }}
                  >
                    <Text className="block text-white text-xs font-bold">{index + 1}</Text>
                  </View>
                )}
              </View>
              <Text className="block text-sm font-semibold text-gray-800 truncate">
                {product.name}
              </Text>
              <View className="flex items-baseline mt-1">
                <Text className="block text-base font-bold text-red-500">
                  ¥{product.price}
                </Text>
                {product.original_price > product.price && (
                  <Text className="block text-xs text-gray-400 line-through ml-2">
                    ¥{product.original_price}
                  </Text>
                )}
              </View>
              <View className="flex items-center justify-between mt-1">
                <Text className="block text-xs text-gray-400">已售{product.sales_count}</Text>
                <View className="bg-red-50 rounded-full px-2 py-1">
                  <Text className="block text-xs text-red-500">TOP {index + 1}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default HotPage;