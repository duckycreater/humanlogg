/* ============================================
   FloodLink 2.0 – Emergency Mode
   Khẩn cấp · Thuốc men · Sức khỏe · Hotline
   ============================================ */

class EmergencyMode {
  constructor() {
    this.medCategory = 'all';
    this.healthReports = [];
    this.expandedGuide = null;
    this.selectedSeverity = null; // AI will determine this
  }

  init() {
    this.render();
  }

  getMedicines() {
    return [
      // Hạ sốt & Giảm đau
      { id: 'M01', name: 'Paracetamol 500mg', category: 'fever', icon: '💊', usage: 'Hạ sốt, giảm đau đầu, đau cơ', dosage: '1-2 viên/lần, cách 4-6 giờ', warning: 'Không quá 8 viên/ngày. Cẩn thận bệnh gan.', stock: 500, unit: 'viên' },
      { id: 'M02', name: 'Ibuprofen 400mg', category: 'fever', icon: '💊', usage: 'Giảm đau mạnh, kháng viêm, hạ sốt', dosage: '1 viên/lần, cách 6-8 giờ', warning: 'Uống sau bữa ăn. Không dùng nếu loét dạ dày.', stock: 200, unit: 'viên' },

      // Tiêu hóa
      { id: 'M03', name: 'ORS (Oresol)', category: 'digest', icon: '🥤', usage: 'Bù nước & điện giải khi tiêu chảy, nôn mửa', dosage: '1 gói pha 1L nước, uống từng ngụm nhỏ', warning: 'Pha đúng liều. Nước phải sạch.', stock: 1000, unit: 'gói' },
      { id: 'M04', name: 'Loperamide 2mg', category: 'digest', icon: '💊', usage: 'Cầm tiêu chảy cấp', dosage: '2 viên đầu, sau đó 1 viên/lần đi ngoài', warning: 'Không dùng quá 3 ngày. Không dùng khi sốt cao.', stock: 300, unit: 'viên' },
      { id: 'M05', name: 'Smecta (Diosmectite)', category: 'digest', icon: '📦', usage: 'Bao niêm mạc ruột, trị tiêu chảy', dosage: '1 gói × 3 lần/ngày, pha nước', warning: 'Uống cách thuốc khác 2 giờ.', stock: 400, unit: 'gói' },

      // Kháng sinh
      { id: 'M06', name: 'Amoxicillin 500mg', category: 'antibiotic', icon: '💊', usage: 'Nhiễm trùng da, hô hấp, tiết niệu', dosage: '1 viên × 3 lần/ngày × 5-7 ngày', warning: '⚠ CHỈ dùng khi có chỉ định. Dị ứng Penicillin KHÔNG dùng.', stock: 200, unit: 'viên' },
      { id: 'M07', name: 'Metronidazole 250mg', category: 'antibiotic', icon: '💊', usage: 'Nhiễm trùng đường ruột, vết thương nhiễm khuẩn', dosage: '2 viên × 3 lần/ngày', warning: '⚠ KHÔNG uống rượu khi dùng thuốc.', stock: 150, unit: 'viên' },

      // Ngoài da
      { id: 'M08', name: 'Betadine (Povidone Iodine)', category: 'skin', icon: '🧴', usage: 'Sát khuẩn vết thương, phòng nhiễm trùng', dosage: 'Bôi trực tiếp lên vết thương 2-3 lần/ngày', warning: 'Không dùng cho vết thương quá sâu.', stock: 100, unit: 'chai' },
      { id: 'M09', name: 'Mỡ kháng sinh Neosporin', category: 'skin', icon: '🧴', usage: 'Bôi vết thương nhỏ, trầy xước', dosage: 'Bôi mỏng 1-3 lần/ngày sau khi rửa sạch', warning: 'Dừng nếu bị kích ứng.', stock: 80, unit: 'tuýp' },
      { id: 'M10', name: 'Kem chống nước ăn chân', category: 'skin', icon: '🦶', usage: 'Phòng và trị nấm da, nước ăn chân do ngâm lũ', dosage: 'Bôi 2 lần/ngày, rửa sạch lau khô trước', warning: 'Giữ chân khô ráo khi có thể.', stock: 200, unit: 'tuýp' },

      // Dị ứng & Khác
      { id: 'M11', name: 'Loratadine 10mg', category: 'other', icon: '💊', usage: 'Chống dị ứng, nổi mề đay, ngứa', dosage: '1 viên/ngày', warning: 'Có thể gây buồn ngủ nhẹ.', stock: 200, unit: 'viên' },
      { id: 'M12', name: 'Thuốc nhỏ mắt Natri Clorid', category: 'other', icon: '👁️', usage: 'Rửa mắt khi bị bụi bẩn, nước lũ vào mắt', dosage: 'Nhỏ 2-3 giọt/mắt khi cần', warning: 'Không dùng chung lọ.', stock: 150, unit: 'lọ' },
    ];
  }

  getFirstAidGuides() {
    return [
      {
        id: 'FA01', title: 'Sơ cứu đuối nước', icon: '🏊', severity: 'critical',
        steps: [
          'Gọi ngay hotline 0912127142. Đưa nạn nhân ra khỏi nước AN TOÀN.',
          'Đặt nạn nhân nằm ngửa trên mặt phẳng. Kiểm tra hô hấp.',
          'Nếu KHÔNG THỞ: Hà hơi thổi ngạt 2 lần, sau đó ấn tim 30 lần (giữa ngực, sâu 5cm, 100-120 lần/phút).',
          'Lặp lại chu kỳ 30 ấn tim + 2 thổi ngạt cho đến khi nạn nhân thở hoặc có người đến hỗ trợ.',
          'Khi nạn nhân thở lại: nghiêng người sang bên, giữ ấm, KHÔNG cho uống nước.'
        ]
      },
      {
        id: 'FA02', title: 'Hạ thân nhiệt', icon: '🥶', severity: 'high',
        steps: [
          'Nhận biết: Run rẩy, da tím tái, lú lẫn, nói lắp, buồn ngủ.',
          'Đưa vào nơi khô ráo, kín gió ngay lập tức.',
          'Cởi bỏ quần áo ướt, thay quần áo khô hoặc quấn chăn.',
          'Cho uống nước ấm (KHÔNG nóng). KHÔNG cho uống rượu.',
          'Ôm nạn nhân để truyền nhiệt. Chườm ấm nách, cổ, háng.',
          'Nếu bất tỉnh → gọi 0912127142 ngay.'
        ]
      },
      {
        id: 'FA03', title: 'Vết thương & Chảy máu', icon: '🩸', severity: 'high',
        steps: [
          'Rửa tay sạch trước khi xử lý (hoặc đeo găng tay).',
          'Rửa vết thương bằng nước sạch. Lấy dị vật nếu thấy.',
          'Ấn chặt gạc/vải sạch lên vết thương 10-15 phút.',
          'Băng lại bằng băng gạc sạch. Thay băng 1-2 lần/ngày.',
          'Nếu chảy máu không ngừng, máu phun thành tia → gọi 0912127142 NGAY, giữ ấn chặt vết thương.'
        ]
      },
      {
        id: 'FA04', title: 'Tiêu chảy & Mất nước', icon: '🤒', severity: 'medium',
        steps: [
          'Pha ORS đúng liều: 1 gói + 1 lít nước sạch.',
          'Cho uống từng ngụm nhỏ, liên tục cả ngày.',
          'Tiếp tục ăn uống bình thường (cháo, cơm, chuối).',
          'Trẻ em: cho bú mẹ bình thường + ORS.',
          'Nếu đi ngoài > 10 lần/ngày, có máu, hoặc sốt cao → gọi 0912127142.'
        ]
      },
      {
        id: 'FA05', title: 'Rắn/Côn trùng cắn', icon: '🐍', severity: 'critical',
        steps: [
          'BÌNH TĨNH. Không hút nọc, không garrot quá chặt.',
          'Rửa sạch vết cắn bằng nước. Bất động chi bị cắn.',
          'Đánh dấu vùng sưng bằng bút, ghi giờ cắn.',
          'Gọi 0912127142 NGAY. Cố nhớ hình dạng rắn.',
          'KHÔNG: chích, rạch, hút nọc, bôi thuốc lá, uống rượu.'
        ]
      },
      {
        id: 'FA06', title: 'Điện giật trong lũ', icon: '⚡', severity: 'critical',
        steps: [
          'KHÔNG chạm nạn nhân nếu còn tiếp xúc nguồn điện!',
          'Cắt nguồn điện ngay nếu có thể (cầu dao, công tắc).',
          'Dùng vật cách điện khô (gậy gỗ, nhựa) tách nạn nhân.',
          'Kiểm tra hô hấp → CPR nếu không thở.',
          'Gọi 0912127142. Tất cả điện giật đều cần kiểm tra tim.'
        ]
      }
    ];
  }

  render() {
    const panel = document.getElementById('emergency-panel');
    if (!panel) return;

    const medicines = this.getMedicines();
    const filteredMeds = this.medCategory === 'all' ? medicines : medicines.filter(m => m.category === this.medCategory);
    const guides = this.getFirstAidGuides();

    const medCategories = [
      { id: 'all', label: 'Tất cả', icon: '📋' },
      { id: 'fever', label: 'Hạ sốt', icon: '🌡️' },
      { id: 'digest', label: 'Tiêu hóa', icon: '🤢' },
      { id: 'antibiotic', label: 'Kháng sinh', icon: '🦠' },
      { id: 'skin', label: 'Ngoài da', icon: '🩹' },
      { id: 'other', label: 'Khác', icon: '💊' }
    ];

    panel.innerHTML = `
      <div class="emergency-layout">
        <!-- HOTLINE BANNER -->
        <div class="emergency-header-bar">
          <div class="hotline-banner">
            <div class="hotline-icon">📞</div>
            <div class="hotline-info">
              <div class="hotline-label">🚨 Đường dây nóng cứu trợ khẩn cấp</div>
              <div class="hotline-number">0912 127 142</div>
              <div class="hotline-note">Hoạt động 24/7 · Hội Chữ thập đỏ Việt Nam · Gọi ngay khi cần</div>
            </div>
            <a href="tel:0912127142" class="hotline-call-btn">
              📞 GỌI NGAY
            </a>
          </div>
        </div>

        <!-- QUICK ACTIONS -->
        <div class="emergency-quick">
          <button class="emergency-quick-btn sos" onclick="emergencyMode.sendSOS()">
            <span class="icon">🆘</span>
            <span class="label">Gửi SOS Khẩn cấp</span>
          </button>
          <button class="emergency-quick-btn" onclick="emergencyMode.scrollTo('health-form-section')">
            <span class="icon">📋</span>
            <span class="label">Báo tình hình sức khỏe</span>
          </button>
          <button class="emergency-quick-btn" onclick="emergencyMode.scrollTo('medicine-section')">
            <span class="icon">💊</span>
            <span class="label">Tra cứu thuốc men</span>
          </button>
          <button class="emergency-quick-btn" onclick="emergencyMode.scrollTo('firstaid-section')">
            <span class="icon">🩹</span>
            <span class="label">Hướng dẫn sơ cứu</span>
          </button>
        </div>

        <!-- LEFT COLUMN -->
        <div style="display:flex; flex-direction:column; gap:var(--space-4);">

          <!-- HEALTH REPORT FORM -->
          <div class="card" id="health-form-section">
            <div style="display:flex; align-items:center; gap:var(--space-2); margin-bottom:var(--space-4);">
              <span style="font-size:20px;">📋</span>
              <h3 style="font-size:var(--text-base); font-weight:var(--font-bold);">Báo cáo tình hình sức khỏe</h3>
            </div>

            <div class="health-form">
              <div class="health-field">
                <span class="health-label">Họ tên người bệnh</span>
                <input type="text" class="health-input" id="health-name" placeholder="Nhập họ tên..." />
              </div>

              <div class="health-field">
                <span class="health-label">Triệu chứng</span>
                <select class="health-select" id="health-symptom">
                  <option value="">-- Chọn triệu chứng --</option>
                  <option value="Sốt cao">🌡️ Sốt cao (&gt;38.5°C)</option>
                  <option value="Tiêu chảy">🤢 Tiêu chảy / Nôn mửa</option>
                  <option value="Khó thở">😮‍💨 Khó thở</option>
                  <option value="Vết thương chảy máu">🩸 Vết thương chảy máu</option>
                  <option value="Hạ thân nhiệt">🥶 Hạ thân nhiệt / Run rẩy</option>
                  <option value="Đuối nước">🏊 Đuối nước (đã cứu lên)</option>
                  <option value="Nhiễm trùng da">🦠 Nhiễm trùng da / Nước ăn chân</option>
                  <option value="Dị ứng">😷 Dị ứng nổi mề đay</option>
                  <option value="Gãy xương">🦴 Nghi gãy xương</option>
                  <option value="Đau bụng">🤕 Đau bụng dữ dội</option>
                  <option value="Bệnh mãn tính">💊 Bệnh mãn tính cần thuốc</option>
                  <option value="Bất tỉnh">😵 Bất tỉnh / Không phản ứng</option>
                  <option value="Ngừng thở">💀 Ngừng thở / Tim ngừng đập</option>
                  <option value="Chảy máu nặng">🩸 Chảy máu không cầm được</option>
                  <option value="Tâm lý">😰 Hoảng loạn / Sang chấn tâm lý</option>
                  <option value="Khác">📝 Khác</option>
                </select>
              </div>

              <div class="health-field">
                <span class="health-label">Số người bị ảnh hưởng</span>
                <input type="number" class="health-input" id="health-count" placeholder="1" min="1" max="50" value="1" />
              </div>

              <div class="health-field">
                <span class="health-label">Mô tả chi tiết (càng chi tiết, AI phân tích càng chính xác)</span>
                <textarea class="health-textarea" id="health-detail" rows="4" placeholder="Mô tả triệu chứng: thời gian bắt đầu, mức đau (1-10), có sốt không, đã dùng thuốc gì, tiền sử bệnh, tuổi bệnh nhân..."></textarea>
              </div>

              <div style="background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.2); border-radius:8px; padding:10px; margin-bottom:12px;">
                <div style="font-size:11px; color:#93c5fd;">🤖 <strong>AI Tự động phân loại</strong> – Groq AI sẽ phân tích triệu chứng và quyết định mức độ khẩn cấp (🔴 Đỏ / 🟡 Vàng / 🟢 Xanh), đề xuất cử người hay drone.</div>
              </div>

              <div id="ai-analysis-loading" style="display:none; text-align:center; padding:12px;">
                <div style="font-size:14px;">🤖 AI đang phân tích triệu chứng...</div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Groq LLaMA 3.3 70B</div>
              </div>

              <div style="display:flex; gap:var(--space-3);">
                <button class="btn btn-primary btn-lg" id="health-submit-btn" onclick="emergencyMode.submitHealthReport()" style="flex:1;">
                  🤖 Gửi & AI Phân tích
                </button>
                <a href="tel:0912127142" class="btn btn-danger btn-lg">
                  📞 Gọi 0912127142
                </a>
              </div>
            </div>
          </div>

          <!-- RECENT HEALTH REPORTS -->
          <div class="card">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-3);">
              <div style="display:flex; align-items:center; gap:var(--space-2);">
                <span style="font-size:16px;">📊</span>
                <span style="font-size:var(--text-sm); font-weight:var(--font-bold);">Báo cáo gần đây</span>
              </div>
              <span class="badge badge-info">${this.healthReports.length} báo cáo</span>
            </div>
            <div id="health-reports-list">
              ${this.renderHealthReports()}
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div style="display:flex; flex-direction:column; gap:var(--space-4);">

          <!-- FIRST AID GUIDES -->
          <div class="card" id="firstaid-section">
            <div style="display:flex; align-items:center; gap:var(--space-2); margin-bottom:var(--space-4);">
              <span style="font-size:20px;">🩹</span>
              <h3 style="font-size:var(--text-base); font-weight:var(--font-bold);">Hướng dẫn sơ cứu</h3>
            </div>
            ${guides.map(g => `
              <div class="firstaid-card ${this.expandedGuide === g.id ? 'expanded' : ''}" onclick="emergencyMode.toggleGuide('${g.id}')">
                <div class="firstaid-header">
                  <span class="firstaid-icon">${g.icon}</span>
                  <span class="firstaid-title">${g.title}</span>
                  <span class="badge ${g.severity === 'critical' ? 'badge-danger' : g.severity === 'high' ? 'badge-warning' : 'badge-info'}">${g.severity === 'critical' ? 'Nguy kịch' : g.severity === 'high' ? 'Nguy hiểm' : 'Cần chú ý'}</span>
                  <span class="firstaid-expand">▼</span>
                </div>
                <div class="firstaid-content">
                  ${g.steps.map((step, i) => `
                    <div class="firstaid-step">
                      <div class="firstaid-step-num">${i + 1}</div>
                      <div class="firstaid-step-text">${step}</div>
                    </div>
                  `).join('')}
                  <div style="margin-top:var(--space-3); padding-top:var(--space-2); border-top:1px solid var(--border-secondary);">
                    <a href="tel:0912127142" class="btn btn-danger" style="width:100%; justify-content:center;">
                      📞 Gọi cấp cứu: 0912 127 142
                    </a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- MEDICINE GUIDE -->
          <div class="card" id="medicine-section">
            <div style="display:flex; align-items:center; gap:var(--space-2); margin-bottom:var(--space-3);">
              <span style="font-size:20px;">💊</span>
              <h3 style="font-size:var(--text-base); font-weight:var(--font-bold);">Tra cứu thuốc men</h3>
            </div>

            <div class="med-category-tabs">
              ${medCategories.map(c => `
                <button class="btn ${this.medCategory === c.id ? 'btn-primary' : 'btn-ghost'}" 
                  onclick="emergencyMode.setMedCategory('${c.id}')" style="font-size:11px; padding:4px 10px; white-space:nowrap;">
                  ${c.icon} ${c.label}
                </button>
              `).join('')}
            </div>

            <div style="max-height:400px; overflow-y:auto;">
              ${filteredMeds.map(m => `
                <div class="med-card">
                  <div class="med-icon">${m.icon}</div>
                  <div class="med-info">
                    <div class="med-name">${m.name}</div>
                    <div class="med-usage">${m.usage}</div>
                    <div style="margin-top:4px;">
                      <span class="med-dosage">💊 ${m.dosage}</span>
                    </div>
                    <div style="font-size:10px; color:var(--color-warning-light); margin-top:4px;">
                      ⚠ ${m.warning}
                    </div>
                  </div>
                  <div style="text-align:right; min-width:50px;">
                    <div style="font-family:var(--font-mono); font-size:var(--text-sm); font-weight:var(--font-bold);">${m.stock}</div>
                    <div style="font-size:10px; color:var(--text-muted);">${m.unit}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:var(--space-3); padding:var(--space-3); background:rgba(245,158,11,0.08); border-radius:var(--radius-sm); border:1px solid rgba(245,158,11,0.2);">
              <div style="font-size:var(--text-xs); color:var(--color-warning-light); font-weight:var(--font-semibold);">
                ⚠ LƯU Ý QUAN TRỌNG
              </div>
              <div style="font-size:var(--text-xs); color:var(--text-secondary); margin-top:4px; line-height:1.6;">
                Chỉ dùng thuốc khi chắc chắn. Kháng sinh CHỈ dùng khi có chỉ định y tế.
                Liên hệ hotline <strong style="color:var(--color-danger-light);">0912 127 142</strong> nếu không chắc chắn.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderHealthReports() {
    if (this.healthReports.length === 0) {
      return '<div style="text-align:center; padding:var(--space-4); color:var(--text-muted); font-size:var(--text-xs);">Chưa có báo cáo sức khỏe.<br>Hãy điền form bên trên – AI sẽ tự động phân loại.</div>';
    }

    return this.healthReports.map(r => {
      const severityColors = { low: 'var(--color-success)', medium: 'var(--color-warning)', high: 'var(--color-danger)' };
      const severityLabels = { low: '🟢 Xanh', medium: '🟡 Vàng', high: '🔴 Đỏ' };
      const color = severityColors[r.severity] || 'var(--text-muted)';
      return `
        <div class="health-report-item" style="border-left:3px solid ${color};">
          <div class="health-report-severity" style="background:${color};box-shadow:0 0 8px ${color};"></div>
          <div class="health-report-info">
            <div class="health-report-name">
              ${r.name}
              <span class="badge ${r.severity === 'high' ? 'badge-danger' : r.severity === 'medium' ? 'badge-warning' : 'badge-success'}" style="font-size:9px;">${severityLabels[r.severity] || '⏳'}</span>
              <span style="font-size:9px; background:rgba(59,130,246,0.15); color:#93c5fd; padding:1px 6px; border-radius:4px; margin-left:4px;">🤖 AI</span>
            </div>
            <div class="health-report-detail">${r.symptom} · ${r.count} người</div>
            ${r.aiAnalysis ? `<div style="margin-top:6px; padding:8px; background:rgba(15,23,42,0.5); border-radius:6px; font-size:11px; color:#cbd5e1; line-height:1.5;">
              <div style="font-weight:bold; color:#93c5fd; margin-bottom:3px;">🤖 Phân tích AI:</div>
              ${r.aiAnalysis}
            </div>` : ''}
            ${r.dispatch ? `<div style="margin-top:4px; padding:4px 8px; background:${r.severity === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'}; border-radius:4px; font-size:10px; font-weight:bold; color:${r.severity === 'high' ? '#fca5a5' : '#6ee7b7'};">
              ${r.dispatch}
            </div>` : ''}
          </div>
          <div class="health-report-time">${r.time}</div>
        </div>
      `;
    }).join('');
  }

  setMedCategory(cat) {
    this.medCategory = cat;
    this.render();
  }

  toggleGuide(id) {
    this.expandedGuide = this.expandedGuide === id ? null : id;
    this.render();
  }

  scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  sendSOS() {
    showToast('🆘 TÍN HIỆU SOS ĐÃ GỬI QUA LORA! Đội cứu trợ sẽ đến nhanh nhất có thể.', 'danger');

    FloodData.messages.unshift({
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      from: 'Emergency Mode',
      type: 'sos',
      text: '🆘 SOS KHẨN CẤP – Yêu cầu hỗ trợ ngay lập tức!'
    });

    if (confirm('🆘 SOS ĐÃ GỬI!\n\nBạn có muốn gọi hotline cứu trợ\n0912 127 142 ngay bây giờ?')) {
      window.open('tel:0912127142');
    }
  }

  async submitHealthReport() {
    const name = document.getElementById('health-name')?.value?.trim();
    const symptom = document.getElementById('health-symptom')?.value;
    const count = document.getElementById('health-count')?.value || '1';
    const detail = document.getElementById('health-detail')?.value?.trim();

    if (!name) { showToast('⚠ Vui lòng nhập họ tên', 'danger'); return; }
    if (!symptom) { showToast('⚠ Vui lòng chọn triệu chứng', 'danger'); return; }

    // Show loading
    const loadingEl = document.getElementById('ai-analysis-loading');
    const submitBtn = document.getElementById('health-submit-btn');
    if (loadingEl) loadingEl.style.display = 'block';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '⏳ AI đang phân tích...'; }

    // Call Groq AI for triage
    let aiResult = { severity: 'medium', analysis: '', dispatch: '' };
    try {
      aiResult = await this.analyzeWithGroq(name, symptom, count, detail);
    } catch (err) {
      console.warn('AI analysis failed, using fallback:', err);
      aiResult = this.fallbackTriage(symptom);
    }

    if (loadingEl) loadingEl.style.display = 'none';
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '🤖 Gửi & AI Phân tích'; }

    const report = {
      id: `HR-${Date.now()}`,
      name, symptom,
      severity: aiResult.severity,
      count: parseInt(count),
      detail,
      aiAnalysis: aiResult.analysis,
      dispatch: aiResult.dispatch,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    this.healthReports.unshift(report);

    // Sync to Firestore
    if (typeof firestoreSync !== 'undefined' && firestoreSync.connected) {
      firestoreSync.saveHealthReport(report);
      firestoreSync.saveDispatch({
        reportId: report.id, name, symptom,
        severity: aiResult.severity,
        dispatch: aiResult.dispatch,
        time: report.time
      });
    }

    FloodData.messages.unshift({
      time: report.time, from: 'AI Y tế',
      type: aiResult.severity === 'high' ? 'sos' : 'alert',
      text: `🤖 AI: ${name} – ${symptom} → ${aiResult.severity === 'high' ? '🔴 NGUY KỊCH' : aiResult.severity === 'medium' ? '🟡 NẶNG' : '🟢 NHẸ'} – ${aiResult.dispatch}`
    });

    const toastType = aiResult.severity === 'high' ? 'danger' : aiResult.severity === 'medium' ? 'warning' : 'success';
    showToast(`🤖 AI: ${name} → ${aiResult.severity === 'high' ? '🔴 Đỏ' : aiResult.severity === 'medium' ? '🟡 Vàng' : '🟢 Xanh'} – ${aiResult.dispatch}`, toastType);

    if (aiResult.severity === 'high') {
      showToast('🚨 NGUY KỊCH – Đã cử bác sĩ + thuyền cứu hộ! Gọi 0912127142!', 'danger');
    }

    this.render();
  }

  async analyzeWithGroq(name, symptom, count, detail) {
    const apiKey = chatbot?.apiKey;
    if (!apiKey) throw new Error('No API key');

    const prompt = `Phân tích y tế khẩn cấp trong lũ lụt:
- Bệnh nhân: ${name}
- Triệu chứng: ${symptom}
- Số người: ${count}
- Mô tả: ${detail || 'Không có'}

Trả lời CHÍNH XÁC theo format JSON (KHÔNG thêm text ngoài JSON):
{"severity":"high/medium/low","analysis":"phân tích ngắn 1-2 câu","dispatch":"đề xuất cử ai (ưu tiên người hơn drone)"}

Quy tắc:
- high: Đuối nước, bất tỉnh, ngừng thở, chảy máu nặng, gãy xương → Cử BÁC SĨ + THUYỀN CỨU HỘ
- medium: Sốt cao, hạ thân nhiệt, tiêu chảy nặng, đau bụng dữ dội → Cử Y TÁ + THUYỀN
- low: Cảm lạnh, trầy xước, dị ứng nhẹ, stress → Cử TÌNH NGUYỆN VIÊN hoặc DRONE y tế`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2, max_tokens: 200
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const text = data.choices[0]?.message?.content || '';

    // Parse JSON from response
    const jsonMatch = text.match(/\{[^}]+\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        severity: ['high', 'medium', 'low'].includes(parsed.severity) ? parsed.severity : 'medium',
        analysis: parsed.analysis || '',
        dispatch: parsed.dispatch || ''
      };
    }
    throw new Error('Invalid AI response');
  }

  fallbackTriage(symptom) {
    const critical = ['Đuối nước', 'Bất tỉnh', 'Ngừng thở', 'Chảy máu nặng'];
    const serious = ['Sốt cao', 'Hạ thân nhiệt', 'Gãy xương', 'Khó thở', 'Đau bụng', 'Vết thương chảy máu'];

    if (critical.includes(symptom)) {
      return { severity: 'high', analysis: 'Tình trạng nguy kịch – cần can thiệp y tế ngay', dispatch: '👤 Cử BS + 🚤 Thuyền cứu hộ NGAY' };
    } else if (serious.includes(symptom)) {
      return { severity: 'medium', analysis: 'Tình trạng cần theo dõi y tế', dispatch: '👤 Cử Y tá + 🚤 Thuyền' };
    }
    return { severity: 'low', analysis: 'Tình trạng nhẹ, có thể xử lý tại chỗ', dispatch: '👤 Tình nguyện viên hoặc ✈️ Drone y tế' };
  }
}
