/* eslint-disable default-case */
import { Types } from './type';
import { message } from 'antd';
import { fetchApi } from 'app/lib/api';

export const actionLoading = (payload) => ({
    type: Types.SAVE_LOADING,
    payload,
})

export const actionLogin = (payload) => async (dispatch, getState) => {
    try {
        const response = await fetchApi('/login', 'post', payload)


        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        const token = response?.data?.token || null
        localStorage.setItem('token', token)

        let listPermissions = []
        if (response?.data?.list_permission.length > 0) {
            for (let item of response?.data?.list_permission) {
                listPermissions = [...listPermissions, item.slug]
            }
        }

        await Promise.all([
            dispatch(actionSaveInfoUser(response?.data?.user)),
            dispatch(actionSaveListUserLoginPermission(listPermissions)),
        ])
        return response?.data?.user
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionLogout = () => async () => {
    try {
        localStorage.removeItem('token')
        window.location.assign('/session/signin')
        return;
    } catch (error) {
        alert("Error Logout: ", error)
    }
}

export const actionSaveInfoUser = (payload) => ({
    type: Types.SAVE_INFO_USER,
    payload,
})

export const actionSaveListUserLoginPermission = (payload) => ({
    type: Types.SAVE_LIST_USER_LOGIN_PERMISSION,
    payload,
})

export const checkErrorCode = async (code, errorMessage) => {


    switch (code) {
        case 400: {
            message.error(errorMessage || "Có lỗi xảy ra vui lòng thử lại!");
            break;
        }
        case 401: {
            message.error("Authen token is invalid!");
            break;
        }
        default:
            message.error("Authen token is invalid!");
            break;

    }
}
