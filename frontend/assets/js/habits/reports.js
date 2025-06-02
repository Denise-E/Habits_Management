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
      li.style.cursor = 'pointer'; // For better style
      li.innerHTML = `
        <span>${habit.name}</span>
        <span style="float: right;">
          <button class="edit-btn" data-id="${habit.id}">✏️</button>
          <button data-id="${habit.id}" class="delete-btn">🗑️</button>
        </span>
      `;

      li.addEventListener('click', () => {
        sessionStorage.setItem('detailHabitId', habit.id);
        window.location.href = './habit_detail.html';
      });

      li.querySelector('.edit-btn').addEventListener('click', event => {
        event.stopPropagation();
        sessionStorage.setItem('editHabitId', habit.id);
        window.location.href = './edit_habit.html';
      });

      li.querySelector('.delete-btn').addEventListener('click', event => {
        event.stopPropagation();
        habitIdToDelete = habit.id;
        dialog.showModal();
      });

      list.appendChild(li);
    });
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
          habitIdToDelete = button.getAttribute('data-id');
          dialog.showModal();
        });
      });

      // Confirm deletion
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

      // Cancel deletion
      cancelBtn.addEventListener('click', () => {
        habitIdToDelete = null;
        dialog.close();
      });
    });
});
