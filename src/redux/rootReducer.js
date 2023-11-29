import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from '../app/modules/_redux/authRedux';
import homeReducer from "./home/reducer";

export const rootReducer = combineReducers({
    auth: auth.reducer,
    home: homeReducer
})

export function* rootSaga() {
    yield all([auth.saga()]);
}

