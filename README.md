# 🚀 MoveIt

**Instant content sharing between devices. No accounts, no hassle.**

MoveIt is a modern web application that allows you to easily share content between your devices using QR codes and WebSocket connections. Share text, links, images, audio, and videos instantly without any registration or data storage.

![MoveIt Demo](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![Django](https://img.shields.io/badge/Django-5.2.4-092E20)

## ✨ Features

- **🔗 Instant Sharing** - Share text, links, images, audio, and videos between devices instantly
- **📱 No Login Required** - Just scan the QR code with your mobile device and start sharing
- **🎯 Drag & Drop** - Organize your shared content with interactive sticky notes
- **🔒 Privacy First** - Your data stays on your devices and is never stored on servers
- **🌐 Open Source** - Completely open source and free to use
- **📱 Cross-Platform** - Works on desktop and mobile browsers
- **⚡ Real-time** - WebSocket-based real-time communication
- **🎨 Beautiful UI** - Modern, responsive design with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Icons** - Popular icon library
- **React Hot Toast** - Elegant notifications
- **React QR Scanner** - QR code scanning capabilities
- **React QR Code** - QR code generation

### Backend
- **Django 5.2.4** - High-level Python web framework
- **Django REST Framework** - Powerful toolkit for building Web APIs
- **Django Channels** - WebSocket support for Django
- **Channels Redis** - Redis channel layer for WebSocket
- **Django CORS Headers** - Cross-Origin Resource Sharing
- **Pillow** - Python Imaging Library
- **HTTPX** - Modern HTTP client

### Infrastructure
- **SQLite** - Lightweight database
- **Redis** - In-memory data structure store (for WebSocket channels)
- **WebSocket** - Real-time bidirectional communication

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Redis** (for WebSocket functionality)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/khaled-muhammad/moveit.git
   cd moveit
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd moveit_backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Start Redis Server**
   ```bash
   # On macOS with Homebrew
   brew install redis
   brew services start redis
   
   # On Ubuntu/Debian
   sudo apt-get install redis-server
   sudo systemctl start redis
   
   # On Windows (using WSL or Docker)
   # Follow Redis installation guide for Windows
   ```

5. **Run Database Migrations**
   ```bash
   cd moveit_backend
   python manage.py migrate
   ```

6. **Start the Development Servers**

   **Terminal 1 - Backend:**
   ```bash
   cd moveit_backend
   python manage.py runserver
   ```

   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Desktop: http://localhost:5173
   - Mobile: Scan the QR code displayed on desktop

## 📱 How to Use

### Desktop Experience
1. Open MoveIt in your desktop browser
2. A QR code will be displayed on the screen
3. Share this QR code with your mobile device
4. Start sharing content instantly!

### Mobile Experience
1. Open MoveIt in your mobile browser
2. Scan the QR code displayed on your desktop
3. Use the "Copy" button to share clipboard content
4. Use the "Upload" button to share files
5. All shared content appears as interactive sticky notes

### Features
- **Text Sharing**: Copy text from your clipboard and share instantly
- **File Upload**: Upload images, videos, and audio files
- **Interactive Notes**: Double-click notes to copy content back
- **Real-time Sync**: All changes appear instantly on connected devices
- **Privacy**: No data is stored on servers - everything stays on your devices

## 🏗️ Project Structure

```
moveit/
├── src/                          # Frontend React application
│   ├── components/               # Reusable React components
│   │   ├── Footer.jsx           # Beautiful footer component
│   │   ├── Logo.jsx             # Animated logo component
│   │   ├── QRCodeDisplay.jsx    # QR code generation
│   │   ├── SessionProvider.jsx  # Session management
│   │   ├── StickyNote.jsx       # Interactive sticky notes
│   │   ├── UploadBtn.jsx        # File upload component
│   │   └── WebSocketProvider.jsx # WebSocket connection management
│   ├── routes/                   # Page components
│   │   ├── DesktopPage.jsx      # Desktop interface
│   │   └── MobilePage.jsx       # Mobile interface
│   ├── assets/                   # Static assets
│   ├── App.jsx                   # Main application component
│   └── main.jsx                  # Application entry point
├── moveit_backend/               # Django backend application
│   ├── beam/                     # Main Django app
│   │   ├── consumers.py         # WebSocket consumers
│   │   ├── models.py            # Database models
│   │   ├── serializers.py       # API serializers
│   │   ├── views.py             # API views
│   │   └── routing.py           # WebSocket routing
│   ├── moveit/                   # Django project settings
│   │   ├── settings.py          # Django configuration
│   │   ├── urls.py              # URL routing
│   │   └── asgi.py              # ASGI configuration
│   └── requirements.txt          # Python dependencies
├── public/                       # Static files
├── package.json                  # Node.js dependencies
└── README.md                     # Project documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_BASE_URL=http://localhost:8000/api

# Backend
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Redis Configuration

The application uses Redis for WebSocket channel layers. Make sure Redis is running on the default port (6379) or update the configuration in `moveit_backend/moveit/settings.py`:

```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your preferred hosting service

### Backend Deployment (Heroku/DigitalOcean)

1. Install production dependencies:
   ```bash
   pip install gunicorn
   ```

2. Set up environment variables for production

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the server:
   ```bash
   gunicorn moveit.asgi:application
   ```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Use meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Django Team** - For the robust Django framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For the smooth animations
- **React Icons** - For the beautiful icon library

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the existing issues for solutions
- Contact the maintainer

---

**Made with ❤️ by [Khaled Muhammad](https://github.com/khaled-muhammad)**

*MoveIt - Instant content sharing between devices*
