document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.getElementById('header');
  if (headerContainer) {
    fetch('partials/header.html')
      .then(res => res.text())
      .then(html => {
        headerContainer.innerHTML = html;
      });
  }
});

function logout() {
  sessionStorage.clear();
  window.location.href = '../../index.html';
}
