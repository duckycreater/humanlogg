/* ============================================
   FloodLink – LoRa Mesh Simulator
   ============================================ */

class LoRaSimulator {
  constructor() {
    this.messageQueue = [];
    this.animInterval = null;
  }

  init() {
    this.startSimulation();
  }

  renderPanel() {
    const panel = document.getElementById('lora-panel');
    if (!panel) return;

    panel.innerHTML = `
      <div class="lora-title">
        <span class="status-dot status-dot-online" style="margin-right:6px;"></span>
        LoRa Mesh Network
      </div>
      ${FloodData.loraNodes.slice(0, 6).map(node => `
        <div class="lora-node">
          <div class="lora-signal">
            ${[1,2,3,4,5].map(i => `
              <div class="lora-signal-bar" style="height:${i * 3 + 2}px; opacity:${i <= node.signal ? 1 : 0.15};"></div>
            `).join('')}
          </div>
          <span style="flex:1; color:var(--text-secondary); font-size:11px;">${node.name}</span>
          <span style="color:var(--text-muted); font-family:var(--font-mono); font-size:10px;">${node.lastSeen}</span>
        </div>
      `).join('')}
      <div style="margin-top:var(--space-2); padding-top:var(--space-2); border-top:1px solid var(--border-secondary); font-size:10px; color:var(--text-muted);">
        ${FloodData.loraNodes.length} nodes | Range: 1.5–3 km | Multi-hop active
      </div>
    `;
  }

  startSimulation() {
    // Randomly update last seen
    this.animInterval = setInterval(() => {
      FloodData.loraNodes.forEach(node => {
        if (Math.random() > 0.6) {
          const sec = Math.floor(Math.random() * 20) + 1;
          node.lastSeen = `${sec}s`;
          // Occasionally change signal strength
          if (Math.random() > 0.85) {
            node.signal = Math.max(1, Math.min(5, node.signal + (Math.random() > 0.5 ? 1 : -1)));
          }
        }
      });
      this.renderPanel();
    }, 3000);
  }

  destroy() {
    if (this.animInterval) clearInterval(this.animInterval);
  }
}
