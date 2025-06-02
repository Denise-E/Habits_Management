const USERS_URL = window.env.BACKEND_URL + '/users';

document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const phone = document.getElementById('phone').value.trim();
  const birthday_dateRaw = document.getElementById('birthday_date').value;

  // Cleaning previous errores
  clearErrors();

  let isValid = true;

  // Fields validations
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

  if (!birthday_dateRaw) {
    setError('birthday_date', 'La fecha de nacimiento es obligatoria');
    isValid = false;
  }

  if (!isValid) return;

  // Date formatting - result DD-MM-YY
  const birthday_dateParts = birthday_dateRaw.split('-');
  const birthday_date = `${birthday_dateParts[2]}-${birthday_dateParts[1]}-${birthday_dateParts[0].slice(2)}`; 

  try {
    const response = await fetch(`${USERS_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, birthday_date })
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
