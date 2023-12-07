//axios.interceptor.request sử dụng để chỉnh sửa dữ liệu trc khi gửi req đến server
//axios.interceptor.response sử dụng để chỉnh sửa dữ liệu trc khi gửi res đến client

// hiện tại project đnag dùng để đính token cho phép xác thực người dùng  hiện tại là ai

export default function setupAxios(axios, store) {
    axios.interceptors.request.use(
        config => {
            const {
                auth: { authToken }
            } = store.getState();

            if (authToken) {
                config.headers.Authorization = `Bearer ${authToken}`;
            }
            // console.log("Axios Interceptor: ", config);
            return config;
        },

        err => Promise.reject(err)
    );
}