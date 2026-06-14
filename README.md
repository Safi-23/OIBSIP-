# 🍕 Pizza Delivery Application

A full-stack pizza ordering platform built with React, Node.js, Express, and MongoDB.

## Features
 User registration with email verification
 Login with JWT authentication
 Forgot/reset password flow
 Custom pizza builder (base, sauce, cheese, veggies)
 Stripe payment integration (test mode)
 Order tracking dashboard
 Admin panel — manage orders & inventory
 Low stock email alerts

## Tech Stack
 Frontend: React, React Router, Axios
 Backend: Node.js, Express, Mongoose
 Database: MongoDB Atlas
 Auth: JWT, bcrypt
 Payments: Stripe
 Email: Nodemailer

## Setup Instructions

### Backend
```
cd pizza-backend
npm install
# create .env file (see .env.example)
node server.js
```

### Frontend
```
cd pizza-frontend
npm install
npm run dev
```

## Environment Variables
See `.env.example` in pizza-backend for required variables.
1