import { lazy } from 'react';
import Loadable from 'app/components/Loadable';
import ManageProduct from './product/ManageProduct';
import ManageCategory from './product/MannageCategory';
import ManageBrand from './product/ManageBrand';
import ManageProductType from './product/ManageProductType';
import ManageVoucher from './order-voucher/ManageVoucher';
import ManagePostCategory from './post/ManagePostCategory';
import ManagePostTag from './post/ManagePostTag';
import ManagePost from './post/ManagePost';
import ManageCustomer from './customer/ManageCustomer';
import ManageOrder from './order-voucher/ManageOrder';
import DetailOrder from './order-voucher/DetailOrder';
import ManageBanner from './banner/ManageBanner';
import ListGuitar from './guitar/ListGuitar';

const AppTable = Loadable(lazy(() => import('./tables/AppTable')));
const AppForm = Loadable(lazy(() => import('./forms/AppForm')));
const AppButton = Loadable(lazy(() => import('./buttons/AppButton')));
const AppIcon = Loadable(lazy(() => import('./icons/AppIcon')));
const AppProgress = Loadable(lazy(() => import('./AppProgress')));
const AppMenu = Loadable(lazy(() => import('./menu/AppMenu')));
const AppCheckbox = Loadable(lazy(() => import('./checkbox/AppCheckbox')));
const AppSwitch = Loadable(lazy(() => import('./switch/AppSwitch')));
const AppRadio = Loadable(lazy(() => import('./radio/AppRadio')));
const AppSlider = Loadable(lazy(() => import('./slider/AppSlider')));
const AppDialog = Loadable(lazy(() => import('./dialog/AppDialog')));
const AppSnackbar = Loadable(lazy(() => import('./snackbar/AppSnackbar')));
const AppAutoComplete = Loadable(lazy(() => import('./auto-complete/AppAutoComplete')));
const AppExpansionPanel = Loadable(lazy(() => import('./expansion-panel/AppExpansionPanel')));


const ManageAdmin = Loadable(lazy(() => import('./manage/ManageAdmin')))
const ManageRole = Loadable(lazy(() => import('./manage/ManageRole')))
const ManagePermission = Loadable(lazy(() => import('./manage/ManagePermission')))

const materialRoutes = [
  { path: '/material/table', element: <AppTable /> },
  { path: '/material/form', element: <AppForm /> },
  { path: '/material/buttons', element: <AppButton /> },
  { path: '/material/icons', element: <AppIcon /> },
  { path: '/material/progress', element: <AppProgress /> },
  { path: '/material/menu', element: <AppMenu /> },
  { path: '/material/checkbox', element: <AppCheckbox /> },
  { path: '/material/switch', element: <AppSwitch /> },
  { path: '/material/radio', element: <AppRadio /> },
  { path: '/material/slider', element: <AppSlider /> },
  { path: '/material/autocomplete', element: <AppAutoComplete /> },
  { path: '/material/expansion-panel', element: <AppExpansionPanel /> },
  { path: '/material/dialog', element: <AppDialog /> },
  { path: '/material/snackbar', element: <AppSnackbar /> },

  //manage
  { path: '/admin/manage', element: <ManageAdmin /> },
  { path: '/admin/role', element: <ManageRole /> },
  { path: '/admin/permission', element: <ManagePermission /> },

  { path: 'guitar/list', element: <ListGuitar /> },

  //product
  //manage
  { path: '/product/list', element: <ManageProduct /> },
  { path: '/product/category', element: <ManageCategory /> },
  { path: '/product/brand', element: <ManageBrand /> },
  { path: '/product/product-type', element: <ManageProductType /> },

  //order-voucher
  { path: '/order/list', element: <ManageOrder /> },
  { path: '/order/detail/:id', element: <DetailOrder /> },
  { path: '/voucher/list', element: <ManageVoucher /> },

  //post
  { path: '/content/list', element: <ManagePost /> },
  { path: '/content/category', element: <ManagePostCategory /> },
  { path: '/content/tag', element: <ManagePostTag /> },

  //customer
  { path: '/customer/list', element: <ManageCustomer /> },

  //banner
  { path: '/banner/list', element: <ManageBanner /> },

];

export default materialRoutes;
