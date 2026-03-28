/* ============================================
   FloodLink 2.0 – Elder Mode (Voice-only)
   ============================================ */

class ElderMode {
  constructor() {
    this.isActive = false;
    this.isListening = false;
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.statusEl = null;
    this.circleEl = null;
    this.waveEl = null;
  }

  init() {
    this.statusEl = document.getElementById('elder-status');
    this.circleEl = document.getElementById('elder-voice-circle');
    this.waveEl = document.getElementById('elder-voice-wave');

    // Try to set up speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'vi-VN';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        this.processVoice(transcript);
      };

      this.recognition.onerror = (event) => {
        this.setStatus('Không nghe rõ. Vui lòng nói lại hoặc nhấn nút bên dưới.', '');
        this.setCircleState('');
        this.setWaveActive(false);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.setWaveActive(false);
        if (this.isActive) {
          setTimeout(() => this.startListening(), 2000);
        }
      };
    }

    // Keyboard fallback
    document.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      if (e.key === '1') this.executeCommand('sos');
      if (e.key === '2') this.executeCommand('confirm');
      if (e.key === '3') this.executeCommand('warm');
      if (e.key === 'Escape') this.deactivate();
    });
  }

  activate() {
    this.isActive = true;
    document.getElementById('elder-mode').classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      this.speak('Xin chào, FloodLink đã sẵn sàng. Bạn cần gì?');
      this.setStatus('Xin chào, FloodLink đã sẵn sàng.\nBạn cần gì?', '');
      this.setCircleState('');

      setTimeout(() => this.startListening(), 2500);
    }, 500);
  }

  deactivate() {
    this.isActive = false;
    this.isListening = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch(e) {}
    }
    document.getElementById('elder-mode').classList.remove('active');
    document.body.style.overflow = '';
  }

  startListening() {
    if (!this.isActive) return;

    this.isListening = true;
    this.setCircleState('listening');
    this.setWaveActive(true);
    this.setStatus('Đang lắng nghe...', '');

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch(e) {
        // Already started
      }
    }
  }

  processVoice(text) {
    this.setCircleState('processing');
    this.setWaveActive(false);
    this.setStatus(`Đang xử lý: "${text}"`, '');

    // Match commands
    if (text.includes('cứu trợ') || text.includes('cứu') || text.includes('giúp') || text.includes('sos')) {
      setTimeout(() => this.executeCommand('sos'), 800);
    } else if (text.includes('nhận hàng') || text.includes('nhận') || text.includes('đã nhận')) {
      setTimeout(() => this.executeCommand('confirm'), 800);
    } else if (text.includes('sưởi') || text.includes('ấm') || text.includes('chăn') || text.includes('lạnh')) {
      setTimeout(() => this.executeCommand('warm'), 800);
    } else {
      setTimeout(() => {
        this.setStatus('Không nhận diện được lệnh.\nVui lòng nói: "Cần cứu trợ", "Nhận hàng", hoặc "Giao sưởi ấm"', '');
        this.setCircleState('');
        this.speak('Không nhận diện được. Vui lòng nói lại.');
      }, 800);
    }
  }

  executeCommand(cmd) {
    this.setCircleState('success');

    switch (cmd) {
      case 'sos':
        this.setStatus('🆘 Đã gửi tín hiệu cứu trợ!\nThuyền sẽ đến trong khoảng 15 phút.', 'highlight');
        this.speak('Đã nhận, thuyền sẽ đến trong mười lăm phút. Xin giữ bình tĩnh.');
        showToast('🆘 Elder Mode: Tín hiệu SOS đã gửi qua LoRa', 'danger');
        break;

      case 'confirm':
        this.setStatus('✅ Xác nhận đã nhận hàng cứu trợ!\nCảm ơn bạn.', 'highlight');
        this.speak('Đã xác nhận bạn đã nhận hàng. Cảm ơn bạn. Nếu cần thêm, hãy gọi lại.');
        showToast('✅ Elder Mode: Xác nhận nhận hàng', 'success');
        break;

      case 'warm':
        this.setStatus('🧣 Đã yêu cầu thêm chăn và áo ấm!\nĐội cứu trợ sẽ mang đến sớm.', 'highlight');
        this.speak('Đã gửi yêu cầu chăn ấm và áo ấm. Đội cứu trợ sẽ mang đến trong thời gian sớm nhất.');
        showToast('🧣 Elder Mode: Yêu cầu chăn/áo ấm đã gửi', 'info');
        break;
    }

    // Reset after a delay
    setTimeout(() => {
      if (this.isActive) {
        this.setCircleState('');
        this.setStatus('FloodLink sẵn sàng.\nBạn cần gì?', '');
        setTimeout(() => this.startListening(), 1500);
      }
    }, 5000);
  }

  speak(text) {
    if (this.synthesis) {
      this.synthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      // Try to find Vietnamese voice
      const voices = this.synthesis.getVoices();
      const viVoice = voices.find(v => v.lang.startsWith('vi'));
      if (viVoice) utterance.voice = viVoice;

      this.synthesis.speak(utterance);
    }
  }

  setStatus(text, cls) {
    if (this.statusEl) {
      this.statusEl.textContent = text;
      this.statusEl.className = 'elder-status' + (cls ? ` ${cls}` : '');
    }
  }

  setCircleState(state) {
    if (this.circleEl) {
      this.circleEl.className = 'elder-voice-circle' + (state ? ` ${state}` : '');
    }
  }

  setWaveActive(active) {
    if (this.waveEl) {
      this.waveEl.className = 'elder-voice-wave' + (active ? ' active' : '');
    }
  }
}
