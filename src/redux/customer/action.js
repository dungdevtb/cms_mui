import { actionLoading, checkErrorCode } from 'redux/home/action';
import { Types } from './type';
import { fetchApi } from 'app/lib/api';

export const actionGetListCustomer = (payload) => async (dispatch, getState) => {
    try {
        dispatch(dispatch(actionLoading(true)));
        // const { page } = payload
        let response = await fetchApi('/api/customer/get-list-customer', 'get', payload);

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

        await dispatch(actionSaveListCustomer(response?.data));
        dispatch(actionLoading(false));
        return response?.data;
    } catch (error) {
        alert(error || error?.message);
    }
};

export const actionCUCustomer = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        let response = await fetchApi('/api/customer/update-customer', 'post', payload)

        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListCustomer())
        dispatch(actionLoading(false))
        return response
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionDeleteCustomer = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        const { id } = payload
        let response = await fetchApi(`/api/customer/delete-customer/${id}`, 'post')
        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListCustomer())
        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionSaveListCustomer = (payload) => ({
    type: Types.SAVE_LIST_CUSTOMER,
    payload
});


export const actionGetDetailCart = (payload) => async (dispatch, getState) => {
    try {
        dispatch(dispatch(actionLoading(true)));
        // const { page } = payload
        let response = await fetchApi(`/api/order/get-detail-cart?customer_id=${payload}`, 'get');

        await dispatch(actionSaveCart(response?.data));
        dispatch(actionLoading(false));
        return response?.data;
    } catch (error) {
        alert(error || error?.message);
    }
};


export const actionSaveCart = (payload) => ({
    type: Types.SAVE_CART,
    payload
});