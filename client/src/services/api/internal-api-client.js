import users from "./mocks/admins";

export default class InternalApiClient {
  constructor(onAuthRequired, onAccessDenied) {
    this._onAuthRequired = onAuthRequired;
    this._onAccessDenied = onAccessDenied;
  }

  doInternalRequest() {}

  mockInternalRequest(getData) {
    const user = users.find(({id}) => id === Number(localStorage.getItem("_user")));
    if (!user) {
      this._onAuthRequired();
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(getData(user));
      }, 1000);
    });
  }
}
