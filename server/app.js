const express = require("express");

const requestCinemaData = require("./src/scripts/requestCinema");

const app = express();
const port = 3000;

app.get("/spartak", (req, res) => {
    requestCinemaData("http://kinospartak.ru/", "./htmls/spartak.html");
});

app.get("/maximir", (req, res) => {
    requestCinemaData("http://www.maxi-mir.ru/cinema&render=true", "./htmls/maximir.html");
    /*fs.readFile("./src/htmls/maximir.html", "utf8", (error, data) => {
        if (error) throw error; // если возникла ошибка
        res.send(data); // выводим считанные данные
    });*/
});

app.get("/proletarian", (req, res) => {
    requestCinemaData("http://proletka.ru/", "./htmls/proletka.html");
});

app.get("/cinema-park", (req, res) => {
    requestCinemaData(
        "https://kinoteatr.ru/raspisanie-kinoteatrov/voronezh/galereya-chizhova/",
        "./htmls/cinema.html",
        res
    );
});

const server = app.listen(port, error => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});
