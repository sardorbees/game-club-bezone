// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000/",
// });

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default API;


import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/",
});

API.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;





// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default API;

// import axios from 'axios';

// const API = axios.create({
//     baseURL: 'http://127.0.0.1:8000/',
// });

// // Добавляем токен в каждый запрос
// API.interceptors.request.use(config => {
//     const token = localStorage.getItem('access'); // JWT токен
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default API;