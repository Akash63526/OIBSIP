# Local Setup Guide

Follow these steps to run the Pizza Delivery Application on your local machine.

## Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- MongoDB (if running locally without Docker)
- Redis (if running locally without Docker)

## Environment Variables
Create a `.env` file in the `server` directory and configure the following:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pizza_delivery
REDIS_URL=redis://localhost:6379

JWT_ACCESS_SECRET=4ea10e7f535d9044b1ac3ba851fe3ae70188542798b719d78e10252f9a6c7d89
JWT_REFRESH_SECRET=a31e94fe60bf7438566a6a7f4b6f0d4eb9dad9bff3758291dafbcb085fe7b28d
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=567c2dfcf3b865
SMTP_PASS=5d701c0fdae6bb
EMAIL_FROM=noreply@pizzaapp.com

RAZORPAY_KEY_ID=rzp_test_St5oZ542gltwyC
RAZORPAY_KEY_SECRET=opxYylnkv4aL4HkR5kdGSyqJ

# Cloudinary Image Upload Credentials
CLOUDINARY_CLOUD_NAME=dvrwhxtwi
CLOUDINARY_API_KEY=138943773353664
CLOUDINARY_API_SECRET=avUbeexoSINXj8G3sDemdM_FFm8
```

### 🔑 How to Fill in the Blanks

Here is a step-by-step guide to help you find and generate the values for the environment variables above:

#### 1. Database & Cache Defaults
* **`MONGODB_URI`**: Set to `mongodb://localhost:27017/pizza_delivery`. If you are using MongoDB Atlas (cloud), replace this with your connection string.
* **`REDIS_URL`**: Keep as `redis://localhost:6379`. This connects to your local Redis instance.

#### 2. Security Keys (`JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`)
These are used to encrypt user login tokens. You should generate random, secure strings.
* **How to generate**: Open your terminal, run the following command, and copy the output:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Run it twice to get two different keys—one for the access secret and one for the refresh secret.

#### 3. Email Settings (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`)
These are used to send verification and order status emails. For development, we recommend **Mailtrap** (a free service that catches outgoing emails so you can test safely).
1. Go to [Mailtrap](https://mailtrap.io/) and sign up for a free account.
2. Navigate to **Email Testing** > **Inboxes** > **My Inbox**.
3. Select **Integrations** > **Nodemailer** or click on **SMTP Settings**.
4. Copy the values:
   * `SMTP_HOST`: `sandbox.smtp.mailtrap.io` (or as shown on your dashboard)
   * `SMTP_PORT`: `2525`
   * `SMTP_USER`: Enter your unique inbox username.
   * `SMTP_PASS`: Enter your unique inbox password.

#### 4. Payments (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`)
These enable standard payment processing. You can use **Test Mode** (no real money).
1. Go to [Razorpay](https://razorpay.com/) and register a free account.
2. In the dashboard, toggle to **Test Mode** (usually at the top right).
3. Navigate to **Settings** > **API Keys** > **Generate Key**.
4. Copy the `Key ID` and `Key Secret` into your variables.

#### 5. Image Storage (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
These store pizza images uploaded by the admin interface.
1. Sign up for a free account at [Cloudinary](https://cloudinary.com/).
2. Log into the Cloudinary Console.
3. On the **Dashboard/Product Environment Info**, you will find:
   * **Cloud Name** (`CLOUDINARY_CLOUD_NAME`)
   * **API Key** (`CLOUDINARY_API_KEY`)
   * **API Secret** (`CLOUDINARY_API_SECRET`) (Click "Reveal" to see it).
4. Copy these credentials directly into your `.env` file.


## Running the Application (With Docker)
The easiest way to run the entire stack (Frontend, Backend, MongoDB, Redis) is via Docker Compose:

1. Ensure Docker is running.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. The frontend will be accessible at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Running the Application (Without Docker)

### 1. Start the Backend
```bash
cd server
npm install
npm run dev
```

### 2. Start the Frontend
```bash
cd client
npm install
npm run dev
```
