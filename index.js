const hospitals = [
  ["Elmhurst Hospital Center", 40.738710402563, -73.878351155182],
  ["Jacobi Medical Center", 40.857397104611, -73.846571204087],
  ["Metropolitan Hospital Center", 40.784557024105, -73.943795653643],
  ["North Central Bronx Hospital", 40.880463372456, -73.881592877502],
  ["Kings Count Hospital Center", 40.655761808605, -73.944662615537],
  ["Bellevue Hospital Center", 40.73962320748, -73.976572846645],
  ["Coney Island Hospital", 40.586645433957, -73.965830115778],
  ["Queens Hospital Center", 40.71311535449, -73.792820999789],
  ["Lincoln Medical and Mental Health Center", 40.817688484049, -73.924200271483],
  ["Harlem Hospital Center", 40.814275217502, -73.940602831291],
  ["Woodhull Medical and Mental Health Center", 40.70052661478, -73.941643858765]
]

// TODO hook up to server request
const dummy_values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

document.onreadystatechange = function () {
  var state = document.readyState;
  if (state == 'interactive') {
    var map = L.map('map').setView([40.7212, -73.8638], 11);
    var layerGroup = L.layerGroup();
    map.addLayer(layerGroup)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    document.getElementById("same-circles").addEventListener("click", () => {
      drawHospitalCirclesSameSizeRegions(map, layerGroup, dummy_values)
    })
    document.getElementById("diff-circles").addEventListener("click", () => {
      drawHospitalCirclesDifferentSizeRegions(map, layerGroup, dummy_values)
    })

    drawHospitalCirclesSameSizeRegions(map, layerGroup, dummy_values)
  }
};

function drawHospitalCirclesSameSizeRegions(map, layerGroup, values) {
  clearMap(map, layerGroup)
  const radii = Array(hospitals.length).fill(1000)
  drawHospitalCircleRegions(layerGroup, radii, values)
}

function drawHospitalCirclesDifferentSizeRegions(map, layerGroup, values) {
  clearMap(map, layerGroup)
  const radii = [
    2500, 2000, 3000, 4000,
    5000, 2000, 7000, 5000,
    1500, 1500, 3000
  ];
  drawHospitalCircleRegions(layerGroup, radii, values)
}

function drawHospitalCircleRegions(layerGroup, radii, values) {
  for (let i = 0; i < hospitals.length; i++) {
    let hospital = hospitals[i];
    let radius = radii[i]
    let value = values[i];
    let coord = [hospital[1], hospital[2]];
    layerGroup.addLayer(L.circle(coord, radius))
    drawMarker(layerGroup, coord, radius, value)
  }
}

function drawMarker(layerGroup, coord, radius, value) {
  const icon = new L.divIcon({
    className: "value-icon",
    iconSize: [25, 31],
    iconAnchor: [12, 31],
    popupAnchor: [0, -34],
    shadowSize: [31, 31],
    html: `<span class="icon-text">${value}</span>`
  })
  let marker = L.marker(coord, {
    icon
  })
  layerGroup.addLayer(marker);
}

function clearMap(map, layerGroup) {
  if (map.hasLayer(layerGroup)) {
    layerGroup.clearLayers();
  }
}
