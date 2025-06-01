const USERS_URL = window.env.BACKEND_URL + '/users';

document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Obtener valores
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const phone = document.getElementById('phone').value.trim();
  const birthdateRaw = document.getElementById('birthdate').value;

  // Limpiar errores anteriores
  clearErrors();

  let isValid = true;

  // Validaciones
  if (!name) {
    setError('name', 'El nombre es obligatorio');
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    setError('email', 'El email es obligatorio');
    isValid = false;
  } else if (!emailRegex.test(email)) {
    setError('email', 'El formato del email no es válido');
    isValid = false;
  }

  if (!password) {
    setError('password', 'La contraseña es obligatoria');
    isValid = false;
  } else if (password.length < 6) {
    setError('password', 'La contraseña debe tener al menos 6 caracteres');
    isValid = false;
  }

  if (!phone) {
    setError('phone', 'El teléfono es obligatorio');
    isValid = false;
  } else if (phone.length < 8) {
    setError('phone', 'El teléfono debe tener al menos 8 caracteres');
    isValid = false;
  }

  if (!birthdateRaw) {
    setError('birthdate', 'La fecha de nacimiento es obligatoria');
    isValid = false;
  }

  if (!isValid) return;

  // Formatear fecha a DD-MM-YY
  const birthdateParts = birthdateRaw.split('-'); // YYYY-MM-DD
  const birthdate = `${birthdateParts[2]}-${birthdateParts[1]}-${birthdateParts[0].slice(2)}`; // DD-MM-YY

  try {
    const response = await fetch(`${USERS_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, birthdate })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Error desconocido');
      return;
    }

    sessionStorage.setItem('userEmail', email);
    window.location.href = '../../pages/habits/habits.html';
  } catch (error) {
    alert('No se pudo conectar con el servidor.');
  }
});

function setError(fieldId, message) {
  const errorSpan = document.getElementById(`error-${fieldId}`);
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.style.color = 'red';
  }
}

function clearErrors() {
  const errorSpans = document.querySelectorAll('.error-message');
  errorSpans.forEach(span => span.textContent = '');
}
