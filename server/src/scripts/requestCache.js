const fs = require("fs");

function requestCinemaDataCache(path, res) {
    fs.readFile(`./src/source-htmls/${path}.html`, "utf8", (error, data) => {
        //console.log(data);
        if (error) throw error; // если возникла ошибка
        return res.send(data); // выводим считанные данные
    });
}

module.exports = requestCinemaDataCache;
/*fs.readFile("./src/htmls/maximir.html", "utf8", (error, data) => {
    if (error) throw error; // если возникла ошибка
    res.send(data); // выводим считанные данные
});*/
