import { actionLoading, checkErrorCode } from 'redux/home/action';
import { Types } from './type';
import { fetchApi } from 'app/lib/api';

//******************PERMISSION*****************/
export const actionGetListPermission = (payload) => async (dispatch, getState) => {
    try {
        dispatch(dispatch(actionLoading(true)))
        // const { page } = payload
        let response = await fetchApi('/api/permission/get-list-permission', 'get', payload)

        if (response.statusCode !== 200) {
            dispatch(dispatch(actionLoading(false)))
            return checkErrorCode(response?.statusCode, response?.message)
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

        await dispatch(actionSaveListPermission(response?.data))
        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionCUPermission = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        let response = await fetchApi('/api/permission/create-update-permission', 'post', payload)

        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        //thêm
        if (!payload?.id) {
            dispatch(actionGetListPermission())
        } else {
            dispatch(actionGetListPermission())

            //sửa
            // const state = getState()
            // const dataPermission = state?.roleAndPermissionReducer?.dataPermission
            // let newData = { ...dataPermission }

            // const index = newData.rows.findIndex(it => it.id === payload.id)
            // newData.rows[index] = response.data
            // await dispatch(actionSaveListPermission(newData))
        }

        dispatch(actionLoading(false))
        return response
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionDeletePermission = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        const { id } = payload
        let response = await fetchApi(`/api/permission/delete-permission/${id}`, 'post')
        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        // const state = getState()
        // const dataPermission = state?.roleAndPermissionReducer?.dataPermission
        // let newData = { ...dataPermission }
        // newData.rows = newData.rows.filter(it => it.id !== payload.id)

        // await dispatch(actionSaveListPermission(newData))
        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionSaveListPermission = (payload) => ({
    type: Types.SAVE_LIST_PERMISSION,
    payload,
})

//******************ROLE*****************/
export const actionGetListRole = (payload) => async (dispatch, getState) => {
    try {
        dispatch(dispatch(actionLoading(true)))
        // const { page } = payload
        let response = await fetchApi('/api/role/get-list-role', 'get', payload)

        if (response.statusCode !== 200) {
            dispatch(dispatch(actionLoading(false)))
            return checkErrorCode(response?.statusCode, response?.message)
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

        await dispatch(actionSaveListRole(response?.data))
        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionCURole = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        let response = await fetchApi('/api/role/create-update-role', 'post', payload)

        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        //thêm
        if (!payload?.id) {
            dispatch(actionGetListRole())
        } else {
            dispatch(actionGetListRole())

            //sửa
            // const state = getState()
            // const dataPermission = state?.roleAndPermissionReducer?.dataPermission
            // let newData = { ...dataPermission }

            // const index = newData.rows.findIndex(it => it.id === payload.id)
            // newData.rows[index] = response.data
            // await dispatch(actionSaveListPermission(newData))
        }

        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionDeleteRole = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        const { id } = payload

        let response = await fetchApi(`/api/role/delete-role/${id}`, 'post')

        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        // const state = getState()
        // const dataPermission = state?.roleAndPermissionReducer?.dataPermission
        // let newData = { ...dataPermission }
        // newData.rows = newData.rows.filter(it => it.id !== payload.id)

        // await dispatch(actionSaveListPermission(newData))
        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionAddRolePermisson = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        let response = await fetchApi('/api/role/add-role-permission', 'post', payload)

        if (response.statusCode !== 200) {
            dispatch(actionLoading(false))
            return checkErrorCode(response?.statusCode, response?.message)
        }

        // const state = getState()
        // const dataRole = state?.roleAndPermissionReducer?.dataRole
        // let newData = { ...dataRole }
        // const index = newData?.rows?.findIndex((it) => it.id === payload.role_id)
        // if (index === -1) return alert("Không tìm thấy id")

        // newData.rows[index].role_permission = payload.list_permission.map(item => {
        //     return {
        //         permission: { id: item }
        //     }
        // })

        // await dispatch(actionSaveListRole(newData))
        await dispatch(actionGetListRole())
        dispatch(actionLoading(false))

        return response.statusCode
    } catch (error) {
        alert(error || error?.message)
    }
}

export const actionSaveListRole = (payload) => ({
    type: Types.SAVE_LIST_ROLE,
    payload,
})


//******************ADMIN*****************/
export const actionSaveListAdmin = (payload) => ({
    type: Types.SAVE_LIST_ADMIN,
    payload,
})

export const actionGetListAdmin = (payload) => async (dispatch, getState) => {
    try {
        dispatch(dispatch(actionLoading(true)))
        // const { page } = payload
        let response = await fetchApi('/api/user/get-list-user', 'get', payload)

        if (response.statusCode !== 200) {
            dispatch(dispatch(actionLoading(false)))
            return checkErrorCode(response?.statusCode, response?.message)
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

        await dispatch(actionSaveListAdmin(response?.data))
        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert(error || error?.message)
    }
}


