# AI Travel Planner

A premium full-stack AI-powered travel planning application with modern UI, real-time weather, interactive maps, and smart itineraries.

## Features

- 🔐 **JWT Authentication** - Secure login/register system
- 🤖 **AI-Powered Itineraries** - Smart trip planning with Google Gemini AI
- 🗺️ **Interactive Maps** - Leaflet maps with location markers
- 🌤️ **Real-time Weather** - OpenWeather API integration
- 📊 **Analytics Dashboard** - Beautiful charts with Recharts
- 🌓 **Dark Mode** - Premium dark/light theme
- 💬 **AI Chat Assistant** - Travel advice and recommendations
- 📱 **Responsive Design** - Mobile-first approach
- ✨ **Smooth Animations** - Framer Motion animations

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Framer Motion
- Recharts
- Leaflet
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Google Gemini AI API
- OpenWeather API

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Environment Variables

Create `.env` files:

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel_planner
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
FRONTEND_URL=http://localhost:5173