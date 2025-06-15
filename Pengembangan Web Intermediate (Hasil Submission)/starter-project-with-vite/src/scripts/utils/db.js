import { openDB } from 'idb';

const dbPromise = openDB('film-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('films')) {
      db.createObjectStore('films', { keyPath: 'id', autoIncrement: true });
    }
  }
});

const saveFilm = async (film) => {
  const db = await dbPromise;
  return db.add('films', film);
};

const getAllFilms = async () => {
  const db = await dbPromise;
  return db.getAll('films');
};

const deleteFilm = async (id) => {
  const db = await dbPromise;
  return db.delete('films', id);
};

// ✅ PENTING: Export semuanya di sini
export { saveFilm, getAllFilms, deleteFilm };
