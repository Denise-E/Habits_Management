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
  const deleteBtn = document.getElementById('deleteBtn');

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

  deleteBtn.addEventListener('click', () => {
    if (confirm('¿Querés eliminar este hábito? Esta acción no se puede deshacer.')) {
      fetch(`${HABITS_URL}/${habitId}`, {
        method: 'DELETE'
      })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar');
        alert('Hábito eliminado correctamente');
        // Limpiar sessionStorage para ese hábito
        sessionStorage.removeItem('habitDetailId');
        sessionStorage.removeItem('editHabitId');
        // Redirigir a la lista de hábitos
        window.location.href = './habits.html';
      })
      .catch(err => {
        console.error('Error al eliminar hábito:', err);
        alert('No se pudo eliminar el hábito.');
      });
    }
  });
  
});
