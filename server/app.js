const express = require("express");
const cors = require("cors");

const requestCinemaData = require("./src/scripts/requestCinema");
const requestCinemaDataCache = require("./src/scripts/requestCache");

const app = express();
const port = 3000;

const corsOptions = {
    origin: "http://localhost:8000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.get("/spartak", (req, res) => {
    requestCinemaDataCache("spartak", res);
    // requestCinemaData("http://kinospartak.ru/", "./src/source-htmls/spartak.html", res);
});

app.get("/maximir", (req, res) => {
    requestCinemaDataCache("maximir", res);
});

app.get("/proletarian", (req, res) => {
    requestCinemaDataCache("proletka", res);
});

app.get("/cinema-park", (req, res) => {
    requestCinemaDataCache("cinema", res);
});

app.get("/spartak/contacts", (req, res) => {
    requestCinemaDataCache("spartakdb", res);
    //requestCinemaData("http://kinospartak.ru/contact/", "./src/source-htmls/spartakdb.html", res);
    //requestCinemaData("http://kinospartak.ru/", "./src/source-htmls/spartak.html", res);
    //requestCinemaData("http://proletka.ru/", "./src/source-htmls/proletka.html", res);
    /*requestCinemaData(
        "https://kinoteatr.ru/raspisanie-kinoteatrov/voronezh/galereya-chizhova/?day=tomorrow",
        "./src/source-htmls/cinema.html",
        res
    );*/
});

const server = app.listen(port, error => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});
