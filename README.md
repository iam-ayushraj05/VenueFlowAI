# VenueFlow AI — Stadium Intelligence Platform

VenueFlow AI is a comprehensive command center interface designed for modern stadium operations. It provides real-time insights into crowd density, predictive AI surge alerts, AR wayfinding, and streamlined fan services like smart queuing and in-seat delivery.

## 🚀 Features

- **Real-Time Command Center:** View live metrics including attendance, active choke points, and open incidents.
- **Crowd Heat Maps:** Interactive HTML5 Canvas visualizations of stadium zones, color-coded by density and flow velocity.
- **AR Wayfinding Simulation:** A dynamic viewfinder overlay that generates personalized augmented reality navigation routes to seats, restrooms, or exits.
- **Smart Queue & Fan Services:** Track active virtual queues, order in-seat delivery, and monitor restroom occupancy levels via simulated sensors.
- **Interactive Fan Journey:** Trace the end-to-end timeline of distinct fan profiles, from pre-arrival parking to post-game exit routing.
- **Premium Aesthetics:** Features a beautiful "Modern SaaS" interface with seamless Light & Dark Mode toggling and subtle glassmorphism effects.

## 🏗️ Architecture

The project has been refactored from a monolithic HTML prototype into a robust decoupled architecture:

- **Frontend (`/frontend`)**: Built with **React** & **Vite**. Uses `react-router-dom` for navigation, raw `Canvas API` for visualizations, and `Chart.js` for throughput metrics.
- **Backend (`/backend`)**: Built with **Node.js** & **Express**. Serves as an in-memory API database that powers the dynamic frontend, providing simulated REST endpoints for incidents, queues, and AI surge events.

## 💻 Running the Application Locally

You will need two separate terminal windows to run the frontend and backend servers concurrently.

### 1. Start the Backend API
```bash
cd backend
npm install
npm run dev
```
*(Runs on `http://localhost:3001` with nodemon for auto-reloading)*

### 2. Start the Frontend React App
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173`. API requests are automatically proxied to the backend)*

## 🎨 UI/UX Highlights
- Fully responsive CSS-Grid layouts.
- Highly optimized `requestAnimationFrame` loops for AR and Canvas rendering.
- `localStorage` theme persistence (Light/Dark Mode).

## 🛠️ Built For
Created to demonstrate advanced agentic AI capabilities in refactoring monolithic codebases into scalable, componentized React architectures.
