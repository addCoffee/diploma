import React, { Component } from "react";
import { Card, Spin } from "antd";
import { Link } from "react-router-dom";

const { Meta } = Card;

export default class PageFilmsList extends Component<any, any> {
  state = {
    isLoading: true,
    data: [],
  };

  componentDidMount() {
    this.props.cinemasApiClient.getFilms()
      .then(data => {
        this.setState({ data: [...data], isLoading: false });
      })
      .catch((err: string) => console.warn(err));
  }

  render() {
    console.log(this.state.data);
    if (this.state.isLoading) {
      return <Spin className="spin-loading" size="large" />;
    }

    return (
      <div>
        <h1>Фильмы</h1>
        <div className="films-list">
          {
            this.state.data.map(item => (
              <Link to={`/films/${item.id}`}>
                <Card
                  className="films-list__card-film"
                  hoverable
                  cover={<img alt="picture" src={item.film_image} />}
                >
                  <Meta className="meta" title={item.film_name} />
                </Card>
              </Link>
            ))
          }
        </div>
      </div>
    );
  }
}
