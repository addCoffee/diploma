import React, { Component } from "react";
import { YMaps, Map, GeoObject, ZoomControl, RouteButton, FullscreenControl } from "react-yandex-maps";
import { Spin } from "antd";

export default class PageCinemaContacts extends Component<any, any> {
  state: {isLoading: boolean, data: {coords: number[], address?: any, contacts?: any}} = {
    isLoading: true,
    data: { coords: [0, 0] },
  };

  componentDidMount() {
    this.props.cinemasApiClient.getSpartakContact().then(data => {
      this.setState({ data: { ...data }, isLoading: false });
    });
  }

  render() {
    if (this.state.isLoading) {
      return <Spin className="spin-loading" size="large" />;
    }

    return (
      <>
        <h1>Кинотеатр Спартак</h1>
        <div className="cinema-contacts">
          <YMaps>
            <Map className="maps" defaultState={{ center: this.state.data.coords, zoom: 16 }}>
              <FullscreenControl />
              <RouteButton options={{ float: "right" }} />
              <ZoomControl
                options={{
                  size: "small",
                  zoomDuration: 1000,
                }}
              />
              <GeoObject
                geometry={{
                  type: "Point",
                  coordinates: this.state.data.coords,
                }}
                properties={{
                  // Контент метки.
                  iconContent: this.state.data.address,
                }}
                options={{
                  preset: "islands#blackStretchyIcon",
                }}
              />
            </Map>
          </YMaps>
          <ul className="cinema-contacts__contacts-list contacts-list">
            {
              this.state.data.contacts.forEach(item => (
                <li key={item.mean} className="contacts-list__contact-item">
                  <b>{item.text}</b> {item.mean}
                </li>
              ))
            }
          </ul>
        </div>
      </>
    );
  }
}
