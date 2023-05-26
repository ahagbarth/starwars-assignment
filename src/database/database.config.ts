// database.config.ts
import Dexie from "dexie";

const database = new Dexie("database");

database.version(1).stores({
  people: '++id, name, height, mass, hair_color, skin_color, eye_color, birth_year, gender, homeworld, films, species, vehicles, starships, url',
  films:  '++id, title, episode_id, opening_crawl, director, producer, release_date, characters '
});

export const peopleTable = database.table('people');
export const db = database;

export default database;