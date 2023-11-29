import { Types } from "./type";

const initialState = {
    spin: false,
    token: null,
    infoUser: null,
    listUserLoginPermission: null
}

const homeReducer = (state = initialState, action) => {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case Types.SAVE_LOADING:
            return {
                ...newState,
                spin: action.payload
            }

        case Types.SAVE_LOGIN:
            return {
                ...newState,
                token: action.payload
            }
        case Types.SAVE_INFO_USER:
            return {
                ...newState,
                infoUser: action.payload
            }
        case Types.SAVE_LIST_USER_LOGIN_PERMISSION:
            return {
                ...newState,
                listUserLoginPermission: action.payload
            }
        default:
            return { ...newState }
    }
}

export default homeReducer