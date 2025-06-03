function logout() {
  console.log("Logging out");
  sessionStorage.clear();
  window.location.href = '../../../index.html';
}

function setupLogoutButton() {
  console.log("Logout script loaded");
  const logoutButton = document.getElementById('logoutButton');

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      console.log("Button clicked");
      logout();
    });
  } else {
    console.warn("logoutButton not found");
  }
}
