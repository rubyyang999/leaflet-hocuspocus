# Leaflet Hocuspocus

同步協作 WebGIS 應用程式。多位使用者可同時在Leaflet 地圖上繪製地理圖徵（點、線、面）。

[English](README.md)

## 技術架構

- **前端**: Vue 3 + TypeScript + Vite + PrimeVue + Leaflet
- **同步**: Yjs (CRDT) + Hocuspocus WebSocket 伺服器
- **部署**: Docker Compose (nginx + Node.js)

## 快速開始

### Docker（建議）

```bash
docker compose up --build
# 開啟 http://localhost
```

### 本地開發

```bash
# Terminal 1 - 後端
cd server && npm install && npm run dev

# Terminal 2 - 前端
cd frontend && npm install && npm run dev
# 開啟 http://localhost:5173
```

## 使用方式

- 在多個瀏覽器分頁開啟應用程式
- 使用底部工具列選擇繪製模式（點 / 線 / 面）
- **點**: 點擊地圖放置
- **線**: 點擊新增頂點，右鍵結束繪製
- **面**: 點擊新增頂點，點擊第一個點閉合
- 繪製完成後填寫圖徵屬性（名稱、描述、分類）
- 所有繪製內容即時同步至所有連線的使用者

## 架構

```
┌──────────────┐         WebSocket         ┌──────────────────┐
│  瀏覽器 A     │◄──────── /ws ────────────►│                  │
│  Vue 3 + Yjs │                           │  Hocuspocus      │
└──────────────┘                           │  Server (:1234)  │
                                           │                  │
┌──────────────┐         WebSocket         │  Y.Doc 同步       │
│  瀏覽器 B     │◄──────── /ws ────────────►│                  │
│  Vue 3 + Yjs │                           └──────────────────┘
└──────────────┘
         ▲
         │ port 80
┌──────────────┐
│    nginx     │  靜態檔案 + /ws 代理
└──────────────┘
```
