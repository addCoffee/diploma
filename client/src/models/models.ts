interface CinemaModel {
  name: string;
  schedule: FilmModel[];
  url: string;
  coords: [number, number];
}

interface FilmModel {
  name?: string;
  image: string;
  age?: string;
  studio?: string;
  duration?: string;
  genre: any[];
  schedule: any[];
}