const USERS_URL = window.env.BACKEND_URL + '/users'

document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  let error = false;

  if (!email) {
    setError('email', 'El email es obligatorio');
    isValid = false;
    error = true;
  }

  if (!password) {
    setError('password', 'La contraseña es obligatoria');
    isValid = false;
    error = true;
  }

  //   // Cleaning previous errors
  let errorElement = document.getElementById('login-error');
  if (errorElement) {
    errorElement.remove();
  }

  function setError(fieldId, message) {
    const errorSpan = document.getElementById(`error-${fieldId}`);
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.color = 'red';
    }
  }

  if(!error){
    try {
      // Log in backend request
      const response = await fetch(`${USERS_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // To show error messages on the form
        const errorMsg = document.createElement('p');
        errorMsg.id = 'login-error';
        errorMsg.textContent = data.message || 'Error desconocido';
        errorMsg.style.color = 'red';
        document.getElementById('login-form').appendChild(errorMsg);
      } else {
        // Home redirection
        const userEmail = sessionStorage['userEmail'] = email;
        window.location.href = './assets/pages/habits/habits.html';
      }
    } catch (error) {
      const errorMsg = document.createElement('p');
      errorMsg.id = 'login-error';
      errorMsg.textContent = 'No se pudo conectar con el servidor.';
      errorMsg.style.color = 'red';
      document.getElementById('login-form').appendChild(errorMsg);
    } 
  }
  
});
