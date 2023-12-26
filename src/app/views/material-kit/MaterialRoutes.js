import { lazy } from 'react';
import Loadable from 'app/components/Loadable';
import ManageProduct from './product/ManageProduct';
import ManageCategory from './product/MannageCategory';
import ManageBrand from './product/ManageBrand';
import ManageVoucher from './order-voucher/ManageVoucher';

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

  //product
  //manage
  { path: '/product/list', element: <ManageProduct /> },
  { path: '/product/category', element: <ManageCategory /> },
  { path: '/product/brand', element: <ManageBrand /> },

  //order-voucher
  { path: '/order/list', element: <AppTable /> },
  { path: '/voucher/list', element: <ManageVoucher /> },


];

export default materialRoutes;
