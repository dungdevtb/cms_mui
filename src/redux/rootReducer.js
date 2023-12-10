import { all } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import * as auth from '../app/modules/_redux/authRedux';
import homeReducer from './home/reducer';
import manageReducer from './manage/reducer';
import productReducer from './product/reducer';

export const rootReducer = combineReducers({
  auth: auth.reducer,
  homeReducer: homeReducer,
  manageReducer: manageReducer,
  productReducer: productReducer
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
