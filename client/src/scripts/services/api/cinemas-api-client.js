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
                return res.clone().text();
            })
            .then(resText => {
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
                        item.match(/">(.*)<\/a/)[1];
                        return item.match(/">(.*)<\/a/)[1];
                    } else {
                        let itemNew = item.match(/([СтоVIP]{3}.*?[0-9I]{1,2})"|([0-9]{2}:[0-9]{2})/g);

                        let timeAndRoom = {};
                        let newItem = [];
                        for (let i = 0; i < itemNew.length; i++) {
                            if (!/[0-9]{2}:[0-9]{2}/.test(itemNew[i])) {
                                if (Object.keys(timeAndRoom).length !== 0) {
                                    newItem.push({ ...timeAndRoom });
                                }
                                timeAndRoom = {};
                                console.log(typeof itemNew[i]);
                                timeAndRoom["room"] = itemNew[i].slice(0, itemNew[i].length - 1);
                            } else {
                                timeAndRoom["time"] = itemNew[i];
                            }
                            if (itemNew.length - 1 === i) {
                                newItem.push({ ...timeAndRoom });
                            }
                        }
                        itemNew = newItem;
                        return itemNew;
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
                            data["schedule"].push({ ...scheduleItem });
                        }
                        scheduleItem = { film_name: "", film_schedule: [], film_image: "" };
                        scheduleItem["film_image"] = `http://kinospartak.ru${item}`;
                    } else if (!/[0-9]{2}:[0-9]{2}/.test(item) && typeof item !== "object") {
                        scheduleItem["film_name"] = item;
                    } else {
                        item.forEach(timeItem => {
                            let fieldTimeName = {};
                            fieldTimeName["room"] = timeItem.room;
                            fieldTimeName["time"] = timeItem.time;
                            scheduleItem["film_schedule"].push({ ...fieldTimeName });
                        });
                    }
                    if (dataSource.length - 1 === i && scheduleItem["film_schedule"].length !== 0) {
                        data["schedule"].push({ ...scheduleItem });
                    }
                });
                console.log(data);
                return data;
            })
            .catch(err => console.log(err));
    }

    parsing(resText, coords, to, path, nameCinema, general, isImages, generalImages, nameFilm, afterImages) {
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
        data["cinema_url"] = to;
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
                    "maximir",
                    "http://www.maxi-mir.ru",
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
                    "proletarian",
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
                    /data-gtm-list-item-filmName="(.*?)"|<span class="shedule_session_time">\s+([0-9]{2}:[0-9]{2})|<img class="shedule_movie_img" src="(https:\/\/.*?\.kinoteatr\.ru\/preview6\/upload\/.*?\.jpg)">|data-gtm-list-item-genre="([а-я, ]+)"|raiting_sub">([0-9]+\+)<\/i>|"title">\s+([0-3] ч\. [0-9]+ мин\.)\s+<\/span>|shedule_movie_text">([а-яА-Яёa-zA-Z() \s]+)<\/span>/g
                );

                dataSource = dataSource.map(item => {
                    if (/src/.test(item)) {
                        return item.match(/(http.*)"/)[1];
                    } else if (/([0-9]{2}:[0-9]{2})/.test(item)) {
                        return item.match(/([0-9]{2}:[0-9]{2})/)[1];
                    } else {
                        return item;
                    }
                });

                console.log(dataSource);
                let data = {};
                data["cinema_name"] = "Синема Парк";
                data["schedule"] = [];
                data["cinema_url"] = "cinema-park";
                data["coords"] = [51.666657102324095, 39.19122787756437];
                let scheduleItem = {};
                dataSource.forEach((item, i) => {
                    if (!/[0-9]{2}:[0-9]{2}/.test(item) && /filmName/.test(item)) {
                        if (Object.keys(scheduleItem).length !== 0 && scheduleItem["film_schedule"].length !== 0) {
                            data["schedule"].push({ ...scheduleItem });
                        }
                        scheduleItem = { film_name: "", film_schedule: [], film_image: "" };
                        scheduleItem["film_name"] = item.match(/"(.*?)"/)[1];
                    } else if (/http/.test(item)) {
                        scheduleItem["film_image"] = `${item}`;
                    } else if (/genre/.test(item)) {
                        scheduleItem["film_genre"] = [];
                        //console.log(item.match(/([а-я, ]+)/g)[0], typeof item.match(/([а-я, ]+)/g)[0]);
                        scheduleItem.film_genre = item.match(/([а-я, ]+)/g)[0].split(",");
                    } else if (/raiting_/.test(item)) {
                        scheduleItem["film_age"] = item.match(/([0-9]+)/g)[0];
                    } else if (/shedule_movie_text/.test(item)) {
                        //console.log(item.match(/>([а-яА-Яёa-zA-Z() \s]+)/g)[0].match(/([а-яА-Яёa-zA-Z() \s]+)/g));
                        scheduleItem["film_studio"] = item
                            .match(/>([а-яА-Яёa-zA-Z() \s]+)/g)[0]
                            .match(/([а-яА-Яёa-zA-Z() \s]+)/g)[0]
                            .replace(/\s{2,}/g, "");
                    } else if (/title/.test(item)) {
                        scheduleItem["film_duration"] = item
                            .match(/\s+([0-3] ч\. [0-9]+ мин\.)\s+/g)[0]
                            .replace(/\s{2,}/g, "");
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
            })
            .catch(err => console.log(err));
    }

    getSpartakContact() {
        return fetch("http://localhost:3000/spartak/contacts", {
            method: "get",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8",
            },
        })
            .then(res => {
                return res.clone().text();
            })
            .then(resText => {
                let dataSource = [];
                dataSource = resText.match(
                    /([а-яА-Яё. &laquor;-]+:) (\+7[()0-9 и+-]+)|(Эл. почта: ).*?>([a-zA-Z]+@.*?.ru)/g
                );
                let textAndMean = {};
                let newItem = [];
                for (let i = 0; i < dataSource.length; i++) {
                    if (Object.keys(textAndMean).length !== 0) {
                        newItem.push({ ...textAndMean });
                    }
                    textAndMean = {};
                    textAndMean["text"] = dataSource[i].match(
                        /([а-яА-Яё. &laquor;-]{3,}:)|(\+7[()0-9 и+-]+)|(Эл. почта: )|([a-zA-Z]+@.*?.ru)"/g
                    )[0];
                    textAndMean["mean"] = dataSource[i].match(
                        /([а-яА-Яё. &laquor;-]{3,}:)|(\+7[()0-9 и+-]+)|(Эл. почта: )|([a-zA-Z]+@.*?.ru)"/g
                    )[1];
                    if (/([a-zA-Z]+@.*?.ru)/.test(textAndMean.mean)) {
                        textAndMean.mean = textAndMean.mean.slice(0, textAndMean.mean.length - 1);
                    }
                    if (/([а-яА-Яё. &laquor;-]{3,}:)/.test(textAndMean.text)) {
                        textAndMean.text = textAndMean.text.replace(/[&laquor;]+/g, "");
                    }

                    if (dataSource.length - 1 === i) {
                        newItem.push({ ...textAndMean });
                    }
                }
                dataSource = {};
                dataSource["contacts"] = newItem;
                dataSource["coords"] = [51.66197289303437, 39.20448107491798];
                dataSource["address"] = "Пл.Ленина, д.13";
                console.log(dataSource);
                return dataSource;
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
        return dataScope;
    }

    async getFilms() {
        let dataScope = [];

        await this.getCinemaPark().then(data => {
            dataScope.push(data);
        });

        await this.getSpartak().then(data => {
            dataScope.push(data);
        });

        await this.getMaximir().then(data => {
            dataScope.push(data);
        });

        await this.getProletarian().then(data => {
            dataScope.push(data);
        });

        let newData = [];
        let id = 1;
        dataScope.forEach(cinema => {
            let objFilm = {};
            objFilm["cinema_schedule"] = [];
            let objCinema = {};
            objCinema["cinema_name"] = cinema.cinema_name;
            cinema.schedule.forEach(film => {
                objFilm = {};
                objFilm["cinema_schedule"] = [];
                objFilm["film_image"] = film.film_image;
                objFilm["film_name"] = film.film_name;
                if (objCinema.cinema_name === "Синема Парк") {
                    console.log(film.film_name);
                    objFilm["film_age"] = film.film_age;
                    objFilm["film_duration"] = film.film_duration;
                    objFilm["film_genre"] = film.film_genre;
                    objFilm["film_studio"] = film.film_studio;
                }
                objCinema["schedule"] = film.film_schedule;
                objFilm.cinema_schedule.push({ ...objCinema });
                const tranformFilmName = objFilm.film_name
                    .match(/([А-Я]{1}[а-яА-Яё0-24-9,. !№?:—-]{1,} ?)(3D)?/g)[0]
                    .trim()
                    .replace("ё", "е")
                    .toLowerCase();
                let isPushed = false;
                newData.forEach((newDataFilm, i) => {
                    const tranformNewDataFilmName = newDataFilm.film_name
                        .match(/([А-Я]{1}[а-яА-Яё0-24-9,. !№?:—-]{1,} ?)(3D)?/g)[0]
                        .trim()
                        .replace("ё", "е")
                        .toLowerCase();

                    if (tranformNewDataFilmName.startsWith(tranformFilmName) && isPushed === false) {
                        newData[i].cinema_schedule.push({ ...objCinema });
                        isPushed = true;
                    }
                });
                if (!isPushed) {
                    objFilm["id"] = id;
                    id++;
                    newData.push({ ...objFilm });
                }
            });
        });
        return newData;
    }
}
