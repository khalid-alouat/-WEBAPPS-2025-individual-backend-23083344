const itemsPerPage = 5;
let currentPage = 1;

/**
 * @param {Array} itemsArray 
 */
function renderItems(itemsArray = motoren) {
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
 * @param {Array} itemsArray
 */
function renderPagination(itemsArray = motoren) {
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
  // Laad opgeslagen motoren uit localStorage als deze bestaan
  const storedMotoren = localStorage.getItem('motoren');
  if (storedMotoren) {
    // Leeg de huidige motoren array en vul deze met de opgeslagen data
    motoren.length = 0;
    JSON.parse(storedMotoren).forEach(item => motoren.push(item));
    console.log("Opgeslagen motoren geladen uit localStorage.");
  }

  renderItems();
  renderPagination();
});
