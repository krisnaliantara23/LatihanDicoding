import { loadBooks, saveBooks, addBook, updateBook, deleteBook } from "./localStorage.js";

document.addEventListener("DOMContentLoaded", () => {
    renderBooks();

    document.getElementById("bookForm").addEventListener("submit", handleAddBook);
    document.getElementById("searchBook").addEventListener("submit", handleSearch);
});

function handleAddBook(event) {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value.trim();
    const author = document.getElementById("bookFormAuthor").value.trim();
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    if (!title || !author || isNaN(year)) {
        alert("Harap isi semua bidang dengan benar!");
        return;
    }

    const newBook = { id: Date.now(), title, author, year, isComplete };
    addBook(newBook);
    renderBooks();

    event.target.reset();
}

function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById("searchBookTitle").value.toLowerCase();
    const books = loadBooks().filter(book => book.title.toLowerCase().includes(query));
    renderBooks(books);
}

function renderBooks(filteredBooks = null) {
    const incompleteList = document.getElementById("incompleteBookList");
    const completeList = document.getElementById("completeBookList");

    incompleteList.innerHTML = "";
    completeList.innerHTML = "";

    (filteredBooks || loadBooks()).forEach(book => {
        const bookElement = createBookElement(book);
        (book.isComplete ? completeList : incompleteList).appendChild(bookElement);
    });
}

function createBookElement(book) {
    const bookContainer = document.createElement("div");
    bookContainer.classList.add("book-item");
    bookContainer.setAttribute("data-bookid", book.id);
    bookContainer.setAttribute("data-testid", "bookItem");

    bookContainer.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
            <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum Selesai" : "Selesai Dibaca"}</button>
            <button data-testid="bookItemDeleteButton">Hapus</button>
            <button data-testid="bookItemEditButton">Edit</button>
        </div>
    `;

    bookContainer.querySelector("[data-testid='bookItemIsCompleteButton']").addEventListener("click", () => {
        updateBook(book.id, { isComplete: !book.isComplete });
        renderBooks();
    });

    bookContainer.querySelector("[data-testid='bookItemDeleteButton']").addEventListener("click", () => {
        if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
            deleteBook(book.id);
            renderBooks();
        }
    });

    bookContainer.querySelector("[data-testid='bookItemEditButton']").addEventListener("click", () => {
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        document.getElementById("bookFormIsComplete").checked = book.isComplete;

        deleteBook(book.id);
        renderBooks();
    });

    return bookContainer;
}
