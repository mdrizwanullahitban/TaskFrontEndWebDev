// Sample data – you can replace with your city’s centers
const centers = [
  {
    name: "GHMC Dry Waste Collection Center",
    lat: 17.3850,
    lng: 78.4867,
    address: "Nampally, Hyderabad",
    materials: ["plastic", "paper", "metal", "glass"]
  },
  {
    name: "Eco Recycling Hub",
    lat: 17.4483,
    lng: 78.3915,
    address: "Madhapur, Hyderabad",
    materials: ["plastic", "ewaste"]
  },
  {
    name: "Green Recyclers",
    lat: 17.4375,
    lng: 78.4483,
    address: "Ameerpet, Hyderabad",
    materials: ["paper", "metal"]
  },
  {
    name: "Urban Glass & Plastic Center",
    lat: 17.4065,
    lng: 78.4772,
    address: "Charminar Area, Hyderabad",
    materials: ["glass", "plastic"]
  }
];


let map;
let markers = [];

function initMap() {
  // Default center – Mumbai
  map = L.map("map").setView([19.0760, 72.8777], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  renderCenters("all");
}

function renderCenters(filter) {
  // Clear previous markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const list = document.getElementById("centerList");
  list.innerHTML = "";

  centers.forEach(center => {
    const hasMaterial =
      filter === "all" || center.materials.includes(filter);

    if (!hasMaterial) return;

    const marker = L.marker([center.lat, center.lng])
      .addTo(map)
      .bindPopup(
        `<b>${center.name}</b><br>${center.address}<br>Materials: ${center.materials.join(
          ", "
        )}`
      );

    markers.push(marker);

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="center-name">${center.name}</div>
      <div>${center.address}</div>
      <div class="center-materials">Materials: ${center.materials.join(
        ", "
      )}</div>
    `;
    li.addEventListener("click", () => {
      map.setView([center.lat, center.lng], 14);
      marker.openPopup();
    });

    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();

  document.getElementById("material").addEventListener("change", e => {
    renderCenters(e.target.value);
  });

  document.getElementById("locateBtn").addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 14);
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();
      },
      () => alert("Unable to get your location")
    );
  });
});
