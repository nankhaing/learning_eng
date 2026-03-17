// Global State Management
const AppState = {
  user: null,
  stats: {
    xp: 0,
    streak: 0,
    lessonsCompleted: 0
  },
  settings: {
    darkMode: false,
    language: 'en'
  },
  
  // Initialize State
  init() {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      this.user = parsed.user;
      this.stats = parsed.stats;
      this.settings = parsed.settings;
      this.applySettings();
    }
  },

  // Update User Data
  setUser(userData) {
    this.user = userData;
    this.save();
  },

  // Update Stats
  updateStats(newStats) {
    this.stats = { ...this.stats, ...newStats };
    this.save();
  },

  // Save to LocalStorage
  save() {
    localStorage.setItem('appState', JSON.stringify({
      user: this.user,
      stats: this.stats,
      settings: this.settings
    }));
  },

  // Apply Settings (Dark Mode, Language)
  applySettings() {
    if (this.settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Language logic would go here
  }
};

// Initialize on load
AppState.init();
export { AppState };

