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

        let listPermission = []
        if (response?.data?.list_permission.length > 0) {
            for (let item of response?.data?.list_permission) {
                listPermission = [...listPermission, item.slug]
            }
        }
        await Promise.all([
            dispatch(actionSaveInfoUser(response?.data?.user)),
            dispatch(actionSaveListUserLoginPermission(listPermission)),
        ])
        return response?.data?.user
    } catch (error) {
        console.log(error)
        alert(error || error?.message)
    }
}

export const actionLoginByToken = () => async (dispatch) => {
    try {
        const response = await fetchApi('/login-by-token', 'get')

        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }
        const token = response?.data?.token || null
        localStorage.setItem('token', token)
        let listPermission = []

        for (let item of response?.data?.list_permission) {
            listPermission = [...listPermission, item.slug]
        }

        await Promise.all([
            dispatch(actionSaveInfoUser(response?.data?.user)),
            dispatch(actionSaveListUserLoginPermission(listPermission)),
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
            message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            break;
        }
        default:
            message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            break;

    }
}
