/* ============================================
   FloodLink 2.0 – Leaflet Map Renderer
   Real OpenStreetMap + Heatmap + 20 Drones
   ============================================ */

class FloodMap {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.layers = {};
    this.droneMarkers = [];
    this.householdMarkers = [];
    this.userMarkers = [];
    this.droneLines = [];
    this.heatmapLayer = null;
    this.showHeatmap = false;
    this.showDronePaths = true;
    this.showFloodZones = true;
    this.animInterval = null;
    this.selectedHousehold = null;

    // Initialize markers array
    if (!FloodData.markers) FloodData.markers = [];
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // If map already exists, just resize and return
    if (this.map) {
      this.map.invalidateSize();
      return;
    }

    // Create Leaflet map (only once!)
    this.map = L.map(this.containerId, {
      center: [21.029, 105.851],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // Add zoom control to top-left
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // ── Tile Layers ──
    const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    });

    const satelliteTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });

    const topoTiles = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17
    });

    // Default layer
    darkTiles.addTo(this.map);

    // Layer control
    const baseLayers = {
      '🌑 Tối (Dark)': darkTiles,
      '📡 Vệ tinh': satelliteTiles,
      '🗺️ Địa hình': topoTiles
    };
    L.control.layers(baseLayers, null, { position: 'topright', collapsed: true }).addTo(this.map);

    // Attribution
    L.control.attribution({ prefix: 'FloodLink 2.0 | Leaflet | © OpenStreetMap' }).addTo(this.map);

    // ── Build all layers ──
    this.buildFloodZones();
    this.buildStation();
    this.buildCommunityPoints();
    this.buildHouseholdMarkers();
    this.buildDroneMarkers();
    this.buildHeatmap();
    this.buildUserMarkers();

    // ── Right-click for marking ──
    this.map.on('contextmenu', (e) => {
      this.showContextMenu(e.latlng, e.originalEvent);
    });

    // Close context menu on click (only if not in waypoint mode)
    this.map.on('click', () => {
      if (!this._waypointMode) this.hideContextMenu();
    });

    // Init drawing tools
    this.initDrawTools();

    // Build rescue team markers
    this.buildRescueTeamMarkers();

    // Start animation
    this.startAnimation();
  }

  // ══════════════════ RESCUE TEAMS ══════════════════

  buildRescueTeamMarkers() {
    if (!this.map || !FloodData.rescueTeams) return;
    if (this._rescueMarkers) this._rescueMarkers.forEach(m => this.map.removeLayer(m));
    this._rescueMarkers = [];

    const teams = FloodData.rescueTeams;

    // Volunteers
    teams.volunteers.forEach(v => {
      const color = v.status === 'dispatched' ? '#ef4444' : v.status === 'active' ? '#10b981' : '#64748b';
      const icon = L.divIcon({
        className: 'rescue-marker',
        html: `<div style="position:relative; text-align:center;">
          <div style="width:30px; height:30px; border-radius:50%; background:${color};
            border:2px solid rgba(255,255,255,0.5); display:flex; align-items:center; justify-content:center;
            font-size:14px; box-shadow:0 0 12px ${color}60;">👤</div>
          <div style="font-size:8px; color:white; font-weight:bold; text-shadow:0 1px 3px rgba(0,0,0,0.8);
            white-space:nowrap; margin-top:1px;">${v.name.split(' ').pop()}</div>
        </div>`,
        iconSize: [30, 36], iconAnchor: [15, 18]
      });

      const equipment = v.equipment || ['Áo phao', 'Bộ đàm', 'Đèn pin'];
      const m = L.marker([v.lat, v.lng], { icon })
        .bindPopup(`<div style="font-size:12px; min-width:180px;">
          <div style="font-weight:bold; font-size:14px; color:${color};">👤 ${v.name}</div>
          <div style="margin:4px 0; padding:3px 8px; background:${color}20; border-radius:4px; font-size:11px; display:inline-block;">${v.role}</div>
          <div style="margin-top:6px; display:grid; gap:3px;">
            <div>📋 ${v.task}</div>
            <div>📞 ${v.phone}</div>
            <div>🎒 ${equipment.join(', ')}</div>
          </div>
        </div>`, { maxWidth: 250 })
        .addTo(this.map);
      this._rescueMarkers.push(m);
    });

    // Boats
    teams.boats.forEach(b => {
      const color = b.status === 'dispatched' ? '#ef4444' : b.status === 'active' ? '#3b82f6' : '#64748b';
      const icon = L.divIcon({
        className: 'rescue-marker',
        html: `<div style="position:relative; text-align:center;">
          <div style="width:34px; height:34px; border-radius:8px; background:${color};
            border:2px solid rgba(255,255,255,0.5); display:flex; align-items:center; justify-content:center;
            font-size:16px; box-shadow:0 0 14px ${color}60;
            ${b.status === 'dispatched' ? 'animation:pulse-scale 1.5s infinite;' : ''}">${b.icon}</div>
          <div style="font-size:8px; color:white; font-weight:bold; text-shadow:0 1px 3px rgba(0,0,0,0.8);
            white-space:nowrap; margin-top:1px;">${b.name.replace('Thuyền ', '')}</div>
        </div>`,
        iconSize: [34, 40], iconAnchor: [17, 20]
      });

      const m = L.marker([b.lat, b.lng], { icon })
        .bindPopup(`<div style="font-size:12px; min-width:180px;">
          <div style="font-weight:bold; font-size:14px; color:${color};">${b.icon} ${b.name}</div>
          <div style="margin:4px 0;"><span style="padding:2px 8px; background:${color}20; border-radius:4px; font-size:11px;">
            ${b.type === 'rescue' ? '🚨 Cứu hộ' : '📦 Viện trợ'}</span></div>
          <div style="display:grid; gap:3px; margin-top:6px;">
            <div>📋 ${b.task}</div>
            <div>👥 Thủy thủ: ${b.crew} người</div>
            <div>📦 Tải: ${b.capacity} ${b.type === 'rescue' ? 'người' : 'túi'}</div>
          </div>
        </div>`, { maxWidth: 250 })
        .addTo(this.map);
      this._rescueMarkers.push(m);
    });

    // Experts
    teams.experts.forEach(e => {
      const color = e.status === 'dispatched' ? '#ef4444' : '#f59e0b';
      const icon = L.divIcon({
        className: 'rescue-marker',
        html: `<div style="position:relative; text-align:center;">
          <div style="width:30px; height:30px; border-radius:50%; background:${color};
            border:2px solid rgba(255,255,255,0.5); display:flex; align-items:center; justify-content:center;
            font-size:14px; box-shadow:0 0 12px ${color}60;
            ${e.status === 'dispatched' ? 'animation:pulse-scale 1.5s infinite;' : ''}">⚕️</div>
          <div style="font-size:8px; color:white; font-weight:bold; text-shadow:0 1px 3px rgba(0,0,0,0.8);
            white-space:nowrap; margin-top:1px;">${e.name.split(' ').pop()}</div>
        </div>`,
        iconSize: [30, 36], iconAnchor: [15, 18]
      });

      const m = L.marker([e.lat, e.lng], { icon })
        .bindPopup(`<div style="font-size:12px; min-width:180px;">
          <div style="font-weight:bold; font-size:14px; color:${color};">⚕️ ${e.name}</div>
          <div style="margin:4px 0; padding:3px 8px; background:${color}20; border-radius:4px; font-size:11px; display:inline-block;">${e.role}</div>
          <div style="margin-top:6px; display:grid; gap:3px;">
            <div>📋 ${e.task}</div>
            <div>📞 ${e.phone}</div>
          </div>
        </div>`, { maxWidth: 250 })
        .addTo(this.map);
      this._rescueMarkers.push(m);
    });
  }

  // ══════════════════ FLOOD ZONES ══════════════════

  buildFloodZones() {
    const floodZones = [
      { center: [21.032, 105.846], radius: 400, level: 'high', label: 'Vùng ngập sâu A' },
      { center: [21.027, 105.855], radius: 350, level: 'high', label: 'Vùng ngập sâu B' },
      { center: [21.024, 105.848], radius: 300, level: 'medium', label: 'Vùng ngập TB C' },
      { center: [21.035, 105.852], radius: 250, level: 'medium', label: 'Vùng ngập TB D' },
      { center: [21.022, 105.860], radius: 280, level: 'high', label: 'Vùng ngập sâu E' },
      { center: [21.037, 105.843], radius: 320, level: 'low', label: 'Vùng ngập nhẹ F' },
      { center: [21.030, 105.840], radius: 200, level: 'medium', label: 'Vùng ngập TB G' }
    ];

    const colors = { high: '#ef4444', medium: '#f59e0b', low: '#3b82f6' };
    const opacities = { high: 0.2, medium: 0.12, low: 0.08 };

    this.layers.floodZones = L.layerGroup();

    floodZones.forEach(zone => {
      L.circle(zone.center, {
        radius: zone.radius,
        color: colors[zone.level],
        fillColor: colors[zone.level],
        fillOpacity: opacities[zone.level],
        weight: 1,
        opacity: 0.4,
        dashArray: '5, 8'
      }).bindTooltip(zone.label, { permanent: false, className: 'flood-tooltip' })
        .addTo(this.layers.floodZones);
    });

    this.layers.floodZones.addTo(this.map);
  }

  // ══════════════════ STATION ══════════════════

  buildStation() {
    const stationIcon = L.divIcon({
      className: 'station-marker',
      html: `<div style="
        width:44px; height:44px; border-radius:50%; 
        background:linear-gradient(135deg, #06d6a0, #00b4d8);
        display:flex; align-items:center; justify-content:center;
        box-shadow: 0 0 20px rgba(6,214,160,0.5), 0 0 40px rgba(6,214,160,0.2);
        border: 3px solid rgba(255,255,255,0.3);
        font-size:22px; animation: pulse-scale 2s infinite;
      ">⚓</div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    L.marker([21.029, 105.851], { icon: stationIcon })
      .bindTooltip('🚢 Thuyền Trạm #01 – Trạm chỉ huy chính', { offset: [0, -28], className: 'station-tooltip' })
      .addTo(this.map);
  }

  // ══════════════════ COMMUNITY POINTS ══════════════════

  buildCommunityPoints() {
    const positions = [
      [21.035, 105.843], [21.027, 105.858], [21.022, 105.845],
      [21.038, 105.855], [21.020, 105.852], [21.033, 105.862], [21.025, 105.840]
    ];

    FloodData.communityPoints.forEach((cp, i) => {
      const colors = { active: '#3b82f6', completed: '#10b981', pending: '#64748b', urgent: '#ef4444' };
      const color = colors[cp.status] || '#3b82f6';

      const icon = L.divIcon({
        className: 'cp-marker',
        html: `<div style="
          width:28px; height:28px; border-radius:50%;
          background:${color}; border:2px solid rgba(255,255,255,0.4);
          display:flex; align-items:center; justify-content:center;
          font-size:12px; box-shadow:0 0 12px ${color}80;
        ">📍</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker(positions[i], { icon })
        .bindPopup(`
          <div style="font-size:13px;">
            <strong>${cp.name}</strong><br>
            📍 ${cp.area}<br>
            👤 TNV: ${cp.volunteer}<br>
            🏠 ${cp.distributed}/${cp.households} hộ<br>
            <span style="color:${color}; font-weight:bold;">${cp.status.toUpperCase()}</span>
          </div>
        `)
        .addTo(this.map);
    });
  }

  // ══════════════════ HOUSEHOLDS ══════════════════

  buildHouseholdMarkers() {
    this.householdMarkers.forEach(m => this.map.removeLayer(m));
    this.householdMarkers = [];

    FloodData.households.forEach(h => {
      const color = h.score >= 80 ? '#ef4444' : h.score >= 60 ? '#f59e0b' : h.score >= 40 ? '#eab308' : '#10b981';
      const radius = h.score >= 80 ? 10 : h.score >= 60 ? 8 : 6;
      const pulse = h.score >= 80 ? 'animation: pulse-scale 1.5s infinite;' : '';

      const icon = L.divIcon({
        className: 'household-marker',
        html: `<div style="
          width:${radius * 2}px; height:${radius * 2}px; border-radius:50%;
          background:${color}; border:2px solid rgba(255,255,255,0.4);
          box-shadow: 0 0 ${h.score >= 80 ? 16 : 8}px ${color}80;
          ${pulse}
        "></div>`,
        iconSize: [radius * 2, radius * 2],
        iconAnchor: [radius, radius]
      });

      const statusEmoji = h.status === 'delivered' ? '✅' : h.status === 'in-transit' ? '🚢' : '⏳';
      const vulnIcons = [h.hasElder ? '👴' : '', h.hasChild ? '👶' : '', h.hasDisabled ? '♿' : ''].filter(Boolean).join(' ');

      const marker = L.marker([h.lat, h.lng], { icon })
        .bindPopup(`
          <div style="font-size:12px; min-width:200px;">
            <div style="font-weight:bold; font-size:14px; margin-bottom:4px;">${h.name}</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-bottom:6px;">
              <div>📊 Điểm: <strong style="color:${color};">${h.score}</strong></div>
              <div>👥 ${h.people} người ${vulnIcons}</div>
              <div>🌊 Ngập: <strong>${h.floodLevel}m</strong></div>
              <div>📍 ${h.area}</div>
            </div>
            <div>${statusEmoji} ${h.status === 'delivered' ? 'Đã giao' : h.status === 'in-transit' ? 'Đang vận chuyển' : 'Chờ cứu trợ'}</div>
            <div style="margin-top:4px; font-size:11px; color:#999;">Cần: ${h.needs.join(', ')}</div>
            <div style="font-size:10px; color:#666; margin-top:2px;">Liên lạc: ${h.lastContact}</div>
          </div>
        `, { maxWidth: 280 })
        .on('click', () => {
          this.selectedHousehold = h;
          if (typeof onHouseholdSelect === 'function') onHouseholdSelect(h);
        })
        .addTo(this.map);

      this.householdMarkers.push(marker);
    });
  }

  // ══════════════════ DRONES (20) ══════════════════

  buildDroneMarkers() {
    this.droneMarkers.forEach(m => this.map.removeLayer(m));
    this.droneLines.forEach(l => this.map.removeLayer(l));
    this.droneMarkers = [];
    this.droneLines = [];

    const stationPos = [21.029, 105.851];

    FloodData.drones.forEach(drone => {
      if (drone.status === 'standby') return;

      const isLowBattery = drone.status === 'low-battery';
      const color = isLowBattery ? '#ef4444' : '#3b82f6';

      // Drone icon
      const icon = L.divIcon({
        className: 'drone-marker-icon',
        html: `<div style="position:relative;">
          <div style="
            width:32px; height:32px; border-radius:8px;
            background:${color}; transform:rotate(45deg);
            display:flex; align-items:center; justify-content:center;
            box-shadow: 0 0 20px ${color}80, inset 0 0 8px rgba(255,255,255,0.2);
            border:2px solid rgba(255,255,255,0.4);
            ${isLowBattery ? 'animation: pulse-scale 1s infinite;' : ''}
          ">
            <span style="transform:rotate(-45deg); font-size:14px;">✈</span>
          </div>
          <div style="
            position:absolute; top:-20px; left:50%; transform:translateX(-50%);
            font-size:10px; font-weight:bold; color:white;
            text-shadow:0 1px 4px rgba(0,0,0,0.8); white-space:nowrap;
          ">${drone.id.replace('DRN-', '#')}</div>
          <div style="
            position:absolute; bottom:-16px; left:50%; transform:translateX(-50%);
            font-size:9px; font-weight:bold; font-family:monospace;
            color:${drone.battery < 20 ? '#ef4444' : drone.battery < 50 ? '#f59e0b' : '#10b981'};
            text-shadow:0 1px 3px rgba(0,0,0,0.8); white-space:nowrap;
          ">🔋${Math.round(drone.battery)}%</div>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([drone.lat, drone.lng], { icon, zIndexOffset: 1000 })
        .bindPopup(`
          <div style="font-size:12px; min-width:200px;">
            <div style="font-weight:bold; font-size:14px; color:${color};">✈ ${drone.name}</div>
            <div style="margin:6px 0;">
              <span style="display:inline-block; padding:2px 8px; background:${color}20; color:${color}; border-radius:4px; font-size:11px; font-weight:bold;">
                ${drone.status === 'flying' ? '🟢 ĐANG BAY' : '🔴 PIN YẾU'}
              </span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px;">
              <div>🔋 Pin: <strong>${drone.battery}%</strong></div>
              <div>📏 Cao: <strong>${drone.altitude}m</strong></div>
              <div>💨 Tốc: <strong>${drone.speed} km/h</strong></div>
              <div>🕐 Bay: <strong>${drone.flightTime}</strong></div>
              <div>📍 ${drone.distanceCovered}</div>
              <div>🌡 ${drone.thermalScans} quét</div>
            </div>
            <div style="margin-top:6px; padding-top:6px; border-top:1px solid #333; font-size:11px;">
              📋 ${drone.task}
            </div>
          </div>
        `, { maxWidth: 280 })
        .addTo(this.map);

      this.droneMarkers.push(marker);

      // Drone path line
      if (this.showDronePaths && drone.status === 'flying') {
        const line = L.polyline([stationPos, [drone.lat, drone.lng]], {
          color: color,
          weight: 1.5,
          opacity: 0.4,
          dashArray: '6, 8'
        }).addTo(this.map);
        this.droneLines.push(line);
      }
    });
  }

  // ══════════════════ HEATMAP ══════════════════

  buildHeatmap() {
    // Population density heatmap data
    const heatData = FloodData.households.map(h => [h.lat, h.lng, h.score / 100]);

    // Add extra density points for populated areas
    const densityPoints = [
      [21.032, 105.846, 0.9], [21.033, 105.847, 0.8], [21.031, 105.845, 0.7],
      [21.027, 105.855, 0.85], [21.028, 105.856, 0.75], [21.026, 105.854, 0.65],
      [21.024, 105.848, 0.7], [21.023, 105.849, 0.6],
      [21.035, 105.852, 0.6], [21.036, 105.853, 0.5],
      [21.022, 105.860, 0.8], [21.021, 105.859, 0.7],
      [21.038, 105.843, 0.5], [21.037, 105.842, 0.4],
      [21.030, 105.840, 0.55], [21.029, 105.841, 0.45]
    ];

    const allData = [...heatData, ...densityPoints];

    if (typeof L.heatLayer !== 'undefined') {
      this.heatmapLayer = L.heatLayer(allData, {
        radius: 35,
        blur: 25,
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.2: '#0000ff',
          0.4: '#00ffff',
          0.6: '#00ff00',
          0.8: '#ffff00',
          1.0: '#ff0000'
        }
      });

      if (this.showHeatmap) {
        this.heatmapLayer.addTo(this.map);
      }
    }
  }

  // ══════════════════ USER MARKERS ══════════════════

  buildUserMarkers() {
    this.userMarkers.forEach(m => this.map.removeLayer(m));
    this.userMarkers = [];

    const markerConfig = {
      sos:     { icon: '🆘', color: '#ef4444', label: 'SOS' },
      danger:  { icon: '⚠️', color: '#f59e0b', label: 'Nguy hiểm' },
      safe:    { icon: '✅', color: '#10b981', label: 'An toàn' },
      supply:  { icon: '📦', color: '#3b82f6', label: 'Phân phối' }
    };

    FloodData.markers.forEach(m => {
      const config = markerConfig[m.type] || markerConfig.sos;

      const icon = L.divIcon({
        className: 'user-marker',
        html: `<div style="
          position:relative; text-align:center;
        ">
          <div style="
            width:36px; height:36px; border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            background:${config.color};
            display:flex; align-items:center; justify-content:center;
            box-shadow:0 4px 14px ${config.color}60;
            border:2px solid rgba(255,255,255,0.5);
            animation: pulse-scale 2s infinite;
          ">
            <span style="transform:rotate(45deg); font-size:16px;">${config.icon}</span>
          </div>
          <div style="
            font-size:9px; color:white; font-weight:bold;
            text-shadow:0 1px 3px rgba(0,0,0,0.8);
            margin-top:2px;
          ">${m.label}</div>
        </div>`,
        iconSize: [36, 44],
        iconAnchor: [18, 40]
      });

      const marker = L.marker([m.lat, m.lng], { icon })
        .bindPopup(`
          <div style="font-size:12px;">
            <strong>${config.icon} ${m.label}</strong><br>
            📍 ${m.lat.toFixed(4)}, ${m.lng.toFixed(4)}<br>
            🕐 ${m.time}
          </div>
        `)
        .addTo(this.map);

      this.userMarkers.push(marker);
    });
  }

  // ══════════════════ ANIMATION ══════════════════

  startAnimation() {
    if (this.animInterval) clearInterval(this.animInterval);

    this.animInterval = setInterval(() => {
      // Simulate drone movement
      FloodData.drones.forEach(drone => {
        if (drone.status === 'flying') {
          drone.lat += (Math.random() - 0.5) * 0.0003;
          drone.lng += (Math.random() - 0.5) * 0.0003;
          drone.battery = Math.max(0, drone.battery - 0.02);
          if (drone.battery < 15 && drone.status !== 'low-battery') {
            drone.status = 'low-battery';
          }
        }
      });

      this.buildDroneMarkers();
    }, 5000);
  }

  // ══════════════════ CONTEXT MENU ══════════════════

  showContextMenu(latlng, event) {
    this.hideContextMenu();
    this._contextLatlng = latlng;

    const menu = document.createElement('div');
    menu.className = 'map-context-menu';
    menu.id = 'map-context-menu';
    menu.style.position = 'fixed';
    menu.style.left = event.clientX + 'px';
    menu.style.top = event.clientY + 'px';

    menu.innerHTML = `
      <div class="map-context-menu-title">📍 Đánh dấu vị trí</div>
      <div class="map-context-menu-item" onclick="floodMap.addMarker('sos')">
        <span>🆘</span> <span>Điểm SOS</span>
      </div>
      <div class="map-context-menu-item" onclick="floodMap.addMarker('danger')">
        <span>⚠️</span> <span>Vùng nguy hiểm</span>
      </div>
      <div class="map-context-menu-item" onclick="floodMap.addMarker('safe')">
        <span>✅</span> <span>Điểm an toàn</span>
      </div>
      <div class="map-context-menu-item" onclick="floodMap.addMarker('supply')">
        <span>📦</span> <span>Điểm phân phối</span>
      </div>
      <div style="height:1px; background:var(--border-secondary); margin:var(--space-1) 0;"></div>
      <div class="map-context-menu-item" style="font-size:var(--text-xs); color:var(--text-muted);" onclick="floodMap.hideContextMenu()">
        <span>✕</span> <span>Hủy</span>
      </div>
    `;

    document.body.appendChild(menu);

    setTimeout(() => {
      const handler = (e) => {
        if (!menu.contains(e.target)) {
          this.hideContextMenu();
          document.removeEventListener('click', handler);
        }
      };
      document.addEventListener('click', handler);
    }, 100);
  }

  hideContextMenu() {
    const menu = document.getElementById('map-context-menu');
    if (menu) menu.remove();
  }

  addMarker(type) {
    if (!this._contextLatlng) return;
    const labels = { sos: 'SOS', danger: 'Nguy hiểm', safe: 'An toàn', supply: 'Phân phối' };

    const marker = {
      id: `MK-${Date.now()}`,
      type, label: labels[type],
      lat: this._contextLatlng.lat,
      lng: this._contextLatlng.lng,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      note: ''
    };

    FloodData.markers.push(marker);
    this.hideContextMenu();
    this.buildUserMarkers();
    showToast(`📍 Đã đánh dấu ${labels[type]} tại (${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)})`, type === 'sos' ? 'danger' : 'success');
    this.renderMarkersPanel();
  }

  removeMarker(id) {
    FloodData.markers = FloodData.markers.filter(m => m.id !== id);
    this.buildUserMarkers();
    this.renderMarkersPanel();
    showToast('🗑️ Đã xóa điểm đánh dấu', 'default');
  }

  // ══════════════════ TOGGLES ══════════════════

  toggleThermal() {
    this.showHeatmap = !this.showHeatmap;
    if (this.heatmapLayer) {
      if (this.showHeatmap) {
        this.heatmapLayer.addTo(this.map);
      } else {
        this.map.removeLayer(this.heatmapLayer);
      }
    }
    return this.showHeatmap;
  }

  toggleFloodZones() {
    this.showFloodZones = !this.showFloodZones;
    if (this.layers.floodZones) {
      if (this.showFloodZones) {
        this.layers.floodZones.addTo(this.map);
      } else {
        this.map.removeLayer(this.layers.floodZones);
      }
    }
    return this.showFloodZones;
  }

  toggleDronePaths() {
    this.showDronePaths = !this.showDronePaths;
    this.buildDroneMarkers();
    return this.showDronePaths;
  }

  toggleMarkersPanel() {
    const panel = document.getElementById('markers-panel');
    if (panel) {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) this.renderMarkersPanel();
    }
  }

  renderMarkersPanel() {
    const panel = document.getElementById('markers-panel-list');
    if (!panel) return;

    const icons = { sos: '🆘', danger: '⚠️', safe: '✅', supply: '📦' };

    if (FloodData.markers.length === 0) {
      panel.innerHTML = '<div style="padding:var(--space-4); text-align:center; font-size:var(--text-xs); color:var(--text-muted);">Chưa có điểm đánh dấu.<br>Click chuột phải trên bản đồ để thêm.</div>';
      return;
    }

    panel.innerHTML = FloodData.markers.map(m => `
      <div class="marker-item">
        <span class="marker-item-icon">${icons[m.type] || '📍'}</span>
        <div class="marker-item-info">
          <div class="marker-item-label">${m.label}</div>
          <div class="marker-item-coords">${m.lat.toFixed(4)}, ${m.lng.toFixed(4)} • ${m.time}</div>
        </div>
        <button class="marker-item-delete" onclick="floodMap.removeMarker('${m.id}')" title="Xóa">✕</button>
      </div>
    `).join('');
  }

  // ══════════════════ DRONE FLIGHT CONTROL ══════════════════

  selectDrone(droneId) {
    this._selectedDrone = FloodData.drones.find(d => d.id === droneId);
    if (!this._selectedDrone) return;

    // Init waypoints array if needed
    if (!this._selectedDrone.waypoints) this._selectedDrone.waypoints = [];

    showToast(`✈ Đã chọn ${this._selectedDrone.name} – Click bản đồ để đặt điểm đến`, 'info');

    // Enter waypoint mode
    this._waypointMode = true;
    if (this.map) {
      this.map.getContainer().style.cursor = 'crosshair';
      this.map.once('click', (e) => this.addDroneWaypoint(e.latlng));
    }
  }

  addDroneWaypoint(latlng) {
    if (!this._selectedDrone) return;
    if (!this._selectedDrone.waypoints) this._selectedDrone.waypoints = [];

    this._selectedDrone.waypoints.push({ lat: latlng.lat, lng: latlng.lng });

    // Draw waypoint marker
    const wpIcon = L.divIcon({
      className: 'waypoint-icon',
      html: `<div style="
        width:18px; height:18px; border-radius:50%;
        background:#8b5cf6; border:2px solid rgba(255,255,255,0.6);
        display:flex; align-items:center; justify-content:center;
        font-size:10px; color:white; font-weight:bold;
        box-shadow:0 0 12px rgba(139,92,246,0.5);
      ">${this._selectedDrone.waypoints.length}</div>`,
      iconSize: [18, 18], iconAnchor: [9, 9]
    });

    const marker = L.marker(latlng, { icon: wpIcon }).addTo(this.map);
    if (!this._waypointMarkers) this._waypointMarkers = [];
    this._waypointMarkers.push(marker);

    // Draw path line
    if (this._selectedDrone.waypoints.length > 1) {
      const pts = this._selectedDrone.waypoints.map(w => [w.lat, w.lng]);
      if (this._waypointLine) this.map.removeLayer(this._waypointLine);
      this._waypointLine = L.polyline(pts, {
        color: '#8b5cf6', weight: 3, opacity: 0.8, dashArray: '8, 6'
      }).addTo(this.map);
    }

    // Also draw line from drone position to first waypoint
    if (this._selectedDrone.waypoints.length === 1) {
      const dronePos = [this._selectedDrone.lat, this._selectedDrone.lng];
      this._waypointLine = L.polyline([dronePos, [latlng.lat, latlng.lng]], {
        color: '#8b5cf6', weight: 3, opacity: 0.8, dashArray: '8, 6'
      }).addTo(this.map);
    }

    showToast(`📍 Waypoint #${this._selectedDrone.waypoints.length} – (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`, 'info');

    // Sync to Firestore
    if (typeof firestoreSync !== 'undefined' && firestoreSync.connected) {
      firestoreSync.saveDroneWaypoints(this._selectedDrone.id, this._selectedDrone.waypoints);
    }

    // Continue waypoint mode
    this.map.once('click', (e) => this.addDroneWaypoint(e.latlng));
  }

  finishWaypoints() {
    this._waypointMode = false;
    if (this.map) this.map.getContainer().style.cursor = '';
    this.map.off('click');

    if (this._selectedDrone && this._selectedDrone.waypoints && this._selectedDrone.waypoints.length > 0) {
      this._selectedDrone.autoFly = true;
      this._selectedDrone._wpIndex = 0;
      this._selectedDrone.task = `🗺 Bay theo ${this._selectedDrone.waypoints.length} điểm – Tự động`;
      showToast(`✈ ${this._selectedDrone.name} – Bắt đầu bay tự động (${this._selectedDrone.waypoints.length} waypoints)`, 'success');

      if (typeof firestoreSync !== 'undefined' && firestoreSync.connected) {
        firestoreSync.saveDroneCommand(this._selectedDrone.id, 'auto');
      }
    }
  }

  clearWaypoints() {
    if (this._waypointMarkers) {
      this._waypointMarkers.forEach(m => this.map.removeLayer(m));
      this._waypointMarkers = [];
    }
    if (this._waypointLine) {
      this.map.removeLayer(this._waypointLine);
      this._waypointLine = null;
    }
    if (this._selectedDrone) {
      this._selectedDrone.waypoints = [];
      this._selectedDrone.autoFly = false;
      this._selectedDrone._wpIndex = 0;
    }
    this._waypointMode = false;
    if (this.map) this.map.getContainer().style.cursor = '';
    this.map.off('click');
  }

  toggleDroneAutoFly(droneId) {
    const drone = FloodData.drones.find(d => d.id === droneId);
    if (!drone) return;

    if (drone.status === 'flying') {
      drone.status = 'standby';
      drone.speed = 0;
      drone.altitude = 0;
      drone.task = '⏸ Dừng bay – Lệnh thủ công';
      showToast(`⏸ ${drone.name} đã dừng bay`, 'default');

      if (typeof firestoreSync !== 'undefined' && firestoreSync.connected) {
        firestoreSync.saveDroneCommand(droneId, 'stop');
      }
    } else {
      drone.status = 'flying';
      drone.speed = 30;
      drone.altitude = 100;
      drone.task = '▶ Tiếp tục bay – Lệnh thủ công';
      showToast(`▶ ${drone.name} tiếp tục bay`, 'success');

      if (typeof firestoreSync !== 'undefined' && firestoreSync.connected) {
        firestoreSync.saveDroneCommand(droneId, 'fly');
      }
    }

    this.buildDroneMarkers();
  }

  // ══════════════════ DRAWING TOOLS ══════════════════

  initDrawTools() {
    if (!this.map || this._drawInitialized) return;
    this._drawInitialized = true;

    // Create a feature group for drawn items
    this._drawnItems = new L.FeatureGroup();
    this.map.addLayer(this._drawnItems);

    // Create draw control
    if (typeof L.Control.Draw !== 'undefined') {
      this._drawControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
          polyline: { shapeOptions: { color: '#f59e0b', weight: 3 } },
          polygon: { shapeOptions: { color: '#3b82f6', fillOpacity: 0.15 } },
          circle: { shapeOptions: { color: '#ef4444', fillOpacity: 0.1 } },
          rectangle: { shapeOptions: { color: '#10b981', fillOpacity: 0.1 } },
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: this._drawnItems,
          remove: true
        }
      });
      this.map.addControl(this._drawControl);

      // Handle draw events
      this.map.on(L.Draw.Event.CREATED, (e) => {
        this._drawnItems.addLayer(e.layer);

        // Sync to Firestore
        const drawing = {
          id: `DRW-${Date.now()}`,
          type: e.layerType,
          latlngs: e.layer.getLatLngs ? JSON.stringify(e.layer.getLatLngs()) : null,
          center: e.layer.getLatLng ? { lat: e.layer.getLatLng().lat, lng: e.layer.getLatLng().lng } : null,
          radius: e.layer.getRadius ? e.layer.getRadius() : null
        };
        if (typeof firestoreSync !== 'undefined' && firestoreSync.connected) {
          firestoreSync.saveDrawing(drawing);
        }

        showToast(`🖊 Đã vẽ ${e.layerType} trên bản đồ`, 'success');
      });
    }
  }

  // ══════════════════ 3D TILT MODE ══════════════════

  toggle3D() {
    const container = document.getElementById(this.containerId);
    if (!container) return false;

    this._is3D = !this._is3D;

    if (this._is3D) {
      container.style.perspective = '1200px';
      container.style.perspectiveOrigin = '50% 50%';
      container.querySelector('.leaflet-map-pane').style.transform = 'rotateX(45deg) scale(1.2)';
      container.querySelector('.leaflet-map-pane').style.transformOrigin = '50% 100%';
      container.querySelector('.leaflet-map-pane').style.transition = 'transform 0.6s ease';
    } else {
      container.querySelector('.leaflet-map-pane').style.transform = '';
      container.querySelector('.leaflet-map-pane').style.transition = 'transform 0.6s ease';
      setTimeout(() => {
        container.style.perspective = '';
        container.style.perspectiveOrigin = '';
      }, 600);
    }

    return this._is3D;
  }

  // ══════════════════ LIFECYCLE ══════════════════

  start() { /* map auto-renders */ }

  stop() {
    if (this.animInterval) clearInterval(this.animInterval);
  }

  resize() {
    if (this.map) this.map.invalidateSize();
  }
}
