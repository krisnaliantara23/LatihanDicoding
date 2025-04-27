import "./style.css";

function showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
}
function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

class NoteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<header><h1>Notes App</h1></header>`;
    }
}
customElements.define("note-header", NoteHeader);

class NoteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<footer><p>© 2025 Notes App</p></footer>`;
    }
}
customElements.define("note-footer", NoteFooter);

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
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const title = this.querySelector("#note-title").value;
            const body = this.querySelector("#note-body").value;

            if (title && body) {
                const newNote = { title, body, createdAt: new Date().toISOString(), archived: false };
                await this.addNoteToAPI(newNote);
                form.reset();
            }
        });
    }

    async addNoteToAPI(note) {
        try {
            showLoading();
            const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(note),
            });

            if (response.ok) {
                document.querySelector('note-list').fetchNotes(); 
            } else {
                throw new Error('Failed to add note');
            }
        } catch (error) {
            console.error('Error adding note:', error);
        } finally {
            hideLoading();
        }
    }
}
customElements.define("note-form", NoteForm);

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

        this.querySelector(".delete-btn").addEventListener("click", async () => {
            await this.deleteNoteFromAPI();
        });

        this.querySelector(".edit-btn").addEventListener("click", () => {
            document.getElementById("note-title").value = this._noteData.title;
            document.getElementById("note-body").value = this._noteData.body;
            this.remove();
        });
    }

    async deleteNoteFromAPI() {
        try {
            showLoading();
            const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${this._noteData.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                this.remove();
            } else {
                throw new Error('Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        } finally {
            hideLoading();
        }
    }
}
customElements.define("note-item", NoteItem);

class NoteList extends HTMLElement {
    constructor() {
        super();
        this.notesData = [];
    }

    connectedCallback() {
        this.fetchNotes();
    }

    async fetchNotes() {
        try {
            showLoading();
            const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            this.notesData = data.data;
            this.render();
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            hideLoading();
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

        this.notesGrid.innerHTML = "";
        this.notesData.forEach((note) => {
            const noteElement = document.createElement("note-item");
            noteElement.noteData = note;
            this.notesGrid.appendChild(noteElement);
        });
    }
}
customElements.define("note-list", NoteList);
