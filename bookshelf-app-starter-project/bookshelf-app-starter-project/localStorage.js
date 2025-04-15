const STORAGE_KEY = "BOOKSHELF_APPS";

export function loadBooks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveBooks(books) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function addBook(book) {
    const books = loadBooks();
    books.push(book);
    saveBooks(books);
}

export function updateBook(bookId, updatedData) {
    let books = loadBooks();
    books = books.map(book => 
        book.id === bookId ? { ...book, ...updatedData } : book
    );
    saveBooks(books);
}

export function deleteBook(bookId) {
    let books = loadBooks().filter(book => book.id !== bookId);
    saveBooks(books);
}
