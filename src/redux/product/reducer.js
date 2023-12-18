import { Types } from './type';

const initialState = {
  dataProduct: {
    rows: [],
    paging: {}
  },
  dataCategory: {
    rows: [],
    paging: {}
  },
  dataBrand: {
    rows: [],
    paging: {}
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.SAVE_LIST_PRODUCT:
      return {
        ...state,
        dataProduct: action.payload
      };
    case Types.SAVE_LIST_cATEGORY:
      return {
        ...state,
        dataCategory: action.payload
      };
    case Types.SAVE_LIST_BRAND:
      return {
        ...state,
        dataBrand: action.payload
      }
    default:
      return state;
  }
};

export default reducer;
