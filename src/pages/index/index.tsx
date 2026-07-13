import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Network } from '@/network';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Tag, Gift, Zap } from 'lucide-react-taro';

// 商品类型
interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number;
  image_url: string;
  sales_count: number;
  is_hot: boolean;
}

// 轮播数据（示例）
const banners = [
  { id: 1, title: '福理工商城开学季大促', subtitle: '全场满100减20', color: '#E11D48' },
  { id: 2, title: '新学期装备特惠', subtitle: '文具用品低至5折', color: '#2563EB' },
  { id: 3, title: '校园生活好物', subtitle: '精选生活用品热销', color: '#059669' },
];

// 分类入口
const categories = [
  { icon: Flame, name: '热销榜', color: '#E11D48', page: '/pages/hot/index' },
  { icon: Tag, name: '文具', color: '#2563EB' },
  { icon: Gift, name: '生活', color: '#059669' },
  { icon: Zap, name: '数码', color: '#8B5CF6' },
];

const IndexPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await Network.request({ url: '/api/products', method: 'GET' });
      console.log('商品列表响应:', res.data);
      if (res.data?.data) {
        setProducts(res.data.data as Product[]);
      }
    } catch (error) {
      console.error('获取商品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${id}` });
  };

  const goToHot = () => {
    Taro.switchTab({ url: '/pages/hot/index' });
  };

  return (
    <View className="flex flex-col h-full bg-background">
      {/* 轮播区域 */}
      <Swiper
        className="w-full h-32"
        indicatorColor="#999"
        indicatorActiveColor="#E11D48"
        circular
        indicatorDots
        autoplay
      >
        {banners.map((banner) => (
          <SwiperItem key={banner.id}>
            <View
              className="w-full h-full flex flex-col justify-center items-center px-4"
              style={{ backgroundColor: banner.color }}
            >
              <Text className="block text-white text-lg font-bold mb-1">{banner.title}</Text>
              <Text className="block text-white text-sm opacity-90">{banner.subtitle}</Text>
            </View>
          </SwiperItem>
        ))}
      </Swiper>

      {/* 分类快捷入口 */}
      <View className="flex flex-row justify-around py-3 bg-white">
        {categories.map((cat, idx) => (
          <View
            key={idx}
            className="flex flex-col items-center gap-1"
            onClick={() => {
              if (cat.page && cat.name === '热销榜') {
                goToHot();
              }
            }}
          >
            <View
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: cat.color }}
            >
              <cat.icon size={20} color="#FFFFFF" />
            </View>
            <Text className="block text-sm text-gray-700">{cat.name}</Text>
          </View>
        ))}
      </View>

      {/* 商品网格 */}
      <View className="flex-1 px-2 py-3 overflow-y-auto">
        <View className="flex flex-row justify-between items-center mb-3 px-2">
          <Text className="block text-base font-semibold text-gray-900">精选商品</Text>
          <View className="flex flex-row items-center gap-1" onClick={goToHot}>
            <Text className="block text-sm text-gray-500">更多</Text>
          </View>
        </View>

        {loading ? (
          <View className="flex flex-col justify-center items-center h-48">
            <Text className="block text-gray-400 text-sm">加载中...</Text>
          </View>
        ) : products.length === 0 ? (
          <View className="flex flex-col justify-center items-center h-48">
            <Text className="block text-gray-400 text-sm">暂无商品</Text>
          </View>
        ) : (
          <View>
            {Array.from({ length: Math.ceil(products.length / 2) }, (_, rowIndex) => (
              <View key={rowIndex} className="flex flex-row gap-2 mb-2">
                {products.slice(rowIndex * 2, rowIndex * 2 + 2).map((product) => (
                  <Card
                    key={product.id}
                    className="flex-1 rounded-xl overflow-hidden"
                    onClick={() => goToDetail(product.id)}
                  >
                    <CardContent className="p-0">
                      <View className="w-full h-24 bg-gray-100 flex items-center justify-center">
                        {product.image_url ? (
                          <Image
                            className="w-full h-full"
                            src={product.image_url}
                            mode="aspectFill"
                          />
                        ) : (
                          <Gift size={32} color="#999" />
                        )}
                      </View>
                      <View className="p-2">
                        <Text className="block text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </Text>
                        <View className="flex flex-row items-center gap-1 mt-1">
                          <Text className="block text-base font-bold text-rose-600">
                            ¥{product.price}
                          </Text>
                          {product.original_price > product.price && (
                            <Text className="block text-xs text-gray-400 line-through">
                              ¥{product.original_price}
                            </Text>
                          )}
                        </View>
                        <View className="flex flex-row items-center gap-1 mt-1">
                          {product.is_hot && (
                            <Badge className="bg-rose-600 text-white text-xs px-1 py-1 rounded">
                              热销
                            </Badge>
                          )}
                          <Text className="block text-xs text-gray-400">
                            已售{product.sales_count}
                          </Text>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default IndexPage;