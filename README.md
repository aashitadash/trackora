# Trackora

A lightweight full-stack analytics platform inspired by Hotjar and PostHog, built to track user interactions, visualize session journeys, and generate real-time click heatmaps.

---

## Overview

Trackora is a custom-built analytics system that captures user behavior on webpages using a reusable JavaScript tracking SDK. The platform stores events in MongoDB, aggregates sessions, and visualizes analytics data through a modern React dashboard.

The project was developed as part of a Full Stack Engineer technical assignment.

---

# Features

## Event Tracking SDK

* Tracks page views automatically
* Tracks click events automatically
* Stores persistent session IDs using localStorage
* Captures:

  * event type
  * timestamp
  * page URL
  * click coordinates
  * viewport dimensions
  * user agent
* Sends events to backend APIs in real time

---

## Backend APIs

### Event APIs

| Endpoint                   | Method | Description                                |
| -------------------------- | ------ | ------------------------------------------ |
| `/api/events`              | POST   | Receive and store events                   |
| `/api/sessions`            | GET    | Fetch sessions with event counts           |
| `/api/sessions/:sessionId` | GET    | Fetch ordered events for a session         |
| `/api/heatmap`             | GET    | Fetch click data for heatmap visualization |

---

## Dashboard Features

### Overview Dashboard

* Analytics overview cards
* Session statistics
* Activity visualizations
* Responsive SaaS-style UI

### Sessions View

* Lists all tracked sessions
* Displays total event counts
* Shows last activity timestamp
* Opens detailed user journey modal
* Displays ordered event timeline

### Heatmap View

* Displays real click positions visually
* MongoDB-backed click visualization
* Heatmap overlay on webpage preview
* Interactive analytics UI

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Axios
* Lucide React

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Database

* MongoDB Atlas

## Deployment

* GitHub Pages (Frontend)
* Render (Backend)

---

# Project Structure

```bash
trackora/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│
├── dashboard/
│   ├── src/
│   └── public/
│
├── tracker-sdk/
│   └── tracker.js
│
├── demo-site/
│   └── index.html
│
└── README.md
```

---

# Database Schema

Each event document contains:

```json
{
  "session_id": "uuid",
  "event_type": "click",
  "page_url": "/pricing",
  "timestamp": "ISO Date",
  "coordinates": {
    "x": 120,
    "y": 450
  },
  "viewport": {
    "width": 1440,
    "height": 900
  },
  "user_agent": "Chrome"
}
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/AashitaDash/trackora.git
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
MONGO_URI=your_mongodb_uri
PORT=8000
```

Run backend:

```bash
node ./src/server.js
```

---

## 3. Frontend Setup

```bash
cd dashboard
npm install
npm run dev
```

---

## 4. Demo Website

Open:

```bash
demo-site/index.html
```

OR use Live Server in VS Code.

---

# Tracking SDK Usage

Include the SDK in any webpage:

```html
<script src="tracker.js"></script>

<script>
  Trackora.init({
    apiUrl: "http://localhost:8000"
  });
</script>
```

---

# Screenshots

## Dashboard Overview

<img width="959" height="449" alt="image" src="https://github.com/user-attachments/assets/b304a11f-500b-4622-a305-cabfd5ef93c4" />


## Sessions View

<img width="957" height="376" alt="image" src="https://github.com/user-attachments/assets/966e576b-846e-481b-91b8-9cbb815b2870" />


## Heatmap View

<img width="817" height="399" alt="image" src="https://github.com/user-attachments/assets/2473362c-61f1-494c-8778-7db95e1b236a" />

---

#Demo Video

https://drive.google.com/file/d/1YiS1ZpGNLavVb2xQDwhDMvqWtygM0wDP/view?usp=sharing
---

# Future Improvements

* Real-time websocket updates
* Advanced analytics aggregation
* Session replay
* Funnel analysis
* Authentication and multi-user support
* Custom dashboard widgets
* Event filtering and search

---

# Author

## Aashita Dash

* GitHub: [https://github.com/AashitaDash](https://github.com/AashitaDash)
* LinkedIn: [https://www.linkedin.com/in/aashita-dash-b4153928a/](https://www.linkedin.com/in/aashita-dash-b4153928a/)

---

# License

MIT License
