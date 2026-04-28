// form.js - Gestion du formulaire
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('main-form');
  const progressFill = document.getElementById('progress-fill');
  const progressLabel = document.getElementById('progress-label');
  const successOverlay = document.getElementById('success-overlay');

  // Calcul IMC en temps réel
  function calculateIMC() {
    const poids = parseFloat(document.getElementById('poids').value);
    const taille = parseFloat(document.getElementById('taille').value) / 100;
    
    if (poids && taille && taille > 0) {
      const imc = (poids / (taille * taille)).toFixed(1);
      document.getElementById('imc').value = imc;
      
      // Mise à jour de l'affichage IMC
      const imcDisplay = document.getElementById('imc-display');
      const imcValue = document.getElementById('imc-value');
      const imcLabel = document.getElementById('imc-label');
      const imcIndicator = document.getElementById('imc-indicator');
      
      imcDisplay.style.display = 'block';
      imcValue.textContent = imc;
      
      let category, position;
      if (imc < 18.5) {
        category = 'Insuffisance pondérale';
        position = '15%';
      } else if (imc < 25) {
        category = 'Poids normal';
        position = '38%';
      } else if (imc < 30) {
        category = 'Surpoids';
        position = '62%';
      } else {
        category = 'Obésité';
        position = '85%';
      }
      
      imcLabel.textContent = category;
      imcIndicator.style.left = position;
    }
  }

  // Écouteurs pour le calcul IMC
  document.getElementById('poids').addEventListener('input', calculateIMC);
  document.getElementById('taille').addEventListener('input', calculateIMC);

  // Progression du formulaire
  function updateProgress() {
    const sections = document.querySelectorAll('.form-section');
    const requiredFields = form.querySelectorAll('[required]');
    const completedRequired = Array.from(requiredFields).filter(field => {
      if (field.type === 'checkbox') return field.checked;
      return field.value && field.value.trim() !== '';
    }).length;
    
    const progress = Math.round((completedRequired / requiredFields.length) * 100);
    progressFill.style.width = progress + '%';
    progressLabel.textContent = `Progression : ${progress}%`;
  }

  // Validation en temps réel
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', updateProgress);
    field.addEventListener('change', updateProgress);
  });

  // Gestion maladie "Aucune"
  const maladieAucune = document.getElementById('maladie-aucune');
  const maladieCheckboxes = document.querySelectorAll('input[name="maladies"]');
  
  maladieAucune.addEventListener('change', function() {
    if (this.checked) {
      maladieCheckboxes.forEach(cb => {
        if (cb !== this) cb.checked = false;
      });
    }
  });
  
  maladieCheckboxes.forEach(cb => {
    if (cb !== maladieAucune) {
      cb.addEventListener('change', () => {
        maladieAucune.checked = false;
      });
    }
  });

  // Section maternité conditionnelle
  const sexeSelect = document.getElementById('sexe');
  const materniteSection = document.querySelector('[data-section="5"]');
  
  sexeSelect.addEventListener('change', function() {
    materniteSection.style.display = this.value === 'F' ? 'block' : 'none';
  });

  // Soumission du formulaire
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const record = Object.fromEntries(formData.entries());
    
    // Ajouter les maladies (checkboxes multiples)
    record.maladies = Array.from(document.querySelectorAll('input[name="maladies"]:checked'))
      .map(cb => cb.value)
      .join(', ');
    
    // Ajouter les vaccins
    record.vaccins = Array.from(document.querySelectorAll('input[name="vaccins"]:checked'))
      .map(cb => cb.value)
      .join(', ');

    store.save(record);
    
    // Afficher le message de succès
    successOverlay.style.display = 'flex';
  });

  // Fermer le message de succès
  successOverlay.addEventListener('click', function(e) {
    if (e.target === this) {
      this.style.display = 'none';
      form.reset();
      progressFill.style.width = '0%';
      progressLabel.textContent = 'Progression : 0%';
    }
  });
});

// Réinitialisation du formulaire
function resetForm() {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ?')) {
    document.getElementById('main-form').reset();
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('progress-label').textContent = 'Progression : 0%';
    document.getElementById('imc-display').style.display = 'none';
  }
}