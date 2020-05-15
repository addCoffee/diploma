import {users} from "./mocks/admins";

export default class AuthApiClient {
  getCurrentUserInfo() {
    const userId = localStorage.getItem("_user");
    console.log(users.find(item => item.id === +userId))
    const data = users.find(item => item.id === +userId) || null;
    console.log(
      "Call getCurrentUserInfo",
      userId,
      data,
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
