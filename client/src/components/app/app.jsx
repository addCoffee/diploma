import React, { Component } from "react";
import AuthApiClient from "../../services/api/auth-api-client";
import InternalApiClient from "../../services/api/internal-api-client";
// import PageInternal from "./page-internal.jsx";
import { Spin } from "antd";

class App extends Component {
  constructor(props) {
    super(props);

    this.authApiClient = new AuthApiClient();
    this.internalApiClient = new InternalApiClient(
      () => {
        this.setState({ isAuthRequired: true });
      },
      () => { }
    );

    this.state = {
      userData: null,
      isUserLoaded: false,
      isAuthRequired: false,
    };
  }

  componentDidMount() {
    this.authApiClient
      .getCurrentUserInfo()
      .then(userData => {
        this.setState({ userData, isUserLoaded: true });
      })
      .catch(() => {
        this.setState({ isAuthRequired: true });
      });
  }

  render() {
    if (!this.state.isUserLoaded) {
      return <Spin className="spin-loading" size="large" />;
    }

    return <PageInternal userData={this.state.userData} internalApiClient={this.internalApiClient} />;
  }
}

export default App;
