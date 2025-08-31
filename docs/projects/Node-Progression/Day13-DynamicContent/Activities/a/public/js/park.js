import api from './APIClient_mock.js';

/**
 * Initialize leaflet map, called from HTML.
 */
function initMap(lat, lon) {
  var map = L.map('map').setView([lat, lon], 15);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
}

/**********************************/
/*  TASK 4: DISPLAY PARK DETAILS  */
/**********************************/

// 1. Get id from URL
const query = window.location.search;
let parameters = new URLSearchParams(query);
const id = parameters.get('id');

// 2. Retrieve park from API and display details
api.getParkById(id)
  .then(park => {
    // Initialize map
    initMap(park.lat, park.lon);

    // Set page title to park name
    document.title = 'North Carolina Parks - ' + park.name;

    // Update all elements with class "park-name"
    document.querySelectorAll('.park-name').forEach(element => {
      element.textContent = park.name;
    });

    // Get reference to counties container
    const countiesList = document.querySelector('#counties');

    // Reference countyChipTemplate
    const countyChipTemplate = document.getElementById('countyChipTemplate');

    // Iterate over park counties and create county chips
    park.counties.forEach(county => {
      const countyInstance = countyChipTemplate.content.cloneNode(true);
      const countyElement = countyInstance.querySelector('.county');
      countyElement.textContent = county.name;
      countiesList.appendChild(countyElement);
    });
  })
  .catch(() => {
    // Redirect to error page if park is not found
    document.location = "/error";
  });