import { STORAGE_NAME } from "../global"

export default {

    init(data) {
        const {user_id, token} = data;
        localStorage[STORAGE_NAME] = JSON.stringify({user_id, token})
    },
    get(key) {
        const storData = localStorage[STORAGE_NAME];
        if (!storData) {
            return;
        } else {
            return JSON.parse(storData)[key]
        }
    },
    set(key, value) {
        const storData = localStorage[STORAGE_NAME];
        let obj = {}
        if (storData) {
            obj = JSON.parse(storData)
        }
        obj[key] = value;
        localStorage[STORAGE_NAME] = JSON.stringify(obj)
    },
    getAll() {
        const storData = localStorage[STORAGE_NAME];
        if (!storData) {
            return;
        } else {
            return JSON.parse(storData);
        }
    }
} 