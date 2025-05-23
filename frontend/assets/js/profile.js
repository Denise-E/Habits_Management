document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const profileForm = document.getElementById('profileForm');

  const deleteUserBtn = document.getElementById('deleteUserBtn');
  const confirmDialog = document.getElementById('confirmDialog');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  // Obtengo email de sessionStorage
  const userEmail = sessionStorage.getItem('userEmail');

  if (!userEmail) {
    alert('No se encontró usuario logueado');
    // Redirigir a login o homepage si querés
    return;
  }

  emailInput.value = userEmail;

  // Función para cargar datos del perfil
  function loadProfile() {
    fetch('/api/user/detail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    })
    .then(res => res.json())
    .then(data => {
      nameInput.value = data.name || '';
      phoneInput.value = data.phone || '';
    })
    .catch(err => {
      console.error('Error cargando perfil:', err);
      alert('Error al cargar perfil');
    });
  }

  loadProfile();

  // Guardar cambios
  profileForm.addEventListener('submit', e => {
    e.preventDefault();

    const payload = {
      email: userEmail,
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim()
    };

    fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Perfil actualizado');
    })
    .catch(err => {
      console.error('Error actualizando perfil:', err);
      alert('Error al actualizar perfil');
    });
  });

  // Eliminar usuario
  deleteUserBtn.addEventListener('click', () => {
    confirmDialog.showModal();
  });

  cancelDeleteBtn.addEventListener('click', () => {
    confirmDialog.close();
  });

  confirmDeleteBtn.addEventListener('click', () => {
    fetch('/api/user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Usuario eliminado');
      confirmDialog.close();
      // Limpiar sesión y redirigir a login o homepage
      sessionStorage.clear();
      window.location.href = 'login.html'; 
    })
    .catch(err => {
      console.error('Error eliminando usuario:', err);
      alert('Error al eliminar usuario');
    });
  });
});
