import { Types } from './type';

const initialState = {
    dataOrder: {
        rows: [],
        paging: {}
    },
    dataVoucher: {
        rows: [],
        paging: {}
    },
    dataBanner: {
        rows: [],
    }

};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.SAVE_LIST_ORDER:
            return {
                ...state,
                dataOrder: action.payload
            };
        case Types.SAVE_LIST_VOUCHER:
            return {
                ...state,
                dataVoucher: action.payload
            };

        case Types.SAVE_LIST_BANNER:
            return {
                ...state,
                dataBanner: action.payload
            }

        default:
            return state;
    }
};

export default reducer;
