# FieldFlow — Field Force Management System (Frontend)

FieldFlow is a role-based management system designed to streamline field operations. It enables managers to assign tasks, field agents to log visits and capture notes, and automatically utilizes AI to analyze visit notes for risk flagging and sentiment analysis.

This repository contains the **React (Vite)** frontend application.

## 🚀 Live Demo & Repositories

- **Frontend (Live)**: [https://field-flow-frontend-puce.vercel.app/login](https://field-flow-frontend-puce.vercel.app/login)
- **Backend (API)**: [https://fieldflow-6ykv.onrender.com/](https://fieldflow-6ykv.onrender.com/)

- **Frontend Repository**: [amrita-prog/FieldFlow-frontend](https://github.com/amrita-prog/FieldFlow-frontend) *(this repo)*
- **Backend Repository**: [amrita-prog/FieldFlow](https://github.com/amrita-prog/FieldFlow)

---

## ✨ Key Features

- **Role-Based Dashboards**: Dynamic UI that adapts based on whether you log in as Admin, Regional Manager, Team Lead, Field Agent, or Auditor.
- **Task & Visit Management**: Interactive tables and forms to seamlessly assign tasks and track visit lifecycles.
- **AI Risk Visualizations**: Renders AI-analyzed insights and highlights high-risk visits with color-coded badges.
- **Activity Logs**: Searchable and filterable audit trails tracking system-wide actions.

---

## 🛠️ Technology Stack

- **Framework**: React (Vite)
- **Routing**: React Router DOM
- **Styling**: Vanilla CSS (Custom Design System)
- **HTTP Client**: Axios (with JWT Token Rotation Interceptors)
- **Icons**: Lucide React

---

## 💻 How to Run Locally

Follow these steps to get the React frontend running on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/amrita-prog/FieldFlow-frontend.git
cd FieldFlow-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
The application will start on `http://localhost:5173`.

> **Note:** By default, the application is configured to point to the live Render backend (`https://fieldflow-6ykv.onrender.com/api`). You do not need to run the backend locally to test the frontend!

---

## 🔑 Default Test Credentials

You can test the live app or your local instance using these dummy accounts (All passwords except Admin are **`Pass@123`**):

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@fieldflow.com` | `Admin@123` |
| **Regional Manager** | `rm.north@fieldflow.com` | `Pass@123` |
| **Team Lead** | `tl.alpha@fieldflow.com` | `Pass@123` |
| **Field Agent** | `agent1@fieldflow.com` | `Pass@123` |
| **Auditor** | `auditor@fieldflow.com` | `Pass@123` |
