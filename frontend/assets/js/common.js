document.addEventListener('DOMContentLoaded', () => {
  // Header logout button event
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', logout);
  }
});

function logout() {
  console.log("Logging out");
  sessionStorage.clear();
  window.location.href = '../../index.html';
}
