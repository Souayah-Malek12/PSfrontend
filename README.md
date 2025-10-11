<h1 align="center">
  ⚙️ <span style="font-size:40px;">Service — Real-Time MERN Marketplace</span> ⚡
</h1>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:6ee7b7,100:3b82f6&height=120&section=header&text=Find%20Workers%20.%20Place%20Orders%20.%20Connect%20Live&fontSize=26&fontColor=ffffff&animation=fadeIn" />
</p>

<p align="center">
  <a href="https://souayah-malek12.github.io/PSfrontend/">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-Click%20Here-brightgreen?style=for-the-badge" alt="Live Demo"/>
  </a>
  <img src="https://img.shields.io/badge/MERN%20Stack-React%20%7C%20Node%20%7C%20Express%20%7C%20MongoDB-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/RealTime-Socket.IO-yellow?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-JWT%20%7C%20Role%20Based-orange?style=for-the-badge" />
</p>

---

## 🚀 Overview

**Service** is a real-time **MERN web application** connecting **clients**, **workers**, and **admins** in one interactive system.

Clients can:
- 🧾 Select a **service category** (e.g., *Climatisation*, *Plumbing*, etc.)
- 📍 Enter location, order details, and preferred price range
- ⚡ Instantly send the order to nearby workers (e.g., within **8 km** radius)

Workers can:
- 👷‍♂️ Receive live job offers based on their category and distance  
- 💰 Place **bids** in real time within the client’s range  
- 🏆 Automatically win the job if they offer the **lowest bid**

Admins can:
- 🧭 Manage all users, services, and categories  
- 📊 Filter orders by status or category  
- 🧹 Add / delete users and view performance stats  

Each user has:
- 💬 **Real-time chat** system  
- 📈 **Dashboard** with all active and past orders  
- ⭐ Workers gain **+1 score** for each completed job (Acquired → Started → Completed)

---

## 🧩 Features

| Category | Description |
|-----------|-------------|
| 👤 **Authentication** | JWT-based login / register with role-based access |
| ⚙️ **Real-Time Orders** | Instant broadcast of new orders to nearby workers |
| 💬 **Live Chat** | Socket.IO chat across all roles |
| 🛠️ **Admin Panel** | Manage users, categories, and services |
| 📱 **Dashboards** | Custom dashboards for clients, workers, and admins |
| 💰 **Bidding System** | Real-time competitive bids |
| 📍 **Geo-Filtering** | Match workers by category & distance |
| ⭐ **Worker Scoring** | Reputation grows with completed jobs |

---

## 🖼️ Screenshots

### 🔐 Login / Register  
![Login](./src/assets/imgs/Login-Register.png)

---

### 💼 Client Side — Pass Orders in Real Time  
| Create Order | Real-Time Dispatch |
|---------------|-------------------|
| ![Pass Order](./src/assets/imgs/PassorderRealTime.png) | ![Available Orders](./src/assets/imgs/AvailableOrderForWorker.png) |

---

### 👷 Worker Side — Receive, Bid & Complete  
| Real-Time Orders | Place Bid | Order Acquired | Completed |
|------------------|-----------|----------------|------------|
| ![RT Orders](./src/assets/imgs/RealTimeOrderForWorker.png) | ![Bid1](./src/assets/imgs/Bid1.png) | ![Acquired](./src/assets/imgs/AcquiredOrderForWorker.png) | ![Completed](./src/assets/imgs/CompletedOrderForworker.png) |

---

### 💰 Bidding Showcase  
| Bid 1 | Bid 2 |
|--------|--------|
| ![Bid1](./src/assets/imgs/Bid1.png) | ![Bid2](./src/assets/imgs/Bid2.png) |

---

### 🧭 Admin Dashboard  
| Users | Filter by Role | Add/Delete Category | Filter Orders |
|--------|----------------|--------------------|----------------|
| ![Users List](./src/assets/imgs/UsersListForAdm.png) | ![Filter Users](./src/assets/imgs/Filter%20UsersByRoleForAdm.png) | ![Add/Delete](./src/assets/imgs/DeleteCatgorieForAdm.png) | ![Filter Orders](./src/assets/imgs/FilterAllOrdersForAdm.png) |

---

### 🛠️ Manage Services / Categories  
| Add Service | Filter by Category |
|--------------|--------------------|
| ![Add Service](./src/assets/imgs/CreateNewServiceForAdm.png) | ![Filter Category](./src/assets/imgs/FilterByCategorieForAdm.png) |

---

### 💬 Real-Time Chat System  
![Chat](./src/assets/imgs/Real%20TimeChat%20App%20forAll.png)

---

### 📊 Worker Dashboard  
![Worker Page](./src/assets/imgs/WorkerPage.png)

---

## 🧠 Tech Stack

| Layer | Technologies |
|--------|--------------|
| **Frontend** | React.js, Redux Toolkit, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Real-Time** | Socket.IO |
| **Authentication** | JWT + bcrypt |
| **Hosting** | Render (Backend), Netlify/GitHub Pages (Frontend), MongoDB Atlas |

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:3b82f6,100:6ee7b7&height=120&section=footer&text=Empowering%20Local%20Services%20with%20Realtime%20Tech&fontSize=22&fontColor=ffffff&animation=fadeIn"/>
</p>
