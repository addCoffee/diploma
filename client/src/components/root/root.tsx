import React from "react";
import { Route, HashRouter, withRouter } from "react-router-dom";
import { Layout } from "antd";
import TopBar from "../top-bar/top-bar";
import PageCinema from "../pages/page-cinema";
import PageCinemaContacts from "../pages/page-cinema-contacts";
import PageFilm from "../pages/page-film";
import PageGeneralSchedule from "../pages/page-general-schedule";
import PageCinemasList from "../pages/page-cinemas-list";
import PageAdmin from "../pages/page-admin";
import PageFilmsList from "../pages/page-films-list";
import CinemasApiClient from "../../services/api/cinemas-api-client";

const { Header, Content } = Layout;
const TopBarWithRouter = withRouter(TopBar);
const PageCinemaWithRouter = withRouter(PageCinema);
const PageCinemaContactsWithRouter = withRouter(PageCinemaContacts);
const PageFilmWithRouter = withRouter(PageFilm);

export default class Root extends React.Component<any, any> {
  cinemasApiClient = new CinemasApiClient();
  state = {};

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
