/* ============================================
   FloodLink 2.0 – Simulated Data
   ============================================ */

const FloodData = {
  // ── Station Info ──
  station: {
    id: 'STATION-01',
    name: 'Thuyền Trạm #01',
    location: 'Hà Nội – Ven sông Hồng',
    date: '28/03/2026',
    commander: 'Nguyễn Văn An',
    status: 'active'
  },

  // ── Households (50 entries) ──
  households: generateHouseholds(),

  // ── Drones (20 units) ──
  drones: [
    { id: 'DRN-01', name: 'Mavic #1', battery: 87, status: 'flying', altitude: 120, speed: 35, lat: 21.0280, lng: 105.8520, task: 'Quét nhiệt khu vực A3', flightTime: '42 phút', distanceCovered: '3.2 km', thermalScans: 28 },
    { id: 'DRN-02', name: 'Mavic #2', battery: 62, status: 'flying', altitude: 95, speed: 28, lat: 21.0310, lng: 105.8480, task: 'Tìm kiếm người mắc kẹt B1', flightTime: '35 phút', distanceCovered: '2.8 km', thermalScans: 19 },
    { id: 'DRN-03', name: 'Mavic #3', battery: 15, status: 'low-battery', altitude: 50, speed: 12, lat: 21.0250, lng: 105.8550, task: '⚠ Pin yếu – Đang quay về', flightTime: '58 phút', distanceCovered: '4.5 km', thermalScans: 41 },
    { id: 'DRN-04', name: 'Mavic #4', battery: 100, status: 'standby', altitude: 0, speed: 0, lat: 21.0290, lng: 105.8510, task: 'Chờ lệnh – Pin đã sạc đầy', flightTime: '0 phút', distanceCovered: '0 km', thermalScans: 0 },
    { id: 'DRN-05', name: 'Phantom #5', battery: 78, status: 'flying', altitude: 110, speed: 32, lat: 21.0340, lng: 105.8460, task: 'Quét vùng ngập C2', flightTime: '28 phút', distanceCovered: '2.1 km', thermalScans: 15 },
    { id: 'DRN-06', name: 'Phantom #6', battery: 45, status: 'flying', altitude: 85, speed: 25, lat: 21.0220, lng: 105.8590, task: 'Phát hiện người kẹt mái nhà', flightTime: '47 phút', distanceCovered: '3.9 km', thermalScans: 33 },
    { id: 'DRN-07', name: 'Mavic #7', battery: 92, status: 'flying', altitude: 130, speed: 38, lat: 21.0360, lng: 105.8430, task: 'Quét nhiệt khu dân cư D1', flightTime: '15 phút', distanceCovered: '1.4 km', thermalScans: 8 },
    { id: 'DRN-08', name: 'Inspire #8', battery: 55, status: 'flying', altitude: 100, speed: 30, lat: 21.0270, lng: 105.8610, task: 'Giao hàng cứu trợ đợt 3', flightTime: '39 phút', distanceCovered: '3.5 km', thermalScans: 22 },
    { id: 'DRN-09', name: 'Mavic #9', battery: 8, status: 'low-battery', altitude: 30, speed: 8, lat: 21.0300, lng: 105.8540, task: '⚠ Pin cực yếu – Hạ cánh khẩn', flightTime: '62 phút', distanceCovered: '5.1 km', thermalScans: 45 },
    { id: 'DRN-10', name: 'Phantom #10', battery: 100, status: 'standby', altitude: 0, speed: 0, lat: 21.0290, lng: 105.8510, task: 'Chờ lệnh – Sạc đầy', flightTime: '0 phút', distanceCovered: '0 km', thermalScans: 0 },
    { id: 'DRN-11', name: 'Mavic #11', battery: 71, status: 'flying', altitude: 115, speed: 33, lat: 21.0200, lng: 105.8500, task: 'Giám sát mực nước S1', flightTime: '31 phút', distanceCovered: '2.6 km', thermalScans: 17 },
    { id: 'DRN-12', name: 'Inspire #12', battery: 38, status: 'flying', altitude: 75, speed: 22, lat: 21.0380, lng: 105.8570, task: 'Truyền tín hiệu LoRa relay', flightTime: '50 phút', distanceCovered: '4.2 km', thermalScans: 36 },
    { id: 'DRN-13', name: 'Mavic #13', battery: 95, status: 'flying', altitude: 140, speed: 40, lat: 21.0330, lng: 105.8400, task: 'Quét tầm xa vùng E', flightTime: '8 phút', distanceCovered: '0.9 km', thermalScans: 5 },
    { id: 'DRN-14', name: 'Phantom #14', battery: 22, status: 'low-battery', altitude: 45, speed: 10, lat: 21.0240, lng: 105.8470, task: '⚠ Pin yếu – Quay về', flightTime: '55 phút', distanceCovered: '4.8 km', thermalScans: 38 },
    { id: 'DRN-15', name: 'Mavic #15', battery: 100, status: 'standby', altitude: 0, speed: 0, lat: 21.0290, lng: 105.8510, task: 'Bảo trì – Thay cánh quạt', flightTime: '0 phút', distanceCovered: '0 km', thermalScans: 0 },
    { id: 'DRN-16', name: 'Inspire #16', battery: 83, status: 'flying', altitude: 105, speed: 29, lat: 21.0210, lng: 105.8630, task: 'Giao thuốc men khu F2', flightTime: '22 phút', distanceCovered: '1.8 km', thermalScans: 12 },
    { id: 'DRN-17', name: 'Mavic #17', battery: 67, status: 'flying', altitude: 90, speed: 27, lat: 21.0350, lng: 105.8580, task: 'Quét nhiệt cầu Long Biên', flightTime: '33 phút', distanceCovered: '2.9 km', thermalScans: 20 },
    { id: 'DRN-18', name: 'Phantom #18', battery: 50, status: 'flying', altitude: 80, speed: 24, lat: 21.0260, lng: 105.8420, task: 'Tìm kiếm trẻ em mất tích', flightTime: '44 phút', distanceCovered: '3.7 km', thermalScans: 30 },
    { id: 'DRN-19', name: 'Mavic #19', battery: 100, status: 'standby', altitude: 0, speed: 0, lat: 21.0290, lng: 105.8510, task: 'Chờ triển khai đợt 4', flightTime: '0 phút', distanceCovered: '0 km', thermalScans: 0 },
    { id: 'DRN-20', name: 'Inspire #20', battery: 74, status: 'flying', altitude: 125, speed: 36, lat: 21.0230, lng: 105.8530, task: 'Quét 3D đánh giá thiệt hại', flightTime: '26 phút', distanceCovered: '2.3 km', thermalScans: 14 }
  ],

  // ── Inventory ──
  inventory: {
    totalBags: 2200,
    distributed: 847,
    remaining: 1353,
    rate: 186, // bags per hour current
    targetRate: 200,
    items: [
      { name: 'Gạo 5kg', total: 2200, used: 847, icon: '🍚' },
      { name: 'Nước uống (thùng)', total: 1800, used: 692, icon: '💧' },
      { name: 'Mì tôm (thùng)', total: 1500, used: 534, icon: '🍜' },
      { name: 'Thuốc men', total: 500, used: 187, icon: '💊' },
      { name: 'Chăn ấm', total: 800, used: 312, icon: '🛏️' },
      { name: 'Áo phao', total: 600, used: 156, icon: '🦺' },
      { name: 'Đèn pin', total: 400, used: 89, icon: '🔦' },
      { name: 'Bộ sơ cứu', total: 300, used: 78, icon: '🩹' }
    ]
  },

  // ── Rescue Teams (People Tracking) ──
  rescueTeams: {
    volunteers: [
      { id: 'VOL-01', name: 'Trần Thị Bình', role: 'Tình nguyện viên', status: 'active', lat: 21.033, lng: 105.847, task: 'Phân phối tại Phúc Xá', phone: '0901-111-001', equipment: ['Áo phao', 'Bộ đàm', 'Túi cứu trợ x5'] },
      { id: 'VOL-02', name: 'Lê Văn Cường', role: 'Tình nguyện viên', status: 'active', lat: 21.027, lng: 105.856, task: 'Hỗ trợ sơ tán B2', phone: '0901-111-002', equipment: ['Áo phao', 'Đèn pin', 'Dây thừng 20m'] },
      { id: 'VOL-03', name: 'Phạm Thị Dung', role: 'Tình nguyện viên', status: 'resting', lat: 21.029, lng: 105.851, task: 'Nghỉ – Ca kế tiếp 14:00', phone: '0901-111-003', equipment: ['Áo phao', 'Bộ đàm'] },
      { id: 'VOL-04', name: 'Ngô Minh Đức', role: 'Trưởng nhóm', status: 'active', lat: 21.035, lng: 105.843, task: 'Điều phối khu D', phone: '0901-111-004', equipment: ['Áo phao', 'Bộ đàm', 'Bản đồ khu vực', 'GPS cầm tay'] },
      { id: 'VOL-05', name: 'Hoàng Thu Hà', role: 'Tình nguyện viên', status: 'active', lat: 21.024, lng: 105.849, task: 'Khảo sát vùng C', phone: '0901-111-005', equipment: ['Áo phao', 'Máy ảnh', 'Sổ ghi chép'] },
      { id: 'VOL-06', name: 'Vũ Thị Lan', role: 'Tình nguyện viên', status: 'active', lat: 21.022, lng: 105.860, task: 'Phát thuốc khu E', phone: '0901-111-006', equipment: ['Áo phao', 'Hộp thuốc sơ cứu', 'Khẩu trang x50'] },
      { id: 'VOL-07', name: 'Đặng Văn Minh', role: 'Trưởng nhóm', status: 'dispatched', lat: 21.031, lng: 105.854, task: '🚨 Đang tới hộ SOS #12', phone: '0901-111-007', equipment: ['Áo phao', 'Bộ đàm', 'Bộ sơ cứu nâng cao', 'Cáng cứu thương'] },
      { id: 'VOL-08', name: 'Bùi Thị Ngọc', role: 'Tình nguyện viên', status: 'active', lat: 21.037, lng: 105.855, task: 'Ghi nhận thiệt hại F1', phone: '0901-111-008', equipment: ['Áo phao', 'Tablet', 'Pin dự phòng'] }
    ],
    boats: [
      { id: 'BOAT-01', name: 'Thuyền Cứu hộ #01', type: 'rescue', status: 'active', lat: 21.030, lng: 105.850, task: 'Tuần tra sông Hồng', capacity: 8, crew: 3, icon: '🚤' },
      { id: 'BOAT-02', name: 'Thuyền Cứu hộ #02', type: 'rescue', status: 'dispatched', lat: 21.026, lng: 105.857, task: '🚨 Cứu 3 người mắc kẹt A5', capacity: 8, crew: 2, icon: '🚤' },
      { id: 'BOAT-03', name: 'Thuyền Viện trợ #01', type: 'supply', status: 'active', lat: 21.032, lng: 105.845, task: 'Giao hàng đợt 5 khu D', capacity: 200, crew: 2, icon: '🛥️' },
      { id: 'BOAT-04', name: 'Thuyền Viện trợ #02', type: 'supply', status: 'active', lat: 21.025, lng: 105.853, task: 'Giao thuốc khu C', capacity: 200, crew: 2, icon: '🛥️' },
      { id: 'BOAT-05', name: 'Thuyền Cứu hộ #03', type: 'rescue', status: 'standby', lat: 21.029, lng: 105.851, task: 'Chờ lệnh – Sẵn sàng', capacity: 8, crew: 3, icon: '🚤' }
    ],
    experts: [
      { id: 'EXP-01', name: 'BS. Nguyễn Minh Tuấn', role: 'Bác sĩ cấp cứu', status: 'active', lat: 21.028, lng: 105.852, task: 'Trực y tế tại trạm chính', phone: '0901-222-001' },
      { id: 'EXP-02', name: 'BS. Lê Thị Hương', role: 'Y tá trưởng', status: 'dispatched', lat: 21.034, lng: 105.848, task: '🚨 Đang tới ca SOS #7', phone: '0901-222-002' },
      { id: 'EXP-03', name: 'KS. Phạm Văn Hải', role: 'Chuyên gia LoRa', status: 'active', lat: 21.029, lng: 105.850, task: 'Bảo trì node LoRa #03', phone: '0901-222-003' },
      { id: 'EXP-04', name: 'BS. Trần Thu Thảo', role: 'Bác sĩ', status: 'active', lat: 21.023, lng: 105.858, task: 'Khám bệnh lưu động khu E', phone: '0901-222-004' }
    ]
  },

  // ── Dispatch Log ──
  dispatchLog: [],

  // ── Community Points ──
  communityPoints: [
    { id: 'CP-01', name: 'Điểm Tiếp Nhận #01', area: 'Phường Phúc Xá', households: 45, distributed: 38, status: 'active', volunteer: 'Trần Thị Bình' },
    { id: 'CP-02', name: 'Điểm Tiếp Nhận #02', area: 'Phường Ngọc Thụy', households: 62, distributed: 41, status: 'active', volunteer: 'Lê Văn Cường' },
    { id: 'CP-03', name: 'Điểm Tiếp Nhận #03', area: 'Phường Bồ Đề', households: 38, distributed: 38, status: 'completed', volunteer: 'Phạm Thị Dung' },
    { id: 'CP-04', name: 'Điểm Tiếp Nhận #04', area: 'Phường Long Biên', households: 71, distributed: 23, status: 'active', volunteer: 'Ngô Minh Đức' },
    { id: 'CP-05', name: 'Điểm Tiếp Nhận #05', area: 'Phường Thanh Trì', households: 55, distributed: 12, status: 'pending', volunteer: 'Hoàng Thu Hà' },
    { id: 'CP-06', name: 'Điểm Tiếp Nhận #06', area: 'Phường Gia Lâm', households: 49, distributed: 30, status: 'active', volunteer: 'Vũ Thị Lan' },
    { id: 'CP-07', name: 'Điểm Tiếp Nhận #07', area: 'Phường Tứ Liên', households: 83, distributed: 15, status: 'urgent', volunteer: 'Đặng Văn Minh' }
  ],

  // ── LoRa Nodes ──
  loraNodes: [
    { id: 'LORA-01', name: 'Node Trạm Chính', signal: 5, lastSeen: '2s', type: 'gateway' },
    { id: 'LORA-02', name: 'Node ĐTN #01', signal: 4, lastSeen: '5s', type: 'relay' },
    { id: 'LORA-03', name: 'Node ĐTN #03', signal: 4, lastSeen: '3s', type: 'relay' },
    { id: 'LORA-04', name: 'Node ĐTN #05', signal: 3, lastSeen: '12s', type: 'relay' },
    { id: 'LORA-05', name: 'Node ĐTN #07', signal: 2, lastSeen: '18s', type: 'relay' },
    { id: 'LORA-06', name: 'Node Drone #1', signal: 5, lastSeen: '1s', type: 'drone' },
    { id: 'LORA-07', name: 'Node Drone #2', signal: 4, lastSeen: '2s', type: 'drone' },
    { id: 'LORA-08', name: 'Node Elder Grp A', signal: 3, lastSeen: '8s', type: 'elder' }
  ],

  // ── Map Markers ──
  markers: [],

  // ── Messages Log ──
  messages: [
    { time: '10:15:23', from: 'Drone #1', type: 'scan', text: 'Phát hiện 3 người trên mái nhà – Khu A3-12' },
    { time: '10:14:45', from: 'ĐTN #07', type: 'urgent', text: 'Cần gấp 50 túi – Khu Tứ Liên đông dân' },
    { time: '10:13:02', from: 'Elder Node', type: 'sos', text: 'Cụ Nguyễn Thị Hoa (82 tuổi) – "Cần cứu trợ"' },
    { time: '10:11:30', from: 'Thuyền #2', type: 'delivery', text: 'Đã giao 30 túi tại ĐTN #03 – Hoàn thành' },
    { time: '10:10:15', from: 'Drone #3', type: 'alert', text: '⚠ Pin 15% – Đang quay về thay pin' },
    { time: '10:08:47', from: 'ĐTN #04', type: 'confirm', text: 'Xác nhận nhận 25 túi – Đang phân phối' },
    { time: '10:06:33', from: 'Drone #2', type: 'scan', text: 'Quét xong Grid B1 – 8 hộ cần hỗ trợ' },
    { time: '10:05:01', from: 'Elder Node', type: 'confirm', text: 'Hộ Trần Văn Bảy – "Nhận hàng" – Xác nhận OK' }
  ]
};

// ── Generate Households ──
function generateHouseholds() {
  const names = [
    'Nguyễn Văn Hùng', 'Trần Thị Mai', 'Lê Văn Tài', 'Phạm Thị Hương', 'Hoàng Văn Dũng',
    'Vũ Thị Lan', 'Đặng Văn Minh', 'Bùi Thị Nga', 'Đỗ Văn Quang', 'Ngô Thị Phương',
    'Lý Văn Sơn', 'Trịnh Thị Tuyết', 'Hà Văn Ước', 'Phan Thị Vân', 'Mai Văn Xuân',
    'Đinh Thị Yến', 'Tô Văn An', 'Cao Thị Bích', 'Dương Văn Cảnh', 'Lưu Thị Diệu',
    'Nguyễn Thị Hoa', 'Trần Văn Bảy', 'Lê Thị Cúc', 'Phạm Văn Đức', 'Hoàng Thị Em',
    'Vũ Văn Phát', 'Đặng Thị Giang', 'Bùi Văn Hiếu', 'Đỗ Thị Ích', 'Ngô Văn Kiên',
    'Chu Thị Liên', 'Trương Văn Mạnh', 'Hồ Thị Nhi', 'Võ Văn Ơn', 'Lâm Thị Phúc',
    'Nghiêm Văn Quốc', 'Tạ Thị Rạng', 'Thái Văn Sáng', 'Ứng Thị Thảo', 'Quách Văn Uy',
    'Kiều Thị Vy', 'La Văn Bình', 'Mã Thị Châu', 'Tăng Văn Danh', 'Huỳnh Thị Ên',
    'Sầm Văn Giàu', 'Ninh Thị Hậu', 'Triệu Văn Ít', 'Cù Thị Kim', 'Âu Văn Lộc'
  ];

  const areas = ['Phúc Xá', 'Ngọc Thụy', 'Bồ Đề', 'Long Biên', 'Thanh Trì', 'Gia Lâm', 'Tứ Liên'];

  return names.map((name, i) => {
    const people = Math.floor(Math.random() * 7) + 1;
    const hasElder = Math.random() > 0.5;
    const hasChild = Math.random() > 0.4;
    const hasDisabled = Math.random() > 0.85;
    const floodLevel = (Math.random() * 2 + 0.3).toFixed(1);
    const tempLow = Math.random() > 0.5 ? 1 : 0;
    const vulnerable = (hasElder || hasChild || hasDisabled) ? 1 : 0;
    const riskHigh = parseFloat(floodLevel) > 1.5 ? 1 : 0;

    const score = Math.min(100, Math.round(
      (tempLow * 40) + (Math.min(people, 5) / 5 * 20) + (vulnerable * 30) + (riskHigh * 15)
    ));

    const status = Math.random() > 0.6 ? 'pending' : Math.random() > 0.5 ? 'delivered' : 'in-transit';

    return {
      id: `HH-${String(i + 1).padStart(3, '0')}`,
      name,
      area: areas[i % areas.length],
      people,
      hasElder,
      hasChild,
      hasDisabled,
      floodLevel: parseFloat(floodLevel),
      score,
      status,
      lat: 21.020 + Math.random() * 0.025,
      lng: 105.840 + Math.random() * 0.025,
      needs: generateNeeds(),
      lastContact: `${Math.floor(Math.random() * 60)} phút trước`
    };
  }).sort((a, b) => b.score - a.score);
}

function generateNeeds() {
  const allNeeds = ['Gạo', 'Nước', 'Thuốc', 'Chăn ấm', 'Mì tôm', 'Áo phao', 'Đèn pin', 'Sơ cứu'];
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = allNeeds.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Priority color helper
function getPriorityColor(score) {
  if (score >= 80) return 'var(--priority-critical)';
  if (score >= 60) return 'var(--priority-high)';
  if (score >= 40) return 'var(--priority-medium)';
  return 'var(--priority-low)';
}

function getPriorityClass(score) {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getPriorityLabel(score) {
  if (score >= 80) return 'Rất cao';
  if (score >= 60) return 'Cao';
  if (score >= 40) return 'Trung bình';
  return 'Thấp';
}
