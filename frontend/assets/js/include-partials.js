function includeHTML(selector, url, callback) {
  const element = document.querySelector(selector);
  if (!element) return;

  fetch(url)
    .then((res) => res.text())
    .then((data) => {
      element.innerHTML = data;

      if (typeof callback === 'function') {
        callback();
      }
    })
    .catch((err) => console.error(`Error al incluir el archivo '${url}':`, err));
}

window.addEventListener("DOMContentLoaded", () => {
  includeHTML("header", "/assets/pages/partials/header.html", () => {
    if (typeof setupLogoutButton === 'function') {
      setupLogoutButton();
    }
  });

  includeHTML("footer", "/assets/pages/partials/footer.html");
});
