/* ============================================
   FloodLink – Volunteer Mode
   ============================================ */

class VolunteerMode {
  constructor() {
    this.selectedHousehold = null;
    this.filterArea = 'all';
    this.scanActive = false;
  }

  init() {
    this.render();
  }

  render() {
    const panel = document.getElementById('volunteer-panel');
    if (!panel) return;

    const filtered = this.filterArea === 'all'
      ? FloodData.households
      : FloodData.households.filter(h => h.area === this.filterArea);

    const areas = [...new Set(FloodData.households.map(h => h.area))];

    panel.innerHTML = `
      <div class="volunteer-layout">
        <!-- Sidebar: Household List -->
        <div class="volunteer-sidebar">
          <div style="padding:var(--space-4) var(--space-5); border-bottom:1px solid var(--border-secondary);">
            <div style="font-size:var(--text-lg); font-weight:var(--font-bold); margin-bottom:var(--space-3);">
              📋 Danh sách hộ dân
            </div>
            <div style="display:flex; gap:var(--space-2); flex-wrap:wrap;">
              <button class="btn ${this.filterArea === 'all' ? 'btn-primary' : 'btn-ghost'}" 
                onclick="volunteerMode.setFilter('all')" style="font-size:11px; padding:4px 10px;">Tất cả</button>
              ${areas.map(a => `
                <button class="btn ${this.filterArea === a ? 'btn-primary' : 'btn-ghost'}" 
                  onclick="volunteerMode.setFilter('${a}')" style="font-size:11px; padding:4px 10px;">${a}</button>
              `).join('')}
            </div>
            <div style="margin-top:var(--space-2); font-size:var(--text-xs); color:var(--text-muted);">
              ${filtered.length} hộ | ${filtered.filter(h => h.status === 'delivered').length} đã giao | ${filtered.filter(h => h.score >= 80).length} khẩn cấp
            </div>
          </div>
          <div style="flex:1; overflow-y:auto; padding:var(--space-3);">
            ${filtered.slice(0, 30).map(h => `
              <div class="household-card ${getPriorityClass(h.score)} ${this.selectedHousehold?.id === h.id ? 'selected' : ''}" 
                onclick="volunteerMode.selectHousehold('${h.id}')" style="cursor:pointer;">
                <div class="household-score" style="color:${getPriorityColor(h.score)}">${h.score}</div>
                <div class="household-info">
                  <div class="household-name">${h.name}</div>
                  <div class="household-detail">
                    ${h.people} người ${h.hasElder ? '👴' : ''} ${h.hasChild ? '👶' : ''} | ${h.area} | Ngập ${h.floodLevel}m
                  </div>
                </div>
                <div>
                  ${h.status === 'delivered' ? '<span class="badge badge-success" style="font-size:10px;">✓</span>' :
                    h.status === 'in-transit' ? '<span class="badge badge-info" style="font-size:10px;">🚢</span>' :
                    '<span class="badge badge-warning" style="font-size:10px;">⏳</span>'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Main Content -->
        <div class="volunteer-main">
          ${this.selectedHousehold ? this.renderHouseholdDetail() : this.renderWelcome()}
        </div>
      </div>
    `;
  }

  renderWelcome() {
    const delivered = FloodData.households.filter(h => h.status === 'delivered').length;
    const total = FloodData.households.length;
    const todayBags = FloodData.inventory.distributed;

    return `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:var(--space-8);">
        <div style="text-align:center;">
          <div style="font-size:64px; margin-bottom:var(--space-4);">🤝</div>
          <h2 style="font-size:var(--text-2xl); font-weight:var(--font-bold); margin-bottom:var(--space-2);">
            Chế độ Tình nguyện viên
          </h2>
          <p style="color:var(--text-secondary); max-width:400px;">
            Chọn một hộ dân từ danh sách bên trái để xem chi tiết và xác nhận giao hàng.
          </p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:var(--space-4); max-width:600px; width:100%;">
          <div class="card card-glass" style="text-align:center;">
            <div class="stat-value text-green" style="font-size:var(--text-3xl);">${delivered}</div>
            <div class="stat-label">Đã giao</div>
          </div>
          <div class="card card-glass" style="text-align:center;">
            <div class="stat-value text-yellow" style="font-size:var(--text-3xl);">${total - delivered}</div>
            <div class="stat-label">Chưa giao</div>
          </div>
          <div class="card card-glass" style="text-align:center;">
            <div class="stat-value text-blue" style="font-size:var(--text-3xl);">${todayBags}</div>
            <div class="stat-label">Túi hôm nay</div>
          </div>
        </div>

        <div style="display:flex; gap:var(--space-3);">
          <button class="btn btn-primary btn-lg" onclick="volunteerMode.openScanner()">
            📷 Quét QR
          </button>
          <button class="btn btn-accent btn-lg" onclick="volunteerMode.voiceReport()">
            🎤 Báo cáo Voice
          </button>
        </div>
      </div>
    `;
  }

  renderHouseholdDetail() {
    const h = this.selectedHousehold;
    return `
      <div class="animate-fade-up" style="max-width:700px;">
        <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-6);">
          <button class="btn btn-ghost btn-icon" onclick="volunteerMode.clearSelection()">
            ← Quay lại
          </button>
          <h2 style="font-size:var(--text-xl); font-weight:var(--font-bold);">Chi tiết hộ dân</h2>
        </div>

        <div class="card" style="margin-bottom:var(--space-4);">
          <div style="display:flex; align-items:center; gap:var(--space-4); margin-bottom:var(--space-4);">
            <div style="width:64px; height:64px; border-radius:var(--radius-lg); background:${getPriorityColor(h.score)}; display:flex; align-items:center; justify-content:center; font-size:var(--text-2xl); font-weight:var(--font-bold); color:#fff;">
              ${h.score}
            </div>
            <div>
              <h3 style="font-size:var(--text-lg); font-weight:var(--font-bold);">${h.name}</h3>
              <div style="color:var(--text-secondary);">${h.id} • ${h.area}</div>
              <span class="badge ${h.score >= 80 ? 'badge-danger' : h.score >= 60 ? 'badge-warning' : 'badge-success'}" style="margin-top:4px;">
                ${getPriorityLabel(h.score)}
              </span>
            </div>
          </div>

          <div class="divider"></div>

          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:var(--space-4); margin-bottom:var(--space-4);">
            <div>
              <div class="stat-label">Số người</div>
              <div style="font-size:var(--text-lg); font-weight:var(--font-semibold);">${h.people} người</div>
              <div style="font-size:var(--text-xs); color:var(--text-muted); margin-top:2px;">
                ${h.hasElder ? '👴 Có người già' : ''} ${h.hasChild ? '👶 Có trẻ em' : ''} ${h.hasDisabled ? '♿ Có người khuyết tật' : ''}
              </div>
            </div>
            <div>
              <div class="stat-label">Mức ngập</div>
              <div style="font-size:var(--text-lg); font-weight:var(--font-semibold); color:${h.floodLevel > 1.5 ? 'var(--color-danger-light)' : 'var(--color-warning-light)'};">
                ${h.floodLevel}m
              </div>
              <div style="font-size:var(--text-xs); color:var(--text-muted); margin-top:2px;">
                ${h.floodLevel > 1.5 ? '⚠ Nguy hiểm' : 'Trung bình'}
              </div>
            </div>
            <div>
              <div class="stat-label">Liên lạc cuối</div>
              <div style="font-size:var(--text-sm);">${h.lastContact}</div>
            </div>
            <div>
              <div class="stat-label">Trạng thái</div>
              <div>
                ${h.status === 'delivered' ? '<span class="badge badge-success">✅ Đã giao hàng</span>' :
                  h.status === 'in-transit' ? '<span class="badge badge-info">🚢 Đang vận chuyển</span>' :
                  '<span class="badge badge-warning">⏳ Chưa giao</span>'}
              </div>
            </div>
          </div>

          <div>
            <div class="stat-label" style="margin-bottom:var(--space-2);">Nhu cầu</div>
            <div style="display:flex; gap:var(--space-2); flex-wrap:wrap;">
              ${h.needs.map(n => `<span class="chip" style="font-size:var(--text-sm); padding:var(--space-2) var(--space-3);">${n}</span>`).join('')}
            </div>
          </div>
        </div>

        <div style="display:flex; gap:var(--space-3);">
          ${h.status !== 'delivered' ? `
            <button class="btn btn-accent btn-lg" onclick="volunteerMode.confirmDelivery('${h.id}')">
              ✅ Xác nhận đã giao
            </button>
          ` : `
            <button class="btn btn-ghost btn-lg" disabled>
              ✅ Đã giao thành công
            </button>
          `}
          <button class="btn btn-ghost btn-lg" onclick="volunteerMode.openScanner()">
            📷 Quét QR xác nhận
          </button>
          <button class="btn btn-ghost btn-lg" onclick="volunteerMode.voiceReport()">
            🎤 Báo cáo
          </button>
        </div>
      </div>
    `;
  }

  setFilter(area) {
    this.filterArea = area;
    this.render();
  }

  selectHousehold(id) {
    this.selectedHousehold = FloodData.households.find(h => h.id === id);
    this.render();
  }

  clearSelection() {
    this.selectedHousehold = null;
    this.render();
  }

  confirmDelivery(id) {
    const h = FloodData.households.find(h => h.id === id);
    if (h) {
      h.status = 'delivered';
      FloodData.inventory.distributed += 1;
      FloodData.inventory.remaining = FloodData.inventory.totalBags - FloodData.inventory.distributed;
      showToast(`✅ Đã xác nhận giao hàng cho ${h.name}`, 'success');
      this.selectedHousehold = h;
      this.render();
    }
  }

  openScanner() {
    showToast('📷 Mô phỏng: Quét mã QR thành công – Xác nhận tự động!', 'success');
  }

  voiceReport() {
    showToast('🎤 Mô phỏng: Ghi nhận báo cáo voice – "Hộ 5 người, nước ngập 1m, có trẻ em"', 'info');
  }
}
