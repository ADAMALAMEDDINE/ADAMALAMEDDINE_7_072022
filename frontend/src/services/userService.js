import axios from 'axios';
import { BACKEND_URL } from '../global';
import storage from './storage';

const userService = {
    async signUp({ firstname, lastname, nickname, email, password }) {
        const result = await axios({
            method: 'post',
            url: BACKEND_URL + "/auth/signup",
            data: {
                firstname, lastname, nickname, email, password
            }
        });
        return result;
    },
    async login({ email, password }) {
        const result = await axios({
            method: 'post',
            url: BACKEND_URL + "/auth/login",
            data: {
                email, password
            }
        });
        return result;
    },
    async updateProfile(formData) {
        const { token, user_id } = storage.getAll();
        const result = await axios.patch(
            BACKEND_URL + "/users/" + user_id, 
            formData, 
            { headers: {'Authorization': `Bearer ${token}`} }
        );
        return result;
    },
    disconnect() {
        storage.clean();
    }
}

export default userService;

