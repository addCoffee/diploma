import React, { Component } from "react";
import CardFilm from "./card-film.jsx";

export default class CardCinema extends Component {
    renderCinema() {
        let cinema = [];
        this.props.schedule.forEach(film =>
            cinema.push(
                <CardFilm
                    name={this.props.idSelected === "cinemas" ? film.film_name : film.cinema_name}
                    schedule={this.props.idSelected === "cinemas" ? film.film_schedule : film.schedule}
                />
            )
        );
        return cinema;
    }

    render() {
        return (
            <>
                <h3 className="general-schedule__cinema-name">{this.props.name}</h3>
                <div className="general-schedule__cinema">{this.renderCinema()}</div>
            </>
        );
    }
}
