
const countiesSelect = document.querySelector('#counties-select');
countiesSelect.addEventListener('change', e => {
  const cIndex = e.target.selectedIndex;
  const county = e.target[cIndex].value;
  var query = new URLSearchParams();
  query.append("countyId", county);
  document.location.href = "/?" + query.toString();
});
