import { View, Text, Image, Checkbox } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Network } from '@/network';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react-taro';

interface CartItem {
  id: string;
  product_id: number;
  quantity: number;
  selected: boolean;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  selectedCount: number;
}

const CartPage = () => {
  const [cart, setCart] = useState<CartState>({ items: [], totalPrice: 0, selectedCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await Network.request({ url: '/api/cart', method: 'GET' });
      console.log('购物车响应:', res.data);
      if (res.data?.data) {
        const items = res.data.data as CartItem[];
        calculateTotals(items);
      }
    } catch (error) {
      console.error('获取购物车失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (items: CartItem[]) => {
    const selectedItems = items.filter(item => item.selected);
    const totalPrice = selectedItems.reduce(
      (sum, item) => sum + item.quantity * Number(item.product?.price || 0),
      0
    );
    setCart({
      items,
      totalPrice,
      selectedCount: selectedItems.length,
    });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await Network.request({
        url: `/api/cart/${id}/quantity`,
        method: 'PUT',
        data: { quantity },
      });
      const newItems = cart.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      calculateTotals(newItems);
    } catch (error) {
      console.error('更新数量失败:', error);
    }
  };

  const updateSelected = async (id: string, selected: boolean) => {
    try {
      await Network.request({
        url: `/api/cart/${id}/selected`,
        method: 'PUT',
        data: { selected },
      });
      const newItems = cart.items.map(item =>
        item.id === id ? { ...item, selected } : item
      );
      calculateTotals(newItems);
    } catch (error) {
      console.error('更新选中状态失败:', error);
    }
  };

  const removeItem = async (id: string) => {
    try {
      await Network.request({
        url: `/api/cart/${id}`,
        method: 'DELETE',
      });
      const newItems = cart.items.filter(item => item.id !== id);
      calculateTotals(newItems);
      Taro.showToast({ title: '已删除', icon: 'success' });
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const goToDetail = (productId: number) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${productId}` });
  };

  return (
    <View className="flex flex-col h-full bg-background">
      {/* 头部 */}
      <View className="flex flex-row items-center justify-between px-4 py-3 bg-white">
        <Text className="block text-lg font-bold text-gray-900">购物车</Text>
        <Text className="block text-sm text-gray-500">共{cart.items.length}件</Text>
      </View>

      {/* 商品列表 */}
      <View className="flex-1 overflow-y-auto">
        {loading ? (
          <View className="flex flex-col justify-center items-center h-48">
            <Text className="block text-gray-400 text-sm">加载中...</Text>
          </View>
        ) : cart.items.length === 0 ? (
          <View className="flex flex-col justify-center items-center h-48">
            <ShoppingCart size={48} color="#999" />
            <Text className="block text-gray-400 text-sm mt-2">购物车空空如也</Text>
            <Button
              className="mt-3 bg-rose-600 text-white rounded-lg"
              onClick={() => Taro.switchTab({ url: '/pages/index/index' })}
            >
              <Text className="block text-sm">去购物</Text>
            </Button>
          </View>
        ) : (
          <View className="flex flex-col gap-3 px-3 py-3">
            {cart.items.map(item => (
              <View
                key={item.id}
                className="flex flex-row items-center gap-3 p-3 bg-white rounded-xl"
              >
                {/* 选择框 */}
                <Checkbox
                  value={item.id}
                  checked={item.selected}
                  onChange={(e) => updateSelected(item.id, e.detail.value.includes(item.id))}
                  className="w-5 h-5"
                />

                {/* 商品图片 */}
                <View
                  className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center"
                  onClick={() => goToDetail(item.product_id)}
                >
                  {item.product?.image_url ? (
                    <Image
                      className="w-full h-full rounded-lg"
                      src={item.product.image_url}
                      mode="aspectFill"
                    />
                  ) : (
                    <ShoppingCart size={32} color="#999" />
                  )}
                </View>

                {/* 商品信息 */}
                <View className="flex-1 flex flex-col justify-between">
                  <View>
                    <Text
                      className="block text-sm font-medium text-gray-900 truncate"
                      onClick={() => goToDetail(item.product_id)}
                    >
                      {item.product?.name}
                    </Text>
                    <Text className="block text-base font-bold text-rose-600 mt-1">
                      ¥{item.product?.price}
                    </Text>
                  </View>

                  <View className="flex flex-row items-center justify-between">
                    {/* 数量控制 */}
                    <View className="flex flex-row items-center gap-2">
                      <View
                        className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} color="#666" />
                      </View>
                      <Text className="block text-sm w-6 text-center">{item.quantity}</Text>
                      <View
                        className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} color="#666" />
                      </View>
                    </View>

                    {/* 删除 */}
                    <View onClick={() => removeItem(item.id)}>
                      <Trash2 size={18} color="#999" />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 底部结算栏 */}
      {cart.items.length > 0 && (
        <View
          style={{
            position: 'fixed',
            bottom: 50,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#fff',
            borderTop: '1px solid #e5e5e5',
            zIndex: 100,
          }}
        >
          <View className="flex flex-row items-center gap-2">
            <Text className="block text-sm text-gray-500">合计:</Text>
            <Text className="block text-lg font-bold text-rose-600">
              ¥{cart.totalPrice.toFixed(2)}
            </Text>
          </View>
          <Button className="flex-1 bg-rose-600 text-white rounded-lg">
            <Text className="block text-sm font-medium">
              结算({cart.selectedCount})
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default CartPage;