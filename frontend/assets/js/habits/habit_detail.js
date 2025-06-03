const HABITS_URL = window.env.BACKEND_URL + '/habits';

document.addEventListener('DOMContentLoaded', () => {
  const userEmail = sessionStorage.getItem('userEmail');
  const habitId = sessionStorage.getItem('detailHabitId');
  if (!habitId) {
    alert('No se encontró el ID del hábito.');
    return;
  }

  // Getting elemnts where info is going to be shown
  const nameElem = document.getElementById('name');
  const descriptionElem = document.getElementById('description');
  const categoryElem = document.getElementById('category');
  const goalElem = document.getElementById('goal');
  const editBtn = document.getElementById('editBtn');
  const deleteBtn = document.getElementById('deleteBtn');

  // Get habit info
  fetch(`${HABITS_URL}/${userEmail}/${habitId}`)
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

  editBtn.addEventListener('click', () => {
    sessionStorage.setItem('editHabitId', habitId);
    window.location.href = './edit_habit.html';
  });

  deleteBtn.addEventListener('click', () => {
    if (confirm('¿Querés eliminar este hábito? Esta acción no se puede deshacer.')) {
      fetch(`${HABITS_URL}/${userEmail}/${habitId}`, {
        method: 'DELETE'
      })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar');
        alert('Hábito eliminado correctamente');
        // Cleaning sessionStorage
        sessionStorage.removeItem('habitDetailId');
        sessionStorage.removeItem('editHabitId');
        window.location.href = './habits.html';
      })
      .catch(err => {
        console.error('Error al eliminar hábito:', err);
        alert('No se pudo eliminar el hábito.');
      });
    }
  });

});
