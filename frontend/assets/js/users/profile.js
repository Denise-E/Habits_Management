const USERS_URL = window.env.BACKEND_URL + '/users';

document.addEventListener('DOMContentLoaded', () => {
  const emailDisplay = document.getElementById('emailDisplay');
  const nameDisplay = document.getElementById('nameDisplay');
  const phoneDisplay = document.getElementById('phoneDisplay');
  const birthdateDisplay = document.getElementById('birthdateDisplay');

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');

  const errorName = document.getElementById('error-name');
  const errorPhone = document.getElementById('error-phone');

  const profileForm = document.getElementById('profileForm');

  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  const deleteUserBtn = document.getElementById('deleteUserBtn');
  const confirmDialog = document.getElementById('confirmDialog');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  const userEmail = sessionStorage.getItem('userEmail');

  emailDisplay.textContent = userEmail;

  function loadProfile() {
    fetch(`${USERS_URL}/detail/${userEmail}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        const { name = '', phone = '', birthdate = '' } = data;

        nameDisplay.textContent = name;
        phoneDisplay.textContent = phone;
        birthdateDisplay.textContent = birthdate;

        nameInput.value = name;
        phoneInput.value = phone;
      })
      .catch(err => {
        console.error('Error cargando perfil:', err);
        alert('Error al cargar perfil');
      });
  }

  function toggleEditMode(editMode) {
    nameDisplay.style.display = editMode ? 'none' : 'block';
    nameInput.style.display = editMode ? 'block' : 'none';

    phoneDisplay.style.display = editMode ? 'none' : 'block';
    phoneInput.style.display = editMode ? 'block' : 'none';

    editBtn.style.display = editMode ? 'none' : 'inline-block';
    saveBtn.style.display = editMode ? 'inline-block' : 'none';
    cancelEditBtn.style.display = editMode ? 'inline-block' : 'none';
  }

  editBtn.addEventListener('click', () => {
    toggleEditMode(true);
  });

  cancelEditBtn.addEventListener('click', () => {
    nameInput.value = nameDisplay.textContent;
    phoneInput.value = phoneDisplay.textContent;
    clearErrors();
    toggleEditMode(false);
  });

  profileForm.addEventListener('submit', e => {
    e.preventDefault();

    clearErrors();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    let valid = true;

    if (!name) {
      setError('name', 'El nombre es obligatorio');
      errorName.textContent = 'El nombre es requerido';
      valid = false;
    }

    if (!phone) {
      setError('phone', 'El telefono es obligatorio');
      errorPhone.textContent = 'El teléfono es requerido';
      valid = false;
    }

    
  function setError(fieldId, message) {
    const errorSpan = document.getElementById(`error-${fieldId}`);
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.color = 'red';
    }
  }
  
    if (!valid) return;

    const payload = { email: userEmail, name, phone };

    fetch(USERS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        nameDisplay.textContent = name;
        phoneDisplay.textContent = phone;
        toggleEditMode(false);
      })
      .catch(err => {
        console.error('Error actualizando perfil:', err);
        alert('Error al actualizar perfil');
      });
  });

  function clearErrors() {
    errorName.textContent = '';
    errorPhone.textContent = '';
  }

  deleteUserBtn.addEventListener('click', () => {
    confirmDialog.showModal();
  });

  cancelDeleteBtn.addEventListener('click', () => {
    confirmDialog.close();
  });

  confirmDeleteBtn.addEventListener('click', () => {
    const url = `${USERS_URL}/${encodeURIComponent(userEmail)}`;

    fetch(url, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar usuario');
        return res.json();
      })
      .then(() => {
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
