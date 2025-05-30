const TRACKING_URL = window.env.BACKEND_URL + '/habits/tracking'

document.addEventListener('DOMContentLoaded', () => {
  // Date formatting into YYYY-MM-DD
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  const weekDaysRow = document.getElementById('weekDaysRow');
  const habitRows = document.getElementById('habitRows');
  const prevWeekBtn = document.getElementById('prevWeek');
  const nextWeekBtn = document.getElementById('nextWeek');
  const currentWeekLabel = document.getElementById('currentWeekLabel');

  let currentMonday = getMonday(new Date());

  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Si es domingo (0), retrocede 6 días, sino va al lunes
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function formatDayLabel(date) {
    const label = date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function renderWeekDates() {
    weekDaysRow.innerHTML = '<th>Hábito</th>'; // First row

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentMonday);
      dayDate.setDate(currentMonday.getDate() + i);

      const th = document.createElement('th');
      th.textContent = formatDayLabel(dayDate);
      weekDaysRow.appendChild(th);
    }

    // Showing week labels - Format: "Semana del DD/MM/YYYY"
    const formattedDate = currentMonday.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    currentWeekLabel.textContent = `Semana del ${formattedDate}`;
  }

  function renderHabits(habits, tracking) {
    habitRows.innerHTML = '';

    habits.forEach(habit => {
      const tr = document.createElement('tr');

      // Habit name column
      const tdName = document.createElement('td');
      tdName.textContent = habit.name;
      tr.appendChild(tdName);

      // Daily checkboxes
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(currentMonday);
        dayDate.setDate(currentMonday.getDate() + i);
        const dateStr = formatDate(dayDate);

        const td = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'habit-checkbox';
        checkbox.dataset.habitId = habit.id;
        checkbox.dataset.date = dateStr;

        // Check if theres a tracking for that day (t.date)
        const tracked = tracking.some(t => t.habit_id === habit.id && t.date === dateStr);
        checkbox.checked = tracked;
        checkbox.addEventListener('change', handleCheckboxChange);

        td.appendChild(checkbox);
        tr.appendChild(td);
      }

      habitRows.appendChild(tr);
    });
  }

  function handleCheckboxChange(event) {
    const checkbox = event.target;
    const habitId = parseInt(checkbox.dataset.habitId);
    const date = checkbox.dataset.date;

    const payload = {
      habit_id: habitId,
      date: date
    };

    if (checkbox.checked) {
      fetch(`${TRACKING_URL}/tracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .catch(err => console.error('Error al guardar tracking:', err));
    } else {
      fetch(TRACKING_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .catch(err => console.error('Error al eliminar tracking:', err));
    }
  }

  function loadTracking() {
    const fromDate = formatDate(currentMonday);
    const toDate = formatDate(new Date(currentMonday.getTime() + 6 * 86400000));

    fetch(`${TRACKING_URL}/detail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromDate, to: toDate })
    })
    .then(res => res.json())
    .then(data => {
      renderWeekDates();
      renderHabits(data.habits, data.tracking);
    })
    .catch(err => {
      console.error('Error cargando tracking:', err);
    });
  }

  prevWeekBtn.addEventListener('click', () => {
    currentMonday.setDate(currentMonday.getDate() - 7);
    loadTracking();
  });

  nextWeekBtn.addEventListener('click', () => {
    currentMonday.setDate(currentMonday.getDate() + 7);
    loadTracking();
  });

  // Weekly table inicilization
  loadTracking();

  // --- Analytics Section ---
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const loadStatsButton = document.getElementById('loadStats');
  const statsResult = document.getElementById('statsResult');

  // Solo si existen los inputs (evita error si no está la sección)
  if (startDateInput && endDateInput && loadStatsButton && statsResult) {
    const todayStr = formatDate(new Date());
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = formatDate(weekAgo);

    startDateInput.value = weekAgoStr;
    endDateInput.value = todayStr;

    loadStatsButton.addEventListener('click', () => {
      const fromDate = startDateInput.value;
      const toDate = endDateInput.value;

      if (!fromDate || !toDate || fromDate > toDate) {
        alert('Por favor seleccioná un rango de fechas válido.');
        return;
      }

      fetch(`${TRACKING_URL}/detail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromDate, to: toDate })
      })
      .then(res => res.json())
      .then(data => {
        const { habits, tracking } = data;

        const diffDays = (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24) + 1;

        const rowsHtml = habits.map(habit => {
          const completions = tracking.filter(t => t.habit_id === habit.id).length;
          const percent = ((completions / diffDays) * 100).toFixed(1);
          return `
            <tr>
              <td>${habit.name}</td>
              <td>${completions}</td>
              <td>${percent}%</td>
            </tr>
          `;
        }).join('');

        statsResult.innerHTML = `
          <table>
            <thead>
              <tr>
                <th>Hábito</th>
                <th>Veces completado</th>
                <th>Porcentaje cumplimiento</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        `;
      })
      .catch(err => {
        console.error(err);
        alert('Ocurrió un error al cargar las estadísticas');
      });
    });
  }

  // Analytics update
  function loadStats(fromDate, toDate) {
    fetch(`${TRACKING_URL}/detail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromDate, to: toDate })
    })
    .then(res => res.json())
    .then(data => {
      const { habits, tracking } = data;
      const diffDays = (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24) + 1;

      const rowsHtml = habits.map(habit => {
        const completions = tracking.filter(t => t.habit_id === habit.id).length;
        const percent = ((completions / diffDays) * 100).toFixed(1);
        return `
          <tr>
            <td>${habit.name}</td>
            <td>${completions}</td>
            <td>${percent}%</td>
          </tr>
        `;
      }).join('');

      statsResult.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Hábito</th>
              <th>Veces completado</th>
              <th>Porcentaje cumplimiento</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `;
    })
    .catch(err => {
      console.error(err);
      alert('Ocurrió un error al cargar las estadísticas');
    });
  }

  if (startDateInput && endDateInput && loadStatsButton && statsResult) {
    const todayStr = formatDate(new Date());
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = formatDate(weekAgo);

    startDateInput.value = weekAgoStr;
    endDateInput.value = todayStr;

    loadStatsButton.addEventListener('click', () => {
      const fromDate = startDateInput.value;
      const toDate = endDateInput.value;

      if (!fromDate || !toDate || fromDate > toDate) {
        alert('Por favor seleccioná un rango de fechas válido.');
        return;
      }

      loadStats(fromDate, toDate);
    });
  }

  function handleCheckboxChange(event) {
    const checkbox = event.target;
    const habitId = parseInt(checkbox.dataset.habitId);
    const date = checkbox.dataset.date;

    const payload = {
      habit_id: habitId,
      date: date
    };

    const fetchOptions = {
      method: checkbox.checked ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };

    fetch(TRACKING_URL, fetchOptions)
      .then(() => {
        // Analytics update if the section is not hidden 
        if (
          statsResult && statsResult.innerHTML.trim() !== '' &&
          startDateInput && endDateInput &&
          startDateInput.value && endDateInput.value &&
          startDateInput.value <= endDateInput.value
        ) {
          loadStats(startDateInput.value, endDateInput.value);
        }
      })
      .catch(err => console.error('Error al actualizar tracking:', err));
  }

});
