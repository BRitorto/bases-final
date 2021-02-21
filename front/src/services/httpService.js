import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.common["Cache-Control"] = "no-cache";
axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.response.use(null, error => {
    const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;

    if (!expectedError) {
        console.log("unexpected: ", error);
        return Promise.reject(error);
    }
    console.log(error.response);
    return Promise.reject(error);
});

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete
};