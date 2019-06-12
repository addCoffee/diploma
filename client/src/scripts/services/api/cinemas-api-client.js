const CURRENT_DAY = new Date(Date.now()).toLocaleString("ru", { timezone: "UTC", month: "long", day: "numeric" });
const NEXT_DAY = new Date(Date.now() + 86400000).toLocaleString("ru", {
    timezone: "UTC",
    month: "long",
    day: "numeric",
});

export default class CinemasApiClient {
    constructor(internalApiClient) {
        this._internalApiClient = internalApiClient;
    }

    getSpartak() {
        return fetch("http://localhost:3000/spartak", {
            method: "get",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8",
            },
        })
            .then(res => {
                console.log(res.clone().text());
                return res.clone().text();
            })
            .then(resText => {
                //console.log(new RegExp(templateSpartak, "g"));
                //через new RegExp потому что нужно вставлять динамические переменные
                let dataSource = [];
                if (new RegExp(`${NEXT_DAY}`, "g").test(resText)) {
                    dataSource = resText.match(
                        new RegExp(
                            `<h2><a href="\\/billboard\\/films\\/[0-9]+\\/">(.*?)<\\/a><\\/h2>|${CURRENT_DAY}.*?${NEXT_DAY}|<a href="\\/billboard\\/films\\/[0-9]+\\/"><img src="(\\/images\\/cms\\/thumbs\\/[0-9a-z]+\\/.*?\\.jpg)`,
                            "g"
                        )
                    );
                } else {
                    dataSource = resText.match(
                        new RegExp(
                            `<h2><a href="\\/billboard\\/films\\/[0-9]+\\/">(.*?)<\\/a><\\/h2>|${CURRENT_DAY}.*? class="close"|<a href="\\/billboard\\/films\\/[0-9]+\\/"><img src="(\\/images\\/cms\\/thumbs\\/[0-9a-z]+\\/.*?\\.jpg)`,
                            "g"
                        )
                    );
                }

                dataSource = dataSource.map(item => {
                    if (/img/.test(item)) {
                        return item.match(/(\/images\/cms\/thumbs\/[0-9a-z]+\/.*?\.jpg)/)[0];
                    } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
                        return item.match(/">(.*)<\/a/)[1];
                    } else {
                        return item.match(/([0-9]{2}:[0-9]{2})/g);
                    }
                });

                let data = {};
                data["cinema_name"] = "Спартак";
                data["schedule"] = [];
                data["cinema_url"] = "spartak";
                data["coords"] = [51.66197289303437, 39.20448107491798];
                let scheduleItem = {};
                dataSource.forEach((item, i) => {
                    if (/images/.test(item)) {
                        if (Object.keys(scheduleItem).length !== 0 && scheduleItem["film_schedule"].length !== 0) {
                            //scheduleItem["film_schedule"]
                            data["schedule"].push({ ...scheduleItem });
                        }
                        scheduleItem = { film_name: "", film_schedule: [], film_image: "" };
                        scheduleItem["film_image"] = `http://kinospartak.ru${item}`;
                    } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
                        scheduleItem["film_name"] = item;
                    } else {
                        item.forEach(timeItem => {
                            let fieldTimeName = {};
                            fieldTimeName["time"] = timeItem;
                            scheduleItem["film_schedule"].push({ ...fieldTimeName });
                        });
                    }
                    if (dataSource.length - 1 === i && scheduleItem["film_schedule"].length !== 0) {
                        data["schedule"].push({ ...scheduleItem });
                    }
                });
                return data;
            })
            .catch(err => console.log(err));
    }

    parsing(resText, coords, path, nameCinema, general, isImages, generalImages, nameFilm, afterImages) {
        let dataSource = resText.match(general);
        dataSource = dataSource.map(item => {
            if (isImages.test(item)) {
                return item.match(generalImages)[1];
            } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
                let newItem = item.match(nameFilm)[1];
                return newItem.replace(/&nbsp;/g, " ");
                //return item.match(name)[1];
            } else {
                return item.match(/([0-9]{2}:[0-9]{2})/)[1];
            }
        });

        let data = {};
        data["cinema_name"] = nameCinema;
        data["schedule"] = [];
        data["coords"] = coords;
        let scheduleItem = {};
        dataSource.forEach((item, i) => {
            if (afterImages.test(item)) {
                if (Object.keys(scheduleItem).length !== 0 && scheduleItem["film_schedule"].length !== 0) {
                    data["schedule"].push({ ...scheduleItem });
                }
                scheduleItem = { film_name: "", film_schedule: [], film_image: "" };
                scheduleItem["film_image"] = `${path}${item}`;
            } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
                scheduleItem["film_name"] = item;
            } else {
                if (Object.keys(scheduleItem).length !== 0) {
                    let fieldTimeName = {};
                    fieldTimeName["time"] = item;
                    scheduleItem["film_schedule"].push({ ...fieldTimeName });
                }
            }
            if (dataSource.length - 1 === i && scheduleItem["film_schedule"].length !== 0) {
                data["schedule"].push({ ...scheduleItem });
            }
        });
        console.log(data);
        return data;
    }

    getMaximir() {
        return fetch("http://localhost:3000/maximir", {
            method: "get",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8",
            },
        })
            .then(res => {
                return res.clone().text();
            })
            .then(resText => {
                return this.parsing(
                    resText,
                    [51.697272424517834, 39.272902010323115],
                    "http://www.maxi-mir.ru/",
                    "Максимир",
                    /class="b-cinema-title">(.*?)<\/a>|<em class="timeColor[0-9]{1}">([0-9]{2}:[0-9]{2})<\/em>|src="(\/files\/cinema\/[0-9]+\/115_[0-9a-z]+.jpg)/g,
                    /src/,
                    /(\/files\/cinema\/[0-9]+\/115_[0-9a-z]+.jpg)/,
                    /">(.*)<\/a/,
                    /files/
                );
            })
            .catch(err => console.log(err));
    }

    getProletarian() {
        return fetch("http://localhost:3000/proletarian", {
            method: "get",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8",
            },
        })
            .then(res => {
                return res.clone().text();
            })
            .then(resText => {
                return this.parsing(
                    resText,
                    [51.664884202447894, 39.20451430308151],
                    "http://proletka.ru/",
                    "Пролетарий",
                    /<a class="link" href="\/movies\/.*\/"><span>(.*)<\/span>|<em class="film-time">([0-9]{2}:[0-9]{2})<\/em><\/li>|ambl-image" src="(\/images\/cms\/thumbs\/[0-9a-z]+\/[0-9a-z_]+\.jpg)/g,
                    /src/,
                    /="(\/images\/cms\/thumbs\/[0-9a-z]+\/[0-9a-z_]+\.jpg)/,
                    /an>(.*)</,
                    /images/
                );
            })
            .catch(err => console.log(err));
    }

    getCinemaPark() {
        return fetch("http://localhost:3000/cinema-park", {
            method: "get",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8",
            },
        })
            .then(res => {
                return res.clone().text();
            })
            .then(resText => {
                let dataSource = resText.match(
                    /data-gtm-list-item-filmName="(.*?)"|<span class="shedule_session_time">\s+([0-9]{2}:[0-9]{2})|<img class="shedule_movie_img" src="(https:\/\/.*?\.kinoteatr\.ru\/preview6\/upload\/.*?\.jpg)">/g
                );

                console.log(dataSource);

                dataSource = dataSource.map(item => {
                    if (/src/.test(item)) {
                        return item.match(/(http.*)"/)[1];
                    } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
                        return item.match(/"(.*?)"/)[1];
                    } else {
                        return item.match(/([0-9]{2}:[0-9]{2})/)[1];
                    }
                });
                console.log(dataSource);

                let data = {};
                data["cinema_name"] = "Синема Парк";
                data["schedule"] = [];
                data["coords"] = [51.666657102324095, 39.19122787756437];
                let scheduleItem = {};
                dataSource.forEach((item, i) => {
                    if (!/[0-9]{2}:[0-9]{2}/.test(item) && !/http/.test(item)) {
                        if (Object.keys(scheduleItem).length !== 0 && scheduleItem["film_schedule"].length !== 0) {
                            data["schedule"].push({ ...scheduleItem });
                        }
                        scheduleItem = { film_name: "", film_schedule: [], film_image: "" };
                        scheduleItem["film_name"] = item;
                    } else if (/http/.test(item)) {
                        scheduleItem["film_image"] = `${item}`;
                    } else {
                        if (Object.keys(scheduleItem).length !== 0) {
                            let fieldTimeName = {};
                            fieldTimeName["time"] = item;
                            scheduleItem["film_schedule"].push({ ...fieldTimeName });
                        }
                    }
                    if (dataSource.length - 1 === i && scheduleItem["film_schedule"].length !== 0) {
                        data["schedule"].push({ ...scheduleItem });
                    }
                });

                return data;
            })
            .catch(err => console.log(err));
    }

    getCinema(id) {
        if (id === "spartak") {
            return this.getSpartak();
        } else if (id === "maximir") {
            return this.getMaximir();
        } else if (id === "proletarian") {
            return this.getProletarian();
        } else {
            return this.getCinemaPark();
        }
    }

    async getGeneralSchedule() {
        let dataScope = [];
        await this.getSpartak().then(data => {
            dataScope.push(data);
        });

        await this.getMaximir().then(data => {
            dataScope.push(data);
        });

        await this.getCinemaPark().then(data => {
            dataScope.push(data);
        });

        await this.getProletarian().then(data => {
            dataScope.push(data);
        });

        /* data.push({ ...this.getMaximir() });
        data.push({ ...this.getCinemaPark() });
        data.push({ ...this.getProletarian() });*/
        return dataScope;
    }
}
