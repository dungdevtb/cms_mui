import { Types } from "./type";

const intialState = {
    listGuitar: {
        paging: {},
        rows: [],
    },
}

const reducer = (state = intialState, action) => {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case Types.SAVE_LIST_GUITAR:
            return {
                ...newState,
                listGuitar: action.payload
            }

        default:
            return { ...newState }
    }
}

export default reducer
