import React from "react";
import { List, Card } from "antd";
import { Link } from "react-router-dom";

const data = [
    {
        title: "Spartak",
    },
    {
        title: "Maximir",
    },
    {
        title: "Cinema-Park",
    },
    {
        title: "Proletarian",
    },
    {
        title: "Luxor",
    },
    {
        title: "Star&Mlad-MP",
    },
    {
        title: "Star&Mlad-Grad",
    },
    {
        title: "Juvenility",
    },

    {
        title: "Left-bank",
    },
];

export default function PageCinemasList() {
    return (
        <>
            <h1>Cinemas</h1>
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
                dataSource={data}
                renderItem={item => {
                    const url = `/cinemas/${item.title.toLowerCase()}`;
                    return (
                        <Link to={url}>
                            <List.Item>
                                <Card title={item.title}>{/*<Link>Сайт кинотеатра</Link>*/}</Card>
                            </List.Item>
                        </Link>
                    );
                }}
            />
        </>
    );
}
