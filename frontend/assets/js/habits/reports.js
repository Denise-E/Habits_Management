const HABITS_URL = window.env.BACKEND_URL + '/habits'

document.addEventListener('DOMContentLoaded', () => {
  const userEmail = sessionStorage.getItem('userEmail');

  fetch(`${HABITS_URL}/${userEmail}`)
    .then(res => res.json())
    .then(habits => {
      console.log("Habits found:", habits)
      const list = document.getElementById('habitList');
      list.innerHTML = '';
      
      if (!Array.isArray(habits) || habits.length == 0) {
        console.log("Inserting no habits message")
        habitList.innerHTML = `
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
            <button onclick="deleteHabit(${habit.id})">🗑️</button>
          </span>
        `;
        list.appendChild(li);
      });
    });
});

function deleteHabit(habitId) {
  console.log("Habit ID", habitId)
  fetch(`${HABITS_URL}/${habitId}`, { method: 'DELETE' })
    .then(() => location.reload());
}
