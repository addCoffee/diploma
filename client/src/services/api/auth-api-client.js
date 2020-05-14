import {users} from "./mocks/admins";

export default class AuthApiClient {
  getCurrentUserInfo() {
    const data = users.find(item => item.id === userId) || null;
    console.log(
      "Call getCurrentUserInfo",
      localStorage.getItem("_user"),
      data
    );
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
