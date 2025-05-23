document.addEventListener("DOMContentLoaded", () => {
  let currentDate = new Date();
  const table = document.getElementById("trackingTable");
  const weekRange = document.getElementById("weekRange");

  document.getElementById("prevWeek").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 7);
    renderWeek(currentDate);
  });

  document.getElementById("nextWeek").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 7);
    renderWeek(currentDate);
  });

  async function renderWeek(date) {
    const monday = new Date(date);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

    const days = [...Array(7)].map((_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    });

    weekRange.textContent = `${formatDate(days[0])} - ${formatDate(days[6])}`;

    const response = await fetch(`/api/tracking?from=${days[0].toISOString()}&to=${days[6].toISOString()}`);
    const { habits, tracking } = await response.json();

    table.innerHTML = `
      <tr>
        <th>Hábito</th>
        ${days.map(d => `<th>${d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric" })}</th>`).join("")}
      </tr>
      ${habits.map(habit => `
        <tr>
          <td>${habit.name}</td>
          ${days.map(day => {
            const iso = day.toISOString().split('T')[0];
            const done = tracking.some(t => t.habit_id === habit.id && t.date === iso);
            return `<td><input type="checkbox" class="checkbox-circle" data-habit="${habit.id}" data-date="${iso}" ${done ? "checked" : ""}></td>`;
          }).join("")}
        </tr>
      `).join("")}
    `;

    document.querySelectorAll(".checkbox-circle").forEach(checkbox => {
      checkbox.addEventListener("change", async (e) => {
        const habit_id = parseInt(e.target.dataset.habit);
        const date = e.target.dataset.date;

        if (e.target.checked) {
          await fetch("/api/tracking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ habit_id, date })
          });
        } else {
          await fetch(`/api/tracking?habit_id=${habit_id}&date=${date}`, {
            method: "DELETE"
          });
        }
      });
    });
  }

  function formatDate(date) {
    return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  }

  renderWeek(currentDate);
});
