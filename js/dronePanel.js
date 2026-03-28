/* ============================================
   FloodLink 2.0 – Drone Dashboard
   ============================================ */

class DronePanel {
  constructor() {
    this.animInterval = null;
  }

  init() {
    this.render();
    this.startAnimation();
  }

  render() {
    const panel = document.getElementById('drone-panel');
    if (!panel) return;

    const activeDrones = FloodData.drones.filter(d => d.status === 'flying').length;
    const totalScans = FloodData.drones.reduce((sum, d) => sum + d.thermalScans, 0);
    const totalDist = FloodData.drones.reduce((sum, d) => sum + parseFloat(d.distanceCovered), 0).toFixed(1);
    const avgBattery = Math.round(FloodData.drones.reduce((sum, d) => sum + d.battery, 0) / FloodData.drones.length);

    panel.innerHTML = `
      <div class="drone-layout">
        <!-- Stats Row -->
        <div class="drone-stats-row">
          <div class="card card-glass animate-fade-up">
            <div class="stat">
              <span class="stat-label">Đang bay</span>
              <span class="stat-value text-blue">${activeDrones}</span>
              <span class="stat-change">/ ${FloodData.drones.length} máy</span>
            </div>
          </div>
          <div class="card card-glass animate-fade-up" style="animation-delay:0.05s">
            <div class="stat">
              <span class="stat-label">Quét nhiệt</span>
              <span class="stat-value text-green">${totalScans}</span>
              <span class="stat-change">lượt quét</span>
            </div>
          </div>
          <div class="card card-glass animate-fade-up" style="animation-delay:0.1s">
            <div class="stat">
              <span class="stat-label">Quãng đường</span>
              <span class="stat-value text-yellow">${totalDist}</span>
              <span class="stat-change">km tổng</span>
            </div>
          </div>
          <div class="card card-glass animate-fade-up" style="animation-delay:0.15s">
            <div class="stat">
              <span class="stat-label">Pin trung bình</span>
              <span class="stat-value" style="color:${avgBattery < 30 ? 'var(--color-danger-light)' : avgBattery < 60 ? 'var(--color-warning-light)' : 'var(--color-success-light)'}">${avgBattery}%</span>
              <span class="stat-change">${avgBattery < 30 ? '⚠ Cần sạc' : 'Bình thường'}</span>
            </div>
          </div>
        </div>

        <!-- Drone Detail Cards -->
        <div class="drone-grid">
          ${FloodData.drones.map(d => this.renderDroneCard(d)).join('')}
        </div>

        <!-- Hot-swap Alerts -->
        <div style="grid-column:1/-1;">
          ${this.renderHotSwapAlerts()}
        </div>
      </div>
    `;
  }

  renderDroneCard(d) {
    const isAlert = d.battery < 20;
    const batteryColor = d.battery < 20 ? 'var(--color-danger)' : d.battery < 50 ? 'var(--color-warning)' : 'var(--color-success)';
    const statusLabel = d.status === 'flying' ? '🟢 Đang bay' :
                        d.status === 'low-battery' ? '🔴 Pin yếu' :
                        '⚪ Chờ lệnh';

    return `
      <div class="drone-detail-card ${isAlert ? 'animate-glow-red' : ''}" style="animation-delay:0">
        <div class="drone-detail-header">
          <div style="display:flex; align-items:center; gap:var(--space-3);">
            <div class="animate-drone" style="display:flex; align-items:center;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${isAlert ? '#ef4444' : '#3b82f6'}" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div style="font-weight:var(--font-bold);">${d.name}</div>
              <div style="font-size:var(--text-xs); color:var(--text-muted);">${d.id}</div>
            </div>
          </div>
          <div>
            <span class="badge ${isAlert ? 'badge-danger' : d.status === 'flying' ? 'badge-success' : 'badge-info'}">
              ${statusLabel}
            </span>
          </div>
        </div>

        <div class="drone-detail-body">
          <!-- Battery Bar -->
          <div style="margin-bottom:var(--space-4);">
            <div style="display:flex; justify-content:space-between; margin-bottom:var(--space-1);">
              <span style="font-size:var(--text-xs); color:var(--text-muted);">Pin</span>
              <span style="font-size:var(--text-sm); font-weight:var(--font-bold); font-family:var(--font-mono); color:${batteryColor}">${d.battery}%</span>
            </div>
            <div class="progress-bar" style="height:10px;">
              <div class="progress-bar-fill ${isAlert ? 'danger' : ''}" style="width:${d.battery}%; background:${batteryColor}; transition:width 1s ease;"></div>
            </div>
          </div>

          <!-- Task -->
          <div style="margin-bottom:var(--space-4); padding:var(--space-3); background:var(--bg-secondary); border-radius:var(--radius-sm);">
            <div style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:4px;">Nhiệm vụ hiện tại</div>
            <div style="font-size:var(--text-sm);">${d.task}</div>
          </div>

          <!-- Stats Grid -->
          <div class="drone-detail-stats">
            <div>
              <div class="stat-label">Độ cao</div>
              <div style="font-weight:var(--font-semibold); font-family:var(--font-mono);">${d.altitude}m</div>
            </div>
            <div>
              <div class="stat-label">Tốc độ</div>
              <div style="font-weight:var(--font-semibold); font-family:var(--font-mono);">${d.speed} km/h</div>
            </div>
            <div>
              <div class="stat-label">Thời gian bay</div>
              <div style="font-weight:var(--font-semibold); font-family:var(--font-mono);">${d.flightTime}</div>
            </div>
            <div>
              <div class="stat-label">Quãng đường</div>
              <div style="font-weight:var(--font-semibold); font-family:var(--font-mono);">${d.distanceCovered}</div>
            </div>
            <div>
              <div class="stat-label">Lượt quét nhiệt</div>
              <div style="font-weight:var(--font-semibold); font-family:var(--font-mono);">${d.thermalScans}</div>
            </div>
            <div>
              <div class="stat-label">Vị trí</div>
              <div style="font-weight:var(--font-semibold); font-family:var(--font-mono); font-size:var(--text-xs);">${d.lat.toFixed(3)}, ${d.lng.toFixed(3)}</div>
            </div>
          </div>

          <!-- Actions -->
          <div style="display:flex; gap:var(--space-2); margin-top:var(--space-4);">
            ${d.status === 'standby' ? `
              <button class="btn btn-primary" onclick="dronePanel.launchDrone('${d.id}')" style="flex:1;">🚀 Phóng</button>
            ` : d.status === 'low-battery' ? `
              <button class="btn btn-danger" onclick="dronePanel.recallDrone('${d.id}')" style="flex:1;">🔻 Hạ cánh thay pin</button>
            ` : `
              <button class="btn btn-ghost" onclick="dronePanel.recallDrone('${d.id}')" style="flex:1;">📡 Thu hồi</button>
            `}
            <button class="btn btn-ghost btn-icon" title="Xem camera">📸</button>
          </div>
        </div>
      </div>
    `;
  }

  renderHotSwapAlerts() {
    const lowBatteryDrones = FloodData.drones.filter(d => d.battery < 30);
    if (lowBatteryDrones.length === 0) {
      return `
        <div class="card card-glass" style="text-align:center; padding:var(--space-4);">
          <span style="color:var(--color-success-light);">✅ Tất cả drone hoạt động bình thường</span>
        </div>
      `;
    }

    return `
      <div class="card" style="border:1px solid rgba(239,68,68,0.3); background:rgba(239,68,68,0.05);">
        <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-3);">
          <span style="font-size:24px;" class="animate-pulse">🔋</span>
          <div>
            <div style="font-weight:var(--font-bold); color:var(--color-danger-light);">⚠ Cảnh báo Hot-swap Pin</div>
            <div style="font-size:var(--text-sm); color:var(--text-secondary);">${lowBatteryDrones.length} drone cần thay pin ngay</div>
          </div>
        </div>
        ${lowBatteryDrones.map(d => `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:var(--space-2) 0; border-top:1px solid var(--border-secondary);">
            <span style="font-size:var(--text-sm);">
              <strong>${d.name}</strong> – Pin <span style="color:var(--color-danger-light); font-weight:bold;">${d.battery}%</span>
            </span>
            <button class="btn btn-danger" onclick="dronePanel.hotSwap('${d.id}')" style="font-size:11px; padding:4px 12px;">
              🔄 Hot-swap
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  launchDrone(id) {
    const d = FloodData.drones.find(d => d.id === id);
    if (d) {
      d.status = 'flying';
      d.altitude = 100;
      d.speed = 30;
      d.task = 'Cất cánh – Quét khu vực mới';
      showToast(`🚀 ${d.name} đã cất cánh!`, 'success');
      this.render();
    }
  }

  recallDrone(id) {
    const d = FloodData.drones.find(d => d.id === id);
    if (d) {
      d.status = 'standby';
      d.altitude = 0;
      d.speed = 0;
      d.task = 'Đã hạ cánh – Chờ lệnh';
      showToast(`📡 ${d.name} đã thu hồi thành công`, 'info');
      this.render();
    }
  }

  hotSwap(id) {
    const d = FloodData.drones.find(d => d.id === id);
    if (d) {
      d.battery = 100;
      d.status = 'standby';
      d.altitude = 0;
      d.speed = 0;
      d.task = 'Pin đã thay – Sẵn sàng cất cánh';
      showToast(`🔋 ${d.name} đã được thay pin mới – 100%`, 'success');
      this.render();
    }
  }

  startAnimation() {
    this.animInterval = setInterval(() => {
      // Slowly drain active drones
      FloodData.drones.forEach(d => {
        if (d.status === 'flying' && Math.random() > 0.5) {
          d.battery = Math.max(5, d.battery - 1);
          d.thermalScans += Math.random() > 0.5 ? 1 : 0;
          if (d.battery < 20 && d.status !== 'low-battery') {
            d.status = 'low-battery';
            d.task = '⚠ Pin yếu – Đang quay về';
          }
        }
      });
      this.render();
    }, 8000);
  }

  destroy() {
    if (this.animInterval) clearInterval(this.animInterval);
  }
}
