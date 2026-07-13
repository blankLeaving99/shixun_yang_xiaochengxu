import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Network } from '@/network';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart } from 'lucide-react-taro';

interface Product {
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
}

const DetailPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const id = Taro.getCurrentInstance().router?.params?.id;
    if (id) {
      fetchProduct(id);
    }
  }, []);

  const fetchProduct = async (id: string) => {
    try {
      const res = await Network.request({ url: `/api/products/${id}`, method: 'GET' });
      console.log('商品详情响应:', res.data);
      if (res.data?.data) {
        setProduct(res.data.data as Product);
      }
    } catch (error) {
      console.error('获取商品详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      const res = await Network.request({
        url: '/api/cart/add',
        method: 'POST',
        data: {
          product_id: product.id,
          quantity,
        },
      });
      console.log('加入购物车响应:', res.data);
      if (res.data?.status === 'success') {
        Taro.showToast({ title: '已加入购物车', icon: 'success' });
      }
    } catch (error) {
      console.error('加入购物车失败:', error);
      Taro.showToast({ title: '添加失败', icon: 'error' });
    } finally {
      setAddingToCart(false);
    }
  };

  const goToCart = () => {
    Taro.switchTab({ url: '/pages/cart/index' });
  };

  if (loading) {
    return (
      <View className="flex flex-col justify-center items-center h-full">
        <Text className="block text-gray-400 text-sm">加载中...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex flex-col justify-center items-center h-full">
        <Text className="block text-gray-400 text-sm">商品不存在</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col h-full bg-background">
      {/* 商品图片 */}
      <Swiper className="w-full h-48" indicatorDots circular>
        <SwiperItem>
          <View className="w-full h-full bg-gray-100 flex items-center justify-center">
            {product.image_url ? (
              <Image className="w-full h-full" src={product.image_url} mode="aspectFill" />
            ) : (
              <ShoppingCart size={64} color="#999" />
            )}
          </View>
        </SwiperItem>
      </Swiper>

      {/* 商品信息 */}
      <View className="flex-1 px-4 py-4 overflow-y-auto">
        <View className="flex flex-row items-center gap-2 mb-2">
          {product.is_hot && (
            <Badge className="bg-rose-600 text-white text-xs px-2 py-1 rounded">
              热销
            </Badge>
          )}
          <Badge className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            {product.category}
          </Badge>
        </View>

        <Text className="block text-lg font-bold text-gray-900 mb-2">{product.name}</Text>

        <View className="flex flex-row items-center gap-2 mb-3">
          <Text className="block text-xl font-bold text-rose-600">¥{product.price}</Text>
          {product.original_price > product.price && (
            <Text className="block text-sm text-gray-400 line-through">
              ¥{product.original_price}
            </Text>
          )}
        </View>

        <View className="flex flex-row items-center gap-4 mb-4 text-sm text-gray-500">
          <Text className="block">库存: {product.stock}</Text>
          <Text className="block">已售: {product.sales_count}</Text>
        </View>

        {/* 商品描述 */}
        <View className="mb-4">
          <Text className="block text-sm font-medium text-gray-700 mb-2">商品描述</Text>
          <Text className="block text-sm text-gray-500">{product.description || '暂无描述'}</Text>
        </View>

        {/* 数量选择 */}
        <View className="flex flex-row items-center justify-between py-3 border-t border-gray-100">
          <Text className="block text-sm font-medium text-gray-700">购买数量</Text>
          <View className="flex flex-row items-center gap-2">
            <View
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus size={16} color="#666" />
            </View>
            <Text className="block text-base font-medium w-8 text-center">{quantity}</Text>
            <View
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus size={16} color="#666" />
            </View>
          </View>
        </View>
      </View>

      {/* 底部操作栏 */}
      <View
        style={{
          position: 'fixed',
          bottom: 50,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          padding: '12px',
          backgroundColor: '#fff',
          borderTop: '1px solid #e5e5e5',
          zIndex: 100,
        }}
      >
        <View className="flex flex-row items-center gap-3">
          <View className="flex flex-col items-center" onClick={goToCart}>
            <ShoppingCart size={20} color="#666" />
            <Text className="block text-xs text-gray-500">购物车</Text>
          </View>
        </View>
        <View className="flex flex-row gap-2 flex-1">
          <Button
            className="flex-1 bg-rose-600 text-white rounded-lg"
            onClick={addToCart}
            disabled={addingToCart}
          >
            <Text className="block text-sm font-medium">
              {addingToCart ? '添加中...' : '加入购物车'}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default DetailPage;