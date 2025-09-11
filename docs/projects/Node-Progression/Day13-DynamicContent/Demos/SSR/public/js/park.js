
/**
 * Initialize leaflet map, called from HTML.
 */
initMap = (lat, lon) => {
  var map = L.map('map').setView([lat, lon], 15);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

}

