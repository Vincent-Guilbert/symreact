import axios from 'axios';

function register(user) {
    return axios.post("http://localhost:8000/api/users", user);
}

function authenticate(credentials) {
    return axios.post("http://localhost:8000/api/login_check", credentials);
}

function logout() {
    return axios.post("http://localhost:8000/api/user/logout");
}

export default {
    register,
    authenticate,
    logout,
}