function includeHTML(selector, url) {
  fetch(url)
    .then((res) => res.text())
    .then((data) => {
      document.querySelector(selector).innerHTML = data;
    })
    .catch((err) => console.error("Error al incluir el archivo:", err));
}

// Usar después de que cargue el DOM
window.addEventListener("DOMContentLoaded", () => {
  includeHTML("header", "/assets/pages/partials/header.html");
  includeHTML("footer", "/assets/pages/partials/footer.html");
});
