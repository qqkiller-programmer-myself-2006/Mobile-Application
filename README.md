# 🚀 Mobile Application Project

> โปรเจกต์รวมแอปพลิเคชัน Mobile สำหรับเรียนรู้ React Native, Expo และ JSON พร้อม Pokédex App และ StickerSmash Tutorial

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-learning-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Expo](https://img.shields.io/badge/Expo-~54.0-000020?style=for-the-badge&logo=expo)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react)

---

## 🎨 Demo / Preview

<!-- TODO: เพิ่ม Screenshot หรือ GIF แสดงการทำงานของ App -->
| Pokédex App | StickerSmash |
|-------------|--------------|
| ![Pokédex](https://via.placeholder.com/300x500?text=Pokédex+App) | ![StickerSmash](https://via.placeholder.com/300x500?text=StickerSmash) |

---

## 📋 สารบัญ
- [ภาพรวมโปรเจค](#-ภาพรวมโปรเจค)
- [Tech Stack](#-tech-stack)
- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)
- [การติดตั้ง](#-การติดตั้ง)
- [การใช้งาน](#-การใช้งาน)
- [รายละเอียดแต่ละโปรเจค](#-รายละเอียดแต่ละโปรเจค)
- [API Reference](#-api-reference)
- [สถานะการพัฒนา](#-สถานะการพัฒนา)
- [คะแนนระบบ](#-คะแนนระบบ)
- [ผู้พัฒนา](#-ผู้พัฒนา)

---

## 🎯 ภาพรวมโปรเจค

Repository นี้รวบรวมโปรเจค Mobile Application สำหรับการเรียนรู้การพัฒนาแอปด้วย **React Native** และ **Expo**
ประกอบด้วย 3 ส่วนหลัก:

1. **my-app (Pokédex)** - แอปแสดงข้อมูล Pokemon ดึงจาก PokéAPI 
2. **StickerSmash** - Tutorial App จาก Expo สำหรับเรียนรู้พื้นฐาน
3. **JSON** - ไฟล์ฝึกฝนการใช้งาน JSON ด้วย JavaScript

### ✨ Key Features
- **Pokédex App:** ดูข้อมูล Pokemon 20 ตัวแรก พร้อมรายละเอียด Stats, Abilities, Types
- **Soft Pastel Theme:** ธีมสีนุ่มนวล สบายตา (Warm Cream, Lavender, Dusty Blue)
- **TypeScript:** Type Safety ตลอดทั้งโปรเจค
- **File-based Routing:** ใช้ Expo Router สำหรับ Navigation

---

## 🛠️ Tech Stack

| Type | Technologies |
|------|--------------|
| **Framework** | React Native 0.81.5, Expo ~54.0.29 |
| **Language** | TypeScript ~5.9.2 |
| **Navigation** | Expo Router ~6.0.19 |
| **UI Library** | React 19.1.0 |
| **API** | PokéAPI (RESTful) |
| **Dev Tools** | ESLint, VSCode |

---

## 📁 โครงสร้างโปรเจค

```
Mobile-Application/
├── README.md              # เอกสารอธิบายโปรเจค (Production-Grade)
├── SETUP_GUIDE.md         # คู่มือการ Setup สำหรับแต่ละ Branch
│
├── my-app/                # 🎮 Pokédex Application
│   ├── app/               # หน้าแอป (File-based Routing)
│   │   ├── _layout.tsx    # Root Layout & Navigation
│   │   ├── index.tsx      # หน้าแรก - รายการ Pokemon
│   │   └── details.tsx    # หน้ารายละเอียด Pokemon
│   ├── assets/            # รูปภาพและ Icons
│   ├── app.json           # Expo Configuration
│   ├── package.json       # Dependencies
│   └── tsconfig.json      # TypeScript Config
│
├── StickerSmash/          # 📸 Expo Tutorial App (Submodule)
│   └── ...                # Sticker App Tutorial
│
└── JSON/                  # 📄 JSON Practice
    └── json1.html         # ตัวอย่าง HTML + JavaScript
```

---

## 📦 การติดตั้ง (Installation)

### Prerequisites
- **Node.js** v18+ (แนะนำ v20 LTS)
- **npm** หรือ **pnpm**
- **Expo Go App** (สำหรับทดสอบบนมือถือ)

### Quick Start

```bash
# 1. Clone repository
git clone git@github.com:qqkiller-programmer-myself-2006/Mobile-Application.git
cd Mobile-Application

# 2. ติดตั้ง dependencies สำหรับ my-app
cd my-app
npm install

# 3. รัน Development Server
npx expo start
```

---

## 🚀 การใช้งาน (Usage)

### รัน Pokédex App (my-app)
```bash
cd my-app
npx expo start           # รันปกติ
npx expo start --tunnel  # รันผ่าน Tunnel (ทดสอบบนมือถือ)
npx expo start --web     # รันบน Web Browser
```

### รัน StickerSmash
```bash
cd StickerSmash
npm install
npx expo start
```

### ทดสอบ JSON
เปิดไฟล์ `JSON/json1.html` ใน Browser แล้วใช้ Console ทดสอบ

---

## 📖 รายละเอียดแต่ละโปรเจค

### 🎮 my-app - Pokédex Application

แอปพลิเคชันแสดงข้อมูล Pokemon ดึงจาก [PokéAPI](https://pokeapi.co/)

#### โครงสร้างหน้าจอ

| หน้า | ไฟล์ | รายละเอียด |
|------|------|------------|
| **Home** | `index.tsx` | แสดง Pokemon 20 ตัวแรกในรูปแบบ Card |
| **Details** | `details.tsx` | รายละเอียด Pokemon (Stats, Abilities, Sprites) |

#### Interfaces หลัก
```typescript
interface Pokemon {
  name: string;      // ชื่อ Pokemon
  image: string;     // รูปด้านหน้า
  imageBack: string; // รูปด้านหลัง
  type: string;      // ประเภท
}

interface PokemonData {
  id: number;
  name: string;
  weight: number;
  height: number;
  base_experience: number;
  abilities: Ability[];
  stats: Stat[];
  types: Type[];
  sprites: Sprites;
}
```

#### ธีมสี (Soft Pastel Theme)
```javascript
COLORS = {
  background: "#FAF7F5",   // Warm Cream
  purple: "#9A8BB0",       // Soft Lavender
  blue: "#7BA3BD",         // Dusty Blue
  pink: "#C08888",         // Dusty Rose
  textPrimary: "#2D2836",  // Dark Purple Grey
}
```

---

## 🔗 API Reference

| Endpoint | Method | คำอธิบาย |
|----------|--------|----------|
| `/api/v2/pokemon/?limit=20` | GET | ดึงรายการ Pokemon 20 ตัวแรก |
| `/api/v2/pokemon/{name}` | GET | ดึงข้อมูลรายละเอียด Pokemon |

### ตัวอย่าง Response
```json
{
  "id": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60,
  "types": [{ "slot": 1, "type": { "name": "electric" } }],
  "stats": [{ "base_stat": 35, "stat": { "name": "hp" } }]
}
```

---

## 📊 สถานะการพัฒนา (Roadmap)

### ✅ Completed
- [x] Setup Expo Project Structure
- [x] Pokemon List (Home Screen)
- [x] Pokemon Details Screen
- [x] Soft Pastel Theme Design
- [x] TypeScript Integration
- [x] Production-Grade README

### 🔄 In Progress
- [ ] เพิ่ม Pokemon Search
- [ ] Pokemon Favorites System
- [ ] Pagination (Load More)

### 📋 Future Plans
- [ ] Offline Mode (AsyncStorage)
- [ ] Pokemon Compare Feature
- [ ] Dark Mode Support
- [ ] Unit Tests

---

## 🏆 คะแนนระบบ (System Score)
*ประเมินตนเองตามมาตรฐาน Workflow 1*

| Criteria | Score | Grade | หมายเหตุ |
|----------|-------|-------|----------|
| **Completeness** | 60% | C | Core ครบ ยังขาด Search, Pagination |
| **Stability** | 80% | B | ไม่มี Fatal Crash, Handle Loading State |
| **Code Quality** | 75% | B | TypeScript, Clean Structure |
| **Docs Quality** | 90% | A | README Production-Grade |
| **Test Coverage** | 0% | F | ยังไม่มี Tests |
| **Overall** | **61%** | **C** | Learning Project |

---

## 👥 ผู้พัฒนา

- **Developer:** qqkiller - [@qqkiller-programmer-myself-2006](https://github.com/qqkiller-programmer-myself-2006)

---

## 📝 หมายเหตุ

- โปรเจกต์นี้ใช้ **TypeScript** เพื่อความปลอดภัยของ Type
- ใช้ **Expo Router** สำหรับ Navigation แบบ File-based
- Comments ในโค้ดเป็น**ภาษาไทย**เพื่อความเข้าใจง่าย
- StickerSmash เป็น Git Submodule

---

## 📄 License

MIT © 2026 qqkiller
