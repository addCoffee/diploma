import React, { Component } from "react";
import { Spin } from "antd";
import CardCinema from "./card-cinema.jsx";

export default class PageGeneralSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: [],
        };
    }

    componentDidMount() {
        this.props.cinemasApiClient.getGeneralSchedule().then(data => {
            this.setState({ data: [...data], isLoading: false });
            console.log("DATA", data);
        });
    }

    renderCinemaSchedule() {
        let schedule = [];
        this.state.data.forEach(cinema =>
            schedule.push(<CardCinema name={cinema.cinema_name} schedule={cinema.schedule} />)
        );
        return schedule;
    }

    render() {
        if (this.state.isLoading) {
            return <Spin className="spin-loading" size="large" />;
        }

        return (
            <>
                <h1>Киноафиша</h1>
                <div className="general-schedule">{this.renderCinemaSchedule()}</div>
            </>
        );
    }
}
