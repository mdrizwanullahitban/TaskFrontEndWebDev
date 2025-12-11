let entries = [];
let chart;

function loadEntries() {
  const saved = localStorage.getItem("aqua_entries");
  if (saved) {
    entries = JSON.parse(saved);
  }
}

function saveEntries() {
  localStorage.setItem("aqua_entries", JSON.stringify(entries));
}

function addEntry(entry) {
  entries.push(entry);
  // keep sorted by date
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveEntries();
}

function updateSummary(entry) {
  const summary = document.getElementById("summary");
  summary.textContent = `Total usage today: ${entry.total} L (Drinking: ${entry.drinking} L, Bathing: ${entry.bathing} L, Washing: ${entry.washing} L, Other: ${entry.other} L)`;
}

function updateHistoryTable() {
  const body = document.getElementById("historyBody");
  body.innerHTML = "";

  entries.forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.date}</td>
      <td>${e.total}</td>
      <td>${e.drinking}</td>
      <td>${e.bathing}</td>
      <td>${e.washing}</td>
      <td>${e.other}</td>
    `;
    body.appendChild(tr);
  });
}

function updateChart() {
  const ctx = document.getElementById("usageChart").getContext("2d");

  const lastEntries = entries.slice(-7); // last 7
  const labels = lastEntries.map(e => e.date);
  const data = lastEntries.map(e => e.total);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Total water usage (L)",
          data
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadEntries();
  updateHistoryTable();
  updateChart();

  const form = document.getElementById("usageForm");

  // Set default date to today
  document.getElementById("dateInput").value = new Date()
    .toISOString()
    .substring(0, 10);

  form.addEventListener("submit", e => {
    e.preventDefault();

    const date = document.getElementById("dateInput").value;
    const drinking = Number(document.getElementById("drinking").value);
    const bathing = Number(document.getElementById("bathing").value);
    const washing = Number(document.getElementById("washing").value);
    const other = Number(document.getElementById("other").value);

    const total = drinking + bathing + washing + other;

    const entry = { date, drinking, bathing, washing, other, total };
    addEntry(entry);
    updateSummary(entry);
    updateHistoryTable();
    updateChart();

    alert("Entry saved!");
  });
});
