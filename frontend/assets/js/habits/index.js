const HABITS_URL = window.env.BACKEND_URL + '/habits';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('habitForm');
  const categorySelect = document.getElementById('category');
  const urlParams = new URLSearchParams(window.location.search);
  const habitId = sessionStorage.getItem('editHabitId');
  console.log("ID cargado desde sessionStorage:", habitId);



  const userEmail = sessionStorage.getItem('userEmail');

    if (Array.isArray(categories)) {
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  // Complete the information if editing
  if (habitId) {
    fetch(`${HABITS_URL}/${userEmail}/${habitId}`)
      .then(res => res.json())
      .then(habit => {
        if (habit.error) throw new Error(habit.error);
        document.getElementById('name').value = habit.name;
        document.getElementById('description').value = habit.description || '';
        document.getElementById('goal').value = habit.goal;

        // Seleccionar la categoría actual del hábito
        const categorySelect = document.getElementById('category');
        categorySelect.value = habit.category;
      })
      .catch(err => {
        console.error("Error cargando hábito:", err);
        alert("No se pudo cargar el hábito.");
      });
  }
  
  form.addEventListener('submit', e => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value.trim();
    const goal = document.getElementById('goal').value.trim();

    let hasErrors = false;

    if (!name) {
      document.getElementById('nameError').textContent = 'Este campo es obligatorio.';
      hasErrors = true;
    }

    if (!category) {
      document.getElementById('categoryError').textContent = 'Seleccioná una categoría.';
      hasErrors = true;
    }

    if (!goal) {
      document.getElementById('goalError').textContent = 'Este campo es obligatorio.';
      hasErrors = true;
    }

    if (hasErrors) return;

    const habit = {
      name,
      description,
      category,
      goal,
      user_email: userEmail
    };

    const fetchOptions = {
      method: habitId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habit)
    };

    const targetUrl = habitId ? `${HABITS_URL}/${userEmail}/${habitId}` : HABITS_URL;

    fetch(targetUrl, fetchOptions)
      .then(() => window.location.href = './habits.html')
      .catch(err => {
        console.error("Error guardando hábito:", err);
        alert("Ocurrió un error al guardar el hábito.");
      });
  });
  sessionStorage.removeItem('editHabitId');
});
