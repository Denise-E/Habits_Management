import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Iniciar sesión</h1>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default LoginPage;
