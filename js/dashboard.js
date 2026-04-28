// dashboard.js - Tableau de bord interactif
document.addEventListener('DOMContentLoaded', () => {
  const data = store.getAll();
  
  if (data.length === 0) {
    document.getElementById('empty-state').style.display = 'block';
    document.getElementById('dashboard-content').style.display = 'none';
    return;
  }

  // Mise à jour des métadonnées
  document.getElementById('dash-total').textContent = `${data.length} fiches`;
  document.getElementById('dash-date').textContent = `Mise à jour : ${new Date().toLocaleDateString('fr-FR')}`;

  // KPIs
  document.getElementById('kpi-total').textContent = data.length;
  
  const imcValues = data.map(d => {
    const p = parseFloat(d.poids);
    const t = parseFloat(d.taille) / 100;
    return t > 0 ? (p / (t * t)).toFixed(1) : null;
  }).filter(Boolean);
  
  const imcAvg = (imcValues.reduce((a, b) => a + parseFloat(b), 0) / imcValues.length).toFixed(1);
  document.getElementById('kpi-imc').textContent = imcAvg;
  
  const taValues = data.map(d => parseFloat(d.ta_systolique)).filter(Boolean);
  const taAvg = (taValues.reduce((a, b) => a + b, 0) / taValues.length).toFixed(0);
  document.getElementById('kpi-tension').textContent = taAvg;
  
  const paludismeCases = data.filter(d => d.maladies?.includes('Paludisme')).length;
  const paludismePct = ((paludismeCases / data.length) * 100).toFixed(1);
  document.getElementById('kpi-paludisme').textContent = paludismePct + '%';

  // Graphiques
  createSexeChart(data);
  createRegionChart(data);
  createIMCChart(data);
  createMaladiesChart(data);
  createAgeChart(data);
  createRegressionChart(data);
  
  // Tableau de données
  populateTable(data);
});

function createSexeChart(data) {
  const ctx = document.getElementById('chart-sexe').getContext('2d');
  const m = data.filter(d => d.sexe === 'M').length;
  const f = data.filter(d => d.sexe === 'F').length;
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Masculin', 'Féminin'],
      datasets: [{
        data: [m, f],
        backgroundColor: ['#0091ff', '#ff5e7e'],
        borderColor: '#111827',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: '#e8edf5' } } }
    }
  });
}

function createRegionChart(data) {
  const ctx = document.getElementById('chart-region').getContext('2d');
  const regions = {};
  data.forEach(d => {
    regions[d.region] = (regions[d.region] || 0) + 1;
  });
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(regions),
      datasets: [{
        label: 'Patients',
        data: Object.values(regions),
        backgroundColor: '#00e5a0',
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#6b7fa3' }, grid: { color: '#1e2d45' } },
        y: { ticks: { color: '#e8edf5' } }
      }
    }
  });
}

// ... Autres fonctions de graphiques (IMC, Maladies, Âge, Régression) ...

function populateTable(data) {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = data.map((d, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${d.nom}</td>
      <td>${d.prenom}</td>
      <td>${d.age || '--'}</td>
      <td><span class="badge badge-${d.sexe === 'M' ? 'm' : 'f'}">${d.sexe}</span></td>
      <td>${d.region}</td>
      <td>${d.imc || '--'}</td>
      <td>${d.ta_systolique || '--'}</td>
      <td>${d.maladies || '--'}</td>
      <td><button class="btn-delete" onclick="deleteRecord(${d.id})">🗑</button></td>
    </tr>
  `).join('');
}

function deleteRecord(id) {
  if (confirm('Supprimer cette fiche ?')) {
    store.delete(id);
    location.reload();
  }
}