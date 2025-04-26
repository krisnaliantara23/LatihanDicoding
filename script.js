import "./style.css";

// Komponen Header
class NoteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<header><h1>Notes App</h1></header>`;
    }
}
customElements.define("note-header", NoteHeader);

// Komponen Footer
class NoteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<footer><p>© 2025 Notes App</p></footer>`;
    }
}
customElements.define("note-footer", NoteFooter);

// Komponen Form untuk Menambahkan Catatan
class NoteForm extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <section id="note-form">
                <h2>Tambah Catatan</h2>
                <form id="add-note-form">
                    <input type="text" id="note-title" placeholder="Judul" required>
                    <textarea id="note-body" placeholder="Isi catatan" required></textarea>
                    <button type="submit">Tambah</button>
                </form>
            </section>
        `;

        const form = this.querySelector("#add-note-form");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const title = this.querySelector("#note-title").value;
            const body = this.querySelector("#note-body").value;

            if (title && body) {
                // Membuat objek note
                const newNote = { title, body, createdAt: new Date().toISOString(), archived: false };
                this.addNoteToAPI(newNote);
                form.reset();
            }
        });
    }

    // Fungsi untuk menambah catatan baru ke Notes API
    async addNoteToAPI(note) {
        try {
            const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(note),
            });

            if (response.ok) {
                const newNote = await response.json();
                // Setelah berhasil menambah catatan baru, ambil ulang data dari API dan perbarui UI
                document.querySelector('note-list').fetchNotes();  // Memanggil fetchNotes untuk mengambil data terbaru
            } else {
                throw new Error('Failed to add note');
            }
        } catch (error) {
            console.error('Error adding note:', error);
        }
    }
}
customElements.define("note-form", NoteForm);

// Komponen untuk Menampilkan Catatan
class NoteItem extends HTMLElement {
    set noteData(data) {
        this._noteData = data;
        this.render();
    }

    render() {
        if (!this._noteData) return;

        this.innerHTML = `
            <div class="note-item">
                <h3>${this._noteData.title}</h3>
                <p>${this._noteData.body}</p>
                <small>Dibuat pada: ${new Date(this._noteData.createdAt).toLocaleDateString()}</small>
                <div class="buttons">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Hapus</button>
                </div>
            </div>
        `;

        this.querySelector(".delete-btn").addEventListener("click", () => {
            this.deleteNoteFromAPI();
        });

        this.querySelector(".edit-btn").addEventListener("click", () => {
            document.getElementById("note-title").value = this._noteData.title;
            document.getElementById("note-body").value = this._noteData.body;
            this.remove();
        });
    }

    // Fungsi untuk menghapus catatan menggunakan DELETE request ke API
    async deleteNoteFromAPI() {
        try {
            const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${this._noteData.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                this.remove(); // Menghapus elemen dari DOM
            } else {
                throw new Error('Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }
}
customElements.define("note-item", NoteItem);

// Komponen untuk Menampilkan Daftar Catatan
class NoteList extends HTMLElement {
    constructor() {
        super();
        this.notesData = [];  // Data yang akan diambil dari API
    }

    connectedCallback() {
        this.fetchNotes();  // Mengambil data catatan dari API saat komponen dimuat
    }

    // Fungsi untuk mengambil data catatan dari Notes API
    async fetchNotes() {
        try {
            const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            // Mengambil data dalam bentuk JSON
            const data = await response.json();

            // Menyimpan data yang diambil ke notesData
            this.notesData = data.data;

            // Render tampilan setelah data diambil
            this.render();
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }

    render() {
        this.innerHTML = `
            <section id="notes-container">
                <h2>Daftar Catatan</h2>
                <div id="notes-grid"></div>
            </section>
        `;
        this.notesGrid = this.querySelector("#notes-grid");

        // Menampilkan setiap note yang diambil dari API
        this.notesData.forEach((note) => {
            const noteElement = document.createElement("note-item");
            noteElement.noteData = note;
            this.notesGrid.appendChild(noteElement);
        });
    }

    // Menambahkan catatan baru ke dalam daftar
    addNote(note) {
        note.id = `notes-${Date.now()}`;
        this.notesData.push(note);

        const noteElement = document.createElement("note-item");
        noteElement.noteData = note;
        this.notesGrid.appendChild(noteElement);
    }
}
customElements.define("note-list", NoteList);
