import axios from 'axios';
import { BACKEND_URL } from '../global';
import storage from './storage';

const dislikeService = {
    async addRemove(post_id) {

        const { token, user_id } = storage.getAll()

        const result = await axios({
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'get',
            url: BACKEND_URL + "/dislikes/add-remove/" + user_id + "/" + post_id
        });
        return result;
    }
};

export default dislikeService;