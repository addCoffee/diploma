const request = require("request");
const fs = require("fs");
const baseUrl = "http://api.scraperapi.com/?api_key=7b1f5faf8ccd51cf3778fc9e6d675890&url=";

function requestCinemaData(url, fileName, res) {
    request(
        {
            method: "GET",
            url: baseUrl + url,
            headers: {
                Accept: "application/json",
                "Access-Control-Allow-Origin": "http://http://localhost:8000",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers":
                    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                "Content-Type": "text/html",
            },
        },
        function(error, response, body) {
            fs.writeFile(fileName, body, () => console.log(1));
            if (body === undefined) {
                throw new SyntaxError("Данные некорректно загружены.");
            } else {
                return res.send(body);
            }
        }
    );
}

module.exports = requestCinemaData;
