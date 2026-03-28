/* ============================================
   FloodLink 2.0 – Yêu cầu hàng cứu trợ
   Citizen supply request system
   ============================================ */

class SupplyRequest {
  constructor() {
    this.requests = [];
    this.categories = [
      { id: 'food', icon: '🍚', label: 'Lương thực', items: ['Gạo', 'Mì gói', 'Nước uống', 'Sữa', 'Bánh khô', 'Thực phẩm đóng hộp'] },
      { id: 'medicine', icon: '💊', label: 'Thuốc men', items: ['Paracetamol', 'ORS', 'Betadine', 'Băng gạc', 'Thuốc tiêu chảy', 'Thuốc cảm'] },
      { id: 'clothing', icon: '👕', label: 'Quần áo', items: ['Áo phao', 'Chăn mền', 'Quần áo khô', 'Giày dép'] },
      { id: 'hygiene', icon: '🧴', label: 'Vệ sinh', items: ['Nước sạch', 'Xà phòng', 'Bàn chải', 'Khăn', 'Bỉm tã', 'Băng vệ sinh'] },
      { id: 'tools', icon: '🔧', label: 'Dụng cụ', items: ['Đèn pin', 'Pin/Sạc dự phòng', 'Dây thừng', 'Bạt che mưa', 'Xẻng'] },
      { id: 'baby', icon: '👶', label: 'Trẻ em', items: ['Sữa bột', 'Bỉm', 'Thuốc trẻ em', 'Chăn ấm trẻ em'] }
    ];
  }

  init() { this.render(); }

  render() {
    const panel = document.getElementById('request-panel');
    if (!panel) return;

    const isAdmin = typeof authManager !== 'undefined' && authManager.isAdmin;

    panel.innerHTML = `
      <div style="display:grid; grid-template-columns:${isAdmin ? '1fr 1fr' : '1fr'}; gap:var(--space-4); padding:var(--space-6); height:100%; overflow-y:auto;">

        <!-- LEFT: Request Form -->
        <div style="display:flex; flex-direction:column; gap:var(--space-4);">

          <!-- Header -->
          <div class="card" style="border-left:3px solid #3b82f6;">
            <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-2);">
              <span style="font-size:28px;">📋</span>
              <div>
                <h2 style="font-size:var(--text-lg); font-weight:var(--font-bold);">Yêu cầu hàng cứu trợ</h2>
                <p style="font-size:var(--text-xs); color:var(--text-muted);">Gửi yêu cầu để nhận hàng cứu trợ. AI sẽ ưu tiên theo mức độ khẩn cấp.</p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="card">
            <h3 style="font-size:var(--text-sm); font-weight:var(--font-bold); margin-bottom:var(--space-3);">📝 Thông tin yêu cầu</h3>

            <div style="display:grid; gap:var(--space-3);">
              <div>
                <label style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Họ tên người yêu cầu *</label>
                <input type="text" id="req-name" class="health-input" placeholder="Nhập họ tên..." />
              </div>

              <div>
                <label style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Địa chỉ / Khu vực *</label>
                <input type="text" id="req-address" class="health-input" placeholder="VD: Xóm 3, xã Phúc Xá, Ba Đình..." />
              </div>

              <div>
                <label style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Số điện thoại</label>
                <input type="tel" id="req-phone" class="health-input" placeholder="0xxx-xxx-xxx" />
              </div>

              <div>
                <label style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Số người cần hỗ trợ</label>
                <input type="number" id="req-people" class="health-input" placeholder="1" min="1" max="200" value="1" />
              </div>
            </div>
          </div>

          <!-- Category select -->
          <div class="card">
            <h3 style="font-size:var(--text-sm); font-weight:var(--font-bold); margin-bottom:var(--space-3);">📦 Chọn hàng cần thiết</h3>
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:var(--space-2); margin-bottom:var(--space-3);">
              ${this.categories.map(c => `
                <button onclick="supplyRequest.toggleCategory('${c.id}')" id="req-cat-${c.id}"
                  style="padding:10px; background:rgba(30,41,59,0.5); border:1px solid var(--border-secondary); border-radius:8px;
                  cursor:pointer; text-align:center; transition:all 0.2s; font-family:inherit; color:var(--text-secondary);"
                  onmouseenter="this.style.borderColor='rgba(59,130,246,0.4)'"
                  onmouseleave="this.style.borderColor='var(--border-secondary)'">
                  <div style="font-size:20px;">${c.icon}</div>
                  <div style="font-size:11px; margin-top:2px;">${c.label}</div>
                </button>
              `).join('')}
            </div>

            <div id="req-items-area" style="display:none;">
              <label style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Chọn mặt hàng cụ thể:</label>
              <div id="req-items-list" style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;"></div>
            </div>

            <div style="margin-top:var(--space-3);">
              <label style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Ghi chú thêm</label>
              <textarea id="req-note" class="health-textarea" rows="2" placeholder="VD: Có 2 trẻ nhỏ dưới 3 tuổi, cần sữa bột khẩn..."></textarea>
            </div>
          </div>

          <!-- Submit -->
          <div style="display:flex; gap:var(--space-3);">
            <button class="btn btn-primary btn-lg" onclick="supplyRequest.submit()" style="flex:1;">
              📨 Gửi yêu cầu cứu trợ
            </button>
            <a href="tel:0912127142" class="btn btn-danger btn-lg">
              📞 Hotline
            </a>
          </div>
        </div>

        <!-- RIGHT: Request List -->
        <div style="display:flex; flex-direction:column; gap:var(--space-4);">

          <div class="card">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-3);">
              <h3 style="font-size:var(--text-sm); font-weight:var(--font-bold);">📊 Yêu cầu đã gửi</h3>
              <span class="badge badge-info">${this.requests.length} yêu cầu</span>
            </div>

            <div id="req-list" style="max-height:60vh; overflow-y:auto;">
              ${this.renderRequests(isAdmin)}
            </div>
          </div>

          <!-- Stats -->
          <div class="card" style="background:rgba(59,130,246,0.05);">
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:var(--space-3); text-align:center;">
              <div>
                <div style="font-size:var(--text-xl); font-weight:var(--font-bold); color:#93c5fd;">${this.requests.filter(r => r.status === 'pending').length}</div>
                <div style="font-size:10px; color:var(--text-muted);">Đang chờ</div>
              </div>
              <div>
                <div style="font-size:var(--text-xl); font-weight:var(--font-bold); color:#fbbf24;">${this.requests.filter(r => r.status === 'processing').length}</div>
                <div style="font-size:10px; color:var(--text-muted);">Đang xử lý</div>
              </div>
              <div>
                <div style="font-size:var(--text-xl); font-weight:var(--font-bold); color:#6ee7b7;">${this.requests.filter(r => r.status === 'done').length}</div>
                <div style="font-size:10px; color:var(--text-muted);">Đã giao</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderRequests(isAdmin) {
    if (this.requests.length === 0) {
      return '<div style="text-align:center; padding:var(--space-6); color:var(--text-muted); font-size:var(--text-xs);">Chưa có yêu cầu nào.<br>Hãy điền form bên trái để gửi.</div>';
    }

    const statusColors = { pending: '#f59e0b', processing: '#3b82f6', done: '#10b981', rejected: '#ef4444' };
    const statusLabels = { pending: '⏳ Chờ duyệt', processing: '🔄 Đang xử lý', done: '✅ Đã giao', rejected: '❌ Từ chối' };

    return this.requests.map(r => `
      <div style="padding:12px; border:1px solid var(--border-secondary); border-left:3px solid ${statusColors[r.status]};
        border-radius:8px; margin-bottom:8px; font-size:var(--text-sm);">
        <div style="display:flex; justify-content:space-between; align-items:start;">
          <div>
            <div style="font-weight:var(--font-bold);">${r.name}</div>
            <div style="font-size:11px; color:var(--text-muted);">${r.address} · ${r.people} người</div>
            <div style="margin-top:4px; display:flex; flex-wrap:wrap; gap:4px;">
              ${r.items.map(i => `<span style="padding:1px 6px; background:rgba(59,130,246,0.1); border-radius:4px; font-size:10px; color:#93c5fd;">${i}</span>`).join('')}
            </div>
            ${r.note ? `<div style="font-size:10px; color:var(--text-muted); margin-top:4px; font-style:italic;">📝 ${r.note}</div>` : ''}
          </div>
          <div style="text-align:right; flex-shrink:0; margin-left:8px;">
            <span style="font-size:10px; padding:2px 8px; background:${statusColors[r.status]}22; color:${statusColors[r.status]}; border-radius:4px; font-weight:bold;">
              ${statusLabels[r.status]}
            </span>
            <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">${r.time}</div>
          </div>
        </div>
        ${isAdmin && r.status === 'pending' ? `
          <div style="display:flex; gap:6px; margin-top:8px; padding-top:8px; border-top:1px solid var(--border-secondary);">
            <button class="btn btn-primary" style="font-size:10px; padding:4px 10px;" onclick="supplyRequest.updateStatus('${r.id}','processing')">🔄 Xử lý</button>
            <button class="btn btn-ghost" style="font-size:10px; padding:4px 10px; color:#10b981;" onclick="supplyRequest.updateStatus('${r.id}','done')">✅ Đã giao</button>
            <button class="btn btn-ghost" style="font-size:10px; padding:4px 10px; color:#ef4444;" onclick="supplyRequest.updateStatus('${r.id}','rejected')">❌ Từ chối</button>
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  selectedCategory = null;
  selectedItems = new Set();

  toggleCategory(catId) {
    this.selectedCategory = this.selectedCategory === catId ? null : catId;
    const area = document.getElementById('req-items-area');
    const list = document.getElementById('req-items-list');
    if (!area || !list) return;

    // Reset button styles
    this.categories.forEach(c => {
      const btn = document.getElementById(`req-cat-${c.id}`);
      if (btn) btn.style.borderColor = c.id === this.selectedCategory ? '#3b82f6' : 'var(--border-secondary)';
      if (btn) btn.style.background = c.id === this.selectedCategory ? 'rgba(59,130,246,0.1)' : 'rgba(30,41,59,0.5)';
    });

    if (!this.selectedCategory) { area.style.display = 'none'; return; }

    const cat = this.categories.find(c => c.id === catId);
    area.style.display = 'block';
    list.innerHTML = cat.items.map(item => `
      <button onclick="supplyRequest.toggleItem('${item}', this)"
        style="padding:4px 10px; border-radius:6px; font-size:11px; cursor:pointer; transition:all 0.2s;
        font-family:inherit; border:1px solid ${this.selectedItems.has(item) ? '#3b82f6' : 'var(--border-secondary)'};
        background:${this.selectedItems.has(item) ? 'rgba(59,130,246,0.15)' : 'rgba(30,41,59,0.3)'};
        color:${this.selectedItems.has(item) ? '#93c5fd' : 'var(--text-secondary)'};">
        ${this.selectedItems.has(item) ? '✓ ' : ''}${item}
      </button>
    `).join('');
  }

  toggleItem(item, el) {
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item);
      if (el) { el.style.borderColor = 'var(--border-secondary)'; el.style.background = 'rgba(30,41,59,0.3)'; el.style.color = 'var(--text-secondary)'; el.textContent = item; }
    } else {
      this.selectedItems.add(item);
      if (el) { el.style.borderColor = '#3b82f6'; el.style.background = 'rgba(59,130,246,0.15)'; el.style.color = '#93c5fd'; el.textContent = '✓ ' + item; }
    }
  }

  submit() {
    const name = document.getElementById('req-name')?.value?.trim();
    const address = document.getElementById('req-address')?.value?.trim();
    const phone = document.getElementById('req-phone')?.value?.trim();
    const people = document.getElementById('req-people')?.value || '1';
    const note = document.getElementById('req-note')?.value?.trim();

    if (!name) { showToast('⚠ Vui lòng nhập họ tên', 'danger'); return; }
    if (!address) { showToast('⚠ Vui lòng nhập địa chỉ', 'danger'); return; }
    if (this.selectedItems.size === 0) { showToast('⚠ Vui lòng chọn ít nhất 1 mặt hàng', 'danger'); return; }

    const request = {
      id: `REQ-${Date.now()}`,
      name, address, phone,
      people: parseInt(people),
      items: [...this.selectedItems],
      note,
      status: 'pending',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    this.requests.unshift(request);

    // Sync to Firestore
    if (typeof firestoreSync !== 'undefined' && firestoreSync.connected) {
      firestoreSync.queueWrite('supplyRequests', request.id, request);
    }

    FloodData.messages.unshift({
      time: request.time, from: 'Yêu cầu cứu trợ', type: 'alert',
      text: `📋 ${name} (${address}) cần: ${request.items.join(', ')} – ${people} người`
    });

    showToast(`📋 Đã gửi yêu cầu cứu trợ cho ${name}!`, 'success');
    this.selectedItems.clear();
    this.selectedCategory = null;
    this.render();
  }

  updateStatus(id, status) {
    const req = this.requests.find(r => r.id === id);
    if (req) {
      req.status = status;
      if (typeof firestoreSync !== 'undefined' && firestoreSync.connected) {
        firestoreSync.queueWrite('supplyRequests', id, { status });
      }
      const statusLabels = { processing: 'đang xử lý', done: 'đã giao', rejected: 'từ chối' };
      showToast(`✅ Yêu cầu ${req.name} → ${statusLabels[status]}`, 'success');
      this.render();
    }
  }
}
