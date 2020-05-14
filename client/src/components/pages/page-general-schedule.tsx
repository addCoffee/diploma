import React, { Component } from "react";
import { Spin, Select } from "antd";
import CardCinema from "../card-cinema/card-cinema";

const { Option } = Select;

export default class PageGeneralSchedule extends Component<any, any> {
  defaultData = [];
  state = {
    isLoading: true,
    data: [],
    selectedId: "cinemas",
  };

  componentDidMount() {
    this.props.cinemasApiClient.getGeneralSchedule()
      .then(data => {
        this.defaultData = [...data];
        this.setState({ data: [...data], isLoading: false });
      })
      .catch(err =>  console.warn(err));
  }

  renderSchedule = () => {
    const {selectedId} = this.state;
    return this.state.data.map(item => (
      <CardCinema
        selectedId={selectedId}
        name={selectedId === "cinemas" ? item.cinema_name : item.film_name}
        schedule={selectedId === "cinemas" ? item.schedule : item.cinema_schedule}
      />
    ));
  };

  transformDataForFilm = () => {
    let newData = [];
    this.defaultData.forEach(cinema => {
      let objFilm:any = {};
      objFilm.cinema_schedule = [];
      let objCinema: any = {};
      objCinema.cinema_name = cinema.cinema_name;
      cinema.schedule.forEach(film => {
        objFilm = {};
        objFilm.cinema_schedule = [];
        objFilm.film_image = film.film_image;
        objFilm.film_name = film.film_name;
        objCinema.schedule = film.film_schedule;
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

  handleChangeSelect = (optionValue: string) => {
    if (optionValue === "films") {
      this.setState({ data: [...this.transformDataForFilm()], selectedId: optionValue });
    } else {
      this.setState({ data: [...this.defaultData], selectedId: optionValue });
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

        <div className="general-schedule">{this.renderSchedule()}</div>
      </>
    );
  }
}
