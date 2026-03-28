/* ============================================
   FloodLink 2.0 – Groq AI Emergency Chatbot
   ============================================ */

class Chatbot {
  constructor() {
    this.apiKey = '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';
    this.isOpen = false;
    this.isTyping = false;
    this.messages = [];
    this.model = 'llama-3.3-70b-versatile';
    this.systemPrompt = this.buildSystemPrompt();
  }

  buildSystemPrompt() {
    return `Bạn là FloodLink AI – Hệ thống phân tích & điều phối cứu trợ lũ lụt AI, được phát triển cho Hội Chữ thập đỏ Việt Nam.

NHIỆM VỤ CHÍNH:
1. PHÂN TÍCH TRIỆU CHỨNG: Khi nhận mô tả sức khỏe, phân loại mức độ:
   - 🔴 ĐỎ (Nguy kịch): Đuối nước, ngừng thở, chảy máu nặng, bất tỉnh → CỬ BÁC SĨ + THUYỀN CỨU HỘ NGAY
   - 🟡 VÀNG (Nặng): Gãy xương, sốt cao >39°C, mất nước nặng, hạ thân nhiệt → CỬ Y TÁ + THUYỀN CỨU HỘ
   - 🟢 XANH (Nhẹ): Trầy xước, cảm lạnh, stress, đau đầu → CỬ TÌNH NGUYỆN VIÊN hoặc DRONE y tế

2. ĐIỀU PHỐI THÔNG MINH (ưu tiên NGƯỜI hơn DRONE):
   - Mức ĐỎ/VÀNG: LUÔN cử NGƯỜI (bác sĩ/y tá + thuyền cứu hộ). Drone chỉ hỗ trợ giám sát.
   - Mức XANH: Có thể cử drone giao thuốc/vật tư NẾU không có người gần đó.
   - Thuyền cứu hộ (rescue): Ưu tiên vận chuyển bệnh nhân, cứu người mắc kẹt
   - Thuyền viện trợ (supply): Giao lương thực, thuốc, vật tư

3. KHI NHẬN YÊU CẦU KHẨN CẤP, trả lời theo FORMAT:
   ┌─────────────────────────┐
   🚨 PHÂN LOẠI: [ĐỎ/VÀNG/XANH]
   📋 TRIỆU CHỨNG: [tóm tắt]
   👤 CỬ NGAY: [tên người + vai trò]
   🚤 PHƯƠNG TIỆN: [thuyền cứu hộ/viện trợ]
   ✈️ DRONE: [có/không + mục đích]
   ⏱️ THỜI GIAN DỰ KIẾN: [x phút]
   📍 LƯU Ý: [hướng dẫn sơ cứu tại chỗ]
   └─────────────────────────┘

4. KHI PHÂN TÍCH TÌNH HÌNH: Dùng dữ liệu thời gian thực về hộ dân, vật tư, drone, tình nguyện viên để đưa ra khuyến nghị.

QUY TẮC:
- Trả lời bằng tiếng Việt, ngắn gọn nhưng đầy đủ
- Ưu tiên SỰ SỐNG – mọi hướng dẫn phải an toàn
- NGƯỜI > DRONE trong mọi tình huống y tế
- Khi không chắc chắn: đề xuất gọi 113/114/115 hoặc hotline 0912-127-142
- Sử dụng emoji phù hợp, format rõ ràng`;
  }

  getContextInfo() {
    const inv = FloodData.inventory;
    const critical = FloodData.households.filter(h => h.score >= 80).length;
    const delivered = FloodData.households.filter(h => h.status === 'delivered').length;
    const activeDrones = FloodData.drones.filter(d => d.status === 'flying').length;

    return `\n\n[DỮ LIỆU THỜI GIAN THỰC]
- Tổng hộ dân: ${FloodData.households.length} | Đã cứu: ${delivered} | Khẩn cấp (≥80): ${critical}
- Vật tư đã giao: ${inv.distributed}/${inv.totalBags} túi | Tốc độ: ${inv.rate} túi/giờ
- Drone hoạt động: ${activeDrones}/${FloodData.drones.length}
- Hàng tồn kho còn: ${inv.remaining} túi
- Tình nguyện viên: ${FloodData.rescueTeams.volunteers.filter(v=>v.status==='active').length} hoạt động / ${FloodData.rescueTeams.volunteers.length} tổng
- Thuyền cứu hộ: ${FloodData.rescueTeams.boats.filter(b=>b.status!=='standby').length} đang hoạt động / ${FloodData.rescueTeams.boats.length} tổng
- Chuyên gia y tế: ${FloodData.rescueTeams.experts.filter(e=>e.status==='active').length} sẵn sàng / ${FloodData.rescueTeams.experts.length} tổng
- Lịch sử điều phối: ${FloodData.dispatchLog.length} lệnh đã cử`;
  }

  init() {
    this.renderPanel();
    this.bindEvents();

    // Auto-connect (API key is hardcoded)
    setTimeout(() => {
      const container = document.getElementById('chat-api-key');
      if (container) {
        container.classList.add('connected');
        container.innerHTML = `
          <span style="font-size:12px;">✅</span>
          <span style="font-size:var(--text-xs); color:var(--color-success-light); flex:1;">Groq AI đã kết nối</span>
        `;
      }
    }, 500);

    // Add welcome message
    this.messages.push({
      role: 'bot',
      content: `👋 Xin chào! Tôi là **FloodLink AI** – trợ lý khẩn cấp cứu trợ lũ lụt.

Tôi có thể giúp bạn:
- 🚨 **Phân tích tình huống** và cử người/thuyền/drone phù hợp
- 🩹 Sơ cứu đuối nước, hạ thân nhiệt, chấn thương
- 📊 Phân tích triệu chứng, xếp loại mức độ khẩn cấp
- 🚤 Điều phối thuyền cứu hộ & thuyền viện trợ
- 👥 Theo dõi tình nguyện viên, bác sĩ, chuyên gia
- ✈️ Quản lý 20 drone giám sát

⚡ **Groq AI đã sẵn sàng** – Hãy mô tả tình huống để tôi phân tích và điều phối!`
    });
  }

  renderPanel() {
    // FAB button
    const fab = document.createElement('button');
    fab.className = 'chat-fab';
    fab.id = 'chat-fab';
    fab.innerHTML = '🤖';
    fab.onclick = () => this.toggle();
    document.body.appendChild(fab);

    // Chat panel
    const panel = document.createElement('div');
    panel.className = 'chat-panel';
    panel.id = 'chat-panel';
    panel.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-avatar">🤖</div>
        <div class="chat-header-info">
          <div class="chat-header-name">FloodLink AI – Trợ lý Khẩn cấp</div>
          <div class="chat-header-status">
            <span class="status-dot status-dot-online" style="width:6px;height:6px;"></span>
            <span>Groq LLaMA 3.3 70B</span>
          </div>
        </div>
        <button class="chat-close" onclick="chatbot.toggle()">✕</button>
      </div>

      <div class="chat-api-key" id="chat-api-key">
        <span style="font-size:12px;">🔑</span>
        <input type="password" id="groq-api-key" placeholder="Nhập Groq API Key..." />
        <button onclick="chatbot.setApiKey()">Kết nối</button>
      </div>

      <div class="chat-messages" id="chat-messages"></div>

      <div class="chat-suggestions" id="chat-suggestions">
        <button class="chat-suggestion" onclick="chatbot.sendSuggestion('Hướng dẫn sơ tán khi nước dâng nhanh')">🚨 Sơ tán khẩn</button>
        <button class="chat-suggestion" onclick="chatbot.sendSuggestion('Sơ cứu người đuối nước')">🩹 Sơ cứu đuối nước</button>
        <button class="chat-suggestion" onclick="chatbot.sendSuggestion('Vật phẩm cần thiết cho cứu trợ lũ lụt')">📦 Vật phẩm cần thiết</button>
        <button class="chat-suggestion" onclick="chatbot.sendSuggestion('Phân tích tình hình hiện tại và đề xuất ưu tiên')">📊 Phân tích tình hình</button>
        <button class="chat-suggestion" onclick="chatbot.sendSuggestion('Cách bảo quản thực phẩm trong lũ')">🍚 Bảo quản thực phẩm</button>
        <button class="chat-suggestion" onclick="chatbot.sendSuggestion('Phòng chống dịch bệnh sau lũ')">💊 Phòng dịch bệnh</button>
      </div>

      <div class="chat-input-area">
        <textarea class="chat-input" id="chat-input" placeholder="Nhập câu hỏi khẩn cấp..." rows="1"></textarea>
        <button class="chat-send" id="chat-send" onclick="chatbot.send()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(panel);
  }

  bindEvents() {
    const input = document.getElementById('chat-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.send();
        }
      });

      // Auto-resize
      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 100) + 'px';
      });
    }

    // Alt+C shortcut
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  setApiKey() {
    const input = document.getElementById('groq-api-key');
    const container = document.getElementById('chat-api-key');
    if (input && input.value.trim()) {
      this.apiKey = input.value.trim();
      container.classList.add('connected');
      container.innerHTML = `
        <span style="font-size:12px;">✅</span>
        <span style="font-size:var(--text-xs); color:var(--color-success-light); flex:1;">Đã kết nối Groq API</span>
        <button onclick="chatbot.disconnectApi()" style="background:transparent; border:1px solid var(--border-primary); color:var(--text-muted); padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Ngắt</button>
      `;
      showToast('✅ Đã kết nối Groq API thành công!', 'success');
    }
  }

  disconnectApi() {
    this.apiKey = '';
    const container = document.getElementById('chat-api-key');
    container.classList.remove('connected');
    container.innerHTML = `
      <span style="font-size:12px;">🔑</span>
      <input type="password" id="groq-api-key" placeholder="Nhập Groq API Key..." />
      <button onclick="chatbot.setApiKey()">Kết nối</button>
    `;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const panel = document.getElementById('chat-panel');
    if (panel) {
      panel.classList.toggle('open', this.isOpen);
      if (this.isOpen) this.renderMessages();
    }
  }

  async send() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';
    input.style.height = 'auto';

    // Add user message
    this.messages.push({ role: 'user', content: text });
    this.renderMessages();

    // Check API key
    if (!this.apiKey) {
      this.messages.push({
        role: 'bot',
        content: '⚠️ Chưa kết nối Groq API. Vui lòng nhập **API Key** ở thanh bên trên để tôi có thể hỗ trợ bạn.\n\nBạn có thể lấy API key miễn phí tại: [console.groq.com](https://console.groq.com)'
      });
      this.renderMessages();
      return;
    }

    // Show typing
    this.isTyping = true;
    this.renderMessages();

    try {
      const response = await this.callGroq(text);
      this.isTyping = false;
      this.messages.push({ role: 'bot', content: response });
    } catch (err) {
      this.isTyping = false;
      this.messages.push({
        role: 'bot',
        content: `❌ Lỗi kết nối: ${err.message}\n\nVui lòng kiểm tra API key hoặc kết nối mạng.`
      });
    }

    this.renderMessages();
  }

  sendSuggestion(text) {
    const input = document.getElementById('chat-input');
    if (input) {
      input.value = text;
      this.send();
    }
  }

  async callGroq(userMessage) {
    const apiMessages = [
      { role: 'system', content: this.systemPrompt + this.getContextInfo() }
    ];

    // Add last 10 messages for context
    const recentMsgs = this.messages.slice(-10);
    recentMsgs.forEach(m => {
      if (m.role === 'user') {
        apiMessages.push({ role: 'user', content: m.content });
      } else if (m.role === 'bot') {
        apiMessages.push({ role: 'assistant', content: m.content });
      }
    });

    apiMessages.push({ role: 'user', content: userMessage });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Không nhận được phản hồi.';
  }

  renderMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    let html = '';

    this.messages.forEach(msg => {
      const isUser = msg.role === 'user';
      const formatted = isUser ? this.escapeHtml(msg.content) : this.formatMarkdown(msg.content);

      html += `
        <div class="chat-msg ${isUser ? 'user' : 'bot'}">
          <div class="chat-msg-avatar">${isUser ? '👤' : '🤖'}</div>
          <div class="chat-msg-content">${formatted}</div>
        </div>
      `;
    });

    if (this.isTyping) {
      html += `
        <div class="chat-msg bot">
          <div class="chat-msg-avatar">🤖</div>
          <div class="chat-msg-content">
            <div class="chat-typing">
              <div class="chat-typing-dots">
                <div class="chat-typing-dot"></div>
                <div class="chat-typing-dot"></div>
                <div class="chat-typing-dot"></div>
              </div>
              <span style="font-size:var(--text-xs); color:var(--text-muted);">Đang suy nghĩ...</span>
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
  }

  formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^### (.+)$/gm, '<strong style="font-size:1.05em;">$1</strong>')
      .replace(/^## (.+)$/gm, '<strong style="font-size:1.1em;">$1</strong>')
      .replace(/^# (.+)$/gm, '<strong style="font-size:1.15em;">$1</strong>')
      .replace(/^- (.+)$/gm, '• $1')
      .replace(/^\d+\. (.+)$/gm, (match, p1, offset, str) => `${match}`)
      .replace(/\n/g, '<br>');
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }
}
