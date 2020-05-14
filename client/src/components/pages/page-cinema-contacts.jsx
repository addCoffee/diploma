import React, { Component } from "react";
import { YMaps, Map, GeoObject, ZoomControl, RouteButton, FullscreenControl } from "react-yandex-maps";
import { Spin } from "antd";

export default class PageCinemaContacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: { coords: [0, 0] },
    };
  }

  componentDidMount() {
    this.props.cinemasApiClient.getSpartakContact().then(data => {
      this.setState({ data: { ...data }, isLoading: false });
    });
  }

  renderContacts() {
    console.log(this.state.data);
    let contacts = [];
    this.state.data.contacts.forEach(item => {
      contacts.push(
        <li key={item.mean} className="contacts-list__contact-item">
          <b>{item.text}</b> {item.mean}
        </li>
      );
    });
    return <ul className="cinema-contacts__contacts-list contacts-list">{contacts}</ul>;
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
          {this.renderContacts()}
        </div>
      </>
    );
  }
}
