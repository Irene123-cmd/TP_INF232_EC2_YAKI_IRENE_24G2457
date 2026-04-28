// export.js - Export des données
document.addEventListener('DOMContentLoaded', () => {
  const data = store.getAll();
  document.getElementById('csv-meta').textContent = `${data.length} enregistrements`;
  document.getElementById('json-meta').textContent = `${data.length} enregistrements`;
  
  if (data.length > 0) {
    generateSummary(data);
  }
});

function exportCSV() {
  const data = store.getAll();
  if (data.length === 0) {
    alert('Aucune donnée à exporter.');
    return;
  }
  
  // En-têtes CSV
  const headers = ['id', 'nom', 'prenom', 'sexe', 'region', 'poids', 'taille', 'imc', 
                   'ta_systolique', 'maladies', 'activite_physique', 'tabac', 'alcool'];
  
  let csv = headers.join(',') + '\n';
  
  data.forEach(row => {
    csv += headers.map(h => `"${row[h] || ''}"`).join(',') + '\n';
  });
  
  // Téléchargement
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `sante_collect_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

function exportJSON() {
  const data = store.getAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `sante_collect_export_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
}

function clearAllData() {
  if (confirm('⚠ Supprimer TOUTES les données ? Cette action est irréversible !')) {
    store.clear();
    alert('Toutes les données ont été supprimées.');
    location.reload();
  }
}

function generateSummary(data) {
  const numericFields = ['poids', 'taille', 'ta_systolique', 'ta_diastolique', 'temperature', 'freq_cardiaque'];
  const summary = numericFields.map(field => {
    const values = data.map(d => parseFloat(d[field])).filter(v => !isNaN(v));
    if (values.length === 0) return null;
    
    const mean = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)].toFixed(1);
    const min = sorted[0].toFixed(1);
    const max = sorted[sorted.length - 1].toFixed(1);
    
    return { field, mean, median, min, max, count: values.length };
  }).filter(Boolean);

  const statsContent = document.getElementById('stats-content');
  let html = '<table class="stats-table"><thead><tr><th>Variable</th><th>Moyenne</th><th>Médiane</th><th>Min</th><th>Max</th><th>n</th></tr></thead><tbody>';
  
  summary.forEach(s => {
    html += `<tr>
      <td>${s.field}</td>
      <td>${s.mean}</td>
      <td>${s.median}</td>
      <td>${s.min}</td>
      <td>${s.max}</td>
      <td>${s.count}</td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  statsContent.innerHTML = html;
}