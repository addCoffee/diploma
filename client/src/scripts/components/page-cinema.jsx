import React, { Component } from "react";
import { Spin } from "antd";

export default class PageCinema extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            cinema_name: "",
            schedule: [],
        };
    }

    componentDidMount() {
        this.props.cinemasApiClient.getCinema(this.props.match.params.cinemaId).then(res => {
            console.log(res, "res");
            this.setState({ cinema_name: res.cinema_name, schedule: res.schedule, isLoading: false });
        });
    }

    renderScheduleFilm(schedule_film) {
        let schedule = [];
        schedule_film.forEach(item => {
            schedule.push(<li className="film-schedule__item-time">{item.time}</li>);
        });
        return <ul className="film-content__film-schedule film-schedule">{schedule}</ul>;
    }

    renderSchedule() {
        let schedule = [];
        this.state.schedule.forEach(item =>
            schedule.push(
                <div className="film-billboard">
                    <div className="film-billboard__name">{item.film_name}</div>
                    <div className="film-billboard__film-content film-content">
                        <img className="film-content__image" src={item.film_image} />
                        {this.renderScheduleFilm(item.film_schedule)}
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
                <h1 className="cinema-billboard__title">Cinema {this.state.cinema_name}</h1>
                <div className="cinema-billboard__films">{this.renderSchedule()}</div>
            </div>
        );
    }
}
