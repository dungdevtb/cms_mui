export const navigations = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'PAGES', type: 'label' },
  {
    name: 'Session/Auth',
    icon: 'security',
    children: [
      { name: 'Sign in', iconText: 'SI', path: '/session/signin' },
      { name: 'Sign up', iconText: 'SU', path: '/session/signup' },
      { name: 'Forgot Password', iconText: 'FP', path: '/session/forgot-password' },
      { name: 'Error', iconText: '404', path: '/session/404' }
    ]
  },
  {
    name: 'Quản trị hệ thống',
    icon: 'build',
    children: [
      { name: 'Quản lý admin', iconText: 'SI', path: '/admin/manage' },
      { name: 'Quản lý vai trò', iconText: 'SU', path: '/admin/role' },
      { name: 'Quản lý quyền', iconText: 'FP', path: '/admin/permission' },
    ]
  },
  {
    name: 'Quản lý tin tức',
    icon: 'desktop_mac',
    children: [
      { name: 'Danh sách bài viết', iconText: 'SI', path: '/content/list' },
      { name: 'Danh sách nhãn', iconText: 'SU', path: '/content/tag' },
      { name: 'Danh mục bài viết', iconText: 'FP', path: '/content/category' },
      { name: 'Danh sách video', iconText: 'FP', path: '/news/video' },
    ]
  },
  {
    name: 'Quản lý đơn hàng',
    icon: 'shop',
    children: [
      { name: 'Danh sách đơn hàng', iconText: 'SI', path: '/order/list' },
      { name: 'Danh sách voucher', iconText: 'SU', path: '/voucher/list' },
      // { name: 'Danh sách quà tặng cho khách hàng', iconText: 'FP', path: '/voucher/gift-to-user' },
    ]
  },
  {
    name: 'Quản lý kho hàng',
    icon: 'shopping_cart',
    children: [
      { name: 'Danh sách sản phẩm', iconText: 'SI', path: '/product/list' },
      { name: 'Danh sách brand', iconText: 'FG', path: '/product/brand' },
      { name: 'Quản lý danh mục', iconText: 'SU', path: '/product/category' },
    ]
  },
  {
    name: 'Quản lý dự án',
    icon: 'subtitles',
    children: [
      { name: 'Quản lý admin', iconText: 'SI', path: '/admin/manage' },
      { name: 'Quản lý vai trò', iconText: 'SU', path: '/admin/role' },
      { name: 'Quản lý quyền', iconText: 'FP', path: '/admin/permission' },
    ]
  },
  {
    name: 'Quản lý khách hàng',
    icon: 'person',
    children: [
      { name: 'Danh sách khách hàng', iconText: 'SI', path: '/customer/list' },
      // { name: 'Quản lý vai trò', iconText: 'SU', path: '/admin/role' },
      // { name: 'Quản lý quyền', iconText: 'FP', path: '/admin/permission' },
    ]
  },
  {
    name: 'Quản lý giao dịch',
    icon: 'monetization_on',
    children: [
      { name: 'Danh sách nhập hàng', iconText: 'SI', path: '/admin/manage' },
      { name: 'Danh sách bán hàng', iconText: 'SU', path: '/admin/role' },
      { name: 'Top bán chạy', iconText: 'FP', path: '/admin/permission' },
    ]
  },

  { label: 'Components', type: 'label' },
  {
    name: 'Components',
    icon: 'favorite',
    badge: { value: '30+', color: 'secondary' },
    children: [
      { name: 'Auto Complete', path: '/material/autocomplete', iconText: 'A' },
      { name: 'Buttons', path: '/material/buttons', iconText: 'B' },
      { name: 'Checkbox', path: '/material/checkbox', iconText: 'C' },
      { name: 'Dialog', path: '/material/dialog', iconText: 'D' },
      { name: 'Expansion Panel', path: '/material/expansion-panel', iconText: 'E' },
      { name: 'Form', path: '/material/form', iconText: 'F' },
      { name: 'Icons', path: '/material/icons', iconText: 'I' },
      { name: 'Menu', path: '/material/menu', iconText: 'M' },
      { name: 'Progress', path: '/material/progress', iconText: 'P' },
      { name: 'Radio', path: '/material/radio', iconText: 'R' },
      { name: 'Switch', path: '/material/switch', iconText: 'S' },
      { name: 'Slider', path: '/material/slider', iconText: 'S' },
      { name: 'Snackbar', path: '/material/snackbar', iconText: 'S' },
      { name: 'Table', path: '/material/table', iconText: 'T' }
    ]
  },
  {
    name: 'Charts',
    icon: 'trending_up',
    children: [{ name: 'Echarts', path: '/charts/echarts', iconText: 'E' }]
  },
  {
    name: 'Doc',
    icon: 'launch',
    type: 'extLink',
    path: 'http://demos.ui-lib.com/matx-react-doc/'
  }
];
