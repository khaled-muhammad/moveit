# 🚀 Airsynca

**Instant content sharing between devices with persistent sessions and collaborative workspaces.**

Airsynca is a modern web application that allows you to easily share content between your devices using QR codes and WebSocket connections. Create persistent beam sessions, share text, links, images, audio, and videos instantly, and collaborate in real-time workspaces.

![MoveIt Demo](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![Django](https://img.shields.io/badge/Django-5.2.4-092E20)

## ✨ Features

### 🔗 Core Sharing Features
- **Instant Sharing** - Share text, links, images, audio, and videos between devices instantly
- **Real-time Collaboration** - Multiple devices can connect to the same beam session
- **Persistent Sessions** - Beam sessions are saved and can be rejoined later
- **QR Code Connection** - Quick device pairing using QR codes
- **Cross-Platform** - Works seamlessly on desktop and mobile browsers

### 📝 Content Management
- **Rich Note Creation** - Create detailed notes with the Lexi Note editor
- **Interactive Sticky Notes** - Drag, drop, and organize shared content
- **File Upload Support** - Upload images, videos, and audio files
- **Content Types** - Support for text, images, audio, video, and rich notes
- **Note Archiving** - Archive and manage your notes

### 🔐 Session Management
- **Beam Sessions** - Create and manage persistent beam sessions
- **Session Persistence** - Desktop sessions are automatically saved to localStorage
- **Smart Session Loading** - Automatically creates new sessions when previous ones have content
- **Session Sharing** - Share beam URLs with others to join your session
- **Multi-Device Support** - Multiple devices can connect to the same beam

### 🎨 User Experience
- **Beautiful UI** - Modern, responsive design with smooth animations
- **Drag & Drop Interface** - Intuitive content organization
- **Real-time Updates** - All changes appear instantly on connected devices
- **Toast Notifications** - Elegant feedback for user actions
- **Responsive Design** - Optimized for both desktop and mobile

### 🔁 Recurring Value (Pro & Premium)
- **Templates & Presets** - Start faster with reusable session and note templates
- **Version History** - Roll back changes and audit what changed when
- **Cloud Backup & Restore** - Peace of mind with easy restores
- **Cross-Device Sync** - Seamless continuity across all your devices
- **Image OCR** - Extract text from images for quick reuse
- **Audio Transcription** - Turn audio into searchable text
- **Fullscreen Presentation Mode** - Present or focus without distractions
- **Share Analytics** - See engagement on shared beams/notes

### 🔒 Privacy & Security
- **Privacy First** - Your data stays on your devices
- **No Registration Required** - Start sharing immediately without accounts
- **Secure WebSocket Connections** - Encrypted real-time communication
- **Session-based Authentication** - Secure beam access control

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks and context
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Icons** - Popular icon library
- **React Hot Toast** - Elegant notifications
- **React QR Scanner** - QR code scanning capabilities
- **React QR Code** - QR code generation
- **React Router** - Client-side routing

### Backend
- **Django 5.2.4** - High-level Python web framework
- **Django REST Framework** - Powerful toolkit for building Web APIs
- **Django Channels** - WebSocket support for Django
- **Channels Redis** - Redis channel layer for WebSocket
- **Django CORS Headers** - Cross-Origin Resource Sharing
- **Django Authentication** - User authentication and session management
- **Pillow** - Python Imaging Library
- **HTTPX** - Modern HTTP client

### Database & Infrastructure
- **SQLite** - Lightweight database for development
- **PostgreSQL** - Production-ready database (configurable)
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
   git clone https://github.com/khaled-muhammad/airsynca.git
   cd airsynca
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

### Seed/Update Default Plans (Pricing & Features)
Run this anytime to create or update the default plan tiers with the latest pricing and feature flags shown on the Pricing page.

```bash
cd moveit_backend
python manage.py create_default_plans
```

6. **Start the Development Servers**

   **Terminal 1 - Backend:**
   ```bash
   cd airsynca_backend
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
1. **Open Airsynca** in your desktop browser
2. **Create a Beam Session** - A new beam session is automatically created
3. **Share the QR Code** - Display the QR code for mobile devices to scan
4. **Start Sharing Content** - Use the toolbar to share clipboard content or create notes
5. **Manage Your Session** - Save beam sessions for later use

### Mobile Experience
1. **Open Airsynca** in your mobile browser
2. **Scan the QR Code** displayed on your desktop
3. **Join the Beam Session** - Connect to the shared workspace
4. **Share Content** - Use the "Copy" button to share clipboard content
5. **Upload Files** - Share images, videos, and audio files
6. **View Shared Content** - All content appears as interactive sticky notes

### Beam Session Features
- **Persistent Sessions** - Beam sessions are saved and can be rejoined
- **Multi-Device Support** - Multiple devices can connect to the same beam
- **Real-time Collaboration** - All changes appear instantly on connected devices
- **Session Management** - Create, save, and manage your beam sessions
- **Content Organization** - Drag and drop to organize shared content

### Content Types
- **Text Sharing** - Copy text from your clipboard and share instantly
- **Rich Notes** - Create detailed notes with the Lexi Note editor
- **File Upload** - Upload images, videos, and audio files
- **Interactive Notes** - Double-click notes to copy content back
- **Note Archiving** - Archive and manage your notes

## 🏗️ Project Structure

```
moveit/
├── src/                          # Frontend React application
│   ├── components/               # Reusable React components
│   │   ├── Footer.jsx           # Beautiful footer component
│   │   ├── Logo.jsx             # Animated logo component
│   │   ├── QRCodeDisplay.jsx    # QR code generation
│   │   ├── SessionProvider.jsx  # Beam session management
│   │   ├── StickyNote.jsx       # Interactive sticky notes
│   │   ├── StickyNoteContainer.jsx # Note container with drag & drop
│   │   ├── NoteForm.jsx         # Rich note creation form
│   │   ├── UploadBtn.jsx        # File upload component
│   │   └── WebSocketProvider.jsx # WebSocket connection management
│   ├── routes/                   # Page components
│   │   ├── DesktopPage.jsx      # Desktop interface with toolbar
│   │   ├── MobilePage.jsx       # Mobile interface
│   │   ├── SpacePage.jsx        # Space management interface
│   │   ├── BeamsPage.jsx        # Beam session management
│   │   ├── LoginPage.jsx        # User authentication
│   │   └── RegisterPage.jsx     # User registration
│   ├── contexts/                 # React contexts
│   │   └── AuthContext.tsx      # Authentication context
│   ├── assets/                   # Static assets
│   ├── App.jsx                   # Main application component
│   └── main.jsx                  # Application entry point
├── airsynca_backend/               # Django backend application
│   ├── beam/                     # Beam session management
│   │   ├── consumers.py         # WebSocket consumers
│   │   ├── models.py            # Beam and session models
│   │   ├── serializers.py       # API serializers
│   │   ├── views.py             # API views
│   │   └── routing.py           # WebSocket routing
│   ├── note/                     # Note management
│   │   ├── models.py            # Note models
│   │   ├── serializers.py       # Note serializers
│   │   ├── views.py             # Note API views
│   │   └── admin.py             # Django admin configuration
│   ├── my_auth/                  # Authentication
│   │   ├── models.py            # User models
│   │   ├── views.py             # Auth API views
│   │   └── authentication.py    # Custom authentication
│   ├── airsynca/                   # Django project settings
│   │   ├── settings.py          # Django configuration
│   │   ├── urls.py              # URL routing
│   │   └── asgi.py              # ASGI configuration
│   └── requirements.txt          # Python dependencies
├── public/                       # Static files
├── package.json                  # Node.js dependencies
└── README.md                     # Project documentation
```

## 💳 Pricing & Plans

- **Free**: $0/month
  - Up to 3 beam sessions, 2 connected devices, 7‑day history
  - Cross‑device sync, core sharing features
- **Pro**: $8/month or $80/year (save 2 months)
  - Unlimited sessions, 10 devices, 60‑day history, 200MB uploads
  - Templates, version history, cloud backup/restore, cross‑device sync
  - Image OCR, audio transcription, fullscreen presentation mode
  - Priority email support
- **Premium**: $16/month or $160/year (save 2 months)
  - Everything in Pro + 1000MB uploads, unlimited devices & history
  - Advanced permissions, collaboration dashboard, share analytics
  - Cloud backup/restore, OCR, transcription, presentation mode
  - Live chat support, export capabilities
  
> Enterprise available on request: SSO, API, advanced analytics, SLA, branding.

## 🧩 Plan Feature Flags (API)

Plans expose capability flags via the API so the UI can gate and message upgrades precisely:

- `has_templates`, `has_version_history`, `has_cloud_backup`, `has_cross_device_sync`
- `has_ocr`, `has_audio_transcription`, `has_presentation_mode`, `has_share_analytics`
- Plus existing flags: `has_rich_editor`, `has_file_uploads`, `has_advanced_permissions`, `has_team_collaboration`, `has_api_access`, `has_sso_integration`, `has_custom_branding`, `has_analytics`, `has_priority_support`

Use `GET /api/plans/` for plan data and `GET /api/plans/comparison/` for a comparison payload. Seed/update defaults with `python manage.py create_default_plans`.

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
DATABASE_URL=sqlite:///db.sqlite3
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

*Airsynca - Instant content sharing between devices with persistent sessions*
