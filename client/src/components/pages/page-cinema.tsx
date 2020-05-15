import React, { Component } from "react";
import { Spin } from "antd";
import { Link } from "react-router-dom";

export default class PageCinema extends Component<any, any> {
  currentTime = new Date(Date.now()).toTimeString().slice(0, 5);
  state = {
    isLoading: true,
    cinema_name: "",
    schedule: [],
  };

  componentDidMount() {
    this.props.cinemasApiClient.getCinema(this.props.match.params.cinemaId)
      .then(({cinema_name, schedule}) => {
        this.setState({
          cinema_name,
          schedule,
          isLoading: false,
        });
      });
  }

  renderScheduleFilm(schedule_film) {
    let schedule = [];
    schedule_film.forEach(item => {
      schedule.push(
        <li
          title={item.room}
          className={
            item.time > this.currentTime || item.time.startsWith("00:")
              ? "film-schedule__item-time"
              : "film-schedule__item-time film-schedule__item-time--disabled"
          }
        >
          {item.time}
        </li>
      );
    });
    return <ul className="film-content__film-schedule film-schedule">{schedule}</ul>;
  }

  renderSchedule() {
    let schedule = [];
    this.state.schedule.forEach(item =>
      schedule.push(
        <div className="film-billboard">
          <div className="film-billboard__name">{item.filmName}</div>
          <div className="film-billboard__film-content film-content">
            <img className="film-content__image" alt="picture" src={item.film_image} />
            {this.renderScheduleFilm(item.filmSchedule)}
          </div>
        </div>
      )
    );
    return schedule;
  }

  render() {
    if (this.state.isLoading) {
      return <Spin className="spin-loading" size="large" />;
    }

    return (
      <div className="cinema-billboard">
        <div className="cinema-billboard__header-cinema header-cinema">
          <h1>Кинотеатр {this.state.cinema_name}</h1>
          <div className="header-cinema__contacts">
            <Link to={`/cinemas/${this.props.match.params.cinemaId}/contacts`}>Контакты</Link>
          </div>
        </div>
        <div className="cinema-billboard__films">{this.renderSchedule()}</div>
      </div>
    );
  }
}
