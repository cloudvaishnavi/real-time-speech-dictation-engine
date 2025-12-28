# 🎙️ Real-Time Speech Dictation Engine

A full-stack web application that converts live speech into text, intelligently cleans and restructures the output, and stores transcriptions for later use.

This project is designed to demonstrate **clear backend understanding, rule-based NLP logic, and real-time frontend interaction**, without relying on heavy AI libraries.

---

## 🚀 Project Overview

The application captures real-time speech using the browser’s **Web Speech API**, processes the text through a **custom multi-stage text-cleaning engine**, and stores corrected transcriptions in **MongoDB**.

It focuses on:
- Explainable NLP logic
- Clean REST API design
- Real-time data flow
- Interview-friendly implementation

---

## ✨ Features

### 🎧 Speech & Text Processing
- Real-time speech-to-text transcription
- Filler word removal (um, uh, like, you know, etc.)
- Repeated word removal
- Automatic capitalization and punctuation fixing
- Basic grammar normalization (rule-based)

---

### 🎯 Tone-Aware Output
Users can choose how the final text should sound:
- **Neutral** – balanced and clear
- **Formal** – professional wording
- **Concise** – short and direct
- **Friendly** – conversational tone
- **Expanded** – adds clarity explanation

---

### 📊 Live Speaking Insights
Displayed during recording:
- Word count
- Time elapsed
- Speaking speed (WPM)
- Clarity level (Low / Medium / High)

---

### 🔊 Accessibility & UX
- Read-aloud (Text-to-Speech) for corrected text
- Before → After comparison view
- One-click text download
- Clean and responsive UI

---

### 🗂️ Transcription Management
- Automatic saving of corrected transcriptions
- View transcription history
- Delete individual entries
- Export history as:
  - TXT
  - JSON
  - PDF

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Web Speech API
- Browser SpeechSynthesis API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Testing
- Jest
- Supertest
- MongoDB Memory Server

---

## 📁 Project Structure

project-root/
│
├── backend/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── tests/
│ └── server.js
│
├── frontend/
│ ├── index.html
│ ├── frontend.js
│ └── frontend.css
│
└── README.md


---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud)
- Google Chrome (recommended)

🔧 Backend Setup

Navigate to backend:

cd backend
npm install


Create a .env file inside backend/ and add:

MONGODB_URI=mongodb://localhost:27017/speech_dictation
PORT=5000


Start the backend server:

npm start


Backend runs at:
http://localhost:5000

🌐 Frontend Setup
cd frontend


Open index.html using:

Live Server extension (recommended)

OR any local HTTP server

⚠️ Note:
Web Speech API works best in Google Chrome and requires microphone permission.

🧪 Testing

Run backend tests using:

npm test


Tests cover:

Text cleaning logic

API endpoints

Database interactions (in-memory MongoDB)

📌 Why This Project Matters

Uses rule-based NLP instead of black-box AI

Easy to explain in interviews

Demonstrates full-stack understanding

Clean, modular, and scalable design

Strong beginner-to-intermediate portfolio project

📄 License

This project is for educational and portfolio purposes.