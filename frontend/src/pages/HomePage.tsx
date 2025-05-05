import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Mis hábitos</h1>

      {/* 📝 Acá vas a renderizar el listado de hábitos */}
      <section style={{ marginTop: '2rem' }}>
        <p>Aún no hay hábitos. Creá uno para empezar.</p>
        {/* En el futuro: lista de hábitos renderizada acá */}
      </section>

      {/* ➕ Acá iría un botón para crear un nuevo hábito */}
      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => console.log('Crear hábito')}>
          Crear nuevo hábito
        </button>
      </div>
    </div>
  );
};

export default HomePage;
