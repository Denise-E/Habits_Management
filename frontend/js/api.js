const API_URL = 'http://localhost:5000/api';

export async function login(email, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function getHabits(token) {
  const res = await fetch(`${API_URL}/habits/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}
