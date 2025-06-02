const HABITS_URL = window.env.BACKEND_URL + '/habits';

document.addEventListener('DOMContentLoaded', () => {
  // Obtener el ID del hábito desde sessionStorage
  const habitId = sessionStorage.getItem('detailHabitId');
  if (!habitId) {
    alert('No se encontró el ID del hábito.');
    return;
  }

  // Elementos donde mostrar los datos
  const nameElem = document.getElementById('name');
  const descriptionElem = document.getElementById('description');
  const categoryElem = document.getElementById('category');
  const goalElem = document.getElementById('goal');
  const editBtn = document.getElementById('editBtn');

  // Traer datos del hábito
  fetch(`${HABITS_URL}/${habitId}`)
    .then(res => res.json())
    .then(habit => {
      if (habit.error) throw new Error(habit.error);

      nameElem.textContent = habit.name || '-';
      descriptionElem.textContent = habit.description || '-';
      categoryElem.textContent = habit.category || '-';
      goalElem.textContent = habit.goal || '-';
    })
    .catch(err => {
      console.error('Error al cargar el hábito:', err);
      alert('No se pudo cargar el hábito.');
    });

  // Al hacer click en "Editar hábito"
  editBtn.addEventListener('click', () => {
    sessionStorage.setItem('editHabitId', habitId);
    window.location.href = './edit_habit.html';
  });
});
