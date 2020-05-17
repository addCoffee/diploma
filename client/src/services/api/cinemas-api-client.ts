import { isSimilarName, TypeRegExp } from "../../utils/helpers";

// Cinemas closed, data isn't actual
let CURRENT_DAY = new Date(Date.now()).toLocaleString("ru", { timeZone: "UTC", month: "long", day: "numeric" });
CURRENT_DAY = "17 июня";
let NEXT_DAY = new Date(Date.now() + 86400000).toLocaleString("ru", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
});
NEXT_DAY = "18 июня";
const fetchParams = {
  method: "get",
  headers: {
    "Content-Type": "text/plain;charset=UTF-8",
  },
};

export default class CinemasApiClient {
  dataScope = [];
  _internalApiClient;
  constructor(internalApiClient) {
      this._internalApiClient = internalApiClient;
  }

  async getSpartak(): Promise<void | CinemaModel> {
    return await fetch("http://localhost:3000/spartak", fetchParams)
      .then(res => res.clone().text())
      .then(resText => {
        //через new RegExp потому что нужно вставлять динамические переменные
        let calculateMatch = '';
        if (new RegExp(`${NEXT_DAY}`, "g").test(resText)) {
          calculateMatch = `|${CURRENT_DAY}.*?${NEXT_DAY}|`;
        } else {
          calculateMatch = `|${CURRENT_DAY}.*? class="close"|`;
        }
        let dataSource: any = resText.match(
          new RegExp(
            `<h2><a href="\\/billboard\\/films\\/[0-9]+\\/">(.*?)<\\/a><\\/h2>${calculateMatch}<a href="\\/billboard\\/films\\/[0-9]+\\/"><img src="(\\/images\\/cms\\/thumbs\\/[0-9a-z]+\\/.*?\\.jpg)`,
            "g"
          )
        );

        dataSource = dataSource.map(item => {
            // get image
          if (/img/.test(item)) {
            return item.match(/(\/images\/cms\/thumbs\/[0-9a-z]+\/.*?\.jpg)/)[0];
            // get time session
          } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
            return item.match(/">(.*)<\/a/)[1];
          } else {
            let itemNew = item.match(/([СтоVIP]{3}.*?[0-9I]{1,2})"|([0-9]{2}:[0-9]{2})/g);

            let timeAndRoom: any = {};
            let newItem = [];
            // itemNew.forEach()
            for (let i = 0; i < itemNew.length; i++) {
              if (!/[0-9]{2}:[0-9]{2}/.test(itemNew[i])) {
                if (Object.keys(timeAndRoom).length) {
                    newItem.push({ ...timeAndRoom });
                }
                timeAndRoom = {};
                timeAndRoom.room = itemNew[i].slice(0, itemNew[i].length - 1);
              } else {
                timeAndRoom.time = itemNew[i];
              }
              if (itemNew.length - 1 === i) {
                newItem.push({ ...timeAndRoom });
              }
            }
            itemNew = newItem;
            return itemNew;
          }
        });

        const cinema: CinemaModel = {
          name: "Спартак",
          schedule: [],
          url: "spartak",
          coords: [51.66197289303437, 39.20448107491798],
        };
        let film: any = {};
        dataSource.forEach((item, i) => {
          if (/images/.test(item)) {
            if (Object.keys(film).length && film.schedule.length) {
              cinema.schedule.push({ ...film });
            }
            film.name = '';
            film.schedule = [];
            film.image = `http://kinospartak.ru${item}`;
          } else if (!/[0-9]{2}:[0-9]{2}/.test(item) && typeof item !== "object") {
            film.name = item;
          } else {
            item.forEach(({room, time}) => {
              film.schedule.push({room, time});
            });
          }
          if (dataSource.length - 1 === i && film.schedule.length) {
            cinema.schedule.push({ ...film });
          }
        });

        return cinema;
    })
    .catch(err => console.warn(err));
  }

  parsing(resText, coords, url, path, cinemaName, general, isImages, generalImages, nameFilm, afterImages): CinemaModel {
    let dataSource = resText.match(general);
    dataSource = dataSource.map(item => {
      if (isImages.test(item)) {
        return item.match(generalImages)[1];
      } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
        let newItem = item.match(nameFilm)[1];
        return newItem.replace(/(&nbsp;|<\/a> <span class="format3d">3D)/g, " ");
      } else {
        return item.match(/([0-9]{2}:[0-9]{2})/)[1];
      }
    });

    const cinema: CinemaModel = {
      url,
      coords,
      name: cinemaName,
      schedule: [],
    };

    const film: FilmModel = {name: "", schedule: [], image: "", genre: []};
    dataSource.forEach((item, i) => {
      if (afterImages.test(item)) {
        if (Object.keys(film).length && film.schedule.length) {
          cinema.schedule.push({ ...film });
        }
        film.name = "";
        film.schedule = [];
        film.image = `${path}${item}`;
      } else if (!/[0-9]{2}:[0-9]{2}/.test(item)) {
        film.name = item;
      } else {
        if (Object.keys(film).length) {
          film.schedule.push({time: item});
        }
      }
      if (dataSource.length - 1 === i && film.schedule.length) {
        cinema.schedule.push({ ...film });
      }
    });
    return cinema;
  }

  getMaximir() {
    return fetch("http://localhost:3000/maximir", fetchParams)
      .then(res => res.clone().text())
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
      .catch(err => console.warn(err));
  }

  getProletarian() {
    return fetch("http://localhost:3000/proletarian", fetchParams)
      .then(res => res.clone().text())
      .then(resText => {
        return this.parsing(
          resText,
          [51.664884202447894, 39.20451430308151],
          "proletarian",
          "http://proletka.ru/",
          "Пролетарий",
          // /<a class="link" href="\/movies\/.*\/"><span>(.*)<\/span>|<em class="film-time">([0-9]{2}:[0-9]{2})<\/em><\/li>|ambl-image" src="(\/images\/cms\/thumbs\/[0-9a-z]+\/[0-9a-z_]+\.jpg)/g,
          /href="\/movies\/.*\/"><?s?p?a?n?>?(.*)((?<!>)<\/sp|<\/a><\/span)|<em class="film-time">([0-9]{2}:[0-9]{2})<\/em><\/li>|ambl-image" src="(\/images\/cms\/thumbs\/[0-9a-z]+\/[0-9a-z_]+\.jpg)/g,
          /src/,
          /="(\/images\/cms\/thumbs\/[0-9a-z]+\/[0-9a-z_]+\.jpg)/,
          /href="\/movies\/.*\/"><?s?p?a?n?>?(.*)((?<!>)<\/sp|<\/a><\/span)/,
          // /an>(.*)</g,
          /images/
        );
      })
      .catch(err => console.warn(err));
  }

  getCinemaPark(): Promise<void | CinemaModel> {
    return fetch("http://localhost:3000/cinema-park", fetchParams)
      .then(res => res.clone().text())
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

        const cinema: CinemaModel = {
          name: "Синема Парк",
          schedule: [],
          url: "cinema-park",
          coords: [51.666657102324095, 39.19122787756437],
        };

        const film: FilmModel = {name: "", schedule: [], image: "", genre: []};
        dataSource.forEach((item, i) => {
          if (!/[0-9]{2}:[0-9]{2}/.test(item) && /filmName/.test(item)) {
            if (Object.keys(film).length && film.schedule.length) {
              cinema.schedule.push({ ...film });
            }
            film.schedule = [];
            film.image = "";
            film.name = item.match(/"(.*?)"/)[1];
          } else if (/http/.test(item)) {
            film.image = `${item}`;
          } else if (/genre/.test(item)) {
            film.genre = item.match(/([а-я, ]+)/g)[0].split(",");
          } else if (/raiting_/.test(item)) {
            film.age = item.match(/([0-9]+)/g)[0];
          } else if (/shedule_movie_text/.test(item)) {
            film.studio = item
              .match(/>([а-яА-Яёa-zA-Z() \s]+)/g)[0]
              .match(/([а-яА-Яёa-zA-Z() \s]+)/g)[0]
              .replace(/\s{2,}/g, "");
          } else if (/title/.test(item)) {
            film.duration = item
              .match(/\s+([0-3] ч\. [0-9]+ мин\.)\s+/g)[0]
              .replace(/\s{2,}/g, "");
          } else {
            if (Object.keys(film).length) {
              film.schedule.push({time: item});
            }
          }
          if (dataSource.length - 1 === i && film.schedule.length) {
            cinema.schedule.push({ ...film });
          }
        });

        return cinema;
      })
      .catch(err => console.warn(err));
  }

  getSpartakContact() {
    return fetch("http://localhost:3000/spartak/contacts", fetchParams)
      .then(res => res.clone().text())
      .then(resText => {
        let dataSource: any = resText.match(
            /([а-яА-Яё. &laquor;-]+:) (\+7[()0-9 и+-]+)|(Эл. почта: ).*?>([a-zA-Z]+@.*?.ru)/g
        );
        let textAndMean: any = {};
        let newItem = [];
        for (let i = 0; i < dataSource.length; i++) {
          if (Object.keys(textAndMean).length) {
            newItem.push({ ...textAndMean });
          }
          const textMeanMatch = dataSource[i].match(
            /([а-яА-Яё. &laquor;-]{3,}:)|(\+7[()0-9 и+-]+)|(Эл. почта: )|([a-zA-Z]+@.*?.ru)"/g
          );
          textAndMean = {
            text: textMeanMatch[0],
            mean: textMeanMatch[1],
          };
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
        dataSource = {
          contacts: newItem,
          coords: [51.66197289303437, 39.20448107491798],
          address: "Пл.Ленина, д.13",
        };

        return dataSource;
      })
      .catch(err => console.warn(err));
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

  async getGeneralSchedule(): Promise<CinemaModel[]> {
    if (!this.dataScope.length) {
      await this.updateInfoAllCinemas();
    }
    return this.dataScope;
  }

  async getFilms() {
    if (!this.dataScope.length) {
      await this.updateInfoAllCinemas();
    }

    let films = [];
    let id = 1;
    this.dataScope.forEach(cinema => {
      cinema.schedule.forEach(film => {
        const foundIndex = films.findIndex(({name}) => isSimilarName(name, film.name, TypeRegExp.FILM_NAME));
        if (foundIndex !== -1) {
          films[foundIndex] = {
            ...film,
            id,
            schedule: [...films[foundIndex].schedule, {name: cinema.name, schedule: film.schedule}],
          }
        } else {
          id = id++;
          films.push({
            ...film,
            id,
            schedule: [{name: cinema.name, schedule: film.schedule}],
          });
        }
      });
    });
    return films;
  }

  async updateInfoAllCinemas() {
    await this.getCinemaPark().then(data => this.dataScope.push(data));
    await this.getSpartak().then(data => this.dataScope.push(data));
    await this.getMaximir().then(data => this.dataScope.push(data));
    await this.getProletarian().then(data => this.dataScope.push(data));
  }
}
