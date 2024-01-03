import { Types } from './type';

const initialState = {
    dataCustomer: {
        rows: [],
        paging: {}
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.SAVE_LIST_CUSTOMER:
            return {
                ...state,
                dataCustomer: action.payload
            };

        default:
            return state;
    }
};

export default reducer;
