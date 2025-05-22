document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Limpiar mensaje de error anterior
  let errorElement = document.getElementById('register-error');
  if (errorElement) {
    errorElement.remove();
  }

  try {
    const response = await fetch('http://localhost:5000/api/users/register', {
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
      window.location.href = 'reports.html';
    }
  } catch (error) {
    const errorMsg = document.createElement('p');
    errorMsg.id = 'register-error';
    errorMsg.textContent = 'No se pudo conectar con el servidor.';
    errorMsg.style.color = 'red';
    document.getElementById('register-form').appendChild(errorMsg);
  }
});
