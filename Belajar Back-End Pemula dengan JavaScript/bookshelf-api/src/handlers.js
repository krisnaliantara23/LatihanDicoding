const { nanoid } = require('nanoid');
const books = require('./books');

const jsonHeader = { 'Content-Type': 'application/json; charset=utf-8' };

const addBookHandler = (req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);

  req.on('end', () => {
    try {
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = JSON.parse(body);

      if (!name) {
        res.writeHead(400, jsonHeader);
        return res.end(JSON.stringify({ status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku' }));
      }

      if (readPage > pageCount) {
        res.writeHead(400, jsonHeader);
        return res.end(JSON.stringify({ status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' }));
      }

      const id = nanoid(16);
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;
      const finished = pageCount === readPage;

      const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
      };

      books.push(newBook);

      res.writeHead(201, jsonHeader);
      res.end(JSON.stringify({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: id } }));
    } catch {
      res.writeHead(500, jsonHeader);
      res.end(JSON.stringify({ status: 'error', message: 'Terjadi kesalahan pada server' }));
    }
  });
};

const getAllBooksHandler = (req, res) => {
  const booksSummary = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
  res.writeHead(200, jsonHeader);
  res.end(JSON.stringify({ status: 'success', data: { books: booksSummary } }));
};

const getBookByIdHandler = (req, res, id) => {
  const book = books.find(b => b.id === id);

  if (book) {
    res.writeHead(200, jsonHeader);
    res.end(JSON.stringify({ status: 'success', data: { book } }));
  } else {
    res.writeHead(404, jsonHeader);
    res.end(JSON.stringify({ status: 'fail', message: 'Buku tidak ditemukan' }));
  }
};

const editBookByIdHandler = (req, res, id) => {
  let body = '';
  req.on('data', chunk => body += chunk);

  req.on('end', () => {
    try {
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = JSON.parse(body);

      if (!name) {
        res.writeHead(400, jsonHeader);
        return res.end(JSON.stringify({ status: 'fail', message: 'Gagal memperbarui buku. Mohon isi nama buku' }));
      }

      if (readPage > pageCount) {
        res.writeHead(400, jsonHeader);
        return res.end(JSON.stringify({ status: 'fail', message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' }));
      }

      const index = books.findIndex(b => b.id === id);

      if (index !== -1) {
        books[index] = {
          ...books[index], name, year, author, summary, publisher, pageCount, readPage,
          reading, finished: pageCount === readPage, updatedAt: new Date().toISOString()
        };

        res.writeHead(200, jsonHeader);
        res.end(JSON.stringify({ status: 'success', message: 'Buku berhasil diperbarui' }));
      } else {
        res.writeHead(404, jsonHeader);
        res.end(JSON.stringify({ status: 'fail', message: 'Gagal memperbarui buku. Id tidak ditemukan' }));
      }
    } catch {
      res.writeHead(500, jsonHeader);
      res.end(JSON.stringify({ status: 'error', message: 'Terjadi kesalahan pada server' }));
    }
  });
};

const deleteBookByIdHandler = (req, res, id) => {
  const index = books.findIndex(b => b.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    res.writeHead(200, jsonHeader);
    res.end(JSON.stringify({ status: 'success', message: 'Buku berhasil dihapus' }));
  } else {
    res.writeHead(404, jsonHeader);
    res.end(JSON.stringify({ status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan' }));
  }
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
};

