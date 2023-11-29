import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken } from "./authCRUD";

export const actionTypes = {
    Login: "[Login] Action",
    Logout: "[Logout] Action",
    Register: "[Register] Action",
    UserRequested: "[Request User] Action",
    UserLoaded: "[Load User] Auth API",
    SetUser: "[Set User] Action",
}

const initialAuthState = {
    user: undefined,
    authToken: undefined,
}

export const reducer = persistReducer(
    { key: "auth", storage, whitelist: ["user", "authToken", "token"] },
    (state = initialAuthState, action) => {
        switch (action.type) {
            case actionTypes.Login: {
                const { authToken } = action.payload
                return { authToken, user: undefined }
            }
            case actionTypes.Register: {
                const { authToken } = action.payload
                return { authToken, user: undefined }
            }
            case actionTypes.Logout: {
                return initialAuthState
            }
            case actionTypes.UserLoaded: {
                const { user } = action.payload
                return { ...state, user }
            }
            case actionTypes.SetUser: {
                const { user } = action.payload
                return { ...state, user }
            }
            default: {
                return state
            }
        }
    }
)

export const actions = {
    login: (authToken) => ({ type: actionTypes.Login, payload: { authToken } }),
    register: (authToken) => ({ type: actionTypes.Register, payload: { authToken } }),
    logout: () => ({ type: actionTypes.Logout }),
    requestUser: (user) => ({ type: actionTypes.UserRequested, payload: { user } }),
    fulfillUser: (user) => ({ type: actionTypes.UserLoaded, payload: { user } }),
    setUser: (user) => ({ type: actionTypes.SetUser, payload: { user } }),
}

export function* saga() {
    yield takeLatest(actionTypes.Login, function* loginSaga() {
        yield put(actions.requestUser())
    })

    yield takeLatest(actionTypes.Register, function* registerSaga() {
        yield put(actions.requestUser())
    })

    yield takeLatest(actionTypes.UserRequested, function* userRequested() {
        const { data, user } = yield getUserByToken();
        yield put(actions.fulfillUser({ user }))
    })
}
