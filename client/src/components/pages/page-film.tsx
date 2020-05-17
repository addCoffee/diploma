import React, { Component } from "react";
import { Spin } from "antd";
import Recomendation from "../recomendation/recomendation";

export default class PageFilm extends Component<any, any> {
  currentTime = new Date(Date.now()).toTimeString().slice(0, 5);
  state: {isLoading: boolean, film: any} = {
    isLoading: true,
    film: {},
  };

  componentDidMount() {
    //console.log(typeof this.props.match.params.filmId);
    this.props.cinemasApiClient.getFilms()
      .then(data => {
        //console.log(data);
        this.setState({
          film: { ...data.find(item => item.id === Number(this.props.match.params.filmId)) },
          isLoading: false,
        });
      })
      .catch((err: string) => console.warn(err));
  }

  renderScheduleCinema(schedule_film) {
    let schedule = [];
    schedule_film.forEach(item => {
      schedule.push(
        <li
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
    return <ul className="card-film__schedule-film schedule-film ">{schedule}</ul>;
  }

  renderSchedule() {
    let schedule = [];
    this.state.film.cinema_schedule.forEach(item =>
      schedule.push(
        <li className="card-film">
          <div className="card-film__name-film">{item.cinema_name}</div>
          {this.renderScheduleCinema(item.schedule)}
        </li>
      )
    );
    return <ul className="page-film-schedule card-film__schedule-film schedule-film card-schedule">{schedule}</ul>;
  }

  renderJenre() {
    return this.state.film.film_genre.join(", ");
  }

  render() {
    const { film_image, film_age, film_duration, filmName, film_studio, film_genre } = this.state.film;

    console.log(this.state.film);

    if (this.state.isLoading) {
      return <Spin className="spin-loading" size="large" />;
    }
    return (
      <>
        <h1>{filmName}</h1>
        <div className="page-film">
          <img className="page-film__image" alt="picture" src={film_image} />
          <ul className="page-film__info info">
            <li className="info__item">
              <p>
                <b>Возрастное ограничение:</b>
              </p>
              <p>{film_age}+</p>
            </li>
            <li className="info__item">
              <p>
                <b>Жанры:</b>
              </p>
              <p>{this.renderJenre()}</p>
            </li>
            <li className="info__item">
              <p>
                <b>Длительность:</b>
              </p>
              <p>{film_duration}</p>
            </li>
            <li className="info__item">
              <p>
                <b>Производство:</b>
              </p>
              <p>{film_studio}</p>
            </li>
          </ul>
        </div>
        {this.renderSchedule()}

        <Recomendation
          cinemasApiClient={this.props.cinemasApiClient}
          id={Number(this.props.match.params.filmId)}
        />
      </>
    );
  }
}
