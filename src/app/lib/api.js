import axios from "axios"

export const fetchApi = async (url, method = 'get', body, headers) => {
    let token = localStorage.getItem('token');
    console.log("fetchAPI", url, process.env.REACT_APP_API_URL);

    try {
        let opts = {
            method,
            url: `${process.env.REACT_APP_API_URL.trim()}${url}`,
            timeout: 1 * 1000 * 60,// 1 phut
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': token,
            }
        }
        if (headers) {
            opts = {
                ...opts,
                headers: {
                    ...headers,
                    [headers.key]: headers.value,
                }
            }
        }
        if (method === 'get') {
            opts.params = body;
        } else {
            opts.data = body;
        }
        let fetchData = await axios(opts);
        if (fetchData.data.code !== 200) {
            return fetchData.data
        }
        return fetchData.data
    } catch (error) {
        console.log("Error fetchApi >>>> ", error);
        let { response } = error
        if (response) {
            return response.data
        }
        return error
    }
}

export const fetchApiUpload = async (url, method = 'get', body) => {
    let token = localStorage.getItem("token");

    try {
        let opts = {
            method,
            url: `${process.env.REACT_APP_API_URL.trim()}${url}`,
            timeout: 1 * 1000 * 60,//1phut     
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'token': token,
            }
        }
        if (method === 'get') {
            opts.params = body;
        } else {
            opts.data = body;
        }
        let fetchdata = await axios(opts);
        if (fetchdata.data.code !== 200) {
            return fetchdata.data;
        }
        return fetchdata.data;
    } catch (error) {
        console.log('error124', error)
        let { response } = error;
        if (response) {
            return response.data;
        }
        return error;
    }
};