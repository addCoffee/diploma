import React, { Component } from "react";
import { YMaps, Map, GeoObject } from "react-yandex-maps";

export default class PageCinemaContacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            coords: [],
        };
    }

    componentDidMount() {
        this.props.cinemasApiClient.getGeneralSchedule().then(data => {
            const elemFinded = data.find(cinema => {
                console.log(cinema.cinema_url, this.props.match.params.cinemaId);
                return cinema.cinema_name == this.props.match.params.cinemaId;
            });
            console.log("elem", elemFinded);

            this.setState({ coords: elemFinded.coords, isLoading: false });
            console.log("DATA", data);
        });
    }

    render() {
        console.log(this.props.match.params.cinemaId);
        return (
            <YMaps>
                <Map className="maps" defaultState={{ center: this.state.coords, zoom: 16 }}>
                    <GeoObject
                        geometry={{
                            type: "Point",
                            coordinates: this.state.coords,
                        }}
                        properties={{
                            // Контент метки.
                            iconContent: "Я тащусь",
                        }}
                    />
                </Map>
            </YMaps>
        );
    }
}
