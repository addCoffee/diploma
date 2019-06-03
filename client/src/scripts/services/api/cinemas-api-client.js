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
                let dataSource = resText.match(
                    /<h2><a href="\/billboard\/films\/[0-9]+\/">(.*)<\/a><\/h2>|([0-9]{2}:[0-9]{2})|<a href="\/billboard\/films\/[0-9]+\/"><img src="(\/images\/cms\/thumbs\/[0-9a-z]+\/.*\.jpg)/g
                );
                console.log(dataSource);
                let loadBool = false;
                dataSource = dataSource.filter((item, i, arr) => {
                    if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
                        loadBool = false;
                        return true;
                    } else {
                        if (loadBool) {
                            return false;
                        }
                        if (arr[i] < arr[i + 1] && !loadBool) {
                            return true;
                        } else {
                            loadBool = true;
                            return true;
                        }
                    }
                });
                dataSource = dataSource.map(item => {
                    if (/img/.test(item)) {
                        return item.match(/(\/images\/cms\/thumbs\/[0-9a-z]+\/.*\.jpg)/)[1];
                    } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
                        return item.match(/">(.*)<\/a/)[1];
                    } else {
                        return item;
                    }
                });

                console.log("datasource", dataSource);
                let data = {};
                data["cinema_name"] = "Spartak";
                data["schedule"] = [];
                let scheduleItem = {};
                console.log("data", data);
                console.log(dataSource);
                dataSource.forEach((item, i) => {
                    if (/images/.test(item)) {
                        if (Object.keys(scheduleItem).length !== 0) {
                            data["schedule"].push({ ...scheduleItem });
                        }
                        console.log(1);
                        scheduleItem = { film_name: "", film_schedule: [], film_image: "" };
                        scheduleItem["film_image"] = `http://kinospartak.ru${item}`;
                    } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
                        scheduleItem["film_name"] = item;
                    } else {
                        let fieldTimeName = {};
                        fieldTimeName["time"] = item;
                        scheduleItem["film_schedule"].push({ ...fieldTimeName });
                    }
                    if (dataSource.length - 1 === i) {
                        data["schedule"].push({ ...scheduleItem });
                    }
                });
                console.log("data", data);
                return data;
            })
            .catch(err => console.log(err));
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
                let dataSource = resText.match(
                    /class="b-cinema-title">(.*?)<\/a>|<em class="timeColor[0-9]{1}">([0-9]{2}:[0-9]{2})<\/em>|src="(\/files\/cinema\/[0-9]+\/115_[0-9a-z]+.jpg)/g
                );
                dataSource = dataSource.map(item => {
                    if (/src/.test(item)) {
                        return item.match(/(\/files\/cinema\/[0-9]+\/115_[0-9a-z]+.jpg)/)[0];
                    } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
                        return item.match(/">(.*)<\/a/)[1];
                    } else {
                        return item.match(/([0-9]{2}:[0-9]{2})/)[1];
                    }
                });

                let data = {};
                data["cinema_name"] = "Maximir";
                data["schedule"] = [];
                let scheduleItem = {};
                dataSource.forEach((item, i) => {
                    if (/files/.test(item)) {
                        if (Object.keys(scheduleItem).length !== 0) {
                            data["schedule"].push({ ...scheduleItem });
                        }
                        scheduleItem = { film_name: "", film_schedule: [], film_image: "" };
                        scheduleItem["film_image"] = `http://www.maxi-mir.ru/${item}`;
                    } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
                        scheduleItem["film_name"] = item;
                    } else {
                        let fieldTimeName = {};
                        fieldTimeName["time"] = item;
                        scheduleItem["film_schedule"].push({ ...fieldTimeName });
                    }
                    if (dataSource.length - 1 === i) {
                        data["schedule"].push({ ...scheduleItem });
                    }
                });

                return data;
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
                let dataSource = resText.match(
                    /<a class="link" href="\/movies\/.*\/"><span>(.*)<\/span>|<em class="film-time">([0-9]{2}:[0-9]{2})<\/em><\/li>|ambl-image" src="(\/images\/cms\/thumbs\/[0-9a-z]+\/[0-9a-z_]+\.jpg)/g
                );

                dataSource = dataSource.map(item => {
                    if (/src/.test(item)) {
                        console.log(item.match(/="(\/images\/cms\/thumbs\/[0-9a-z]+\/[0-9a-z_]+\.jpg)/));
                        return item.match(/="(\/images\/cms\/thumbs\/[0-9a-z]+\/[0-9a-z_]+\.jpg)/)[1];
                    } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
                        console.log(item.match(/an>(.*)</));
                        let newItem = item.match(/an>(.*)</)[1];
                        return newItem.replace(/&nbsp;/g, " ");
                    } else {
                        console.log(item.match(/([0-9]{2}:[0-9]{2})/));
                        return item.match(/([0-9]{2}:[0-9]{2})/)[1];
                    }
                });

                let data = {};
                data["cinema_name"] = "Proletarian";
                data["schedule"] = [];
                let scheduleItem = {};
                dataSource.forEach((item, i) => {
                    if (/images/.test(item)) {
                        if (Object.keys(scheduleItem).length !== 0) {
                            data["schedule"].push({ ...scheduleItem });
                        }
                        scheduleItem = { film_name: "", film_schedule: [], film_image: "" };
                        scheduleItem["film_image"] = `http://proletka.ru/${item}`;
                    } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
                        scheduleItem["film_name"] = item;
                    } else {
                        if (Object.keys(scheduleItem).length !== 0) {
                            let fieldTimeName = {};
                            fieldTimeName["time"] = item;
                            scheduleItem["film_schedule"].push({ ...fieldTimeName });
                        }
                    }
                    if (dataSource.length - 1 === i) {
                        data["schedule"].push({ ...scheduleItem });
                    }
                });

                return data;
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
                    /data-gtm-list-item-filmName="(.*?)"|<span class="shedule_session_time">\s+([0-9]{2}:[0-9]{2})|<img class="shedule_movie_img" src="(https:\/\/.*\.kinoteatr\.ru\/preview6\/upload\/.*\.jpg)">/g
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
                data["cinema_name"] = "Cinema-Park";
                data["schedule"] = [];
                let scheduleItem = {};
                dataSource.forEach((item, i) => {
                    if (!/[0-9]{2}:[0-9]{2}/.test(item) && !/http/.test(item)) {
                        if (Object.keys(scheduleItem).length !== 0) {
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
                    if (dataSource.length - 1 === i) {
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

    getGeneralSchedule() {}
}
