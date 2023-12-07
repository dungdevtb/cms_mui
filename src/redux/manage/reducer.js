import { Types } from "./type";

const intialState = {
    listPermission: {
        paging: {},
        rows: [],
    },
    listRole: {
        paging: {},
        rows: [],
    }
}

const reducer = (state = intialState, action) => {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case Types.SAVE_LIST_PERMISSION:
            return {
                ...newState,
                listPermission: action.payload
            }

        case Types.SAVE_LIST_ROLE:
            return {
                ...newState,
                listRole: action.payload
            }
        default:
            return { ...newState }
    }
}

export default reducer
