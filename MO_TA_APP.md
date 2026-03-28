# 🌊 FloodLink – Hệ thống Điều phối Cứu trợ Lũ lụt Thông minh

> **"Mỗi giây đều quý giá trong cứu trợ"**

---

## 📋 Tổng quan

**FloodLink** là nền tảng điều phối cứu trợ lũ lụt thông minh, tích hợp **AI (Groq LLaMA 3.3)**, **bản đồ thời gian thực**, và **Firebase Firestore** để hỗ trợ công tác cứu hộ, cứu trợ trong thiên tai. Hệ thống được thiết kế để phục vụ cả **người dân** lẫn **đội ngũ điều phối**, với giao diện tối ưu cho mọi thiết bị từ điện thoại đến máy tính.

### 🎯 Mục tiêu
- Điều phối cứu trợ nhanh chóng, chính xác
- Ưu tiên cử **NGƯỜI** (bác sĩ, thuyền cứu hộ) hơn drone trong tình huống y tế
- Minh bạch tình trạng kho hàng để quyên góp đúng nhu cầu
- Hoạt động được cả khi **mất kết nối internet** (offline-first)

---

## ⚡ Tính năng chính

### 🗺️ Command Center – Trung tâm chỉ huy
- **Bản đồ Leaflet** thời gian thực: vị trí 20 drone, thuyền cứu hộ, tình nguyện viên, hộ dân cần cứu trợ
- **Heatmap** vùng ngập, zones nguy hiểm
- **Vẽ/đánh dấu** trực tiếp trên bản đồ (chỉ Admin)
- **Xếp hạng ưu tiên Top 20** hộ dân theo điểm nguy cấp (0–100)
- Theo dõi trạng thái drone: pin, tọa độ, đường bay

### 👥 Tình nguyện viên & Đội cứu hộ
- Tracking **tình nguyện viên, thuyền, chuyên gia y tế** với GPS thời gian thực
- Marker màu sắc: 🟢 Hoạt động · 🔴 Đã cử đi · 🟡 Chờ lệnh
- Hiển thị trang thiết bị mang theo (áo phao, thuốc, loa, ...)

### 🤖 AI Triage – Phân loại y tế tự động
- Tích hợp **Groq LLaMA 3.3-70B** phân tích triệu chứng
- Tự động xếp loại mức độ nghiêm trọng:
  - 🔴 **Đỏ** (nguy kịch) → Cử bác sĩ + thuyền cứu hộ
  - 🟡 **Vàng** (nặng) → Cử y tá + thuyền
  - 🟢 **Xanh** (nhẹ) → Cử tình nguyện viên hoặc drone
- **Nguyên tắc vàng**: Luôn ưu tiên cử NGƯỜI hơn drone
- Fallback tự động nếu API không khả dụng

### 🚨 Chế độ Khẩn cấp
- **SOS 1 chạm** – gọi ngay hotline 0912 127 142
- **Báo cáo sức khỏe** – AI phân tích và dispatch tự động
- **Tra cứu thuốc men** – database thuốc phổ biến trong lũ lụt
- **Hướng dẫn sơ cứu** – đuối nước, hạ thân nhiệt, vết thương, tiêu chảy

### 📋 Yêu cầu hàng cứu trợ
- Người dân gửi yêu cầu: **tên, địa chỉ, SĐT, số người, mặt hàng cần**
- 6 danh mục: Lương thực, Thuốc men, Quần áo, Vệ sinh, Dụng cụ, Trẻ em
- Admin duyệt/xử lý/từ chối yêu cầu
- Sync Firestore theo thời gian thực

### 📊 Tình trạng kho cứu trợ (Công khai)
- **24 mặt hàng** chia 4 nhóm (Lương thực, Y tế, Sinh hoạt, An toàn)
- Thanh progress bar màu sắc:
  - 🔴 Cần gấp (>90% đã dùng)
  - 🟠 Sắp hết (>75%)
  - 🔵 Ổn (>40%)
  - 🟢 Dư (<40%)
- **Banner 🚨 CẦN QUYÊN GÓP GẤP** tự động hiện khi có mặt hàng thiếu
- Giúp nhà hảo tâm quyên góp đúng thứ đang cần

### ❤️ Quyên góp (VietQR)
- Tích hợp **VietQR** – Ngân hàng VPBank (Vikki)
- STK: **919498172**
- Preset: 50K, 100K, 200K, 500K, 1M hoặc tùy chỉnh
- QR code tự động sinh theo số tiền

### 🎤 Elder Mode – Chế độ người cao tuổi
- Giao diện **voice-only** dành cho người già
- Nút lớn, chữ to, ít thao tác
- Hỗ trợ giọng nói (Speech Recognition)

### 💬 AI Chatbot
- Chatbot hỗ trợ 24/7 (Groq AI)
- Hỏi đáp về cứu trợ, sơ cứu, vật phẩm, tình hình lũ

### 📖 Hướng dẫn sử dụng (HDSD)
- Tab hướng dẫn đầy đủ cho người dùng mới
- Bắt đầu nhanh 4 bước
- Giải thích phân quyền, phím tắt, liên hệ

---

## 🔐 Phân quyền

| Tính năng | 👁️ Người dùng | 🛡️ Admin |
|-----------|:---:|:---:|
| Xem bản đồ, theo dõi cứu hộ | ✅ | ✅ |
| Gửi yêu cầu cứu trợ | ✅ | ✅ |
| Báo cáo y tế + SOS | ✅ | ✅ |
| Xem tình trạng kho | ✅ | ✅ |
| Chatbot AI, Donate, HDSD | ✅ | ✅ |
| Quản lý Drone | 🔒 | ✅ |
| Quản lý Vật phẩm | 🔒 | ✅ |
| Vẽ trên bản đồ | 🔒 | ✅ |
| Duyệt yêu cầu cứu trợ | ❌ | ✅ |
| Điều khiển drone | 🔒 | ✅ |

---

## 🛠️ Công nghệ

| Thành phần | Công nghệ |
|-----------|----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Bản đồ | Leaflet.js + Leaflet.Draw + Leaflet.Heat |
| AI | Groq API (LLaMA 3.3-70B-Versatile) |
| Database | Firebase Firestore (offline persistence) |
| Auth | Firebase Auth + Session-based Admin |
| Thanh toán | VietQR API |
| Responsive | CSS Media Queries (mobile → desktop) |
| Font | Inter (Google Fonts) |

---

## 📱 Responsive

| Thiết bị | Breakpoint | Tối ưu |
|---------|-----------|--------|
| 📱 Điện thoại | ≤480px | Nav cuộn ngang, layout 1 cột, tap targets 44px |
| 📱 Tablet nhỏ | ≤768px | Map + sidebar xếp dọc, emergency xếp dọc |
| 💻 Tablet | ≤1024px | Nav thu gọn, sidebar 300px |
| 🖥️ Desktop lớn | ≥1440px | Sidebar rộng 420px, drone grid 3 cột |
| 📱 Landscape | Max-height 500px | Header 1 dòng, map+sidebar cạnh nhau |

---

## ⌨️ Phím tắt

| Phím | Chức năng |
|------|----------|
| `Alt+1` | Command Center |
| `Alt+2` | Tình nguyện viên |
| `Alt+3` | Drone |
| `Alt+4` | Elder Mode |
| `Alt+5` | Vật phẩm |
| `Alt+6` | Khẩn cấp |
| `Alt+7` | Yêu cầu cứu trợ |
| `Alt+8` | HDSD |
| `Alt+C` | Mở chatbot AI |
| `Esc` | Thoát Elder Mode |

---

## 🚀 Cài đặt & Chạy

1. Clone repository
2. Tạo file `.env`:
   ```
   GROQ_API_KEY=gsk_xxxxx
   ```
3. Mở `index.html` trực tiếp trong trình duyệt (không cần server)
4. Đăng nhập Admin: mật khẩu `floodlink2026`

---

## 📞 Liên hệ khẩn cấp

- 📞 Hotline cứu trợ: **0912 127 142** (24/7)
- 🏥 Cấp cứu: **115**
- 👮 Công an: **113**
- 🚒 PCCC: **114**

---

## 📁 Cấu trúc dự án

```
alehleh/
├── index.html          # Entry point
├── .env                # API keys
├── css/
│   ├── variables.css   # Design tokens
│   ├── base.css        # Reset & base styles
│   ├── animations.css  # Keyframe animations
│   ├── components.css  # UI components
│   ├── layout.css      # Grid layouts
│   ├── elder.css       # Elder Mode styles
│   ├── chatbot.css     # Chatbot panel
│   ├── emergency.css   # Emergency tab
│   └── responsive.css  # Media queries
├── js/
│   ├── data.js         # Mock data (households, drones, inventory)
│   ├── map.js          # Leaflet map + markers
│   ├── commandCenter.js
│   ├── volunteerMode.js
│   ├── dronePanel.js
│   ├── suppliesMode.js # Admin inventory management
│   ├── emergencyMode.js # SOS + AI triage
│   ├── supplyRequest.js # Citizen request + public inventory
│   ├── guideMode.js    # HDSD
│   ├── elderMode.js    # Voice-only interface
│   ├── chatbot.js      # AI chatbot
│   ├── loraSimulator.js
│   ├── firestoreSync.js # Firebase batch sync
│   ├── auth.js         # Role-based access
│   ├── donate.js       # VietQR donation
│   └── app.js          # Main controller
```

---

*Phát triển bởi Đội FloodLink – Hội Chữ thập đỏ Việt Nam · Phiên bản 2.0 · 28/03/2026*
