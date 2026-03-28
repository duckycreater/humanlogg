/* ============================================
   FloodLink 2.0 – Supplies Management Mode
   ============================================ */

class SuppliesMode {
  constructor() {
    this.activeCategory = 'all';
    this.showRequestForm = false;
  }

  getSupplies() {
    return [
      // Lương thực
      { id: 'S01', name: 'Gạo 5kg', category: 'food', icon: '🍚', total: 2200, used: FloodData.inventory.items[0].used, unit: 'túi', priority: 'high', expiry: '12 tháng', weight: '5kg/túi', note: 'Gạo tẻ đóng bao chống nước' },
      { id: 'S02', name: 'Nước uống', category: 'food', icon: '💧', total: 1800, used: FloodData.inventory.items[1].used, unit: 'thùng', priority: 'critical', expiry: '24 tháng', weight: '12L/thùng', note: 'Nước tinh khiết đóng thùng' },
      { id: 'S03', name: 'Mì tôm', category: 'food', icon: '🍜', total: 1500, used: FloodData.inventory.items[2].used, unit: 'thùng', priority: 'high', expiry: '6 tháng', weight: '3kg/thùng', note: '30 gói/thùng' },
      { id: 'S04', name: 'Lương khô', category: 'food', icon: '🍞', total: 800, used: 234, unit: 'hộp', priority: 'medium', expiry: '18 tháng', weight: '0.5kg/hộp', note: 'Bánh lương khô quân đội' },
      { id: 'S05', name: 'Sữa hộp', category: 'food', icon: '🥛', total: 600, used: 178, unit: 'thùng', priority: 'medium', expiry: '12 tháng', weight: '4.8L/thùng', note: 'Sữa đặc có đường' },
      { id: 'S06', name: 'Muối & Đường', category: 'food', icon: '🧂', total: 400, used: 112, unit: 'gói', priority: 'low', expiry: '36 tháng', weight: '1kg/gói', note: 'Muối i-ốt + đường trắng' },

      // Y tế
      { id: 'S07', name: 'Thuốc men', category: 'medical', icon: '💊', total: 500, used: FloodData.inventory.items[3].used, unit: 'bộ', priority: 'critical', expiry: '12 tháng', weight: '0.3kg/bộ', note: 'Paracetamol, ORS, thuốc tiêu chảy, kháng sinh' },
      { id: 'S08', name: 'Bộ sơ cứu', category: 'medical', icon: '🩹', total: 300, used: FloodData.inventory.items[7].used, unit: 'bộ', priority: 'high', expiry: '24 tháng', weight: '0.8kg/bộ', note: 'Băng gạc, cồn, kéo, găng tay' },
      { id: 'S09', name: 'Khẩu trang', category: 'medical', icon: '😷', total: 5000, used: 1200, unit: 'chiếc', priority: 'medium', expiry: '36 tháng', weight: '5g/chiếc', note: 'Khẩu trang y tế 3 lớp' },
      { id: 'S10', name: 'Nước sát khuẩn', category: 'medical', icon: '🧴', total: 400, used: 145, unit: 'chai', priority: 'high', expiry: '24 tháng', weight: '0.5L/chai', note: 'Dung dịch sát khuẩn tay' },
      { id: 'S11', name: 'Viên lọc nước', category: 'medical', icon: '💎', total: 2000, used: 567, unit: 'viên', priority: 'critical', expiry: '36 tháng', weight: '5g/viên', note: 'Viên Aquatab – lọc 20L/viên' },
      { id: 'S12', name: 'Thuốc chống muỗi', category: 'medical', icon: '🦟', total: 300, used: 89, unit: 'chai', priority: 'medium', expiry: '12 tháng', weight: '100ml/chai', note: 'Phòng sốt rét, sốt xuất huyết' },

      // Sinh hoạt
      { id: 'S13', name: 'Chăn ấm', category: 'living', icon: '🛏️', total: 800, used: FloodData.inventory.items[4].used, unit: 'chiếc', priority: 'high', expiry: 'Không', weight: '1.5kg/chiếc', note: 'Chăn fleece chống nước' },
      { id: 'S14', name: 'Đèn pin', category: 'living', icon: '🔦', total: 400, used: FloodData.inventory.items[6].used, unit: 'cái', priority: 'high', expiry: 'Không', weight: '0.2kg/cái', note: 'LED chống nước, kèm pin' },
      { id: 'S15', name: 'Nến & Bật lửa', category: 'living', icon: '🕯️', total: 500, used: 156, unit: 'bộ', priority: 'medium', expiry: 'Không', weight: '0.3kg/bộ', note: '5 nến + 1 bật lửa/bộ' },
      { id: 'S16', name: 'Bạt nhựa', category: 'living', icon: '🏕️', total: 200, used: 67, unit: 'tấm', priority: 'medium', expiry: 'Không', weight: '2kg/tấm', note: 'Bạt 4×6m che mưa' },
      { id: 'S17', name: 'Xô chậu', category: 'living', icon: '🪣', total: 300, used: 98, unit: 'cái', priority: 'low', expiry: 'Không', weight: '0.5kg/cái', note: 'Xô nhựa 15L đa năng' },
      { id: 'S18', name: 'Dây thừng', category: 'living', icon: '🪢', total: 150, used: 45, unit: 'cuộn', priority: 'medium', expiry: 'Không', weight: '2kg/cuộn', note: 'Dây PP 8mm × 50m' },

      // An toàn
      { id: 'S19', name: 'Áo phao', category: 'safety', icon: '🦺', total: 600, used: FloodData.inventory.items[5].used, unit: 'chiếc', priority: 'critical', expiry: 'Không', weight: '0.8kg/chiếc', note: 'Áo phao cứu sinh đạt chuẩn' },
      { id: 'S20', name: 'Phao cứu sinh', category: 'safety', icon: '🛟', total: 100, used: 23, unit: 'chiếc', priority: 'high', expiry: 'Không', weight: '2.5kg/chiếc', note: 'Phao tròn ném SOLAS' },
      { id: 'S21', name: 'Còi cứu hộ', category: 'safety', icon: '📢', total: 200, used: 56, unit: 'cái', priority: 'medium', expiry: 'Không', weight: '50g/cái', note: 'Còi nhựa kèm dây đeo' },
      { id: 'S22', name: 'Pháo sáng', category: 'safety', icon: '🔥', total: 50, used: 8, unit: 'ống', priority: 'low', expiry: '36 tháng', weight: '0.2kg/ống', note: 'Pháo sáng hiệu 60s' },
      { id: 'S23', name: 'Radio FM pin', category: 'safety', icon: '📻', total: 100, used: 34, unit: 'cái', priority: 'high', expiry: 'Không', weight: '0.3kg/cái', note: 'Radio FM/AM kèm đèn LED' },
      { id: 'S24', name: 'Pin dự phòng', category: 'safety', icon: '🔋', total: 300, used: 112, unit: 'cục', priority: 'high', expiry: '60 tháng', weight: '0.25kg/cục', note: 'Pin sạc 10000mAh chống nước' }
    ];
  }

  init() {
    this.render();
  }

  render() {
    const panel = document.getElementById('supplies-panel');
    if (!panel) return;

    const supplies = this.getSupplies();
    const filtered = this.activeCategory === 'all' ? supplies : supplies.filter(s => s.category === this.activeCategory);

    const categories = [
      { id: 'all', label: 'Tất cả', icon: '📋', count: supplies.length },
      { id: 'food', label: 'Lương thực', icon: '🍚', count: supplies.filter(s => s.category === 'food').length },
      { id: 'medical', label: 'Y tế', icon: '💊', count: supplies.filter(s => s.category === 'medical').length },
      { id: 'living', label: 'Sinh hoạt', icon: '🏠', count: supplies.filter(s => s.category === 'living').length },
      { id: 'safety', label: 'An toàn', icon: '🦺', count: supplies.filter(s => s.category === 'safety').length }
    ];

    // Stats
    const totalItems = supplies.reduce((sum, s) => sum + s.total, 0);
    const totalUsed = supplies.reduce((sum, s) => sum + s.used, 0);
    const lowStock = supplies.filter(s => (s.used / s.total) > 0.8).length;
    const criticalItems = supplies.filter(s => s.priority === 'critical').length;

    panel.innerHTML = `
      <div style="display:flex; flex-direction:column; height:100%; overflow:hidden;">
        <!-- Top Stats -->
        <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:var(--space-3); padding:var(--space-4) var(--space-6); border-bottom:1px solid var(--border-secondary); background:var(--bg-secondary);">
          <div class="card card-glass card-sm animate-fade-up" style="text-align:center;">
            <div class="stat">
              <span class="stat-label">Tổng loại</span>
              <span class="stat-value text-blue" style="font-size:var(--text-2xl);">${supplies.length}</span>
            </div>
          </div>
          <div class="card card-glass card-sm animate-fade-up" style="text-align:center; animation-delay:0.05s;">
            <div class="stat">
              <span class="stat-label">Đã phân phối</span>
              <span class="stat-value text-green" style="font-size:var(--text-2xl);">${totalUsed.toLocaleString()}</span>
            </div>
          </div>
          <div class="card card-glass card-sm animate-fade-up" style="text-align:center; animation-delay:0.1s;">
            <div class="stat">
              <span class="stat-label">Tổng kho</span>
              <span class="stat-value text-yellow" style="font-size:var(--text-2xl);">${totalItems.toLocaleString()}</span>
            </div>
          </div>
          <div class="card card-glass card-sm animate-fade-up" style="text-align:center; animation-delay:0.15s;">
            <div class="stat">
              <span class="stat-label">Sắp hết</span>
              <span class="stat-value text-red" style="font-size:var(--text-2xl);">${lowStock}</span>
            </div>
          </div>
          <div class="card card-glass card-sm animate-fade-up" style="text-align:center; animation-delay:0.2s;">
            <div class="stat">
              <span class="stat-label">Ưu tiên cao</span>
              <span class="stat-value" style="font-size:var(--text-2xl); color:var(--color-danger-light);">${criticalItems}</span>
            </div>
          </div>
        </div>

        <!-- Category Tabs -->
        <div style="display:flex; gap:var(--space-2); padding:var(--space-3) var(--space-6); border-bottom:1px solid var(--border-secondary); overflow-x:auto;">
          ${categories.map(c => `
            <button class="btn ${this.activeCategory === c.id ? 'btn-primary' : 'btn-ghost'}" 
              onclick="suppliesMode.setCategory('${c.id}')" style="font-size:12px; padding:6px 14px; white-space:nowrap;">
              ${c.icon} ${c.label} <span style="opacity:0.6; margin-left:4px;">(${c.count})</span>
            </button>
          `).join('')}

          <div style="flex:1;"></div>
          <button class="btn btn-accent" onclick="suppliesMode.requestResupply()" style="font-size:12px; padding:6px 14px;">
            📨 Yêu cầu bổ sung
          </button>
        </div>

        <!-- Items Grid -->
        <div style="flex:1; overflow-y:auto; padding:var(--space-4) var(--space-6);">
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:var(--space-4);" class="stagger-children">
            ${filtered.map(item => this.renderItemCard(item)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderItemCard(item) {
    const pct = Math.round(item.used / item.total * 100);
    const remaining = item.total - item.used;
    const isLow = pct > 80;
    const isCritical = pct > 90;
    const priorityColors = { critical: 'var(--color-danger)', high: 'var(--color-warning)', medium: 'var(--color-primary-light)', low: 'var(--color-success-light)' };
    const priorityLabels = { critical: 'Thiết yếu', high: 'Quan trọng', medium: 'Cần thiết', low: 'Bổ sung' };

    return `
      <div class="card ${isCritical ? 'animate-glow-red' : ''}" style="padding:var(--space-4); ${isLow ? 'border-color:rgba(239,68,68,0.3);' : ''}">
        <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-3);">
          <span style="font-size:28px;">${item.icon}</span>
          <div style="flex:1; min-width:0;">
            <div style="display:flex; align-items:center; gap:var(--space-2);">
              <span style="font-weight:var(--font-bold); font-size:var(--text-sm);">${item.name}</span>
              <span class="badge" style="font-size:9px; padding:1px 6px; background:${priorityColors[item.priority]}20; color:${priorityColors[item.priority]}; border:1px solid ${priorityColors[item.priority]}40;">
                ${priorityLabels[item.priority]}
              </span>
            </div>
            <div style="font-size:var(--text-xs); color:var(--text-muted); margin-top:2px;">${item.note}</div>
          </div>
          ${isLow ? '<span class="animate-pulse" style="font-size:16px;">⚠️</span>' : ''}
        </div>

        <!-- Progress -->
        <div style="margin-bottom:var(--space-3);">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="font-size:var(--text-xs); color:var(--text-muted);">Đã dùng: ${item.used.toLocaleString()} / ${item.total.toLocaleString()} ${item.unit}</span>
            <span style="font-size:var(--text-xs); font-weight:var(--font-bold); color:${isLow ? 'var(--color-danger-light)' : 'var(--color-primary-light)'};">${pct}%</span>
          </div>
          <div class="progress-bar" style="height:8px;">
            <div class="progress-bar-fill ${isLow ? 'danger' : ''}" style="width:${pct}%;"></div>
          </div>
        </div>

        <!-- Details -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:var(--space-2); font-size:var(--text-xs);">
          <div>
            <span style="color:var(--text-muted);">Còn lại</span>
            <div style="font-weight:var(--font-semibold); color:${isLow ? 'var(--color-danger-light)' : 'var(--text-primary)'};">${remaining.toLocaleString()} ${item.unit}</div>
          </div>
          <div>
            <span style="color:var(--text-muted);">Trọng lượng</span>
            <div style="font-weight:var(--font-semibold);">${item.weight}</div>
          </div>
          <div>
            <span style="color:var(--text-muted);">Hạn dùng</span>
            <div style="font-weight:var(--font-semibold);">${item.expiry}</div>
          </div>
        </div>
      </div>
    `;
  }

  setCategory(cat) {
    this.activeCategory = cat;
    this.render();
  }

  requestResupply() {
    const lowItems = this.getSupplies().filter(s => (s.used / s.total) > 0.7);
    if (lowItems.length === 0) {
      showToast('✅ Tất cả vật tư còn đầy đủ!', 'success');
      return;
    }

    const list = lowItems.map(s => `${s.icon} ${s.name}: còn ${s.total - s.used} ${s.unit}`).join('\n');
    showToast(`📨 Đã gửi yêu cầu bổ sung ${lowItems.length} loại vật tư qua LoRa!`, 'info');

    // Add to messages
    FloodData.messages.unshift({
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      from: 'Trạm chính',
      type: 'urgent',
      text: `📨 Yêu cầu bổ sung ${lowItems.length} loại vật tư sắp hết`
    });
  }
}
