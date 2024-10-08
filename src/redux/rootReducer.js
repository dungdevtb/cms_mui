import { all } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import * as auth from '../app/modules/_redux/authRedux';
import homeReducer from './home/reducer';
import manageReducer from './manage/reducer';
import productReducer from './product/reducer';
import orderReducer from './order-voucher/reducer';
import postReducer from './post/reducer';
import customerReducer from './customer/reducer';
import guitarReducer from './guitar/reducer';

export const rootReducer = combineReducers({
  auth: auth.reducer,
  homeReducer: homeReducer,
  manageReducer: manageReducer,
  productReducer: productReducer,
  orderReducer: orderReducer,
  postReducer: postReducer,
  customerReducer: customerReducer,
  guitarReducer: guitarReducer
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
