# 🎥 SlideSprint Demo Video Script & Voiceover Guide
**Presenter:** Akash Rakholiya  
**Project:** Pizza Delivery Application  
**Internship:** OASIS INFOBYTE Internship  
**Target Duration:** 3 to 5 Minutes  

This script provides step-by-step instructions for what to show on screen (Visuals) and exactly what to say (Voiceover/Speech) during your recording.

---

## ⏱️ Video Timeline Overview

| Section | Visual Focus | Target Duration |
| :--- | :--- | :--- |
| **1. Intro Card** | Title screen with presenter & internship details | 0:00 - 0:25 |
| **2. Registration & verification** | Register page, verification screen, and email inbox | 0:25 - 0:55 |
| **3. User Login** | Standard customer login and dashboard | 0:55 - 1:15 |
| **4. Custom Pizza Builder** | Creating a pizza through the 5-step wizard | 1:15 - 1:45 |
| **5. Cart & Razorpay Checkout** | Cart summary and Razorpay test payment modal | 1:45 - 2:20 |
| **6. Live Order Tracking** | Status tracking timeline, driver info, and socket updates | 2:20 - 2:45 |
| **7. Admin Portal & Inventory** | Admin dashboard, settings, and threshold modifications | 2:45 - 3:20 |
| **8. Low-Stock Alerts** | Low-stock email dispatch and final overview | 3:20 - 4:00 |

---

## 🎙️ Scene-by-Scene Script

### 🎬 Scene 1: Introduction (0:00 - 0:25)
* **Visuals:** Show a clean intro slide (either in presentation software or full-screen browser text) showing:
  * **Akash Rakholiya**
  * **OASIS INFOBYTE Internship**
  * **Pizza Delivery Application (SliceSprint)**
* **Voiceover:**
  > *"Hello everyone! My name is Akash Rakholiya, and today I am thrilled to present my project for the Oasis Infobyte Internship. I have built 'SliceSprint'—a full-stack, enterprise-grade pizza delivery application. In this demo video, I will walk you through the end-to-end user workflow, custom builder, Razorpay checkout, real-time order tracking, and our administrative inventory system. Let's dive in!"*

---

### 🎬 Scene 2: User Registration & Verification (0:25 - 0:55)
* **Visuals:** Navigate to `http://localhost:5173/register`. Fill in a name, email, and password. Submit the form. Show the "Verify Your Email" screen. Briefly open your email client (like Mailtrap) showing the HTML email sent by the server, and click the link.
* **Voiceover:**
  > *"We start at the registration screen. I will create a new user account. Once submitted, our Node.js server registers the user, hashes their password securely, and generates an email verification token using Nodemailer. As you can see, we are prompted to check our email. In our Mailtrap inbox, we receive a beautifully styled verification email. Clicking the link takes us back to the platform, successfully verifying our account in the MongoDB database."*

---

### 🎬 Scene 3: User Login (0:55 - 1:15)
* **Visuals:** Navigate to `http://localhost:5173/login`. Type in the credentials and click submit. You will land on the customer homepage dashboard. Scroll through the available preconfigured pizzas.
* **Voiceover:**
  > *"Now, let's log in with our newly verified account. On successful login, the Redux store stores our session token, and we are routed to the customer dashboard. Here, we can browse available signature pizzas, complete with local image assets, pricing, and ingredients loaded dynamically from the backend."*

---

### 🎬 Scene 4: Custom Pizza Creation (1:15 - 1:45)
* **Visuals:** Click on the "Build Pizza" link in the navbar. Navigate through the 5 steps:
  * Step 1: Select Crust (Base)
  * Step 2: Select Sauce
  * Step 3: Select Cheese
  * Step 4: Toggle Veg Toppings
  * Step 5: Select Meat Toppings
* Show the price updating on the right-hand panel in real-time. Click "Add to Cart".
* **Voiceover:**
  > *"One of the core features of SliceSprint is the Custom Pizza Builder. This interactive wizard lets users build a pizza from scratch in 5 simple steps. We select our base, sauce, cheese type, veg toppings, and meats. Note how the price dynamically recalculates on the right as we make our selections. Once satisfied, we click 'Add to Cart', which packages our custom configurations into the Redux cart state."*

---

### 🎬 Scene 5: Cart & Razorpay Test Payment (1:45 - 2:20)
* **Visuals:** Open the cart page. Verify the items, then click "Proceed to Checkout". Enter the delivery address. Click "Pay Now". The Razorpay Checkout modal appears. Select a payment method, click "Success", and watch the modal close.
* **Voiceover:**
  > *"Here is our cart showing our custom pizza. We click checkout, specify our delivery address, and proceed to payment. We have integrated a test-mode Razorpay checkout. The payment gateway generates a unique order ID. On clicking the 'Success' button, the payment signature is verified by our backend payment controller, saving the order state to the database."*

---

### 🎬 Scene 6: Live Order Tracking (2:20 - 2:45)
* **Visuals:** The user is redirected to the `/orders` page. Show the tracking timeline with green dots, the delivery driver card (Rahul Sharma), the mini route map, and the live updates list at the bottom.
* **Voiceover:**
  > *"After a successful checkout, the client redirects us to the Order Tracking page. Rather than static placeholders, this page pulls real data from the database. We can see our order status, payment logs, and a live tracking stepper. We also see our delivery partner's rating and contact status, along with a visual route map."*

---

### 🎬 Scene 7: Admin Login & Inventory Overview (2:45 - 3:20)
* **Visuals:** Log out of the customer account, and log in with the admin account (`admin@pizza.com` / `password123`). Show that you are redirected directly to the **Admin Settings**. Then click on the **Inventory** link in the sidebar. Show the statistics cards and scroll through the table. Adjust a warning threshold slider.
* **Voiceover:**
  > *"Now, let's log in as the system Administrator. On successful login, the application detects our 'admin' role and routes us to the Admin Settings. Switching to the Inventory panel, we see a premium management dashboard. Here, we can inspect ingredient stocks, units, and categories. If we need to adjust stock levels or lower warning thresholds, we can use the sliders or type the numbers directly into the fields."*

---

### 🎬 Scene 8: Stock Reduction & Low Stock Alert Emails (3:20 - 4:00)
* **Visuals:** Click the "+ Add New Ingredient" button at the bottom of the left card, show the modal. Then point to the "Email Alerts" button on the right card. Open Mailtrap again to show the styled "Low Stock Alert" email generated by the backend when the checkout process reduced ingredient quantities below threshold levels.
* **Voiceover:**
  > *"When a customer places an order, the server automatically reduces stock levels. If any ingredient falls below the custom warning threshold, the system immediately dispatches a styled warning email to the administrator. In our email client, we can see the automated stock alert indicating that items like Pizza Sauce or Crusts need attention. This completes the loop of our inventory management system.*
  > 
  > *To summarize, SliceSprint combines a premium React user interface with a robust Express and MongoDB backend to deliver a complete, secure, and production-ready pizza delivery experience.*
  > 
  > *Thank you, Oasis Infobyte, for this learning experience during my internship. I look appreciate your feedback!"*

---
