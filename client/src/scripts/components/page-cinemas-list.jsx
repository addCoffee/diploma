import React from "react";
import { List, Card } from "antd";
import { Link } from "react-router-dom";

const data = [
    {
        title: "Спартак",
        link: "http://kinospartak.ru/",
        namePath: "Spartak",
    },
    {
        title: "Максимир",
        link: "http://www.maxi-mir.ru/cinema",
        namePath: "Maximir",
    },
    {
        title: "Синема Парк",
        link: "https://kinoteatr.ru/kinoafisha/voronezh/",
        namePath: "Cinema-Park",
    },
    {
        title: "Пролетарий",
        link: "http://proletka.ru/",
        namePath: "Proletarian",
    },
    {
        title: "Люксор",
        link: "https://www.luxorfilm.ru/cinema/voronezh",
        namePath: "Luxor",
    },
    {
        title: "Star&Mlad МП",
        link: "https://kinostarmlad.ru//",
        namePath: "Star&Mlad-MP",
    },
    {
        title: "Star&Mlad Град",
        link: "https://kinostarmlad.ru/",
        namePath: "Star&Mlad-Grad",
    },
    {
        title: "Юность",
        link: "http://junost.ru/",
        namePath: "Juvenility",
    },

    {
        title: "Левый берег",
        link: "http://cinema.levbereg.com/",
        namePath: "Left-bank",
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
                    const url = `/cinemas/${item.namePath.toLowerCase()}`;
                    return (
                        <Link to={url}>
                            <List.Item>
                                <Card className="xzz" title={item.title}>
                                    {<Link to={item.link}>Сайт</Link>}
                                </Card>
                            </List.Item>
                        </Link>
                    );
                }}
            />
        </>
    );
}
