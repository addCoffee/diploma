export const menuTopBar = [
  {title: 'Расписание', url: '/'},
  {title: 'Кинотеатры', url: '/cinemas'},
  {title: 'Фильмы', url: '/films'},
  {title: 'Админка', url: '/admin'},
];

export const cinemasList = [
  {
    title: "Спартак",
    link: "http://kinospartak.ru/",
    namePath: "Spartak",
  },
  {
    title: "Максимир",
    link: "http://www.maxi-mir.ru/cinema",
    namePath: "Maximir",
  },
  {
    title: "Синема Парк",
    link: "https://kinoteatr.ru/kinoafisha/voronezh/",
    namePath: "Cinema-Park",
  },
  {
    title: "Пролетарий",
    link: "http://proletka.ru/",
    namePath: "Proletarian",
  },
  {
    title: "Люксор",
    link: "https://www.luxorfilm.ru/cinema/voronezh",
    namePath: "Luxor",
  },
  {
    title: "Star&Mlad МП",
    link: "https://kinostarmlad.ru//",
    namePath: "Star&Mlad-MP",
  },
  {
    title: "Star&Mlad Град",
    link: "https://kinostarmlad.ru/",
    namePath: "Star&Mlad-Grad",
  },
  {
    title: "Юность",
    link: "http://junost.ru/",
    namePath: "Juvenility",
  },

  {
    title: "Левый берег",
    link: "http://cinema.levbereg.com/",
    namePath: "Left-bank",
  },
];

export enum TypeRegExp {
  FILM_NAME = "([А-Я]{1}[а-яА-Яё0-24-9,. !№?:—-]{1,} ?)(3D)?",
}

const transformName = (name: string, type: TypeRegExp) => {
  const regexp = new RegExp(type, "g");
  return name.match(regexp)[0]
        .trim()
        .replace("ё", "е")
        .toLowerCase();
}

export const isSimilarName = (firstName: string, secondName: string, type: TypeRegExp) => {
  return transformName(firstName, type).startsWith(transformName(secondName, type));
}
