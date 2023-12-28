import { Types } from './type';

const initialState = {
    dataPost: {
        rows: [],
        paging: {}
    },
    dataPostCategory: {
        rows: [],
        paging: {}
    },
    dataPostTag: {
        rows: [],
        paging: {}
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.SAVE_LIST_POST:
            return {
                ...state,
                dataPost: action.payload
            };
        case Types.SAVE_LIST_POST_CATEGORY:
            return {
                ...state,
                dataPostCategory: action.payload
            };
        case Types.SAVE_LIST_POST_TAG:
            return {
                ...state,
                dataPostTag: action.payload
            }
        default:
            return state;
    }
};

export default reducer;
