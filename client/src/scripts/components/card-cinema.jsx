import React, { Component } from "react";
import CardFilm from "./card-film.jsx";

export default class CardCinema extends Component {
    renderCinema() {
        let cinema = [];
        this.props.schedule.forEach(film =>
            cinema.push(<CardFilm name={film.film_name} schedule={film.film_schedule} />)
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
