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
const same_circle_radii = Array(hospitals.length).fill(1000)
const diff_circle_radii = [
  2500, 2000, 3000, 4000,
  5000, 2000, 7000, 5000,
  1500, 1500, 3000
];
const base_r = 0.025
const bestagons = []
const squares = []
for (let i = 0; i < hospitals.length; i++) {
  let hospital = hospitals[i]
  let coord = [hospital[1], hospital[2]];
  bestagons.push(computeHexagonCoords(coord, base_r))
  squares.push(computeSquareCoords(coord, base_r))
}

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
      // TODO hook up to server request
      let values = dummy_values
      drawHospitalCirclesSameSizeRegions(map, layerGroup, values)
    })
    document.getElementById("diff-circles").addEventListener("click", () => {
      // TODO hook up to server request
      let values = dummy_values
      drawHospitalCirclesDifferentSizeRegions(map, layerGroup, values)
    })

    document.getElementById("bestagons").addEventListener("click", () => {
      // TODO hook up to server request
      let values = dummy_values
      drawPolygonRegions(map, layerGroup, bestagons, values)
    })

    document.getElementById("complicated").addEventListener("click", () => {
      // TODO hook up to server request
      let values = dummy_values
      let polygons = squares.slice(0, 6).concat(bestagons.slice(6, 11))
      drawPolygonRegions(map, layerGroup, polygons, values)
    })

    drawHospitalCirclesSameSizeRegions(map, layerGroup, dummy_values)
  }
};

function drawHospitalCirclesSameSizeRegions(map, layerGroup, values) {
  clearMap(map, layerGroup)
  const radii = same_circle_radii
  drawHospitalCircleRegions(layerGroup, radii, values)
}

function drawHospitalCirclesDifferentSizeRegions(map, layerGroup, values) {
  clearMap(map, layerGroup)
  const radii = diff_circle_radii;
  drawHospitalCircleRegions(layerGroup, radii, values)
}

function drawHospitalCircleRegions(layerGroup, radii, values) {
  for (let i = 0; i < hospitals.length; i++) {
    let hospital = hospitals[i];
    let coord = [hospital[1], hospital[2]];
    let radius = radii[i]
    let value = values[i];
    layerGroup.addLayer(L.circle(coord, radius))
    drawMarker(layerGroup, coord, value)
  }
}

function drawPolygonRegions(map, layerGroup, polygons, values) {
  clearMap(map, layerGroup)
  for (let i = 0; i < hospitals.length; i++) {
    let hospital = hospitals[i];
    let coord = [hospital[1], hospital[2]];
    let value = values[i];
    let polygon = polygons[i]
    layerGroup.addLayer(L.polygon(polygon))
    drawMarker(layerGroup, coord, value)
  }
}

function computeHexagonCoords(coords, r) {
  const sqrt3_d2 = r * Math.sqrt(3) / 2;
  let x = coords[0];
  let y = coords[1];
  let v_a = [r, 0]
  let v_b = [r / 2, sqrt3_d2]
  let v_c = [-r / 2, sqrt3_d2]
  let v_d = [-r, 0]
  let v_e = [-r / 2, -sqrt3_d2]
  let v_f = [r / 2, -sqrt3_d2]
  let result = [v_a, v_b, v_c, v_d, v_e, v_f];
  for (let i = 0; i < result.length; i++) {
    result[i][0] += x
    result[i][1] += y
  }
  return result;
}

function computeSquareCoords(coords, r) {
  let x = coords[0];
  let y = coords[1];
  let v_a = [-r, -r]
  let v_b = [-r, r]
  let v_c = [r, r]
  let v_d = [r, -r]
  let result = [v_a, v_b, v_c, v_d];
  for (let i = 0; i < result.length; i++) {
    result[i][0] += x
    result[i][1] += y
  }
  return result;
}

function drawMarker(layerGroup, coord, value) {
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
