import axios from 'axios'; // library to make asynchronous http requests( for api calls and etc)

const API = axios.create({ // create an instance of axios
    baseURL: 'http://localhost:5000/api', // add this as a base url for every api calls
});

API.interceptors.request.use((config) => { // configure the header and adding token to it for auth purposes
    const token = localStorage.getItem('token'); // getting token from local storage 
    if(token) {
        config.headers.Authorization = `Bearer ${token}`; // adding as intended
    }
    return config;
});

export default API;