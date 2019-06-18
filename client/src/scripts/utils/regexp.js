const regexSpartak = /<h2><a href="\/billboard\/films\/[0-9]+\/">(.*)<\/a><\/h2>|([0-9]{2}:[0-9]{2})|<a href="\/billboard\/films\/[0-9]+\/"><img src="(\/images\/cms\/thumbs\/[0-9a-z]+\/.*\.jpg)/g;
const regexCinema = /data-gtm-list-item-filmName="(.*?)"|<span class="shedule_session_time">\s+([0-9]{2}:[0-9]{2})|<img class="shedule_movie_img" src="(https:\/\/.*\.kinoteatr\.ru\/preview6\/upload\/.*\.jpg)">/g;
const regexProletka = /<a class="link" href="\/movies\/.*\/"><span>(.*)<\/span>|<em class="film-time">([0-9]{2}:[0-9]{2})<\/em><\/li>|ambl-image" src="(\/images\/cms\/thumbs\/[0-9a-z]+\/[0-9a-z_]+\.jpg)/g;
const regexMaximir = /class="b-cinema-title">(.*?)<\/a>|<em class="timeColor[0-9]{1}">([0-9]{2}:[0-9]{2})<\/em>|src="(\/files\/cinema\/[0-9]+\/115_[0-9a-z]+.jpg)/g;

//new Date(Date.now()).toLocaleString("ru", {timezone: 'UTC', month: 'long',day: 'numeric'})
//new Date(Date.now()+86400000).toLocaleString("ru", {timezone: 'UTC', month: 'long',day: 'numeric'})

const currentDay = new Date(Date.now()).toLocaleString("ru", { timezone: "UTC", month: "long", day: "numeric" });
const nextDay = new Date(Date.now() + 86400000).toLocaleString("ru", {
    timezone: "UTC",
    month: "long",
    day: "numeric",
});

const st =
    'data-gtm-list-item-filmName="(.*?)"|<span class="shedule_session_time">s+([0-9]{2}:[0-9]{2})|<img class="shedule_movie_img" src="(https://.*?.kinoteatr.ru/preview6/upload/.*?.jpg)">|data-gtm-list-item-genre="([а-я, ]+)"|raiting_sub">([0-9]++)</i>|"title">([0-3] ч. [0-9]+ мин.)</span>|shedule_movie_text">[а-яА-Яёa-zA-Z() ]+</span>';

const regExpCinemas = [
    {
        name: "spartak",
        generalRegExp: `<h2><a href="\\/billboard\\/films\\/[0-9]+\\/">(.*?)<\\/a><\\/h2>|${currentDay}.*?${nextDay}|<a href="\\/billboard\\/films\\/[0-9]+\\/"><img src="(\\/images\\/cms\\/thumbs\\/[0-9a-z]+\\/.*?\\.jpg)`,

        imagesRegExp: /(\/images\/cms\/thumbs\/[0-9a-z]+\/.*?\.jpg)/,
    },
    {},
    {},
    {},
];

/*<h2><a href="\/billboard\/films\/[0-9]+\/">(.*?)<\/a><\/h2>|10 июня.*?11 июня|<a href="\/billboard\/films\/[0-9]+\/"><img src="(\/images\/cms\/thumbs\/[0-9a-z]+\/.*?\.jpg)*/
