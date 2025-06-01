document.addEventListener('DOMContentLoaded', () => {
  const userEmail = sessionStorage.getItem('userEmail');
  if (!userEmail) {
    window.location.href = '../../../index.html';  // Redirects to login if no user is loged in
  }
});
