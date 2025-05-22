document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Limpiar mensaje de error anterior
  let errorElement = document.getElementById('login-error');
  if (errorElement) {
    errorElement.remove();
  }

  try {
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      // Mostrar el mensaje de error en el formulario
      const errorMsg = document.createElement('p');
      errorMsg.id = 'login-error';
      errorMsg.textContent = data.message || 'Error desconocido';
      errorMsg.style.color = 'red';
      document.getElementById('login-form').appendChild(errorMsg);
    } else {
      // Redirigir al home
      window.location.href = './presentation/reports.html';
    }
  } catch (error) {
    const errorMsg = document.createElement('p');
    errorMsg.id = 'login-error';
    errorMsg.textContent = 'No se pudo conectar con el servidor.';
    errorMsg.style.color = 'red';
    document.getElementById('login-form').appendChild(errorMsg);
  }
});
