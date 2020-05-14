import users from "./mocks/admins";

export default class AuthApiClient {
    getCurrentUserInfo() {
        const userId = Number(localStorage.getItem("_user"));
        const data = users.find(item => item.id === userId) || null;
        console.log({ message: "Call getCurrentUserInfo", userId, data });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (data) {
                    resolve(data);
                } else {
                    reject(null);
                }
            }, 300);
        });
    }
}
