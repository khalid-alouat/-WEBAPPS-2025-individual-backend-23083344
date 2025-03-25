document.addEventListener('DOMContentLoaded', () => {
  /**
   * Motoren opnieuw ophalen om de lijst te verversen
   */
  function refreshMotoren() {
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
   * Sorteer motoren oplopend op naam
   */
  function sortMotorenAsc() {
    const selectedMerk = document.getElementById('filter-merk') ? document.getElementById('filter-merk').value : 'all';
    let sortedList = motoren;
    if (selectedMerk !== 'all') {
      sortedList = motoren.filter(item => item.merk === selectedMerk);
    }
    sortedList.sort((a, b) => a.naam.localeCompare(b.naam));
    currentPage = 1;
    renderItems(sortedList);
    renderPagination(sortedList);
  }

  /**
   * Sorteer motoren aflopend op naam
   */
  function sortMotorenDesc() {
    const selectedMerk = document.getElementById('filter-merk') ? document.getElementById('filter-merk').value : 'all';
    let sortedList = motoren;
    if (selectedMerk !== 'all') {
      sortedList = motoren.filter(item => item.merk === selectedMerk);
    }
    sortedList.sort((a, b) => b.naam.localeCompare(a.naam));
    currentPage = 1;
    renderItems(sortedList);
    renderPagination(sortedList);
  }

  const sortAscBtn = document.getElementById('sort-asc');
  if (sortAscBtn) {
    sortAscBtn.addEventListener('click', sortMotorenAsc);
  }

  const sortDescBtn = document.getElementById('sort-desc');
  if (sortDescBtn) {
    sortDescBtn.addEventListener('click', sortMotorenDesc);
  }

  /**
   * Filtering motoren op geselecteerd merk
   */
  function filterMotoren() {
    const selectedMerk = document.getElementById('filter-merk').value;
    let filteredMotoren = motoren;
    if (selectedMerk !== 'all') {
      filteredMotoren = motoren.filter(item => item.merk === selectedMerk);
    }
    currentPage = 1;
    renderItems(filteredMotoren);
    renderPagination(filteredMotoren);
  }

  const filterSelect = document.getElementById('filter-merk');
  if (filterSelect) {
    filterSelect.addEventListener('change', filterMotoren);
  }

  /**
   * Toevoegen nieuwe motor via de API (op de pagina "toevoegen.html")
   */
  const addMotorForm = document.getElementById('add-motor-form');
  if (addMotorForm) {
    addMotorForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const naam = document.getElementById('naam').value;
      const bouwjaar = Number(document.getElementById('bouwjaar').value);
      const merk = document.getElementById('merk').value;

      let afbeelding = 'images/dummy.jpg';
      if (merk.toLowerCase() === "kawasaki") {
        afbeelding = "images/kawasaki_logo.jpg";
      } else if (merk.toLowerCase() === "yamaha") {
        afbeelding = "images/yamaha_logo.jpg";
      }

      const nieuwItem = {
        naam: naam,
        bouwjaar: bouwjaar,
        merk: merk,
        afbeelding: afbeelding,
        alt: naam
      };

      // Verstuur POST-request naar de backend API
      fetch('http://localhost:4000/motoren', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nieuwItem)
      })
        .then(response => response.json())
        .then(data => {
          console.log("Nieuw item toegevoegd:", data);
          document.getElementById('form-message').textContent = 'Motor is toegevoegd!';
          refreshMotoren();
        })
        .catch(error => console.error('Fout bij toevoegen motor:', error));

      addMotorForm.reset();
    });
  }
});
