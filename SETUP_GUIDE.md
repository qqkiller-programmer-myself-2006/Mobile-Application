# 🛠️ Setup Guide for Branch: Developer/qqkiller/chore/initial-setup

> **Last Updated:** 2026-01-27
> **Branch:** Developer/qqkiller/chore/initial-setup

## 1. Environment Variables (.env)
```properties
# ไม่มี Environment Variables พิเศษสำหรับ Branch นี้
```

## 2. Dependencies
- [ ] Run `cd my-app && npm install`
- [ ] Run `cd StickerSmash && npm install`

## 3. Projects in this Repository
| Project | Type | Description |
|---------|------|-------------|
| `my-app/` | Expo (React Native) | Main mobile application |
| `StickerSmash/` | Expo (React Native) | Sticker application tutorial |
| `JSON/` | HTML | JSON utility files |

## 4. Running the Apps
```bash
# สำหรับ my-app
cd my-app
npx expo start

# สำหรับ StickerSmash
cd StickerSmash
npx expo start
```

## 5. Other Notes
- StickerSmash เป็น Git Submodule (embedded repository)
- ควรพิจารณาจัดการด้วย `git submodule` หากต้องการ sync กับ repo ต้นทาง
