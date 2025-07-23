import api from './APIClient.js';

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




// 1. Get id from URL
const query = window.location.search;
let parameters = new URLSearchParams(query);
const id = parameters.get('id');

// 2. Retrieve park from API and display details
api.getParkById(id).then(park => {
  initMap(park.lat, park.lon);
  document.title = 'North Carolina Parks - ' + park.name;

  document.querySelectorAll('.park-name').forEach(element => {
    element.textContent = park.name;
  });

  const countyChipTemplate = document.getElementById('countyChipTemplate');
  const countiesList = document.querySelector('#counties');
  park.counties.forEach(county => {


    const countyInstance = countyChipTemplate.content.cloneNode(true);
    const countyElement = countyInstance.querySelector('.county');

    countyElement.textContent = county.name;
    countiesList.appendChild(countyElement);
  });


}).catch(() => {
  document.location = "/error";
});
