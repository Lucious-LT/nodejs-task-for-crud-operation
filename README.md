# 📝 Node.js Task Management API

A simple task management API built with Node.js, Express, MongoDB, and JWT for user authentication. Users can sign up, log in, and manage their tasks (create, read, update, delete). Includes protected routes and secure password hashing.

---

##  Features

- ✅ User Signup & Login (JWT-based authentication)
- 🔐 Protected task routes
- 🔄 Full CRUD functionality for tasks
- 🔒 Password hashing with bcrypt
- 🧪 Test suite with Jest & Supertest
- 🌿 MongoDB integration via Mongoose

---

## 🧰 Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Jest & Supertest

---

## 📦 Getting Started

### ✅ Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/lucious-lt/nodejs-task-for-crud-operation.git
cd nodejs-task-for-crud-operation

# Install dependencies
npm install

#To Run it Locally
npm run dev


#Run Tests
npm test 

## 📁 Project Folder Structure

├── config
│ └── db.js
├── controllers
│ └── task.controller.js
├── middleware
│ └── auth.middleware.js
├── model
│ ├── task.model.js
│ └── user.model.js
├── node_modules
├── routes
│ ├── auth.routes.js
│ └── task.routes.js
├── test
│ ├── auth.test.js
│ └── task.test.js
├── .env
├── .env.test
├── app.js
├── babel.config.js
├── package.json
├── package-lock.json
├── README.md
└── server.js




