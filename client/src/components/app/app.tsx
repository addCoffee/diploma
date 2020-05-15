import React from "react";
import AuthApiClient from "../../services/api/auth-api-client";
import InternalApiClient from "../../services/api/internal-api-client";
import { Spin } from "antd";
import Root from "../root/root";

export default class App extends React.Component {
  authApiClient = new AuthApiClient();
  internalApiClient = new InternalApiClient(
    () => this.setState({ isAuthRequired: true }),
    () => {}
  );
  state = {
    userData: null,
    isUserLoaded: false,
    isAuthRequired: false,
  };

  componentDidMount() {
    this.authApiClient
      .getCurrentUserInfo()
      .then(userData => {
        console.log(userData)
        this.setState({ userData, isUserLoaded: true });
      })
      .catch(() => {
        console.log(1)
        this.setState({ isAuthRequired: true });
      });
  }

  render() {
    // console.log(1)
    if (!this.state.isUserLoaded) {
      return <Spin className="spin-loading" size="large" />;
    }

    return <Root userData={this.state.userData} internalApiClient={this.internalApiClient} />;
  }
}
