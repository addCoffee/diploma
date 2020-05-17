import React, { Component } from "react";
import { List, Card } from "antd";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import { cinemasList } from "../../utils/helpers";


export default class PageCinemasList extends Component {
  redirectTo = e => {
    return <Redirect to={e.currentTarget.dataset.to} />;
  };
  render() {
    return (
      <>
        <h1>Кинотеатры</h1>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
          dataSource={cinemasList}
          renderItem={item => (
            <Link to={`/cinemas/${item.namePath.toLowerCase()}`}>
              <List.Item>
                <Card className="xzz" title={item.title}>
                  <div onClick={this.redirectTo} data-to={item.link}>
                    Сайт
                  </div>
                </Card>
              </List.Item>
            </Link>
          )}
        />
      </>
    );
  }
}
