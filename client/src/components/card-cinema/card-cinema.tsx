import React from "react";
import CardFilm from "../card-film/card-film";

export default function CardCinema(props: any) {
  const {schedule, name} = props;
  console.log(props)
  return (
    <>
      <h3 className="general-schedule__cinema-name">{name}</h3>
      <div className="general-schedule__cinema">
        {
          schedule.map((film, idx: number) => (
            <CardFilm
              key={idx}
              name={film.name}
              schedule={film.schedule}
            />
          ))
        }
      </div>
    </>
  );
}
