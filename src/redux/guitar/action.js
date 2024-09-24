import { actionLoading, checkErrorCode } from 'redux/home/action';
import { Types } from './type';
import { fetchApi } from 'app/lib/api';

//******************PERMISSION*****************/
export const actionGetListGuitar = (payload) => async (dispatch, getState) => {
    try {
        dispatch(dispatch(actionLoading(true)))
        let response = await fetchApi('/api/guitar/get-list-guitar', 'get', payload)

        if (response.statusCode !== 200) {
            dispatch(dispatch(actionLoading(false)))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        await dispatch(actionSaveListGuitar(response?.data))
        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionCUGuitar = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        let response = await fetchApi('/api/guitar/create-update-guitar', 'post', payload)

        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListGuitar())
        dispatch(actionLoading(false))
        return response
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionDeleteGuitar = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        const { id } = payload
        let response = await fetchApi(`/api/guitar/delete-guitar/${id}`, 'post')
        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        dispatch(actionGetListGuitar())
        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionSaveListGuitar = (payload) => ({
    type: Types.SAVE_LIST_GUITAR,
    payload,
})


