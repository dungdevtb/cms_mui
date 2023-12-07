import { message } from "antd";
import { fetchApiUpload } from "app/lib/api";
import { actionLoading } from "redux/home/action";

export const actionUploadOneFile = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        const response = await fetchApiUpload('/api/upload/uploadImage', 'post', payload)
        if (response.statusCode === 400) {
            message.error(response?.message)
            setTimeout(() => {
                message.destroy()
            }, 2000)
            return
        }

        dispatch(actionLoading(false))
        return response?.data?.filePaths?.file
    } catch (error) {
        alert("Error Upload: ", error)
    }
}

export const actionUploadMultipleFile = (payload) => async (dispatch, getState) => {
    try {
        dispatch(actionLoading(true))
        const response = await fetchApiUpload('/api/upload/uploadMultipleImage', 'post', payload)
        if (response.statusCode === 400) {
            message.error(response?.message)
            setTimeout(() => {
                message.destroy()
            }, 2000)
            return
        }

        dispatch(actionLoading(false))
        return response?.data
    } catch (error) {
        alert("Error Multiple Upload: ", error)
    }
}