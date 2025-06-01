const HABITS_URL = window.env.BACKEND_URL + '/habits'

let habitIdToDelete = null;

document.addEventListener('DOMContentLoaded', () => {
  const userEmail = sessionStorage.getItem('userEmail');
  const list = document.getElementById('habitList');
  const dialog = document.getElementById('confirmDeleteHabitDialog');
  const confirmBtn = document.getElementById('confirmDeleteHabitBtn');
  const cancelBtn = document.getElementById('cancelDeleteHabitBtn');

  fetch(`${HABITS_URL}/${userEmail}`)
    .then(res => res.json())
    .then(habits => {
      list.innerHTML = '';

      if (!Array.isArray(habits) || habits.length === 0) {
        list.innerHTML = `
          <li style="list-style: none; margin-top: 1rem; font-size: 1.2rem; color: #333; text-align: center; display: block;">
            Todavía no registraste ningún hábito. 
          </li>
        `;
        return;
      }

      habits.forEach(habit => {
        const li = document.createElement('li');
        li.style.marginBottom = '1rem';
        li.innerHTML = `
          <span>${habit.name}</span>
          <span style="float: right;">
            <a href="edit_habit.html?id=${habit.id}">✏️</a>
            <button data-id="${habit.id}" class="delete-btn">🗑️</button>
          </span>
        `;
        list.appendChild(li);
      });

      // Asociar eventos a los botones de eliminar
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
          habitIdToDelete = button.getAttribute('data-id');
          dialog.showModal();
        });
      });

      // Confirmar eliminación
      confirmBtn.addEventListener('click', () => {
        if (habitIdToDelete) {
          fetch(`${HABITS_URL}/${habitIdToDelete}`, {
            method: 'DELETE'
          })
          .then(() => {
            dialog.close();
            location.reload();
          });
        }
      });

      // Cancelar eliminación
      cancelBtn.addEventListener('click', () => {
        habitIdToDelete = null;
        dialog.close();
      });
    });
});
