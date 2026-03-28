/* ============================================
   FloodLink – Command Center Module
   ============================================ */

class CommandCenter {
  constructor() {
    this.activeTab = 'priority';
    this.map = null;
    this._liveInterval = null;
    this._initialized = false;
    this._tabsBound = false;
  }

  init() {
    // Create map only once
    if (!this.map) {
      this.map = new FloodMap('command-map');
    }
    this.map.init();

    this.renderStats();
    this.renderSidebar();

    // Bind tabs only once
    if (!this._tabsBound) {
      this.bindTabs();
      this._tabsBound = true;
    }

    // Start live updates only once
    if (!this._liveInterval) {
      this.startLiveUpdates();
    }

    // Invalidate map size after panel becomes visible
    setTimeout(() => {
      if (this.map && this.map.map) this.map.resize();
    }, 100);
  }

  renderStats() {
    const stats = document.getElementById('command-stats');
    if (!stats) return;

    const totalHH = FloodData.households.length;
    const rescued = FloodData.households.filter(h => h.status === 'delivered').length;
    const critical = FloodData.households.filter(h => h.score >= 80).length;
    const flyingDrones = FloodData.drones.filter(d => d.status === 'flying').length;
    const lowBatDrones = FloodData.drones.filter(d => d.status === 'low-battery').length;
    const totalDrones = FloodData.drones.length;

    stats.innerHTML = `
      <div class="card-sm card-glass animate-fade-up">
        <div class="stat">
          <span class="stat-label">Túi đã giao</span>
          <span class="stat-value text-blue">${FloodData.inventory.distributed.toLocaleString()}</span>
          <span class="stat-change">↑ ${FloodData.inventory.rate}/giờ</span>
        </div>
      </div>
      <div class="card-sm card-glass animate-fade-up" style="animation-delay:0.1s">
        <div class="stat">
          <span class="stat-label">Hộ đã cứu</span>
          <span class="stat-value text-green">${rescued}/${totalHH}</span>
          <span class="stat-change">${Math.round(rescued/totalHH*100)}% hoàn thành</span>
        </div>
      </div>
      <div class="card-sm card-glass animate-fade-up" style="animation-delay:0.15s">
        <div class="stat">
          <span class="stat-label">Hộ khẩn cấp</span>
          <span class="stat-value text-red">${critical}</span>
          <span class="stat-change">Điểm ≥ 80</span>
        </div>
      </div>
      <div class="card-sm card-glass animate-fade-up" style="animation-delay:0.2s">
        <div class="stat">
          <span class="stat-label">Drone</span>
          <span class="stat-value text-yellow">${flyingDrones}/${totalDrones}</span>
          <span class="stat-change">${lowBatDrones > 0 ? `⚠ ${lowBatDrones} pin yếu` : 'Bình thường'}</span>
        </div>
      </div>
    `;
  }

  bindTabs() {
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeTab = tab.dataset.tab;
        this.renderSidebar();
      });
    });
  }

  renderSidebar() {
    const content = document.getElementById('sidebar-content');
    if (!content) return;

    switch (this.activeTab) {
      case 'priority': this.renderPriority(content); break;
      case 'drones': this.renderDrones(content); break;
      case 'inventory': this.renderInventory(content); break;
      case 'messages': this.renderMessages(content); break;
    }
  }

  renderPriority(el) {
    const sorted = [...FloodData.households].sort((a, b) => b.score - a.score).slice(0, 20);
    el.innerHTML = `
      <div class="sidebar-section-title" style="margin-bottom:var(--space-3); display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:var(--text-sm); font-weight:var(--font-semibold);">Xếp hạng ưu tiên (Top 20)</span>
        <button class="btn btn-primary btn-sm" onclick="commandCenter.recalcPriority()" style="font-size:11px; padding:4px 12px;">
          ⚡ Tính lại
        </button>
      </div>
      <div class="stagger-children">
        ${sorted.map((h, i) => `
          <div class="household-card ${getPriorityClass(h.score)}" data-id="${h.id}">
            <div class="household-score" style="color:${getPriorityColor(h.score)}">${h.score}</div>
            <div class="household-info">
              <div class="household-name">#${i+1} ${h.name}</div>
              <div class="household-detail">
                ${h.people} người ${h.hasElder ? '👴' : ''} ${h.hasChild ? '👶' : ''} ${h.hasDisabled ? '♿' : ''}
                • Ngập ${h.floodLevel}m • ${h.area}
              </div>
              <div style="margin-top:4px; display:flex; gap:4px;">
                ${h.needs.map(n => `<span class="chip">${n}</span>`).join('')}
              </div>
            </div>
            <div>
              ${h.status === 'delivered' ? '<span class="badge badge-success">✓ Đã giao</span>' :
                h.status === 'in-transit' ? '<span class="badge badge-info">🚢 Đang đến</span>' :
                '<span class="badge badge-warning">⏳ Chờ</span>'}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderDrones(el) {
    const flying = FloodData.drones.filter(d => d.status === 'flying');
    const lowBat = FloodData.drones.filter(d => d.status === 'low-battery');
    const standby = FloodData.drones.filter(d => d.status === 'standby');

    el.innerHTML = `
      <div style="margin-bottom:var(--space-3); display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:var(--text-sm); font-weight:var(--font-semibold);">
          Đội Drone (${FloodData.drones.length} máy)
        </span>
        <div style="display:flex; gap:var(--space-2); font-size:10px;">
          <span style="color:var(--color-success-light);">● ${flying.length} bay</span>
          <span style="color:var(--color-danger-light);">● ${lowBat.length} pin yếu</span>
          <span style="color:var(--text-muted);">● ${standby.length} chờ</span>
        </div>
      </div>
      <div class="stagger-children" style="max-height:calc(100vh - 320px); overflow-y:auto;">
        ${FloodData.drones.map(d => {
          const batteryColor = d.battery < 20 ? 'var(--color-danger-light)' : d.battery < 50 ? 'var(--color-warning-light)' : 'var(--color-success-light)';
          const isAlert = d.battery < 20;
          const statusIcon = d.status === 'flying' ? '🟢' : d.status === 'low-battery' ? '🔴' : '⚪';
          return `
            <div class="drone-card ${isAlert ? 'alert' : ''}">
              <div class="drone-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${isAlert ? '#ef4444' : d.status === 'standby' ? '#64748b' : '#3b82f6'}" stroke-width="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div class="drone-info">
                <div class="drone-name">${statusIcon} ${d.name}</div>
                <div class="drone-status-text">${d.task}</div>
                <div style="margin-top:6px;">
                  <div class="progress-bar" style="width:120px">
                    <div class="progress-bar-fill ${isAlert ? 'danger' : ''}" style="width:${Math.round(d.battery)}%; background:${batteryColor}"></div>
                  </div>
                </div>
              </div>
              <div class="drone-battery">
                <div class="drone-battery-value" style="color:${batteryColor}">${Math.round(d.battery)}%</div>
                <div style="font-size:11px; color:var(--text-muted);">
                  ${d.status === 'flying' ? `${d.altitude}m` : d.status === 'standby' ? 'Chờ' : '⚠ Pin yếu'}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="margin-top:var(--space-4);">
        <div style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:var(--space-2);">THAO TÁC NHANH</div>
        <div style="display:flex; gap:var(--space-2); flex-wrap:wrap;">
          <button class="btn btn-ghost" onclick="commandCenter.toggleMapThermal()">🌡️ Bản đồ nhiệt</button>
          <button class="btn btn-ghost" onclick="commandCenter.toggleDronePaths()">✈️ Đường bay</button>
        </div>
      </div>
    `;
  }

  renderInventory(el) {
    const inv = FloodData.inventory;
    const pct = Math.round(inv.distributed / inv.totalBags * 100);

    el.innerHTML = `
      <div style="margin-bottom:var(--space-4);">
        <div style="font-size:var(--text-sm); font-weight:var(--font-semibold); margin-bottom:var(--space-3);">
          Tổng quan kho hàng
        </div>
        <div class="card card-sm" style="margin-bottom:var(--space-3);">
          <div style="display:flex; justify-content:space-between; margin-bottom:var(--space-2);">
            <span style="color:var(--text-secondary)">${inv.distributed.toLocaleString()} / ${inv.totalBags.toLocaleString()} túi</span>
            <span style="color:var(--color-primary-light); font-weight:var(--font-bold);">${pct}%</span>
          </div>
          <div class="progress-bar progress-bar-striped">
            <div class="progress-bar-fill" style="width:${pct}%"></div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:var(--space-2); font-size:var(--text-xs); color:var(--text-muted);">
            <span>Tốc độ: ${inv.rate} túi/giờ</span>
            <span>Còn lại: ${inv.remaining.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:var(--space-2); text-transform:uppercase; letter-spacing:0.08em; font-weight:var(--font-semibold);">
        Chi tiết vật tư
      </div>
      <div class="stagger-children">
        ${inv.items.map(item => {
          const itemPct = Math.round(item.used / item.total * 100);
          return `
            <div class="card card-sm" style="margin-bottom:var(--space-2); padding:var(--space-3);">
              <div style="display:flex; align-items:center; gap:var(--space-3);">
                <span style="font-size:20px;">${item.icon}</span>
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; justify-content:space-between; font-size:var(--text-sm);">
                    <span>${item.name}</span>
                    <span class="mono" style="color:var(--text-secondary); font-size:var(--text-xs);">${item.used}/${item.total}</span>
                  </div>
                  <div class="progress-bar" style="margin-top:4px;">
                    <div class="progress-bar-fill" style="width:${itemPct}%; ${itemPct > 80 ? 'background:var(--color-danger)' : ''}"></div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderMessages(el) {
    el.innerHTML = `
      <div style="margin-bottom:var(--space-3); font-size:var(--text-sm); font-weight:var(--font-semibold);">
        Nhật ký LoRa Mesh
      </div>
      <div class="stagger-children">
        ${FloodData.messages.slice(0, 20).map(msg => {
          const typeColors = {
            scan: 'var(--color-primary-light)',
            urgent: 'var(--color-danger-light)',
            sos: 'var(--color-danger)',
            delivery: 'var(--color-success-light)',
            alert: 'var(--color-warning-light)',
            confirm: 'var(--color-accent)'
          };
          const typeIcons = {
            scan: '📡', urgent: '🚨', sos: '🆘', delivery: '✅', alert: '⚠️', confirm: '✓'
          };
          return `
            <div class="card card-sm" style="margin-bottom:var(--space-2); padding:var(--space-3); border-left:3px solid ${typeColors[msg.type] || 'var(--border-primary)'};">
              <div style="display:flex; align-items:center; gap:var(--space-2); margin-bottom:4px;">
                <span style="font-size:14px;">${typeIcons[msg.type] || '📨'}</span>
                <span style="font-size:var(--text-xs); font-weight:var(--font-semibold); color:${typeColors[msg.type]}">${msg.from}</span>
                <span style="margin-left:auto; font-size:var(--text-xs); color:var(--text-muted); font-family:var(--font-mono);">${msg.time}</span>
              </div>
              <div style="font-size:var(--text-sm); color:var(--text-secondary); padding-left:22px;">
                ${msg.text}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  toggleMapThermal() {
    if (this.map) {
      const state = this.map.toggleThermal();
      showToast(state ? '🌡️ Bản đồ nhiệt đã bật' : '🌡️ Bản đồ nhiệt đã tắt', state ? 'info' : 'default');
    }
  }

  toggleDronePaths() {
    if (this.map) {
      const state = this.map.toggleDronePaths();
      showToast(state ? '✈️ Đường bay drone đã hiện' : '✈️ Đường bay drone đã ẩn', 'default');
    }
  }

  recalcPriority() {
    FloodData.households.forEach(h => {
      const tempLow = Math.random() > 0.5 ? 1 : 0;
      const vulnerable = (h.hasElder || h.hasChild || h.hasDisabled) ? 1 : 0;
      const riskHigh = h.floodLevel > 1.5 ? 1 : 0;
      h.score = Math.min(100, Math.round(
        (tempLow * 40) + (Math.min(h.people, 5) / 5 * 20) + (vulnerable * 30) + (riskHigh * 15)
      ));
    });
    FloodData.households.sort((a, b) => b.score - a.score);
    this.renderSidebar();
    if (this.map) this.map.buildHouseholdMarkers();
    showToast('⚡ Đã tính lại điểm ưu tiên', 'success');
  }

  startLiveUpdates() {
    this._liveInterval = setInterval(() => {
      // Only update if command panel is active
      if (currentMode !== 'command') return;

      FloodData.drones.forEach(d => {
        if (d.status === 'flying') {
          d.battery = Math.max(5, d.battery - (Math.random() > 0.7 ? 1 : 0));
          if (d.battery < 20 && d.status !== 'low-battery') {
            d.status = 'low-battery';
            d.task = '⚠ Pin yếu – Đang quay về';
            showToast(`🚨 ${d.name} pin chỉ còn ${Math.round(d.battery)}% – Cần hạ cánh!`, 'danger');
          }
        }
      });

      // Random delivery
      if (Math.random() > 0.85) {
        const pending = FloodData.households.filter(h => h.status === 'pending');
        if (pending.length > 0) {
          const h = pending[Math.floor(Math.random() * pending.length)];
          h.status = 'in-transit';
          FloodData.inventory.distributed += Math.floor(Math.random() * 3) + 1;
          FloodData.inventory.remaining = FloodData.inventory.totalBags - FloodData.inventory.distributed;
        }
      }

      // Update stats only
      this.renderStats();
    }, 8000);
  }

  destroy() {
    if (this._liveInterval) {
      clearInterval(this._liveInterval);
      this._liveInterval = null;
    }
    if (this.map) this.map.stop();
  }
}
