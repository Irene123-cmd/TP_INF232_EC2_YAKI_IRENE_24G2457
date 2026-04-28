// app.js - Gestion des données et utilitaires
class DataStore {
  constructor() {
    this.storageKey = 'sante_collect_data';
  }

  getAll() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  save(record) {
    const data = this.getAll();
    record.id = Date.now();
    record.createdAt = new Date().toISOString();
    data.push(record);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    return record;
  }

  delete(id) {
    const data = this.getAll().filter(item => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  update(id, updatedRecord) {
    const data = this.getAll().map(item => 
      item.id === id ? { ...item, ...updatedRecord } : item
    );
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }

  count() {
    return this.getAll().length;
  }
}

const store = new DataStore();