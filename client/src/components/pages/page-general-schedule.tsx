import React from "react";
import {Spin, Select} from "antd";
import CardCinema from "../card-cinema/card-cinema";
import CinemasApiClient from "src/services/api/cinemas-api-client";
import {isSimilarName, TypeRegExp} from "../../utils/helpers";

const { Option } = Select;

interface PageGeneralScheduleState {
  isLoading: boolean;
  data: CinemaModel[];
  selectedId: 'cinemas' | 'films';
}

export default class PageGeneralSchedule extends React.Component<{cinemasApiClient: CinemasApiClient}, PageGeneralScheduleState> {
  initialData: CinemaModel[] = [];
  state: PageGeneralScheduleState = {
    isLoading: true,
    data: [],
    selectedId: "cinemas",
  };

  componentDidMount() {
    this.props.cinemasApiClient.getGeneralSchedule()
      .then(data => {
        this.initialData = data;
        this.setState({data, isLoading: false});
      })
      .catch((err: string) =>  console.warn(err));
  }

  renderSchedule = () => {
    return this.state.data.map((item, idx: number) => (
      <CardCinema
        key={idx}
        name={item.name}
        schedule={item.schedule}
      />
    ));
  };

  transformDataIntoFilms = () => {
    let films = [];
    this.initialData.forEach(cinema => {
      cinema.schedule.forEach(film => {
        const foundIndex = films.findIndex(({name}) => isSimilarName(name, film.name, TypeRegExp.FILM_NAME));
        if (foundIndex !== -1) {
          films[foundIndex] = {
            ...film,
            schedule: [...films[foundIndex].schedule, {name: cinema.name, schedule: film.schedule}],
          }
        } else {
          films.push({
            ...film,
            schedule: [{name: cinema.name, schedule: film.schedule}],
          });
        }
      });
    });
    return films;
  };

  handleChangeSelect = (optionValue: 'cinemas' | 'films') => {
    if (optionValue === "films") {
      this.setState({ data: [...this.transformDataIntoFilms()], selectedId: optionValue });
    } else {
      this.setState({ data: [...this.initialData], selectedId: optionValue });
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
