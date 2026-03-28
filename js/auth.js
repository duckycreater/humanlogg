/* ============================================
   FloodLink 2.0 – Authentication Module
   Role-based: Admin (full) vs User (restricted)
   ============================================ */

class AuthManager {
  constructor() {
    this.isAdmin = false;
    this.ADMIN_EMAIL = 'admin@floodlink.vn';
    this.ADMIN_PASSWORD = 'floodlink2026';

    // Tabs requiring admin
    this.adminOnlyTabs = ['drone', 'supplies'];
    // Elements hidden for non-admin
    this.adminOnlySelectors = [
      '.drone-control-bar',
      '.leaflet-draw-toolbar',
      '.map-controls'
    ];
  }

  init() {
    if (sessionStorage.getItem('floodlink_admin') === 'true') {
      this.isAdmin = true;
    }
    this.updateUI();
    this.buildLoginModal();
    this.applyRestrictions();
  }

  buildLoginModal() {
    if (document.getElementById('auth-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'auth-modal';
    modal.innerHTML = `
      <div class="auth-modal-backdrop" onclick="authManager.closeModal()"></div>
      <div class="auth-modal-content">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
          <div style="width:48px; height:48px; border-radius:14px; background:linear-gradient(135deg,#3b82f6,#06d6a0);
            display:flex; align-items:center; justify-content:center; font-size:24px;">🔐</div>
          <div>
            <div style="font-size:18px; font-weight:700; color:#e2e8f0;">Đăng nhập Admin</div>
            <div style="font-size:12px; color:#94a3b8;">Quản lý Drone, Vật phẩm, Điều phối</div>
          </div>
        </div>

        <div id="auth-error" style="display:none; padding:10px 14px; background:rgba(239,68,68,0.1);
          border:1px solid rgba(239,68,68,0.3); border-radius:8px; color:#fca5a5; font-size:12px; margin-bottom:12px;"></div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <div>
            <label style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px; display:block;">Mật khẩu Admin</label>
            <input type="password" id="auth-password" placeholder="Nhập mật khẩu admin"
              style="width:100%; padding:10px 14px; background:rgba(15,23,42,0.8); border:1px solid rgba(148,163,184,0.15);
              border-radius:8px; color:#e2e8f0; font-size:14px; font-family:inherit; outline:none; box-sizing:border-box;"
              onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='rgba(148,163,184,0.15)'"
              onkeydown="if(event.key==='Enter') authManager.login()" />
          </div>
        </div>

        <button onclick="authManager.login()" style="width:100%; margin-top:16px; padding:10px; background:linear-gradient(135deg,#3b82f6,#2563eb);
          border:none; border-radius:8px; color:white; font-size:14px; font-weight:600; cursor:pointer;
          transition:all 0.2s;" onmouseenter="this.style.transform='translateY(-1px)'" onmouseleave="this.style.transform=''">
          🔑 Đăng nhập
        </button>

        <button onclick="authManager.closeModal()" style="width:100%; margin-top:8px; padding:8px;
          background:none; border:1px solid rgba(148,163,184,0.1); border-radius:8px; color:#64748b;
          font-size:12px; cursor:pointer;">Đóng</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  showModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('open');
      const el = document.getElementById('auth-error');
      if (el) el.style.display = 'none';
      setTimeout(() => document.getElementById('auth-password')?.focus(), 200);
    }
  }

  closeModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('open');
  }

  login() {
    const password = document.getElementById('auth-password')?.value;
    if (password === this.ADMIN_PASSWORD) {
      this.isAdmin = true;
      sessionStorage.setItem('floodlink_admin', 'true');
      this.closeModal();
      this.updateUI();
      this.applyRestrictions();
      showToast('🛡️ Admin – Quyền đầy đủ!', 'success');
    } else {
      const el = document.getElementById('auth-error');
      if (el) { el.style.display = 'block'; el.textContent = 'Sai mật khẩu'; }
    }
  }

  logout() {
    this.isAdmin = false;
    sessionStorage.removeItem('floodlink_admin');
    this.updateUI();
    this.applyRestrictions();
    if (this.adminOnlyTabs.includes(currentMode)) switchMode('command');
    showToast('👋 Đã đăng xuất – chế độ người dùng', 'default');
  }

  updateUI() {
    const el = document.getElementById('auth-status');
    if (el) {
      el.innerHTML = this.isAdmin
        ? `<span style="color:#10b981; font-weight:600; font-size:11px;">🛡️ ADMIN</span>
           <button onclick="authManager.logout()" style="background:none; border:none; color:#64748b; cursor:pointer; font-size:12px; padding:2px 4px;" title="Đăng xuất">✕</button>`
        : `<button onclick="authManager.showModal()" style="padding:4px 10px; background:rgba(59,130,246,0.15);
            border:1px solid rgba(59,130,246,0.3); border-radius:6px; color:#93c5fd; font-size:11px;
            cursor:pointer; font-family:inherit;">🔐 Đăng nhập</button>`;
    }
    this.updateTabLocks();
  }

  updateTabLocks() {
    this.adminOnlyTabs.forEach(tabMode => {
      const tab = document.getElementById(`tab-${tabMode}`);
      if (!tab) return;
      const lock = tab.querySelector('.lock-icon');
      if (!this.isAdmin && !lock) {
        tab.insertAdjacentHTML('beforeend', '<span class="lock-icon" style="margin-left:4px; font-size:10px;">🔒</span>');
      } else if (this.isAdmin && lock) {
        lock.remove();
      }
    });
  }

  applyRestrictions() {
    setTimeout(() => {
      // Hide admin-only DOM elements
      this.adminOnlySelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.style.display = this.isAdmin ? '' : 'none';
        });
      });

      // Hide manage buttons in volunteer mode
      document.querySelectorAll('.household-card .btn').forEach(el => {
        if (el.textContent.includes('ĐANG ĐẾN') || el.textContent.includes('ĐÃ GIAO')) {
          el.style.display = this.isAdmin ? '' : 'none';
        }
      });
    }, 500);
  }

  canAccess(mode) {
    return !this.adminOnlyTabs.includes(mode) || this.isAdmin;
  }

  requireAdmin(mode) {
    if (!this.canAccess(mode)) {
      this.showModal();
      showToast('🔒 Cần mật khẩu Admin để truy cập', 'danger');
      return false;
    }
    return true;
  }
}
