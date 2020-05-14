import React from "react";
import PropTypes from "prop-types";
import { Route, HashRouter, withRouter } from "react-router-dom";
import { Layout } from "antd";
import CinemasApiClient from "../services/api/cinemas-api-client";

import PageGeneralSchedule from "./page-general-schedule.jsx";
import PageCinemasList from "./page-cinemas-list.jsx";
import TopBar from "./top-bar.jsx";

import PageAdmin from "./page-admin.jsx";
import PageCinema from "./page-cinema.jsx";
import PageCinemaContacts from "./page-cinema-contacts.jsx";
import PageFilmsList from "./page-films-list.jsx";
import PageFilm from "./page-film.jsx";

const { Header, Content } = Layout;
const TopBarWithRouter = withRouter(TopBar);
const PageCinemaWithRouter = withRouter(PageCinema);
const PageCinemaContactsWithRouter = withRouter(PageCinemaContacts);
const PageFilmWithRouter = withRouter(PageFilm);

export default class PageInternal extends React.Component {
  constructor(props) {
    super(props);
    this.cinemasApiClient = new CinemasApiClient();
    this.state = {};
  }

  componentDidMount() { }

  render() {
    return (
      <HashRouter>
        <Layout className="layout">
          <Header className="layout__top-bar top-bar">
            <TopBarWithRouter userData={this.props.userData} />
          </Header>
          <Content className="layout__main main">
            <div className="main__content content">
              <Route
                exact
                path="/"
                component={() => <PageGeneralSchedule cinemasApiClient={this.cinemasApiClient} />}
              />
              <Route exact path="/cinemas" component={PageCinemasList} />
              <Route exact path="/admin" component={PageAdmin} />
              <Route
                exact
                path="/cinemas/:cinemaId"
                component={() => <PageCinemaWithRouter cinemasApiClient={this.cinemasApiClient} />}
              />
              <Route
                exact
                path="/cinemas/:cinemaId/contacts"
                component={() => (
                  <PageCinemaContactsWithRouter cinemasApiClient={this.cinemasApiClient} />
                )}
              />
              <Route
                exact
                path="/films"
                component={() => <PageFilmsList cinemasApiClient={this.cinemasApiClient} />}
              />
              <Route
                exact
                path="/films/:filmId/"
                component={() => <PageFilmWithRouter cinemasApiClient={this.cinemasApiClient} />}
              />
            </div>
          </Content>
        </Layout>
      </HashRouter>
    );
  }
}

PageInternal.propTypes = {
  userData: PropTypes.object.isRequired,
};
