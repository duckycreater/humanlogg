/* ============================================
   FloodLink 2.0 – Hướng dẫn sử dụng (HDSD)
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
      <div style="max-width:900px; margin:0 auto; padding:var(--space-6); overflow-y:auto; height:100%;">

        <!-- Header -->
        <div style="text-align:center; margin-bottom:var(--space-6);">
          <div style="font-size:36px; margin-bottom:var(--space-3);">📖</div>
          <h2 style="font-size:var(--text-xl); font-weight:var(--font-bold); background:linear-gradient(135deg,#3b82f6,#06d6a0); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
            Hướng dẫn sử dụng FloodLink 2.0
          </h2>
          <p style="font-size:var(--text-sm); color:var(--text-muted); margin-top:var(--space-2);">
            Hệ thống điều phối cứu trợ lũ lụt thông minh – Hội Chữ thập đỏ Việt Nam
          </p>
        </div>

        <!-- Quick Start -->
        <div class="card" style="margin-bottom:var(--space-4); border-left:3px solid #3b82f6;">
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

        <!-- Sections -->
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

        ${this.renderSection('roles', '🔐 Phân quyền', `
          <div style="display:grid; gap:var(--space-3); font-size:var(--text-sm);">
            <div style="padding:12px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2); border-radius:8px;">
              <div style="font-weight:bold; color:#6ee7b7;">👁️ Người dùng thường</div>
              <div style="color:var(--text-secondary); margin-top:4px;">Xem bản đồ, gửi yêu cầu cứu trợ, báo cáo y tế, SOS, tra cứu thuốc, HDSD, chatbot AI, donate.</div>
            </div>
            <div style="padding:12px; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.2); border-radius:8px;">
              <div style="font-weight:bold; color:#93c5fd;">🛡️ Admin (mật khẩu)</div>
              <div style="color:var(--text-secondary); margin-top:4px;">Tất cả quyền trên + quản lý drone, quản lý kho vật phẩm, điều phối thuyền, vẽ trên bản đồ, duyệt yêu cầu.</div>
            </div>
          </div>
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
            <p>🔧 Phiên bản: FloodLink 2.0 · Cập nhật: 28/03/2026</p>
          </div>
        `)}

        <div style="text-align:center; padding:var(--space-6); color:var(--text-muted); font-size:var(--text-xs);">
          ❤️ FloodLink 2.0 – Mỗi giây đều quý giá trong cứu trợ
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
