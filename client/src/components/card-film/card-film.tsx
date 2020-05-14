import React, { Component } from "react";

export default class CardFilm extends Component<any, any> {
  currentTime = new Date(Date.now()).toTimeString().slice(0, 5);

  renderSchedule() {
    let filmSchedule = [];
    this.props.schedule.forEach(schedule =>
      filmSchedule.push(
        <li
          className={
            schedule.time > this.currentTime || schedule.time.startsWith("00:")
              ? "schedule-film__time"
              : "schedule-film__time schedule-film__time--disabled"
          }
        >
          {schedule.time}
        </li>
      )
    );
    return <ul className="card-film__schedule-film schedule-film">{filmSchedule}</ul>;
  }

  render() {
    return (
      <div className="card-film">
        <div className="card-film__name-film">{this.props.name}</div>
        {this.renderSchedule()}
      </div>
    );
  }
}
