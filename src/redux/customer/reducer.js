import { Types } from './type';

const initialState = {
    dataCustomer: {
        rows: [],
        paging: {}
    },
    dataCart: {

    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.SAVE_LIST_CUSTOMER:
            return {
                ...state,
                dataCustomer: action.payload
            };

        case Types.SAVE_CART:
            return {
                ...state,
                dataCart: action.payload
            }

        default:
            return state;
    }
};

export default reducer;
