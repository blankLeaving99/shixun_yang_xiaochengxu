import { View, Text, Image } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Network } from '@/network';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame } from 'lucide-react-taro';

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
    <View className="flex flex-col h-full bg-background">
      {/* TOP 排行榜头部 */}
      <View className="flex flex-col items-center py-4 bg-gradient-to-b from-rose-600 to-rose-500">
        <Trophy size={32} color="#FFFFFF" />
        <Text className="block text-white text-lg font-bold mt-1">热销排行榜</Text>
        <Text className="block text-white text-sm opacity-90 mt-1">精选热卖好物</Text>
      </View>

      {/* 商品列表 */}
      <View className="flex-1 px-3 py-3 overflow-y-auto">
        {loading ? (
          <View className="flex flex-col justify-center items-center h-48">
            <Text className="block text-gray-400 text-sm">加载中...</Text>
          </View>
        ) : products.length === 0 ? (
          <View className="flex flex-col justify-center items-center h-48">
            <Text className="block text-gray-400 text-sm">暂无热销商品</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-3">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="rounded-xl overflow-hidden"
                onClick={() => goToDetail(product.id)}
              >
                <CardContent className="p-0 flex flex-row">
                  {/* 排名 */}
                  <View className="w-12 flex items-center justify-center bg-gray-50">
                    {index < 3 ? (
                      <View
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: index === 0 ? '#E11D48' : index === 1 ? '#F59E0B' : '#2563EB' }}
                      >
                        <Text className="block text-white text-xs font-bold">{index + 1}</Text>
                      </View>
                    ) : (
                      <Text className="block text-gray-400 text-sm">{index + 1}</Text>
                    )}
                  </View>

                  {/* 商品图片 */}
                  <View className="w-24 h-24 bg-gray-100 flex items-center justify-center">
                    {product.image_url ? (
                      <Image
                        className="w-full h-full object-cover"
                        src={product.image_url}
                        mode="aspectFill"
                      />
                    ) : (
                      <Flame size={32} color="#999" />
                    )}
                  </View>

                  {/* 商品信息 */}
                  <View className="flex-1 p-3 flex flex-col justify-between">
                    <View>
                      <Text className="block text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </Text>
                      <View className="flex flex-row items-center gap-1 mt-1">
                        <Badge className="bg-rose-600 text-white text-xs px-1 py-1 rounded">
                          TOP {index + 1}
                        </Badge>
                        <Text className="block text-xs text-gray-400">
                          已售{product.sales_count}
                        </Text>
                      </View>
                    </View>
                    <View className="flex flex-row items-center gap-1">
                      <Text className="block text-base font-bold text-rose-600">
                        ¥{product.price}
                      </Text>
                      {product.original_price > product.price && (
                        <Text className="block text-xs text-gray-400 line-through">
                          ¥{product.original_price}
                        </Text>
                      )}
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default HotPage;