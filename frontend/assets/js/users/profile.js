const USERS_URL = window.env.BACKEND_URL + '/users'

document.addEventListener('DOMContentLoaded', () => {
  const emailDisplay = document.getElementById('emailDisplay');
  const nameDisplay = document.getElementById('nameDisplay');

  const nameInput = document.getElementById('name');

  const profileForm = document.getElementById('profileForm');

  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  const deleteUserBtn = document.getElementById('deleteUserBtn');
  const confirmDialog = document.getElementById('confirmDialog');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  const userEmail = sessionStorage.getItem('userEmail');

  if (!userEmail) {
    alert('No se encontró usuario logueado');
    return;
  }

  emailDisplay.textContent = userEmail;

  function loadProfile() {
    fetch(`${USERS_URL}/detail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    })
      .then(res => res.json())
      .then(data => {
        const name = data.name || '';
        nameDisplay.textContent = name;
        nameInput.value = name;
      })
      .catch(err => {
        console.error('Error cargando perfil:', err);
        alert('Error al cargar perfil');
      });
  }

  function toggleEditMode(editMode) {
  nameDisplay.style.display = editMode ? 'none' : 'block';
  nameInput.style.display = editMode ? 'block' : 'none';

  editBtn.style.display = editMode ? 'none' : 'inline-block';
  saveBtn.style.display = editMode ? 'inline-block' : 'none';
  cancelEditBtn.style.display = editMode ? 'inline-block' : 'none';
}


  editBtn.addEventListener('click', () => {
    toggleEditMode(true);
  });

  cancelEditBtn.addEventListener('click', () => {
    // Restaurar valores previos desde los <p>
    nameInput.value = nameDisplay.textContent;
    toggleEditMode(false);
  });

  profileForm.addEventListener('submit', e => {
  e.preventDefault();

  const payload = {
    email: userEmail,
    name: nameInput.value.trim(),
  };

  fetch(USERS_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      nameDisplay.textContent = payload.name;
      toggleEditMode(false);
    })
    .catch(err => {
      console.error('Error actualizando perfil:', err);
      alert('Error al actualizar perfil');
    });
});


  deleteUserBtn.addEventListener('click', () => {
    confirmDialog.showModal();
  });

  cancelDeleteBtn.addEventListener('click', () => {
    confirmDialog.close();
  });

confirmDeleteBtn.addEventListener('click', () => {
  const url = `${USERS_URL}/${encodeURIComponent(userEmail)}`;

  fetch(url, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al eliminar usuario');
      return res.json();
    })
    .then(data => {
      sessionStorage.clear();
      window.location.href = '../../../index.html';
    })
    .catch(err => {
      console.error('Error eliminando usuario:', err);
      alert('Error al eliminar usuario');
    });
  });

  loadProfile();
});
