const itemsPerPage = 5;
let currentPage = 1;
let motoren = []; // Lege array; wordt gevuld via de API

function fetchMotoren() {
  fetch('http://localhost:4000/motoren')
    .then(response => response.json())
    .then(data => {
      motoren = data;
      renderItems(motoren);
      renderPagination(motoren);
    })
    .catch(error => console.error('Fout bij ophalen motoren:', error));
}

/**
 * Rendering motoren op pagina
 * @param {Array} itemsArray 
 */
function renderItems(itemsArray) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = itemsArray.slice(startIndex, endIndex);

  const container = document.getElementById('motor-container');
  if (!container) return;
  container.innerHTML = '';

  itemsToShow.forEach(item => {
    container.innerHTML += `
      <div class="motor-card">
        <img src="${item.afbeelding}" alt="${item.alt}">
        <h3>${item.naam}</h3>
        <p>Bouwjaar: ${item.bouwjaar}</p>
        <p>Merk: ${item.merk}</p>
      </div>
    `;
  });

  document.title = `Motorverzameling – Pagina ${currentPage}`;
}

/**
 * Paginatieknoppen aanmaken
 * @param {Array} itemsArray
 */
function renderPagination(itemsArray) {
  const paginationContainer = document.getElementById('pagination');
  if (!paginationContainer) return;
  paginationContainer.innerHTML = '';

  const totalPages = Math.ceil(itemsArray.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `<button class="page-btn" data-page="${i}">${i}</button>`;
  }
  document.querySelectorAll('.page-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      currentPage = Number(e.target.getAttribute('data-page'));
      renderItems(itemsArray);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Data ophalen zodra de pagina geladen is
  fetchMotoren();
});
