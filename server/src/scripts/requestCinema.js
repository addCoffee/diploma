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
            },
        },
        function(error, response, body) {
            if (/spartak/.test(fileName)) {
                fs.writeFile(fileName, body.replace(/\s+/g, " "), () => {});
            } else {
                fs.writeFile(fileName, body, () => {});
            }
            if (body === undefined) {
                throw new SyntaxError("Данные некорректно загружены.");
            } else {
                if (/spartak/.test(fileName)) {
                    return res.send(body.replace(/\s+/g, " "));
                } else {
                    console.log(body);
                    return res.send(body);
                }
            }
        }
    );
}

module.exports = requestCinemaData;
