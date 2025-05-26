const token = localStorage.getItem('accessToken');
if (!token) {
  window.location.href = 'login.html';
}

const noteForm = document.getElementById('noteForm');
const noteModal = new bootstrap.Modal(document.getElementById('noteModal'));
const noteModalLabel = document.getElementById('noteModalLabel');
const noteIdInput = document.getElementById('noteId');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentInput = document.getElementById('noteContent');

function getRandomColor() {
  const colors = ['#6f42c1', '#d63384', '#20c997', '#0d6efd', '#fd7e14', '#198754', '#dc3545'];
  return colors[Math.floor(Math.random() * colors.length)];
}

async function fetchNotes() {
  const res = await fetch('http://localhost:3000/api/notes', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const notes = await res.json();
  const list = document.getElementById('notesList');
  list.innerHTML = '';

  notes.forEach(n => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-3 mb-4';
    const cardColor = getRandomColor();

    col.innerHTML = `
      <div class="card shadow p-3" style="background-color: ${cardColor}">
        <h5>${n.title}</h5>
        <p>${n.content}</p>
        <div class="icons">
          <button class="btn btn-sm btn-light me-2" onclick="openEditModal(${n.id}, \`${n.title.replace(/`/g, '\\`')}\`, \`${n.content.replace(/`/g, '\\`')}\`)">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-light" onclick="deleteNote(${n.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>`;
    list.appendChild(col);
  });
}

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

function openAddModal() {
  noteModalLabel.textContent = 'Tambah Catatan';
  noteIdInput.value = '';
  noteTitleInput.value = '';
  noteContentInput.value = '';
  noteModal.show();
}

function openEditModal(id, title, content) {
  noteModalLabel.textContent = 'Edit Catatan';
  noteIdInput.value = id;
  noteTitleInput.value = title;
  noteContentInput.value = content;
  noteModal.show();
}

noteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = noteIdInput.value;
  const title = noteTitleInput.value;
  const content = noteContentInput.value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `http://localhost:3000/api/notes/${id}` : 'http://localhost:3000/api/notes';
  await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title, content })
  });
  noteModal.hide();
  fetchNotes();
});

async function deleteNote(id) {
  if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
    await fetch(`http://localhost:3000/api/notes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchNotes();
  }
}

fetchNotes();
