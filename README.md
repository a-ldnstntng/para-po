# 🚐 PARA PO! — Philippine Transit Route Extractor

> Turn messy, Taglish commute descriptions into clean, structured transit tickets with PHP fare estimates and step-by-step navigation!

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Express%20%7C%20SQLite%20%7C%20Gemini%20AI-0056D2)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Key Features

- **🗣️ Taglish & English Natural Language Processing**: Describe your commute in plain Taglish (*"Galing Cubao, sakay MRT to Shaw, tapos trike pa-Kapitolyo"*), and Gemini AI extracts structured transit steps.
- **🎨 Traditional Jeepney Signboard Aesthetic**: Custom design system featuring 3D metallic chrome borders, rivets, racing stripes, and neon-flicker title.
- **🎫 Thermal Print Commute Tickets**: Structured route output with vehicle mode badges, landmark stops, step instructions, and estimated PHP fares.
- **🎤 Web Speech Voice Input**: Browser-native voice input in Filipino (`fil-PH`) for hands-free route entry.
- **📋 Terminal Dispatch Archive**: Local SQLite database storing saved routes with live search filtering and community upvote validation.
- **🛡️ Hardened Security & Rate Limiting**: Express rate limiting (`10 req/min/IP`) and API quota handling.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React + TypeScript (Vite)
- **Styling**: Vanilla CSS + Tailwind CSS v4 custom theme
- **Icons**: Web Speech API & Unicode Transit Emojis

### Backend
- **Server**: Node.js + Express + TypeScript
- **AI Model**: Google Gemini (`gemini-3.6-flash`)
- **Database**: SQLite via `sql.js` (Pure JS SQLite)
- **Rate Limiting**: `express-rate-limit`

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- Free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/para-po.git
cd para-po

# Install dependencies for both client and server
cd server && npm install
cd ../client && npm install
```

### 3. Environment Variables

In `server/.env`:
```env
GEMINI_API_KEY=AIzaSy...your_real_gemini_api_key...
PORT=3001
```

### 4. Running Locally

```bash
# Terminal 1 — Start Backend Server (Port 3001)
cd server
npm run dev

# Terminal 2 — Start Frontend Server (Port 5173)
cd client
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 📄 License

MIT License. Built with ❤️ for Philippine commuters.
