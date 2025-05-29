const USERS_URL = window.env.BACKEND_URL + '/users'

document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  //   // Cleaning previous errors
  let errorElement = document.getElementById('login-error');
  if (errorElement) {
    errorElement.remove();
  }

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
      window.location.href = './assets/presentation/reports.html';
    }
  } catch (error) {
    const errorMsg = document.createElement('p');
    errorMsg.id = 'login-error';
    errorMsg.textContent = 'No se pudo conectar con el servidor.';
    errorMsg.style.color = 'red';
    document.getElementById('login-form').appendChild(errorMsg);
  }
});
