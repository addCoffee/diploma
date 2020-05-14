import React, { Component } from "react";
import { Spin, Select } from "antd";
import CardCinema from "../card-cinema/card-cinema";

const { Option } = Select;

export default class PageGeneralSchedule extends Component<any, any> {
  defaultData = [];
  state = {
    isLoading: true,
    data: [],
    idSelected: "cinemas",
  };

  componentDidMount() {
    this.props.cinemasApiClient
      .getGeneralSchedule()
      .then(data => {
        this.defaultData = [...data];
        this.setState({ data: [...data], isLoading: false });
      })
      .catch(err => {
        console.warn(err);
      });
  }

  renderSchedule = idSelected => {
    let schedule = [];
    this.state.data.forEach(item => {
      schedule.push(
        <CardCinema
          idSelected={idSelected}
          name={idSelected === "cinemas" ? item.cinema_name : item.film_name}
          schedule={idSelected === "cinemas" ? item.schedule : item.cinema_schedule}
        />
      );
    });
    return schedule;
  };

  transformDataforFilm = () => {
    let newData = [];
    this.defaultData.forEach(cinema => {
      let objFilm:any = {};
      objFilm["cinema_schedule"] = [];
      let objCinema: any = {};
      objCinema["cinema_name"] = cinema.cinema_name;
      cinema.schedule.forEach(film => {
        objFilm = {};
        objFilm["cinema_schedule"] = [];
        objFilm["film_image"] = film.film_image;
        objFilm["film_name"] = film.film_name;
        objCinema["schedule"] = film.film_schedule;
        objFilm.cinema_schedule.push({ ...objCinema });
        const tranformFilmName = objFilm.film_name
          .match(/([А-Я]{1}[а-яА-Яё0-24-9,. !№?:—-]{1,} ?)(3D)?/g)[0]
          .trim()
          .replace("ё", "е")
          .toLowerCase();
        let isPushed = false;
        newData.forEach((newDataFilm, i) => {
          const tranformNewDataFilmName = newDataFilm.film_name
            .match(/([А-Я]{1}[а-яА-Яё0-24-9,. !№?:—-]{1,} ?)(3D)?/g)[0]
            .trim()
            .replace("ё", "е")
            .toLowerCase();

          if (tranformNewDataFilmName.startsWith(tranformFilmName) && isPushed === false) {
            newData[i].cinema_schedule.push({ ...objCinema });
            isPushed = true;
          }
        });
        if (!isPushed) {
          newData.push({ ...objFilm });
        }
      });
    });
    return newData;
  };

  handleChangeSelect = value => {
    if (value === "films") {
      this.setState({ data: [...this.transformDataforFilm()], idSelected: "films" });
    } else {
      this.setState({ data: [...this.defaultData], idSelected: "cinemas" });
    }
  };

  render() {
    if (this.state.isLoading) {
      return <Spin className="spin-loading" size="large" />;
    }

    return (
      <>
        <div className="general-schedule-header">
          <h1>Киноафиша</h1>
          <div>
            <Select defaultValue="cinemas" style={{ width: 150 }} onChange={this.handleChangeSelect}>
              <Option value="cinemas">По кинотеатрам</Option>
              <Option value="films">По фильмам</Option>
            </Select>
          </div>
        </div>

        <div className="general-schedule">{this.renderSchedule(this.state.idSelected)}</div>
      </>
    );
  }
}
