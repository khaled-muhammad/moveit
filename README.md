# 🚀 Airsynca

<p align="center">
  <img src="src/assets/logo.png" alt="Airsynca Logo" width="120"/>
</p>

**A fast way to share content between devices. No installs, no accounts.**

Airsynca lets you move text, links, files, and notes between devices instantly using QR codes and real-time connections. Open it on your desktop, scan with your phone, and everything you share appears live for everyone connected to the same workspace.

🌐 **Live site:** [https://airsynca.com/](https://airsynca.com/)

---

## ✨ What Airsynca Does

* Share **text, links, images, audio, and videos** instantly
* Connect devices quickly using **QR codes**
* Work together in **real-time shared spaces**
* Keep sessions **persistent so you can return later**
* Organize content as **interactive sticky notes**

No setup, no pairing process, just open and connect.

---

## 🔗 Core Features

### Instant Device Sharing

* Send clipboard text between devices
* Share links, media, and notes instantly
* Works on any modern browser

### Real-Time Collaboration

* Multiple devices can join the same session
* Updates appear immediately via WebSockets
* Great for classrooms, meetings, or quick transfers

### Persistent Beam Sessions

* Sessions remain accessible later
* Rejoin using the same beam link
* Automatically saved locally for desktop users

### QR Device Pairing

* Scan the QR code from your desktop
* Join the workspace immediately
* No manual pairing or login required

---

## 📝 Content Workspace

Shared items appear as draggable sticky notes so you can organize them visually.

Supported content:

* Text snippets
* Links
* Images
* Audio files
* Video files
* Rich notes using the Lexi editor

You can drag, archive, or reuse notes anytime.

---

## 🔒 Privacy

Airsynca is designed to be lightweight and privacy-friendly.

* No account required
* Session-based access
* Secure WebSocket connections
* Your data stays within the active session

---

## 🛠 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Framer Motion
* React Router
* React Hot Toast
* QR Scanner / QR Generator

### Backend

* Django
* Django REST Framework
* Django Channels
* Redis (WebSocket layer)

### Infrastructure

* PostgreSQL (production)
* SQLite (development)
* WebSockets for real-time communication

---

## 🚀 Quick Start

### Requirements

* Node.js 18+
* Python 3.8+
* Redis
* Git

---

### 1. Clone the repository

```bash
git clone https://github.com/khaled-muhammad/airsynca.git
cd airsynca
```

---

### 2. Install frontend dependencies

```bash
npm install
```

---

### 3. Install backend dependencies

```bash
cd airsynca_backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

### 4. Start Redis

Ubuntu / Debian

```bash
sudo apt install redis-server
sudo systemctl start redis
```

Mac (Homebrew)

```bash
brew install redis
brew services start redis
```

---

### 5. Run database migrations

```bash
python manage.py migrate
```

---

### 6. Start the servers

Backend

```bash
python manage.py runserver
```

Frontend

```bash
npm run dev
```

---

### 7. Open the app

Desktop

```
http://localhost:5173
```

Then scan the QR code from your phone.

---

## 📂 Project Structure

```
airsynca/
│
├── src/                     # React frontend
│   ├── components/
│   ├── routes/
│   ├── contexts/
│   ├── assets/
│   │   └── logo.png
│   ├── App.jsx
│   └── main.jsx
│
├── airsynca_backend/       # Django backend
│   ├── beam/
│   ├── note/
│   ├── my_auth/
│   └── airsynca/
│
├── public/
├── package.json
└── README.md
```

---

## 💳 Plans

### Free

* Up to 3 beam sessions
* 2 connected devices
* 7-day history
* Core sharing features

### Pro

* Unlimited sessions
* 10 devices
* 60-day history
* Templates and version history
* Cloud backup
* OCR and audio transcription

### Premium

* Unlimited devices
* Unlimited history
* Large uploads
* Collaboration analytics
* Advanced permissions

Enterprise plans are available for teams needing SSO, APIs, and custom deployments.

---

## 🤝 Contributing

Contributions are welcome.

Steps:

1. Fork the repository
2. Create a branch

```
git checkout -b feature/your-feature
```

3. Commit your changes
4. Push and open a Pull Request

---

## 📄 License

MIT License
See `LICENSE` for details.

---

## 👨‍💻 Author

**Khaled Muhammad**

GitHub
[https://github.com/khaled-muhammad](https://github.com/khaled-muhammad)

---

**Airsynca — share anything between devices instantly.**