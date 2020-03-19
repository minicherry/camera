import axios from 'axios'
const service = axios.create({
    baseURL: "api", // api的base_url
    timeout: 50000, // request timeout
    withCredentials: true
})
service.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
service.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});
export {
    service as request
}