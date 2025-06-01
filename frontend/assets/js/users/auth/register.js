const USERS_URL = window.env.BACKEND_URL + '/users'


document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Cleans previous error messages
  let errorElement = document.getElementById('register-error');
  if (errorElement) {
    errorElement.remove();
  }

  try {
    const response = await fetch(`${USERS_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = document.createElement('p');
      errorMsg.id = 'register-error';
      errorMsg.textContent = data.message || 'Error desconocido';
      errorMsg.style.color = 'red';
      document.getElementById('register-form').appendChild(errorMsg);
    } else {
      const userEmail = sessionStorage['userEmail'] = email;
      window.location.href = '../../pages/habits/habits.html';
    }
  } catch (error) {
    const errorMsg = document.createElement('p');
    errorMsg.id = 'register-error';
    errorMsg.textContent = 'No se pudo conectar con el servidor.';
    errorMsg.style.color = 'red';
    document.getElementById('register-form').appendChild(errorMsg);
  }
});
