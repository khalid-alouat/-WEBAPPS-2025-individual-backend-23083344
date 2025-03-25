document.addEventListener('DOMContentLoaded', () => {
  function saveMotoren() {
    localStorage.setItem('motoren', JSON.stringify(motoren));
    console.log("Motoren opgeslagen in localStorage.");
  }

  const opgeslagenMotoren = localStorage.getItem('motoren');
  if (opgeslagenMotoren) {
    motoren.length = 0;
    JSON.parse(opgeslagenMotoren).forEach(item => motoren.push(item));
    console.log("Opgeslagen motoren geladen uit localStorage.");
  }

  function sortMotorenAsc() {
    const selectedMerk = document.getElementById('filter-merk') ? document.getElementById('filter-merk').value : 'all';
    let sortedList;
    if (selectedMerk !== 'all') {
      sortedList = motoren.filter(item => item.merk === selectedMerk);
    } else {
      sortedList = [...motoren];
    }
    sortedList.sort((a, b) => a.naam.localeCompare(b.naam));
    currentPage = 1;
    renderItems(sortedList);
    renderPagination(sortedList);
  }

  function sortMotorenDesc() {
    const selectedMerk = document.getElementById('filter-merk') ? document.getElementById('filter-merk').value : 'all';
    let sortedList;
    if (selectedMerk !== 'all') {
      sortedList = motoren.filter(item => item.merk === selectedMerk);
    } else {
      sortedList = [...motoren];
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
        id: motoren.length + 1,
        naam: naam,
        bouwjaar: bouwjaar,
        merk: merk,
        afbeelding: afbeelding,
        alt: naam
      };

      motoren.push(nieuwItem);
      console.log("Nieuw item toegevoegd:", nieuwItem);

      saveMotoren();

      document.getElementById('form-message').textContent = 'Motor is toegevoegd!';

      if (!document.getElementById('motor-container')) {
        setTimeout(() => {
          window.location.href = "overzicht.html";
        }, 500);
      } else {
        renderItems();
        renderPagination();
      }

      addMotorForm.reset();
    });
  }
});
