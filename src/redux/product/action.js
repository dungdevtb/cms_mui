import { actionLoading, checkErrorCode } from 'redux/home/action';
import { Types } from './type';
import { fetchApi } from 'app/lib/api';

export const actionGetListProduct = (payload) => async (dispatch, getState) => {
  try {
    dispatch(dispatch(actionLoading(true)));
    // const { page } = payload
    let response = await fetchApi('/api/tutorial/get_all_tutorials', 'get', payload);

    if (response.statusCode !== 200) {
      dispatch(dispatch(actionLoading(false)));
      return checkErrorCode(response?.statusCode, response?.message);
    }

    // response.data = {
    //     ...response.data,
    //     paging: {
    //         page: page || 1,
    //         total: response?.data?.total || 0,
    //         count: Math.ceil(response?.data?.total / 10),//10:Limit page default
    //         limit: 10
    //     }
    // }

    await dispatch(actionSaveListProduct(response?.data));
    dispatch(actionLoading(false));
    return response?.data;
  } catch (error) {
    alert(error || error?.message);
  }
};

export const actionSaveListProduct = (payload) => ({
  type: Types.SAVE_LIST_PRODUCT,
  payload
});
