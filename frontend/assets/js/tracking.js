document.addEventListener('DOMContentLoaded', () => {
  const userEmail = sessionStorage.getItem('userEmail');
  const userName = sessionStorage.getItem('userName');
  document.getElementById('userNameDisplay').textContent = `${userName}`;

  fetch(`http://localhost:5000/api/habits/${userEmail}`)
    .then(res => res.json())
    .then(habits => {
      console.log("Habits found:", habits)
      const list = document.getElementById('habitList');
      list.innerHTML = '';
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
  fetch(`http://localhost:5000/api/habits/${habitId}`, { method: 'DELETE' })
    .then(() => location.reload());
}
