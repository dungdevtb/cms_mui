import axios from "axios";

export const LOGIN_URL = "/api/login";
export const REGISTER_URL = "/api/register";
export const REGISTER_PASSWORD_URL = "/api/forgot-password";

export const ME_URL = "/api/me";

export function login(email, password) {
    return axios.post(LOGIN_URL, {
        email,
        password
    })
}

export function register(username, email, password) {
    axios.post(REGISTER_URL, {
        username,
        email,
        password
    })
}

export function requestPassword(email) {
    return axios.post(REGISTER_PASSWORD_URL, { email })
}

export function getUserByToken() {
    return axios.get(ME_URL)
}
