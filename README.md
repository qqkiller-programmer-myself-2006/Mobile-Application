# 📱 Mobile Application Project

โปรเจกต์นี้ประกอบด้วย 2 ส่วนหลัก คือ **my-app** (แอปพลิเคชัน Pokédex) และ **JSON** (ตัวอย่างการใช้งาน JSON)

---

## 📁 โครงสร้างโปรเจกต์

```
Mobile-Application/
├── README.md              # ไฟล์เอกสารอธิบายโปรเจกต์
├── my-app/                # แอปพลิเคชัน React Native (Expo)
│   ├── app/               # โฟลเดอร์หลักสำหรับหน้าแอป
│   │   ├── _layout.tsx    # ไฟล์กำหนด Layout และ Navigation
│   │   ├── index.tsx      # หน้าแรก แสดงรายการ Pokemon
│   │   └── details.tsx    # หน้ารายละเอียด Pokemon
│   ├── assets/            # ไฟล์รูปภาพและ icon ต่างๆ
│   ├── app.json           # การตั้งค่า Expo
│   ├── package.json       # รายการ dependencies
│   └── tsconfig.json      # การตั้งค่า TypeScript
└── JSON/                  # โฟลเดอร์สำหรับฝึก JSON
    └── json1.html         # ตัวอย่างไฟล์ HTML สำหรับทดสอบ JSON
```

---

## 🎮 my-app - Pokédex Application

### รายละเอียด
แอปพลิเคชัน **Pokédex** สร้างด้วย **React Native** และ **Expo** สำหรับแสดงข้อมูล Pokemon โดยดึงข้อมูลจาก [PokéAPI](https://pokeapi.co/)

### เทคโนโลยีที่ใช้
| เทคโนโลยี | เวอร์ชัน | คำอธิบาย |
|-----------|---------|----------|
| Expo | ~54.0.29 | Framework สำหรับพัฒนา React Native |
| React | 19.1.0 | JavaScript Library สำหรับสร้าง UI |
| React Native | 0.81.5 | Framework สำหรับสร้าง Mobile App |
| TypeScript | ~5.9.2 | ภาษา JavaScript ที่มี Type Safety |
| expo-router | ~6.0.19 | ระบบ Navigation แบบ File-based |

### โครงสร้างไฟล์ในโฟลเดอร์ `app/`

#### 1. `_layout.tsx` - Root Layout
```typescript
// กำหนดโครงสร้าง Navigation ของแอป
- ใช้ Stack Navigator
- กำหนดหน้า index (Home) และ details
- details ใช้ presentation: "formSheet" แสดงเป็น Modal Sheet
```

#### 2. `index.tsx` - หน้าแรก (Home)
```typescript
// หน้าหลักแสดงรายการ Pokemon

Interface ที่ใช้:
├── Pokemon           # ข้อมูล Pokemon แต่ละตัว
│   ├── name         # ชื่อ Pokemon
│   ├── image        # รูปด้านหน้า
│   ├── imageBack    # รูปด้านหลัง
│   └── type         # ประเภท Pokemon
└── PokemonType       # ข้อมูลประเภท
    └── type.name    # ชื่อประเภท

ฟังก์ชันหลัก:
├── fetchPokemons()   # ดึงข้อมูล Pokemon 20 ตัวแรกจาก API
└── formatName()      # แปลงชื่อให้ตัวแรกเป็นตัวใหญ่

การทำงาน:
1. โหลด Component → เรียก fetchPokemons()
2. ดึงรายการ Pokemon จาก API
3. แสดง Loading ระหว่างรอข้อมูล
4. แสดงรายการ Pokemon ในรูปแบบ Card
5. กดที่ Card → ไปหน้า Details
```

#### 3. `details.tsx` - หน้ารายละเอียด
```typescript
// หน้าแสดงรายละเอียด Pokemon แบบเต็มรูปแบบ

Interface PokemonData:
├── id               # รหัส Pokemon
├── name             # ชื่อ
├── weight           # น้ำหนัก
├── height           # ส่วนสูง
├── base_experience  # ค่าประสบการณ์พื้นฐาน
├── is_default       # เป็น Form หลักหรือไม่
├── abilities[]      # ความสามารถ
├── sprites          # รูปภาพต่างๆ
│   ├── front_default  # รูปปกติด้านหน้า
│   ├── back_default   # รูปปกติด้านหลัง
│   ├── front_shiny    # รูป Shiny ด้านหน้า
│   └── back_shiny     # รูป Shiny ด้านหลัง
├── stats[]          # ค่าสถานะพื้นฐาน
├── types[]          # ประเภท
├── past_types[]     # ประเภทในอดีต
├── held_items[]     # ไอเทมที่ถือ
└── species          # สายพันธุ์

ส่วนแสดงผล:
├── 🏷️ Types        # แสดงประเภท Pokemon
├── 🎨 Sprites      # แสดงรูปภาพ (ปกติ/Shiny)
├── 📋 Basic Info   # ข้อมูลพื้นฐาน (น้ำหนัก, ส่วนสูง, Exp)
├── 📈 Base Stats   # ค่าสถานะ (HP, Attack, Defense, ฯลฯ)
├── ⚡ Abilities    # ความสามารถ
├── 🕰️ Past Types   # ประเภทในอดีต (ถ้ามี)
└── 🧬 Species      # สายพันธุ์
```

### ธีมสี
แอปใช้ธีม **Soft Pastel** สีนุ่มนวล สบายตา:
```javascript
COLORS = {
  background: "#FAF7F5"    // Warm Cream (พื้นหลัง)
  purple: "#9A8BB0"        // Soft Lavender
  blue: "#7BA3BD"          // Dusty Blue
  pink: "#C08888"          // Dusty Rose
  textPrimary: "#2D2836"   // Dark Purple Grey (ข้อความหลัก)
}
```

### วิธีการรันแอป
```bash
# ติดตั้ง dependencies
cd my-app
npm install

# รันแอปในโหมด Development
npm start
# หรือ
npx expo start

# รันพร้อม Tunnel (สำหรับทดสอบบนมือถือ)
npx expo start --tunnel

# รันบน Platform เฉพาะ
npx expo start --android
npx expo start --ios
npx expo start --web
```

---

## 📄 JSON - โฟลเดอร์ฝึกฝน JSON

### รายละเอียด
โฟลเดอร์สำหรับฝึกฝนการใช้งาน **JSON** (JavaScript Object Notation)

### โครงสร้าง
```
JSON/
└── json1.html    # ไฟล์ HTML พื้นฐานสำหรับทดสอบ JavaScript และ JSON
```

### json1.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSON</title>
</head>
<body>
    <script>
        // พื้นที่สำหรับเขียน JavaScript ทดสอบ JSON
    </script>
</body>
</html>
```

### ตัวอย่างการใช้งาน JSON
```javascript
// สร้าง Object
const pokemon = {
    name: "Pikachu",
    type: "Electric",
    level: 25
};

// แปลง Object เป็น JSON String
const jsonString = JSON.stringify(pokemon);
// ผลลัพธ์: '{"name":"Pikachu","type":"Electric","level":25}'

// แปลง JSON String เป็น Object
const parsedObject = JSON.parse(jsonString);
// ผลลัพธ์: { name: "Pikachu", type: "Electric", level: 25 }
```

---

## 🔗 API Reference

แอปใช้ข้อมูลจาก **PokéAPI** (https://pokeapi.co/)

| Endpoint | คำอธิบาย |
|----------|----------|
| `/api/v2/pokemon/?limit=20` | ดึงรายการ Pokemon 20 ตัวแรก |
| `/api/v2/pokemon/{name}` | ดึงข้อมูลรายละเอียด Pokemon |

### ตัวอย่าง Response
```json
{
    "id": 25,
    "name": "pikachu",
    "height": 4,
    "weight": 60,
    "types": [
        {
            "slot": 1,
            "type": {
                "name": "electric",
                "url": "https://pokeapi.co/api/v2/type/13/"
            }
        }
    ],
    "stats": [
        {
            "base_stat": 35,
            "stat": { "name": "hp" }
        }
    ]
}
```

---

## 📝 หมายเหตุ

- โปรเจกต์นี้ใช้ **TypeScript** เพื่อความปลอดภัยของ Type
- ใช้ **Expo Router** สำหรับ Navigation แบบ File-based
- Comments ในโค้ดเป็น**ภาษาไทย**เพื่อความเข้าใจง่าย
- ธีมสีออกแบบเพื่อความสบายตา (Soft Pastel Theme)

---

## 👨‍💻 ผู้พัฒนา

สร้างเพื่อการเรียนรู้การพัฒนา Mobile Application ด้วย React Native และ Expo
