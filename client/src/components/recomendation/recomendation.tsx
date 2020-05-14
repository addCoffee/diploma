import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Spin, Card } from "antd";

const {Meta} = Card;

export default class Recomendation extends React.Component<any, any> {
  currentTime = new Date(Date.now()).toTimeString().slice(0, 5);
  state = {
    isLoading: true,
    data: [],
  };

  componentDidMount() {
    this.props.cinemasApiClient.getFilms()
      .then(data => this.setState({data, isLoading: false}))
      .catch((err: string) => console.warn(err));
  }

  renderRecomendations() {
    const countRecomendations = 4;
    let recomendationFilms = [];
    const genreFound = this.state.data.find(({id}) => id === this.props.id).film_genre;
    this.state.data.forEach(item => {
      let countSimilarGenre = 0;
      if (item.film_genre !== undefined && item.id !== this.props.id) {
        item.film_genre.forEach(item => {
          const itemfilm = item;
          genreFound.forEach(item => {
            if (item === itemfilm) {
              countSimilarGenre++;
            }
          });
        });
        if (countSimilarGenre !== 0 && recomendationFilms.length < countRecomendations) {
          const url = `/films/${item.id}`;
          recomendationFilms.push(
            <li>
              <Link to={url}>
                <Card
                  className="recomendation-list__card-film"
                  hoverable
                  cover={<img alt="picture" src={item.film_image} />}
                >
                  <Meta className="meta" title={item.film_name} />
                </Card>
              </Link>
            </li>
          );
        }
      }
    });

    return <ul className="recomendation__ul">{recomendationFilms}</ul>;
  }

  render() {
    if (this.state.isLoading) {
      return <Spin className="spin-loading" size="large" />;
    }

    return (
      <div className="recomendation">
        <h3 className="recomendation__title">Вам может понравиться</h3>
        {this.renderRecomendations()}
      </div>
    );
  }
}
