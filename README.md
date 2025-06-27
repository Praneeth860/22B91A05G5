# QuickLink - React URL Shortener 🚀

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

*A modern, privacy-focused URL shortening application with comprehensive analytics - runs entirely in your browser.*

![Screenshot 2025-06-27 130026](https://github.com/user-attachments/assets/ad7d02b8-2bfa-433d-8ebb-be7c83341e44)

![ok](https://github.com/user-attachments/assets/0656def3-b860-4d38-870d-62880316ee6f)
---

## ✨ Features

### Core Functionality
- **📎 Batch URL Creation**: Create up to 5 URLs simultaneously
- **🎨 Custom Short Codes**: Personalized alphanumeric codes (3-20 characters)
- **⏰ Flexible Expiration**: Custom validity periods from 1 minute to 1 week
- **🔄 Instant Redirection**: Seamless client-side routing with automatic cleanup
- **📋 One-Click Copy**: Easy copying of shortened URLs to clipboard

### Analytics Dashboard
- **📈 Click Tracking**: Real-time monitoring of clicks per URL
- **🕒 Detailed Timestamps**: Creation, click, and expiration tracking
- **🌍 Geographic Insights**: Timezone-based location detection
- **📊 Historical Data**: Complete audit trail with sortable statistics
- **🔽 Expandable Details**: Individual click event data

### User Experience
- **🎯 Material Design**: Clean, responsive interface
- **⚡ Real-time Feedback**: Loading states and comprehensive error handling
- **💾 Session Persistence**: Data maintained using localStorage
- **🧹 Auto-cleanup**: Automatic removal of expired URLs

## 🛠️ Technology Stack

| Frontend | Build Tool | UI Library | Routing | Storage |
|----------|------------|------------|---------|----------|
| React 18.3.1 | Vite 5.4.2 | Material-UI 5.15.0 | React Router 6.26.1 | localStorage |

## 🚀 Installation

### Prerequisites
```bash
node --version  # v16.0.0 or higher
npm --version   # v8.0.0 or higher
```

### Quick Start
```bash
# Clone repository
git clone https://github.com/Praneeth860/22B91A05G5.git
cd url_shortner

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:3000
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build

## 📖 Usage

### Creating Shortened URLs
1. Navigate to the main page
2. Enter your URL (must start with `http://` or `https://`)
3. Set validity period (default: 30 minutes, max: 1 week)
4. Add custom shortcode (optional, 3-20 characters)
5. Add more URLs using "Add Another URL" (max 5)
6. Click "Create URLs" and copy the generated links

### Viewing Analytics
1. Navigate to Statistics page
2. View comprehensive data: total clicks, timestamps, time remaining
3. Expand rows for detailed click history with geographic data
4. Sort by clicks, creation date, or expiration time

### URL Redirection
- Visit shortened URLs directly: `http://localhost:3000/{shortcode}`
- Each click is tracked with metadata (referrer, timezone, timestamp)
- Expired URLs show user-friendly error messages

## 🔒 Privacy & Security

- **🔐 Client-Side Only**: Zero external server communication
- **🏠 Local Storage**: All data stays in your browser
- **🚫 No Tracking**: No analytics services or cookies
- **✅ Input Validation**: Prevents XSS and injection attacks
- **⏰ Auto-Expiration**: URLs automatically expire for security

## 🌐 Browser Compatibility

Supports Chrome 90+, Firefox 88+, Safari 14+, Edge 90+


**[⭐ Star this repo](https://github.com/Praneeth860/22B91A05G5)**


