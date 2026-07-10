export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '热销榜' })
  : { navigationBarTitleText: '热销榜' }