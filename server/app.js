const express = require("express");
const cors = require("cors");

const requestCinemaData = require("./src/scripts/requestCinema");
const requestCinemaDataCache = require("./src/scripts/requestCache");

const app = express();
const port = 3000;

app.use(cors());

app.get("/spartak", (req, res) => {
    requestCinemaDataCache("spartak", res);
    //requestCinemaData("http://kinospartak.ru/", "./src/source-htmls/spartak.html", res);
});

app.get("/maximir", (req, res) => {
    //requestCinemaData("http://www.maxi-mir.ru/cinema&render=true", "./src/source-htmls/maximir.html", res);
    requestCinemaDataCache("maximir", res);
});

app.get("/proletarian", (req, res) => {
    requestCinemaDataCache("proletka", res);
    //requestCinemaData("http://proletka.ru/", "./src/source-htmls/proletka.html", res);
});

app.get("/cinema-park", (req, res) => {
    requestCinemaDataCache("cinema", res);
    /*requestCinemaData(
        "https://kinoteatr.ru/raspisanie-kinoteatrov/voronezh/galereya-chizhova/",
        "./src/source-htmls/cinema.html",
        res
    );*/
});

const server = app.listen(port, error => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});
