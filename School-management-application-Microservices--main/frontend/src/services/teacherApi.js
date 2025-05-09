import axios from 'axios';

const teacherApi = axios.create({
    baseURL: 'http://localhost:8088/teachers',
});

export default teacherApi;
