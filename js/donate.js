/* ============================================
   FloodLink 2.0 – Donate Panel (VietQR)
   ============================================ */

class DonatePanel {
  constructor() {
    this.isOpen = false;
    this.bankInfo = {
      bank: 'VPBank',
      bankCode: 'vpbank',
      accountNo: '919498172',
      accountName: 'QUY CUU TRO LU LUT',
      template: 'compact2'
    };
  }

  init() {
    this.buildFAB();
    this.buildPanel();
  }

  buildFAB() {
    if (document.getElementById('donate-fab')) return;
    const fab = document.createElement('button');
    fab.id = 'donate-fab';
    fab.title = 'Ủng hộ cứu trợ';
    fab.onclick = () => this.toggle();
    Object.assign(fab.style, {
      position: 'fixed', bottom: '90px', right: '24px', zIndex: '9000',
      width: '50px', height: '50px', borderRadius: '14px',
      background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
      border: 'none', cursor: 'pointer', fontSize: '24px',
      boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.3s ease', animation: 'pulse-scale 2s infinite'
    });
    fab.textContent = '❤️';
    fab.onmouseenter = () => fab.style.transform = 'scale(1.1)';
    fab.onmouseleave = () => fab.style.transform = '';
    document.body.appendChild(fab);
  }

  buildPanel() {
    if (document.getElementById('donate-panel')) return;

    const amounts = [50000, 100000, 200000, 500000, 1000000];
    const qrUrl = (amount) => `https://img.vietqr.io/image/${this.bankInfo.bankCode}-${this.bankInfo.accountNo}-${this.bankInfo.template}.jpg?amount=${amount}&addInfo=FloodLink%20Cuu%20Tro&accountName=${encodeURIComponent(this.bankInfo.accountName)}`;

    const panel = document.createElement('div');
    panel.id = 'donate-panel';
    Object.assign(panel.style, {
      position: 'fixed', bottom: '150px', right: '24px', zIndex: '9001',
      width: '360px', maxHeight: '80vh', overflowY: 'auto',
      background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(148,163,184,0.12)',
      borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      padding: '0', display: 'none', fontFamily: 'inherit',
      backdropFilter: 'blur(12px)'
    });

    panel.innerHTML = `
      <div style="padding:20px 20px 0;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg,#ef4444,#f59e0b);
              display:flex; align-items:center; justify-content:center; font-size:20px;">❤️</div>
            <div>
              <div style="font-size:16px; font-weight:700; color:#e2e8f0;">Ủng hộ Cứu trợ</div>
              <div style="font-size:11px; color:#94a3b8;">Mỗi đồng góp phần cứu sống</div>
            </div>
          </div>
          <button onclick="donatePanel.toggle()" style="background:none; border:none; color:#64748b; cursor:pointer; font-size:16px;">✕</button>
        </div>

        <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); border-radius:10px; padding:12px; margin-bottom:16px;">
          <div style="font-size:12px; color:#fca5a5; font-weight:600;">🚨 Tình hình khẩn cấp</div>
          <div style="font-size:11px; color:#94a3b8; margin-top:4px;">
            Hàng nghìn hộ dân đang cần hỗ trợ. Mỗi 50.000đ giúp 1 gia đình có lương thực trong 1 ngày.
          </div>
        </div>

        <!-- QR Code -->
        <div id="donate-qr-area" style="text-align:center; margin-bottom:16px;">
          <div style="background:white; padding:10px; border-radius:12px; display:inline-block;">
            <img id="donate-qr-img" src="${qrUrl(100000)}" alt="VietQR"
              style="width:220px; height:220px; border-radius:8px;" onerror="this.style.display='none'" />
          </div>
          <div style="font-size:10px; color:#64748b; margin-top:6px;">Quét QR bằng app ngân hàng</div>
        </div>

        <!-- Amount buttons -->
        <div style="font-size:11px; color:#94a3b8; margin-bottom:8px;">Chọn mức ủng hộ:</div>
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-bottom:12px;">
          ${amounts.map(a => `
            <button onclick="donatePanel.setAmount(${a})" class="donate-amt-btn"
              style="padding:8px 4px; background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.2);
              border-radius:8px; color:#93c5fd; font-size:12px; font-weight:600; cursor:pointer;
              font-family:inherit; transition:all 0.2s;"
              onmouseenter="this.style.background='rgba(59,130,246,0.2)'"
              onmouseleave="this.style.background='rgba(59,130,246,0.1)'"
            >${(a/1000)}K</button>
          `).join('')}
          <button onclick="donatePanel.customAmount()" class="donate-amt-btn"
            style="padding:8px 4px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2);
            border-radius:8px; color:#6ee7b7; font-size:12px; font-weight:600; cursor:pointer;
            font-family:inherit; transition:all 0.2s;">Khác</button>
        </div>

        <!-- Bank info -->
        <div style="background:rgba(30,41,59,0.5); border-radius:10px; padding:12px; margin-bottom:12px; font-size:12px;">
          <div style="display:grid; gap:6px;">
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#94a3b8;">Ngân hàng</span>
              <span style="color:#e2e8f0; font-weight:600;">VPBank (Vikki)</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#94a3b8;">Số TK</span>
              <span style="color:#e2e8f0; font-weight:600; cursor:pointer;" onclick="donatePanel.copyAccount()" title="Click để sao chép">
                ${this.bankInfo.accountNo} 📋
              </span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#94a3b8;">Nội dung CK</span>
              <span style="color:#f59e0b; font-weight:600;">FloodLink Cuu Tro</span>
            </div>
          </div>
        </div>

        <div style="font-size:10px; color:#64748b; text-align:center; padding-bottom:16px;">
          💚 100% số tiền được chuyển trực tiếp cho người dân vùng lũ<br>
          Powered by VietQR • Hội Chữ thập đỏ Việt Nam
        </div>
      </div>
    `;

    document.body.appendChild(panel);
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const panel = document.getElementById('donate-panel');
    if (panel) panel.style.display = this.isOpen ? 'block' : 'none';
  }

  setAmount(amount) {
    const img = document.getElementById('donate-qr-img');
    if (img) {
      img.src = `https://img.vietqr.io/image/${this.bankInfo.bankCode}-${this.bankInfo.accountNo}-${this.bankInfo.template}.jpg?amount=${amount}&addInfo=FloodLink%20Cuu%20Tro&accountName=${encodeURIComponent(this.bankInfo.accountName)}`;
      img.style.display = '';
    }
    showToast(`💰 QR đã cập nhật: ${amount.toLocaleString()}đ`, 'success');
  }

  customAmount() {
    const amount = prompt('Nhập số tiền ủng hộ (VND):');
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
      this.setAmount(parseInt(amount));
    }
  }

  copyAccount() {
    navigator.clipboard.writeText(this.bankInfo.accountNo).then(() => {
      showToast('📋 Đã sao chép số tài khoản!', 'success');
    }).catch(() => {
      showToast('STK: ' + this.bankInfo.accountNo, 'info');
    });
  }
}
