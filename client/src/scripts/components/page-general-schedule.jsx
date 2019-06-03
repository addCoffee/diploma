import React, { Component } from "react";
import { Spin } from "antd";

export default class PageGeneralSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: {},
        };
    }

    componentDidMount() {
        this.props.cinemasApiClient.getSpartak().then(data => {
            this.setState({ data: data, isLoading: false });
            console.log(data);
        });
    }

    renderSparta() {
        let renderSchedule = [];
        for (let key in this.state.data) {
            let timeWindows = [];
            for (let timeKey of this.state.data[key]) {
                timeWindows.push(timeKey.time);
            }
            renderSchedule.push(
                <div>
                    {key}:{timeWindows}
                </div>
            );
        }
        return renderSchedule;
    }

    render() {
        if (this.state.isLoading) {
            return <Spin className="spin-loading" size="large" />;
        }

        return (
            <div>
                Xexe
                {this.renderSparta()}
            </div>
        );
    }
}
