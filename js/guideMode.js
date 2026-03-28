/* ============================================
   FloodLink – Hướng dẫn sử dụng (HDSD)
   ============================================ */

class GuideMode {
  constructor() {
    this.expandedSection = null;
  }

  init() { this.render(); }

  render() {
    const panel = document.getElementById('guide-panel');
    if (!panel) return;

    panel.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; grid-template-rows:auto auto 1fr; gap:var(--space-4); padding:var(--space-5); height:100%; overflow-y:auto;">

        <!-- Header (full width) -->
        <div style="grid-column:1/-1; text-align:center; padding-bottom:var(--space-2);">
          <div style="font-size:32px; margin-bottom:var(--space-2);">📖</div>
          <h2 style="font-size:var(--text-xl); font-weight:var(--font-bold); background:linear-gradient(135deg,#3b82f6,#06d6a0); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
            Hướng dẫn sử dụng FloodLink
          </h2>
          <p style="font-size:var(--text-sm); color:var(--text-muted); margin-top:var(--space-1);">
            Hệ thống điều phối cứu trợ lũ lụt thông minh – Hội Chữ thập đỏ Việt Nam
          </p>
        </div>

        <!-- TEST MODE BANNER (full width) -->
        <div style="grid-column:1/-1; padding:14px 20px; background:linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.1)); border:2px solid rgba(245,158,11,0.4); border-radius:12px;">
          <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
            <span style="font-size:28px;">🧪</span>
            <div style="flex:1; min-width:200px;">
              <div style="font-size:var(--text-sm); font-weight:var(--font-bold); color:#fbbf24; text-transform:uppercase; letter-spacing:0.08em;">⚠ Chế độ Test – Bản thử nghiệm</div>
              <div style="font-size:var(--text-sm); color:var(--text-secondary); margin-top:4px;">Đăng nhập Admin để truy cập đầy đủ tính năng (Drone, Vật phẩm, Điều phối)</div>
            </div>
            <div style="display:flex; align-items:center; gap:10px; padding:10px 16px; background:rgba(0,0,0,0.3); border-radius:8px; border:1px solid rgba(245,158,11,0.3);">
              <div>
                <div style="font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.06em;">Mật khẩu Admin</div>
                <div style="font-size:18px; font-weight:var(--font-bold); font-family:var(--font-mono); color:#fbbf24; letter-spacing:0.1em;">floodlink2026</div>
              </div>
              <button onclick="navigator.clipboard.writeText('floodlink2026').then(()=>showToast('📋 Đã copy mật khẩu!','success'))" style="padding:6px 10px; background:rgba(245,158,11,0.2); border:1px solid rgba(245,158,11,0.4); border-radius:6px; color:#fbbf24; font-size:12px; cursor:pointer; white-space:nowrap;">📋 Copy</button>
            </div>
            <button onclick="authManager.showModal()" style="padding:10px 20px; background:linear-gradient(135deg,#3b82f6,#2563eb); border:none; border-radius:8px; color:white; font-size:var(--text-sm); font-weight:var(--font-bold); cursor:pointer; white-space:nowrap;">🔐 Đăng nhập ngay</button>
          </div>
        </div>

        <!-- LEFT COLUMN -->
        <div style="display:flex; flex-direction:column; gap:var(--space-3);">

          <!-- Quick Start -->
          <div class="card" style="border-left:3px solid #3b82f6;">
            <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-3);">
              <span style="font-size:24px;">⚡</span>
              <h3 style="font-size:var(--text-base); font-weight:var(--font-bold);">Bắt đầu nhanh</h3>
            </div>
            <div style="display:grid; gap:var(--space-3); font-size:var(--text-sm); color:var(--text-secondary);">
              <div style="display:flex; gap:var(--space-3); align-items:start;">
                <span style="background:#3b82f6; color:white; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; flex-shrink:0;">1</span>
                <div><strong>Xem bản đồ</strong> – Tab "Command Center" hiện bản đồ thời gian thực với vị trí drone, tình nguyện viên, thuyền cứu hộ.</div>
              </div>
              <div style="display:flex; gap:var(--space-3); align-items:start;">
                <span style="background:#06d6a0; color:white; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; flex-shrink:0;">2</span>
                <div><strong>Yêu cầu cứu trợ</strong> – Tab "Yêu cầu cứu trợ" để gửi yêu cầu hàng hóa, thuốc men, nhu yếu phẩm.</div>
              </div>
              <div style="display:flex; gap:var(--space-3); align-items:start;">
                <span style="background:#f59e0b; color:white; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; flex-shrink:0;">3</span>
                <div><strong>Báo cáo y tế</strong> – Tab "Khẩn cấp" để báo tình trạng sức khỏe → AI tự động phân loại và cử người.</div>
              </div>
              <div style="display:flex; gap:var(--space-3); align-items:start;">
                <span style="background:#ef4444; color:white; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; flex-shrink:0;">4</span>
                <div><strong>SOS Khẩn cấp</strong> – Gọi <strong style="color:#fca5a5;">0912 127 142</strong> bất kỳ lúc nào.</div>
              </div>
            </div>
          </div>

          ${this.renderSection('tabs', '📑 Các tab chính', `
            <table style="width:100%; border-collapse:collapse; font-size:var(--text-sm);">
              <tr style="border-bottom:1px solid var(--border-secondary);">
                <td style="padding:8px; font-weight:bold;">🗺️ Command Center</td>
                <td style="padding:8px; color:var(--text-secondary);">Bản đồ tổng quan, theo dõi drone, thuyền, tình nguyện viên, vẽ/đánh dấu trên bản đồ.</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border-secondary);">
                <td style="padding:8px; font-weight:bold;">👥 Tình nguyện viên</td>
                <td style="padding:8px; color:var(--text-secondary);">Danh sách hộ dân cần cứu trợ, xếp hạng ưu tiên.</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border-secondary);">
                <td style="padding:8px; font-weight:bold;">✈️ Drone <span style="color:#fca5a5;">🔒 Admin</span></td>
                <td style="padding:8px; color:var(--text-secondary);">Quản lý 20 drone – chỉ Admin mới truy cập.</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border-secondary);">
                <td style="padding:8px; font-weight:bold;">📦 Vật phẩm <span style="color:#fca5a5;">🔒 Admin</span></td>
                <td style="padding:8px; color:var(--text-secondary);">Quản lý kho hàng cứu trợ – chỉ Admin.</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border-secondary);">
                <td style="padding:8px; font-weight:bold;">🚨 Khẩn cấp</td>
                <td style="padding:8px; color:var(--text-secondary);">SOS, báo cáo y tế (AI phân loại), tra cứu thuốc, sơ cứu.</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border-secondary);">
                <td style="padding:8px; font-weight:bold;">📋 Yêu cầu cứu trợ</td>
                <td style="padding:8px; color:var(--text-secondary);">Gửi yêu cầu hàng cứu trợ (ai cũng có thể gửi).</td>
              </tr>
              <tr>
                <td style="padding:8px; font-weight:bold;">🎤 Elder Mode</td>
                <td style="padding:8px; color:var(--text-secondary);">Giao diện voice-only đặc biệt cho người già.</td>
              </tr>
            </table>
          `)}

          ${this.renderSection('ai', '🤖 AI Chatbot & Triage', `
            <div style="font-size:var(--text-sm); color:var(--text-secondary); line-height:1.8;">
              <p>💬 <strong>Chatbot AI</strong> (nút 🤖 góc dưới phải) – hỏi bất kỳ điều gì về cứu trợ, sơ cứu, vật phẩm.</p>
              <p style="margin-top:8px;">🏥 <strong>AI Triage</strong> – Khi gửi báo cáo y tế ở tab Khẩn cấp, AI tự động:</p>
              <ul style="margin-left:20px; margin-top:4px;">
                <li>🔴 <strong>Đỏ</strong> (nguy kịch) → Cử bác sĩ + thuyền cứu hộ</li>
                <li>🟡 <strong>Vàng</strong> (nặng) → Cử y tá + thuyền</li>
                <li>🟢 <strong>Xanh</strong> (nhẹ) → Cử tình nguyện viên hoặc drone</li>
              </ul>
              <p style="margin-top:8px;">⚡ <strong>Nguyên tắc</strong>: Luôn ưu tiên cử NGƯỜI hơn drone trong tình huống y tế.</p>
            </div>
          `)}
        </div>

        <!-- RIGHT COLUMN -->
        <div style="display:flex; flex-direction:column; gap:var(--space-3);">

          ${this.renderSection('roles', '🔐 Phân quyền & Đăng nhập Admin', `
            <div style="display:grid; gap:var(--space-3); font-size:var(--text-sm);">
              <div style="padding:12px; background:rgba(245,158,11,0.1); border:2px dashed rgba(245,158,11,0.4); border-radius:8px;">
                <div style="font-weight:bold; color:#fbbf24; font-size:14px;">🧪 ĐĂNG NHẬP ADMIN (Bản Test)</div>
                <div style="color:var(--text-secondary); margin-top:6px;">Nhấn nút <strong style='color:#93c5fd;'>🔐 Đăng nhập</strong> ở góc trên bên phải, nhập mật khẩu bên dưới:</div>
                <div style="display:flex; align-items:center; gap:10px; margin-top:8px; padding:10px 14px; background:rgba(0,0,0,0.3); border-radius:8px; border:1px solid rgba(245,158,11,0.3);">
                  <div style="font-family:var(--font-mono); font-size:20px; font-weight:bold; color:#fbbf24; letter-spacing:0.12em;">floodlink2026</div>
                  <button onclick="event.stopPropagation(); navigator.clipboard.writeText('floodlink2026').then(()=>showToast('📋 Đã copy mật khẩu!','success'))" style="padding:4px 10px; background:rgba(245,158,11,0.2); border:1px solid rgba(245,158,11,0.4); border-radius:6px; color:#fbbf24; font-size:11px; cursor:pointer;">📋 Copy</button>
                  <button onclick="event.stopPropagation(); authManager.showModal()" style="padding:4px 10px; background:rgba(59,130,246,0.3); border:1px solid rgba(59,130,246,0.5); border-radius:6px; color:#93c5fd; font-size:11px; cursor:pointer;">🔐 Đăng nhập</button>
                </div>
              </div>
              <div style="padding:12px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2); border-radius:8px;">
                <div style="font-weight:bold; color:#6ee7b7;">👁️ Người dùng thường</div>
                <div style="color:var(--text-secondary); margin-top:4px;">Xem bản đồ, gửi yêu cầu cứu trợ, báo cáo y tế, SOS, tra cứu thuốc, HDSD, chatbot AI, donate.</div>
              </div>
              <div style="padding:12px; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.2); border-radius:8px;">
                <div style="font-weight:bold; color:#93c5fd;">🛡️ Admin</div>
                <div style="color:var(--text-secondary); margin-top:4px;">Tất cả quyền trên + quản lý drone, quản lý kho vật phẩm, điều phối thuyền, vẽ trên bản đồ, duyệt yêu cầu.</div>
              </div>
            </div>
          `)}

          ${this.renderSection('shortcuts', '⌨️ Phím tắt', `
            <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:8px; font-size:var(--text-sm);">
              <div style="padding:8px; background:var(--bg-tertiary); border-radius:6px;"><kbd style="background:var(--bg-secondary); padding:2px 6px; border-radius:4px; font-family:var(--font-mono);">Alt+1-8</kbd> Chuyển tab</div>
              <div style="padding:8px; background:var(--bg-tertiary); border-radius:6px;"><kbd style="background:var(--bg-secondary); padding:2px 6px; border-radius:4px; font-family:var(--font-mono);">Alt+C</kbd> Mở chatbot</div>
              <div style="padding:8px; background:var(--bg-tertiary); border-radius:6px;"><kbd style="background:var(--bg-secondary); padding:2px 6px; border-radius:4px; font-family:var(--font-mono);">Esc</kbd> Thoát Elder Mode</div>
              <div style="padding:8px; background:var(--bg-tertiary); border-radius:6px;"><kbd style="background:var(--bg-secondary); padding:2px 6px; border-radius:4px; font-family:var(--font-mono);">Click phải</kbd> Menu bản đồ</div>
            </div>
          `)}

          ${this.renderSection('contact', '📞 Liên hệ & Hỗ trợ', `
            <div style="font-size:var(--text-sm); color:var(--text-secondary); line-height:1.8;">
              <p>📞 Hotline cứu trợ: <strong style="color:#fca5a5; font-size:16px;">0912 127 142</strong> (24/7)</p>
              <p>🏥 Cấp cứu: <strong>115</strong> · Công an: <strong>113</strong> · PCCC: <strong>114</strong></p>
              <p>💻 Phát triển bởi: Đội thi FloodLink – Hội Chữ thập đỏ Việt Nam</p>
              <p>🔧 Phiên bản: FloodLink · Cập nhật: 28/03/2026</p>
            </div>
          `)}
        </div>

        <div style="grid-column:1/-1; text-align:center; padding:var(--space-4); color:var(--text-muted); font-size:var(--text-xs);">
          ❤️ FloodLink – Mỗi giây đều quý giá trong cứu trợ
        </div>
      </div>
    `;
  }

  renderSection(id, title, content) {
    const isOpen = this.expandedSection === id;
    return `
      <div class="card" style="margin-bottom:var(--space-3); cursor:pointer;" onclick="guideMode.toggleSection('${id}')">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <h3 style="font-size:var(--text-sm); font-weight:var(--font-bold);">${title}</h3>
          <span style="color:var(--text-muted); transition:transform 0.2s; transform:rotate(${isOpen ? '180' : '0'}deg);">▼</span>
        </div>
        <div style="overflow:hidden; max-height:${isOpen ? '1000px' : '0'}; transition:max-height 0.3s ease; ${isOpen ? 'margin-top:var(--space-3);' : ''}">
          ${content}
        </div>
      </div>
    `;
  }

  toggleSection(id) {
    this.expandedSection = this.expandedSection === id ? null : id;
    this.render();
  }
}
