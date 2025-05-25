document.addEventListener('DOMContentLoaded', () => {
  const emailDisplay = document.getElementById('emailDisplay');
  const nameDisplay = document.getElementById('nameDisplay');

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');

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
    fetch('http://localhost:5000/api/users/detail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    })
      .then(res => res.json())
      .then(data => {
        const name = data.name || '';
        const phone = data.phone || '';
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
    phoneInput.style.display = editMode ? 'block' : 'none';

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
      phone: phoneInput.value.trim()
    };

    fetch('http://localhost:5000/api/users', {
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
    fetch('http://localhost:5000/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    })
      .then(res => res.json())
      .then(data => {
        sessionStorage.clear();
        window.location.href = '../../index.html';
      })
      .catch(err => {
        console.error('Error eliminando usuario:', err);
        alert('Error al eliminar usuario');
      });
  });

  loadProfile();
});
