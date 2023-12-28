import { actionLoading, checkErrorCode } from 'redux/home/action';
import { Types } from './type';
import { fetchApi } from 'app/lib/api';

//**************************Post************************ */
export const actionGetListPost = (payload) => async (dispatch, getState) => {
    try {
        dispatch(dispatch(actionLoading(true)));
        // const { page } = payload
        let response = await fetchApi('/api/post/get-list-post', 'get', payload);

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

        await dispatch(actionSaveListPost(response?.data));
        dispatch(actionLoading(false));
        return response?.data;
    } catch (error) {
        alert(error || error?.message);
    }
};

export const actionCUPost = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        let response = await fetchApi('/api/post/create-update-post', 'post', payload)

        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListPost())
        dispatch(actionLoading(false))
        return response
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionDeletePost = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        const { id } = payload
        let response = await fetchApi(`/api/post/delete-post/${id}`, 'post')
        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListPost())
        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionSaveListPost = (payload) => ({
    type: Types.SAVE_LIST_POST,
    payload
});

//**************************PostCategory************************ */
export const actionGetListPostCategory = (payload) => async (dispatch, getState) => {
    try {
        dispatch(dispatch(actionLoading(true)));
        // const { page } = payload
        let response = await fetchApi('/api/post/get-list-post-category', 'get', payload);

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

        await dispatch(actionSaveListPostCategory(response?.data));
        dispatch(actionLoading(false));
        return response?.data;
    } catch (error) {
        alert(error || error?.message);
    }
};

export const actionCUPostCategory = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        let response = await fetchApi('/api/post/create-update-post-category', 'post', payload)

        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListPostCategory())
        dispatch(actionLoading(false))
        return response
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionDeletePostCategory = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        const { id } = payload
        let response = await fetchApi(`/api/post/delete-post-category/${id}`, 'post')
        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListPostCategory())
        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionSaveListPostCategory = (payload) => ({
    type: Types.SAVE_LIST_POST_CATEGORY,
    payload
});

//**************************PostTag************************ */
export const actionGetListPostTag = (payload) => async (dispatch, getState) => {
    try {
        dispatch(dispatch(actionLoading(true)));
        // const { page } = payload
        let response = await fetchApi('/api/post/get-list-post-tag', 'get', payload);

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

        await dispatch(actionSaveListPostTag(response?.data));
        dispatch(actionLoading(false));
        return response?.data;
    } catch (error) {
        alert(error || error?.message);
    }
};

export const actionCUPostTag = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        let response = await fetchApi('/api/post/create-update-post-tag', 'post', payload)

        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListPostTag())
        dispatch(actionLoading(false))
        return response
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionDeletePostTag = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        const { id } = payload
        let response = await fetchApi(`/api/post/delete-post-tag/${id}`, 'post')
        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListPostTag())
        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionSaveListPostTag = (payload) => ({
    type: Types.SAVE_LIST_POST_TAG,
    payload
});
