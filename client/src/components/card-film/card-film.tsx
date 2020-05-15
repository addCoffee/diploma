import React from "react";

export default function CardFilm(props: any) {
  const currentTime = new Date(Date.now()).toTimeString().slice(0, 5);

  return (
    <div className="card-film">
      <div className="card-film__name-film">{props.name}</div>
      <ul className="card-film__schedule-film schedule-film">
        {
          props.schedule.map(schedule => (
            <li
              className={
                schedule.time > currentTime || schedule.time.startsWith("00:")
                  ? "schedule-film__time"
                  : "schedule-film__time schedule-film__time--disabled"
              }
            >
              {schedule.time}
            </li>
          ))
        }
      </ul>
    </div>
  );
}
