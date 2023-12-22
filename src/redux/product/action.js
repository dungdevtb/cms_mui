import { actionLoading, checkErrorCode } from 'redux/home/action';
import { Types } from './type';
import { fetchApi } from 'app/lib/api';

export const actionGetListProduct = (payload) => async (dispatch, getState) => {
  try {
    dispatch(dispatch(actionLoading(true)));
    // const { page } = payload
    let response = await fetchApi('/api/product/get_all_products', 'get', payload);

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

export const actionCUProduct = (payload) => async (dispatch, getState) => {
  try {
    dispatch(actionLoading(true))
    console.log('payloadddddddd', payload);

    let response = await fetchApi('/api/product/create_update_product', 'post', payload)

    if (response.statusCode !== 200) {
      dispatch(actionLoading(false))
      return checkErrorCode(response?.statusCode, response?.message)
    }

    dispatch(actionGetListProduct())
    dispatch(actionLoading(false))
    return response
  } catch (error) {
    alert(error || error?.message)
  }
}

export const actionDeleteProduct = (payload) => async (dispatch, getState) => {
  try {
    dispatch(actionLoading(true))
    const { id } = payload
    let response = await fetchApi(`/api/product/delete_product/${id}`, 'post')
    if (response.statusCode !== 200) {
      dispatch(actionLoading(false))
      return checkErrorCode(response?.statusCode, response?.message)
    }

    dispatch(actionGetListProduct())
    dispatch(actionLoading(false))
    return response?.data
  } catch (error) {
    alert(error || error?.message)
  }
}

export const actionSaveListProduct = (payload) => ({
  type: Types.SAVE_LIST_PRODUCT,
  payload
});

//**************************Category************************ */
export const actionGetListCategory = (payload) => async (dispatch, getState) => {
  try {
    dispatch(dispatch(actionLoading(true)));
    // const { page } = payload
    let response = await fetchApi('/api/category/get_all_categorys', 'get', payload);

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

    await dispatch(actionSaveListCategory(response?.data));
    dispatch(actionLoading(false));
    return response?.data;
  } catch (error) {
    alert(error || error?.message);
  }
};

export const actionCUCategory = (payload) => async (dispatch, getState) => {
  try {
    dispatch(actionLoading(true))
    let response = await fetchApi('/api/category/create_update_category', 'post', payload)

    if (response.statusCode !== 200) {
      dispatch(actionLoading(false))
      return checkErrorCode(response?.statusCode, response?.message)
    }

    dispatch(actionGetListCategory())
    dispatch(actionLoading(false))
    return response
  } catch (error) {
    alert(error || error?.message)
  }
}

export const actionDeleteCategory = (payload) => async (dispatch, getState) => {
  try {
    dispatch(actionLoading(true))
    const { id } = payload
    let response = await fetchApi(`/api/category/delete_category/${id}`, 'post')
    if (response.statusCode !== 200) {
      dispatch(actionLoading(false))
      return checkErrorCode(response?.statusCode, response?.message)
    }

    dispatch(actionGetListCategory())
    dispatch(actionLoading(false))
    return response?.data
  } catch (error) {
    alert(error || error?.message)
  }
}

export const actionSaveListCategory = (payload) => ({
  type: Types.SAVE_LIST_cATEGORY,
  payload
});

//**************************Brand************************ */
export const actionGetListBrand = (payload) => async (dispatch, getState) => {
  try {
    dispatch(dispatch(actionLoading(true)));
    // const { page } = payload
    let response = await fetchApi('/api/brand/get_list_brand', 'get', payload);

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

    await dispatch(actionSaveListBrand(response?.data));
    dispatch(actionLoading(false));
    return response?.data;
  } catch (error) {
    alert(error || error?.message);
  }
};

export const actionCUBrand = (payload) => async (dispatch, getState) => {
  try {
    dispatch(actionLoading(true))
    let response = await fetchApi('/api/brand/create_update_brand', 'post', payload)

    if (response.statusCode !== 200) {
      dispatch(actionLoading(false))
      return checkErrorCode(response?.statusCode, response?.message)
    }

    dispatch(actionGetListBrand())
    dispatch(actionLoading(false))
    return response
  } catch (error) {
    alert(error || error?.message)
  }
}

export const actionDeleteBrand = (payload) => async (dispatch, getState) => {
  try {
    dispatch(actionLoading(true))
    const { id } = payload
    let response = await fetchApi(`/api/brand/delete_brand/${id}`, 'post')
    if (response.statusCode !== 200) {
      dispatch(actionLoading(false))
      return checkErrorCode(response?.statusCode, response?.message)
    }

    dispatch(actionGetListBrand())
    dispatch(actionLoading(false))
    return response?.data
  } catch (error) {
    alert(error || error?.message)
  }
}

export const actionSaveListBrand = (payload) => ({
  type: Types.SAVE_LIST_BRAND,
  payload
});
