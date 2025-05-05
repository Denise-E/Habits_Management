import React from 'react';

const RegisterPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Registrarse</h1>
      <form>
        <div>
          <label>Nombre completo:</label>
          <input type="text" name="fullName" required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Crear cuenta</button>
      </form>
    </div>
  );
};

export default RegisterPage;
