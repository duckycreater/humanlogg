/* ============================================
   FloodLink – Main Application Controller
   ============================================ */

// ── Module instances ──
let commandCenter, elderMode, volunteerMode, dronePanel, loraSimulator, chatbot, suppliesMode, emergencyMode, firestoreSync, authManager, donatePanel, supplyRequest, guideMode;
let floodMap = null; // global reference for map context menu callbacks
let currentMode = 'command';
let toastTimeout = null;

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  // Create module instances
  commandCenter = new CommandCenter();
  elderMode = new ElderMode();
  volunteerMode = new VolunteerMode();
  dronePanel = new DronePanel();
  loraSimulator = new LoRaSimulator();
  chatbot = new Chatbot();
  suppliesMode = new SuppliesMode();
  emergencyMode = new EmergencyMode();
  firestoreSync = new FirestoreSync();
  authManager = new AuthManager();
  donatePanel = new DonatePanel();
  supplyRequest = new SupplyRequest();
  guideMode = new GuideMode();

  // Init all
  elderMode.init();
  loraSimulator.init();
  chatbot.init();
  firestoreSync.init();
  authManager.init();
  donatePanel.init();

  // Start in Command Center
  switchMode('command');

  // Update clock
  updateClock();
  setInterval(updateClock, 1000);

  // Mode nav
  document.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === 'elder') {
        elderMode.activate();
      } else {
        switchMode(mode);
      }
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.altKey) {
      if (e.key === '1') { e.preventDefault(); switchMode('command'); }
      if (e.key === '2') { e.preventDefault(); switchMode('volunteer'); }
      if (e.key === '3') { e.preventDefault(); switchMode('drone'); }
      if (e.key === '4') { e.preventDefault(); elderMode.activate(); }
      if (e.key === '5') { e.preventDefault(); switchMode('supplies'); }
      if (e.key === '6') { e.preventDefault(); switchMode('emergency'); }
      if (e.key === '7') { e.preventDefault(); switchMode('request'); }
      if (e.key === '8') { e.preventDefault(); switchMode('guide'); }
      if (e.key === 'c') { e.preventDefault(); chatbot.toggle(); }
    }
  });
});

// ── Mode Switching ──
function switchMode(mode) {
  // Admin gating for drone and supplies
  if (authManager && !authManager.requireAdmin(mode)) return;

  currentMode = mode;

  // Update nav tabs
  document.querySelectorAll('[data-mode]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  // Switch panels
  document.querySelectorAll('.mode-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  const panel = document.getElementById(`mode-${mode}`);
  if (panel) panel.classList.add('active');

  // Init the respective module
  switch (mode) {
    case 'command':
      commandCenter.init();
      floodMap = commandCenter.map;
      loraSimulator.renderPanel();
      // Populate drone selector
      const sel = document.getElementById('drone-select');
      if (sel && sel.options.length <= 1) {
        FloodData.drones.forEach(d => {
          const opt = document.createElement('option');
          opt.value = d.id;
          opt.textContent = `${d.status === 'flying' ? '🟢' : d.status === 'low-battery' ? '🔴' : '⚪'} ${d.name} (${Math.round(d.battery)}%)`;
          sel.appendChild(opt);
        });
      }
      break;
    case 'volunteer':
      volunteerMode.init();
      break;
    case 'drone':
      dronePanel.init();
      break;
    case 'supplies':
      suppliesMode.init();
      break;
    case 'emergency':
      emergencyMode.init();
      break;
    case 'request':
      supplyRequest.init();
      break;
    case 'guide':
      guideMode.init();
      break;
  }
}

// ── Clock ──
function updateClock() {
  const el = document.getElementById('header-time');
  if (el) {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}

// ── Toast ──
function showToast(message, type = 'default') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  if (toastTimeout) clearTimeout(toastTimeout);

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-size:var(--text-sm);">${message}</span>
    <button onclick="this.parentElement.remove()" style="color:var(--text-muted); font-size:18px; padding:0 0 0 var(--space-3); cursor:pointer;">×</button>
  `;
  document.body.appendChild(toast);

  toastTimeout = setTimeout(() => {
    toast.style.animation = 'fade-in 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ── Household select callback (from map) ──
function onHouseholdSelect(household) {
  if (currentMode === 'command') {
    // Could highlight in sidebar
    showToast(`📍 ${household.name} – Điểm: ${household.score} – ${household.area}`, 'info');
  }
}
