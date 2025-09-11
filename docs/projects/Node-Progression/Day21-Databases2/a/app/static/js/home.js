import api from './APIClient.js';

// Step 1. Set constant for the selected county key
const SELECTED_COUNTY_KEY = 'selectedCounty';

const countiesSelect = document.querySelector('#counties-select');
countiesSelect.addEventListener('change', e => {
  // Step 2. Save the selected county to local storage
  localStorage.setItem(SELECTED_COUNTY_KEY, e.target.value);
  updateParks()
});


// Step 3. Get the selected county from local storage
const storageCounty = localStorage.getItem(SELECTED_COUNTY_KEY);

api.getCounties().then(counties => {
  counties.forEach(county => {
    const countyOptionInstance = countyOptionTemplate.content.cloneNode(true);
    const countyOption = countyOptionInstance.querySelector('option');

    countyOption.value = county.id;
    countyOption.textContent = county.name;
    // Step 4. Set the selected county in the select element
    if(county.id == storageCounty) {
      countyOption.selected = true;
    }
    countiesSelect.append(countyOption);
  });
  updateParks();
});


function updateParks() {
  const cIndex = countiesSelect.selectedIndex;
  const countyId = countiesSelect[cIndex].value;
  api.getParksByCountyId(countyId).then(parks => {
    resetParks();
    fillParksHTML(parks);
  });
}

/**
 * Clear current parks
 */
function resetParks(parks) {
  const parkList = document.querySelector('#parks-list');
  parkList.innerHTML = '';
}

/**
 * Create all parks HTML and add them to the webpage.
 */
function fillParksHTML(parks) {
  const parkList = document.querySelector('#parks-list');
  parks.forEach(park => {
    parkList.append(createParkHTML(park));
  });

}

/**
 * Create park HTML.
 */
const parkTemplate = document.querySelector('#parkTemplate');
const countyChipTemplate = document.querySelector('#countyChipTemplate');

function createParkHTML(park) {
  const parkInstance = parkTemplate.content.cloneNode(true);
  const parkElement = parkInstance.querySelector('.park');

  parkElement.href = '/park?id=' + park.id;

  const parkName = parkInstance.querySelector('h2');
  parkName.textContent = park.name;

  park.counties.forEach(county => {
    const countyInstance = countyChipTemplate.content.cloneNode(true);
    const countyContainer = countyInstance.querySelector('.county');

    countyContainer.textContent = county.name;
    parkElement.appendChild(countyInstance);
  });

  return parkElement;
}


/**
 * RECENT PARKS LIST
 */

const recentParksList = document.querySelector('#visited-parks');
const recentParkTemplate = document.querySelector('#visitedParkTemplate');
api.getVisitedParks().then(parks => {
  parks.forEach(park => {
    const recentParkInstance = recentParkTemplate.content.cloneNode(true);
    const countyContainer = recentParkInstance.querySelector('a');
    countyContainer.textContent = park.name;
    countyContainer.href = '/park?id=' + park.id;
    recentParksList.appendChild(recentParkInstance);
  });
});
  