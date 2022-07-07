import axios from 'axios';
import { BACKEND_URL } from '../global';
import storage from './storage';

const postService = {
    async create(formData) {

        const { token, user_id } = storage.getAll();
        formData.append("user_id", user_id);
        const result = await axios({
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
            method: 'put',
            url: BACKEND_URL + "/posts/create",
            data: formData
        });
        return result;
    },
    async getAll() {

        const { token } = storage.getAll()
        const result = await axios({
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'get',
            url: BACKEND_URL + "/posts"
        });
        return result;
    },

    async getOne(postId) {

        const { token } = storage.getAll()
        const result = await axios({
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'get',
            url: BACKEND_URL + "/posts/get-one/"+postId
        });
        return result;
    },

    async getContent(postId) {

        const { token } = storage.getAll()
        const result = await axios({
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'get',
            url: BACKEND_URL + "/posts/get-content/"+postId
        });
        return result;
    },

    async update(id, formData) {
        const { token } = storage.getAll();

        const result = await axios.post(BACKEND_URL + "/posts/" + id, formData, {
            // You need to use `getHeaders()` in Node.js because Axios doesn't
            // automatically set the multipart form boundary in Node.
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
        });
        // const result = await axios({
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //         "Content-Type": "multipart/form-data"
        //     },
        //     method: 'post',
        //     url: BACKEND_URL + "/posts/" + id,
        //     data: formData
        // });
        return result;
    },

    async delete(id) {

        const { token } = storage.getAll()
        const result = await axios({
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'delete',
            url: BACKEND_URL + "/posts/" + id
        });
        return result;
    },
};

export default postService;