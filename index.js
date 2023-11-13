document.onreadystatechange = function () {
  var state = document.readyState;
  if (state == 'interactive') {
  	var map = L.map('map').setView([40.7212, -73.8638], 11);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  }
};
