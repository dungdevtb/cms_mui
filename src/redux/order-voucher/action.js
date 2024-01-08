import { actionLoading, checkErrorCode } from 'redux/home/action';
import { Types } from './type';
import { fetchApi } from 'app/lib/api';


//************************Order************************* */
export const actionGetListOrder = (payload) => async (dispatch, getState) => {
    try {
        dispatch(dispatch(actionLoading(true)));
        // const { page } = payload
        let response = await fetchApi('/api/order/get-list-order', 'get', payload);

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

        await dispatch(actionSaveListOrder(response?.data));
        dispatch(actionLoading(false));
        return response?.data;
    } catch (error) {
        alert(error || error?.message);
    }
};

export const actionGetDetailOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch(dispatch(actionLoading(true)));
        let response = await fetchApi(`/api/order/get-detail-order?id=${id}`, 'get');

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

        // await dispatch(actionSaveListOrder(response?.data));
        dispatch(actionLoading(false));
        return response?.data;
    } catch (error) {
        alert(error || error?.message);
    }
};

export const actionUpdateStatusOrder = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        let response = await fetchApi('/api/order/update-status-order', 'post', payload)

        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListVoucher())
        dispatch(actionLoading(false))
        return response
    } catch (error) {
        console.log(error);
    }
}

export const actionSaveListOrder = (payload) => ({
    type: Types.SAVE_LIST_ORDER,
    payload
});

//**************************Voucher************************ */
export const actionGetListVoucher = (payload) => async (dispatch, getState) => {
    try {
        dispatch(dispatch(actionLoading(true)));
        // const { page } = payload
        let response = await fetchApi('/api/voucher/get-list-voucher', 'get', payload);

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

        await dispatch(actionSaveListVoucher(response?.data));
        dispatch(actionLoading(false));
        return response?.data;
    } catch (error) {
        alert(error || error?.message);
    }
};

export const actionCUVoucher = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        let response = await fetchApi('/api/voucher/create-update-voucher', 'post', payload)

        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListVoucher())
        dispatch(actionLoading(false))
        return response
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionDeleteVoucher = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        const { id } = payload
        let response = await fetchApi(`/api/voucher/delete-voucher/${id}`, 'post')
        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListVoucher())
        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionSaveListVoucher = (payload) => ({
    type: Types.SAVE_LIST_VOUCHER,
    payload
});
