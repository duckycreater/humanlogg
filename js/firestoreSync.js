/* ============================================
   FloodLink – Firebase / Firestore Module
   Optimized: batch writes, offline persistence,
   debounced sync, error retry
   ============================================ */

class FirestoreSync {
  constructor() {
    this.db = null;
    this.connected = false;
    this.listeners = [];
    this._syncQueue = [];
    this._syncTimer = null;
    this._retryCount = 0;
    this._maxRetry = 3;
  }

  async init() {
    try {
      const firebaseConfig = {
        apiKey: "AIzaSyCJXPzLBhDZke2FR6AKokzl0gjxBOuhYbs",
        authDomain: "humanlog-c361e.firebaseapp.com",
        projectId: "humanlog-c361e",
        storageBucket: "humanlog-c361e.firebasestorage.app",
        messagingSenderId: "926659886002",
        appId: "1:926659886002:web:cd8630b2f808d48e5942ab",
        measurementId: "G-GDBXESXJHV"
      };

      if (!firebase.apps || firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
      }

      this.db = firebase.firestore();

      // Enable offline persistence (cache-first)
      try {
        await this.db.enablePersistence({ synchronizeTabs: true });
      } catch (err) {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore: Multiple tabs open, persistence limited');
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore: Persistence not supported in this browser');
        }
      }

      // Optimize: limit Firestore cache size (40MB)
      this.db.settings({ cacheSizeBytes: 40 * 1024 * 1024 });

      this.connected = true;
      this._retryCount = 0;
      this.updateStatusUI(true);
      showToast('🔥 Firestore kết nối + Offline Cache bật', 'success');

      // Start listeners (with error handling)
      this.listenMarkers();
      this.listenHealthReports();
      this.listenDroneCommands();
      this.listenDispatchLog();

      // Initial batch sync
      this.batchSyncAll();

    } catch (err) {
      console.error('Firestore init error:', err);
      this.connected = false;
      this.updateStatusUI(false);

      // Auto-retry (max 3 times)
      if (this._retryCount < this._maxRetry) {
        this._retryCount++;
        setTimeout(() => this.init(), 3000 * this._retryCount);
        showToast(`⏳ Firestore retry ${this._retryCount}/${this._maxRetry}...`, 'default');
      } else {
        showToast('⚠ Firestore offline – Dữ liệu lưu local', 'danger');
      }
    }
  }

  updateStatusUI(online) {
    const el = document.getElementById('connection-status');
    if (el) {
      el.innerHTML = online
        ? '<span style="color:var(--color-success-light);">● ONLINE</span>'
        : '<span style="color:var(--text-muted);">● OFFLINE</span>';
    }
  }

  // ══════ DEBOUNCED QUEUE (batch writes every 2s) ══════

  queueWrite(collection, docId, data) {
    this._syncQueue.push({ collection, docId, data });

    if (this._syncTimer) clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => this.flushQueue(), 2000);
  }

  async flushQueue() {
    if (!this.db || this._syncQueue.length === 0) return;

    const batch = this.db.batch();
    const items = this._syncQueue.splice(0, 500); // Firestore max 500/batch

    items.forEach(({ collection, docId, data }) => {
      const ref = this.db.collection(collection).doc(docId);
      batch.set(ref, {
        ...data,
        _lastSync: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });

    try {
      await batch.commit();
    } catch (err) {
      console.warn('Batch write error:', err);
      // Re-queue failed items
      this._syncQueue.unshift(...items);
    }
  }

  // ══════ BATCH INITIAL SYNC ══════

  async batchSyncAll() {
    if (!this.db) return;
    try {
      const batch = this.db.batch();

      // Sync drones (20 items)
      FloodData.drones.forEach(d => {
        batch.set(this.db.collection('drones').doc(d.id), {
          id: d.id, name: d.name, status: d.status,
          battery: d.battery, lat: d.lat, lng: d.lng,
          task: d.task, _lastSync: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      });

      // Sync rescue teams
      const teams = FloodData.rescueTeams;
      [...teams.volunteers, ...teams.boats, ...teams.experts].forEach(p => {
        batch.set(this.db.collection('rescueTeams').doc(p.id), {
          ...p, _lastSync: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      });

      await batch.commit();
    } catch (err) {
      console.warn('Initial sync error:', err);
    }
  }

  // ══════ MARKERS ══════

  saveMarker(marker) {
    this.queueWrite('markers', marker.id, marker);
  }

  deleteMarker(id) {
    if (!this.db) return;
    this.db.collection('markers').doc(id).delete().catch(() => {});
  }

  listenMarkers() {
    if (!this.db) return;
    const unsub = this.db.collection('markers')
      .orderBy('_lastSync', 'desc').limit(100)
      .onSnapshot({ includeMetadataChanges: false }, snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = { id: change.doc.id, ...change.doc.data() };
            if (!FloodData.markers.find(m => m.id === data.id)) {
              FloodData.markers.push(data);
            }
          }
        });
        if (floodMap) floodMap.buildUserMarkers();
      }, err => console.warn('Markers listener:', err.code));
    this.listeners.push(unsub);
  }

  // ══════ HEALTH REPORTS ══════

  saveHealthReport(report) {
    this.queueWrite('healthReports', report.id, report);
  }

  listenHealthReports() {
    if (!this.db) return;
    const unsub = this.db.collection('healthReports')
      .orderBy('_lastSync', 'desc').limit(30)
      .onSnapshot({ includeMetadataChanges: false }, snapshot => {
        if (emergencyMode && emergencyMode.healthReports) {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              const data = { id: change.doc.id, ...change.doc.data() };
              if (!emergencyMode.healthReports.find(r => r.id === data.id)) {
                emergencyMode.healthReports.push(data);
              }
            }
          });
        }
      }, err => console.warn('Health listener:', err.code));
    this.listeners.push(unsub);
  }

  // ══════ DRONE COMMANDS ══════

  saveDroneCommand(droneId, command) {
    this.queueWrite('droneCommands', droneId, { droneId, command });
  }

  saveDroneWaypoints(droneId, waypoints) {
    this.queueWrite('droneWaypoints', droneId, {
      droneId,
      waypoints: waypoints.map(w => ({ lat: w.lat, lng: w.lng }))
    });
  }

  listenDroneCommands() {
    if (!this.db) return;
    const unsub = this.db.collection('droneCommands')
      .onSnapshot({ includeMetadataChanges: false }, snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'modified' || change.type === 'added') {
            const data = change.doc.data();
            const drone = FloodData.drones.find(d => d.id === data.droneId);
            if (drone && data.command) {
              if (data.command === 'stop') {
                drone.status = 'standby'; drone.speed = 0;
                drone.task = 'Dừng bay – Lệnh Firestore';
              } else if (data.command === 'fly') {
                drone.status = 'flying'; drone.speed = 30;
                drone.task = 'Hoạt động – Lệnh Firestore';
              }
            }
          }
        });
      }, err => console.warn('DroneCmd listener:', err.code));
    this.listeners.push(unsub);
  }

  // ══════ DISPATCH LOG ══════

  saveDispatch(entry) {
    const id = `DSP-${Date.now()}`;
    FloodData.dispatchLog.push({ id, ...entry });
    this.queueWrite('dispatchLog', id, entry);
  }

  listenDispatchLog() {
    if (!this.db) return;
    const unsub = this.db.collection('dispatchLog')
      .orderBy('_lastSync', 'desc').limit(50)
      .onSnapshot({ includeMetadataChanges: false }, snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = { id: change.doc.id, ...change.doc.data() };
            if (!FloodData.dispatchLog.find(d => d.id === data.id)) {
              FloodData.dispatchLog.push(data);
            }
          }
        });
      }, err => console.warn('Dispatch listener:', err.code));
    this.listeners.push(unsub);
  }

  // ══════ DRAWINGS ══════

  saveDrawing(drawing) {
    this.queueWrite('drawings', drawing.id, drawing);
  }

  // ══════ CLEANUP ══════

  destroy() {
    this.listeners.forEach(unsub => unsub());
    this.listeners = [];
    if (this._syncTimer) clearTimeout(this._syncTimer);
  }
}
