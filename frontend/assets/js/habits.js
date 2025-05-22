document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('habitForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value.trim();
    const goal = document.getElementById('goal').value.trim();
    const user_email = sessionStorage.getItem('userEmail');

    if (!name || !category || !goal || !user_email) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const newHabit = { name, category, goal, user_email };

    try {
      const response = await fetch('http://localhost:5000/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHabit)
      });

      if (!response.ok) {
        throw new Error('Error al guardar el hábito');
      }

      window.location.href = 'reports.html';
    } catch (error) {
      alert("Ocurrió un error al guardar el hábito.");
      console.error(error);
    }
  });
});
