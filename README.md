# Chilli AI Recipe Platform 🌶️

Welcome to **Chilli**, a full-stack, AI-powered intelligent recipe sharing and culinary social network. This project features a robust Express.js backend and a beautiful, dynamic React frontend styled with modern glassmorphism UI components.

## ✨ Key Features

### 🧑‍🍳 For Culinary Creators (Users)
- **Secure Authentication:** JSON Web Token (JWT) based login and registration.
- **Dynamic Social Hub:** Follow other chefs and view a dedicated personalized `Feed` of their latest recipe updates.
- **Interactive Recipe Engine:** Post, read, like, filter, and review highly detailed recipes. Includes support for nutritional information, regional cuisines, embedded YouTube demonstrations, and estimated prep times.
- **Distraction-Free Cook Mode:** A dedicated modal slider designed exclusively for stepping through recipe instructions in real-time in the kitchen.
- **Profile Customization:** Build out your personalized `Cook Profile`, display your bio, and accumulate followers.
- **AI Sous-Chef:** Integrated artificial intelligence functionality offering instant tips and emergency ingredient substitutions.

### 🛡️ For Moderators (Admin Dashboard)
- **Recipe Governance:** Administrators have a dedicated queue to review newly submitted recipes. You can `Approve`, `Reject` (with a specific feedback reason), or `Edit` directly.
- **Pro verification:** Admins can grant trusted creators a Verified "Pro Chef" badge that displays globally across the application.
- **Advanced Security & User Management:** 
  - Manage all active users on the platform.
  - Access highly detailed **Login Security Trackers** for any user (records precise timestamp, IP address, and Device User-Agent information).
  - Suspend users via the `Block` functionality, immediately preventing their associated accounts from receiving viable API login tokens.
  - Perform hard `Delete` database purges on problematic accounts and zero-out fake recipe ratings.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React.js (Vite)
- **Design System:** Vanilla CSS & Tailwind CSS (Custom glass-panel stylesheets, sliding animations, gradients, responsive breakpoints)
- **Routing:** React Router DOM
- **Icons:** Lucide-React

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas via Mongoose ODM
- **Authentication:** Bcrypt.js (Password Hashing) & jsonwebtoken (JWT)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or higher)
- A running MongoDB Cluster (Local installation or MongoDB Atlas URI)

### 1. Database Configuration
Navigate into the `/backend` directory and create a file named `.env`. Provide the following required credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
```

### 2. Backend Installation
Open a terminal, navigate inside the backend folder, install dependencies, and run the server.
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Installation
Open a separate terminal window, navigate into the frontend folder, install dependencies, and launch Vite.
```bash
cd frontend
npm install
npm run dev
```

### 4. Admin Privileges Setup
By default, the application registers normal users. To access the `/admin` portal, you must elevate your user profile object directly inside the database:
1. Register a standard account via the frontend GUI.
2. Open MongoDB Compass (or Atlas UI) and connect to your database.
3. Open the `users` collection.
4. Locate your account document and append/modify the property: `"isAdmin": true`. 
5. Reload the application.

---

## 🔒 Recent Security Engineering

The Chilli platform utilizes strict, algorithmically secured dependency checks for large array logic.
- **Anti-Duplication Mathematics:** "Follow/Unfollow" and "Like/Unlike" endpoints leverage native Javascript `Set()` logic, automatically cleansing duplication requests to prevent server exhaustion and block rate-limit replay attacks that artificially inflate follower queues.
- **Infinite Loop Defense:** Core profile-rendering pipelines employ strict `React.useMemo()` encapsulation, successfully mitigating infinite API fetching loops that otherwise occur during aggressive local storage evaluation.
