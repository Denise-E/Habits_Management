document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('habitForm');
  if (!form) return;

  const urlParams = new URLSearchParams(window.location.search);
  const habitId = urlParams.get('id'); 
  const userEmail = sessionStorage.getItem('userEmail');

  // Si estamos editando, obtenemos los datos del hábito
  if (habitId) {
    fetch(`http://localhost:5000/api/habits/${habitId}`)
      .then(res => res.json())
      .then(habit => {
        if (habit.error) throw new Error(habit.error);
        document.getElementById('name').value = habit.name;
        document.getElementById('description').value = habit.description || '';
        document.getElementById('category').value = habit.category;
        document.getElementById('goal').value = habit.goal;
      });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const habit = {
      name: document.getElementById('name').value.trim(),
      description: document.getElementById('description').value.trim(),
      category: document.getElementById('category').value.trim(),
      goal: document.getElementById('goal').value.trim(),
      user_email: userEmail,
    };

    if (habitId) {
      fetch(`http://localhost:5000/api/habits/${habitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habit)
      }).then(() => window.location.href = 'reports.html');
    } else {
      fetch('http://localhost:5000/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habit)
      }).then(() => window.location.href = 'reports.html');
    }
  });
});
