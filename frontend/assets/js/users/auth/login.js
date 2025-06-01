const USERS_URL = window.env.BACKEND_URL + '/users';

document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  let error = false;

  // Limpio errores anteriores de campos
  document.getElementById('error-email').textContent = '';
  document.getElementById('error-password').textContent = '';

  // Limpio error general si existe
  let errorElement = document.getElementById('login-error');
  if (errorElement) errorElement.remove();

  function setError(fieldId, message) {
    const errorSpan = document.getElementById(`error-${fieldId}`);
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.color = 'red';
    }
  }

  if (!email) {
    setError('email', 'El email es obligatorio');
    error = true;
  }

  if (!password) {
    setError('password', 'La contraseña es obligatoria');
    error = true;
  }

  if (!error) {
    try {
      const response = await fetch(`${USERS_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Crear mensaje de error usando data.error (según lo que pediste)
        const errorMsg = document.createElement('p');
        errorMsg.id = 'login-error';
        errorMsg.textContent = data.error || 'Error desconocido';
        errorMsg.style.color = 'red';

        // Insertar el error justo antes del botón submit
        const form = document.getElementById('login-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        form.insertBefore(errorMsg, submitBtn);
      } else {
        // Login exitoso
        sessionStorage['userEmail'] = email;
        window.location.href = './assets/pages/habits/habits.html';
      }
    } catch (err) {
      const errorMsg = document.createElement('p');
      errorMsg.id = 'login-error';
      errorMsg.textContent = 'No se pudo conectar con el servidor.';
      errorMsg.style.color = 'red';

      const form = document.getElementById('login-form');
      const submitBtn = form.querySelector('button[type="submit"]');
      form.insertBefore(errorMsg, submitBtn);
    }
  }
});

