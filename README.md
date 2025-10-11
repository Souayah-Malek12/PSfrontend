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
<p align="center">
  <img src="./src/assets/imgs/Login-Register.png" width="800"/>
</p>

---

### 💼 Client Side — Pass Orders in Real Time  
| Create Order | Real-Time Dispatch |
|---------------|-------------------|
| <img src="./src/assets/imgs/PassorderRealTime.png" width="400"/> | <img src="./src/assets/imgs/AvailableOrderForWorker.png" width="400"/> |

---

### 👷 Worker Side — Receive, Bid & Complete  
| Real-Time Orders | Place Bid | Order Acquired | Completed |
|------------------|-----------|----------------|------------|
| <img src="./src/assets/imgs/RealTimeOrderForWorker.png" width="300"/> | <img src="./src/assets/imgs/Bid1.png" width="300"/> | <img src="./src/assets/imgs/AcquiredOrderForWorker.png" width="300"/> | <img src="./src/assets/imgs/CompletedOrderForworker.png" width="300"/> |

---

### 💰 Bidding Showcase  
| Bid 1 | Bid 2 |
|--------|--------|
| <img src="./src/assets/imgs/Bid1.png" width="400"/> | <img src="./src/assets/imgs/Bid2.png" width="400"/> |

---

### 🧭 Admin Dashboard  
| Users | Filter by Role | Add/Delete Category | Filter Orders |
|--------|----------------|--------------------|----------------|
| <img src="./src/assets/imgs/UsersListForAdm.png" width="300"/> | <img src="./src/assets/imgs/Filter%20UsersByRoleForAdm.png" width="300"/> | <img src="./src/assets/imgs/DeleteCatgorieForAdm.png" width="300"/> | <img src="./src/assets/imgs/FilterAllOrdersForAdm.png" width="300"/> |

---

### 🛠️ Manage Services / Categories  
| Add Service | Filter by Category |
|--------------|--------------------|
| <img src="./src/assets/imgs/CreateNewServiceForAdm.png" width="400"/> | <img src="./src/assets/imgs/FilterByCategorieForAdm.png" width="400"/> |

---

### 💬 Real-Time Chat System  
<p align="center">
  <img src="./src/assets/imgs/Real%20TimeChat%20App%20forAll.png" width="800"/>
</p>

---

### 📊 Worker Dashboard  
<p align="center">
  <img src="./src/assets/imgs/WorkerPage.png" width="800"/>
</p>

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
