import React from "react";
import CardFilm from "../card-film/card-film";

export default function CardCinema(props: any) {
  const {schedule, selectedId, name} = props;
  return (
    <>
      <h3 className="general-schedule__cinema-name">{name}</h3>
      <div className="general-schedule__cinema">
        {
          schedule.map(film => (
            <CardFilm
              name={selectedId === "cinemas" ? film.film_name : film.cinema_name}
              schedule={selectedId === "cinemas" ? film.film_schedule : film.schedule}
            />
          ))
        }
      </div>
    </>
  );
}
