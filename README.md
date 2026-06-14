# 🍕 SliceSprint - Pizza Delivery Application

![MERN Stack](https://img.shields.io/badge/MERN-FullStack-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment-blue)

## 📌 Project Overview

SliceSprint is a Full Stack Pizza Delivery Application developed as part of the **Oasis Infobyte Web Development Internship Program**.

The application enables users to create customized pizzas, place orders securely using Razorpay Payment Gateway, track orders in real-time, and allows administrators to manage inventory, monitor stock levels, and handle customer orders efficiently.

---

## 🚀 Features

### 👤 User Features

* User Registration
* User Login
* Email Verification
* Forgot Password
* Reset Password
* JWT Authentication
* Browse Available Pizzas
* Custom Pizza Builder
* Add to Cart
* Razorpay Payment Integration
* Order Placement
* Order Tracking
* Order History

---

### 🍕 Custom Pizza Builder

Users can create their own pizza by selecting:

#### Pizza Base

* Thin Crust
* Cheese Burst
* Stuffed Crust
* Whole Wheat
* Classic Pan

#### Sauces

* Tomato Sauce
* BBQ Sauce
* White Garlic Sauce
* Pesto Sauce
* Spicy Sauce

#### Cheese

* Mozzarella
* Cheddar
* Parmesan
* Gouda
* Mixed Cheese

#### Toppings

* Onion
* Capsicum
* Corn
* Mushroom
* Olives
* Tomato
* Jalapeno
* Paneer

---

### 🔐 Authentication System

* Secure Registration
* Login System
* Password Hashing using Bcrypt
* JWT Authentication
* Email Verification
* Forgot Password
* Reset Password

---

### 💳 Payment Gateway

* Razorpay Test Mode Integration
* Secure Checkout
* Payment Verification
* Automatic Order Creation

---

### 👨‍💼 Admin Features

* Admin Login
* Dashboard Overview
* Inventory Management
* Order Management
* Customer Monitoring
* Stock Monitoring
* Email Notifications

---

### 📦 Inventory Management

Admin can manage:

* Pizza Base Stock
* Sauce Stock
* Cheese Stock
* Vegetable Stock
* Meat Stock

Stock is automatically updated after every successful order.

---

### 📧 Low Stock Email Alert

When stock falls below the predefined threshold value:

* Automatic Email Notification
* Low Stock Warning
* Inventory Monitoring

---

### 🚚 Order Tracking

Order status updates include:

1. Order Received
2. In Kitchen
3. Sent To Delivery
4. Delivered

Status updates are reflected on the user dashboard.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Router
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* JWT
* Bcrypt.js

### Email Service

* Nodemailer

### Payment

* Razorpay

### Deployment

* Vercel
* Render

---

## 📂 Project Structure

```bash
SliceSprint/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── screenshots/
│
├── README.md
│
└── package.json
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/OIBSIP.git
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Create Environment Variables

Create a .env file in backend folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

EMAIL_PASS=your_email_password

RAZORPAY_KEY_ID=your_key

RAZORPAY_KEY_SECRET=your_secret
```

### Run Frontend

```bash
npm run dev
```

### Run Backend

```bash
npm run server
```

---

## 📸 Screenshots

### User Panel

* Registration Page
* Login Page
* Email Verification
* Custom Pizza Builder
* Cart Page
* Checkout Page
* Order Tracking

### Admin Panel

* Admin Dashboard
* Inventory Management
* Order Management
* Low Stock Alert

---

## 🎥 Project Demo

Video Demonstration:

Add LinkedIn Video URL Here

---

## 🌐 Live Deployment

Frontend:

Add Frontend URL Here

Backend:

Add Backend URL Here

---

## 👨‍💻 Developer

Akash Rakholiya

Oasis Infobyte Web Development Intern

---

## 📜 Internship

Organization: Oasis Infobyte

Domain: Web Development & Designing

Project: Pizza Delivery Application (SliceSprint)

Program: OIB-SIP Internship

---

## 🙏 Acknowledgement

I would like to thank Oasis Infobyte for providing me with the opportunity to work on this project and enhance my Full Stack Web Development skills through practical learning and implementation.
