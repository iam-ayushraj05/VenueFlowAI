# Refactor VenueFlow AI into Frontend & Backend Components

The goal is to migrate the existing single-file `venueflow.html` into a modern web application structure. This involves splitting the application into distinct frontend and backend repositories, refactoring the UI into reusable components, and replacing the hardcoded frontend state with API endpoints.

## User Review Required

> [!IMPORTANT]
> - I will set up the **Frontend** using Vite + React.
> - I will set up the **Backend** using Node.js + Express.
> - Are you okay with using React for the frontend and Express for the backend?
> - Do you prefer I put them in separate folders like `/frontend` and `/backend` within the current directory?

## Open Questions

> [!WARNING]  
> - The original HTML uses native `Canvas` API for charts and heatmaps, as well as Chart.js. I will migrate these to React, continuing to use Chart.js via `react-chartjs-2` and adapting the custom canvas drawing to React components. Does that sound good?

## Proposed Changes

### 1. Backend Setup (`/backend`)
- Initialize a Node.js + Express project.
- Move the hardcoded `State` object from the original HTML into an in-memory datastore on the backend.
- Create REST API endpoints to serve data and handle actions:
  - `GET /api/status` (dashboard metrics)
  - `GET /api/incidents` and `POST /api/incidents`
  - `GET /api/queues` and `POST /api/queues/join`
  - `GET /api/deliveries` and `POST /api/deliveries`
  - `GET /api/restrooms`
  - `GET /api/fans/:id` (fan journey)

### 2. Frontend Setup (`/frontend`)
- Initialize a Vite + React project.
- Set up a routing mechanism (e.g., React Router) to handle the different sidebar pages.
- Migrate the UI into modular React components:
  - **Layout**: `Sidebar`, `Topbar`, `MainLayout`
  - **Shared UI**: `MetricCard`, `Badge`, `Button`, `Toast`, `CanvasHeatmap`
  - **Pages**: `Dashboard`, `Heatmap`, `Wayfinding`, `SmartQueue`, `RestroomIndex`, `Delivery`, `IncidentManagement`, `ExitOrchestration`, `FanJourney`
- Refactor the global CSS into `index.css` and use CSS Modules or Styled Components if necessary. (I will stick to the beautiful vanilla CSS provided, slightly adapted for React).
- Implement API fetching (using `fetch` or `axios`) to populate the frontend state from the backend.

### 3. Integration
- Connect the frontend to the backend via proxy in Vite config.
- Run both and verify the full workflow (e.g., adding a queue item updates the backend and reflects on the UI).

## Verification Plan

### Automated Tests
- Run `npm run build` on both frontend and backend to ensure no compilation errors.

### Manual Verification
- Start the backend server (`npm start`).
- Start the frontend dev server (`npm run dev`).
- Open the application in the browser.
- Verify all pages render correctly.
- Test interactive features: Joining a queue, reporting an incident, placing a delivery order, simulating alerts.
- Verify that data persists across page reloads (since it will be stored in the backend server's memory).
