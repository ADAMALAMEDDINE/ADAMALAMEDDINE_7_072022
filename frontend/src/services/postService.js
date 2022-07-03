import axios from 'axios';
import { BACKEND_URL } from '../global';
import storage from './storage';

const postService = {
    async create({ title, content }) {

        const { token, user_id } = storage.getAll()
        console.log(token, user_id);
        const result = await axios({
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'put',
            url: BACKEND_URL + "/posts/create",
            data: {
                title, content, user_id
            }
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

    async update(id, data) {

        const { token } = storage.getAll()
        const result = await axios({
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'patch',
            url: BACKEND_URL + "/posts/" + id
        });
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