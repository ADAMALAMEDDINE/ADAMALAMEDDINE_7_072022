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
    disconnect() {
        storage.clean();
    }
}

export default userService;

