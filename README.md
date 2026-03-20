# Leaflet Hocuspocus

Real-time collaborative WebGIS application. Multiple users can simultaneously draw geographic features (Point, Line, Polygon) on a shared Leaflet map.

[中文版](README.zh-TW.md)

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite + PrimeVue + Leaflet
- **Sync**: Yjs (CRDT) + Hocuspocus WebSocket server
- **Deploy**: Docker Compose (nginx + Node.js)

## Quick Start

### Docker (recommended)

```bash
docker compose up --build
# Open http://localhost
```

### Local Development

```bash
# Terminal 1 - Server
cd server && npm install && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
# Open http://localhost:5173
```

## How It Works

- Open the app in multiple browser tabs/windows
- Use the bottom toolbar to select a drawing mode (Point / Line / Polygon)
- **Point**: Click on the map to place
- **Line**: Click to add vertices, right-click to finish
- **Polygon**: Click to add vertices, click first point to close
- After drawing, fill in the feature properties (name, description, category)
- All drawings sync in real-time across all connected clients

## Architecture

```
┌──────────────┐         WebSocket         ┌──────────────────┐
│   Browser A  │◄──────── /ws ────────────►│                  │
│  Vue 3 + Yjs │                           │  Hocuspocus      │
└──────────────┘                           │  Server (:1234)  │
                                           │                  │
┌──────────────┐         WebSocket         │  Y.Doc sync      │
│   Browser B  │◄──────── /ws ────────────►│                  │
│  Vue 3 + Yjs │                           └──────────────────┘
└──────────────┘
         ▲
         │ port 80
┌──────────────┐
│    nginx     │  static files + /ws proxy
└──────────────┘
```
