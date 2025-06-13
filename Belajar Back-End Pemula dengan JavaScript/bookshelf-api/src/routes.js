// routes.js
const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handlers');

const routes = (req, res) => {
  const { method, url } = req;
  const idPattern = /^\/books\/([a-zA-Z0-9-_]+)$/;
  const match = url.match(idPattern);

  // POST /books
  if (method === 'POST' && url === '/books') {
    return addBookHandler(req, res);
  }

  // GET /books
  if (method === 'GET' && url === '/books') {
    return getAllBooksHandler(req, res);
  }

  // GET /books/{id}
  if (method === 'GET' && match) {
    return getBookByIdHandler(req, res, match[1]);
  }

  // PUT /books/{id}
  if (method === 'PUT' && match) {
    return editBookByIdHandler(req, res, match[1]);
  }

  // DELETE /books/{id}
  if (method === 'DELETE' && match) {
    return deleteBookByIdHandler(req, res, match[1]);
  }

  // Route tidak ditemukan
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'fail',
    message: 'Halaman tidak ditemukan',
  }));
};

module.exports = routes;
