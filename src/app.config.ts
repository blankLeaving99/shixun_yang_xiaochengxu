export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/hot/index',
    'pages/cart/index',
    'pages/profile/index',
    'pages/detail/index',
    'pages/address/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '福理工商城',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#71717A',
    selectedColor: '#E11D48',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/hot/index',
        text: '热销',
        iconPath: './assets/tabbar/flame.png',
        selectedIconPath: './assets/tabbar/flame-active.png'
      },
      {
        pagePath: 'pages/cart/index',
        text: '购物车',
        iconPath: './assets/tabbar/shopping-cart.png',
        selectedIconPath: './assets/tabbar/shopping-cart-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png'
      }
    ]
  }
})