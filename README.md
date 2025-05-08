# 📦 StockMate – Node.js Backend

This is the backend service for **StockMate**, a powerful inventory and stock management system built using the **MERN stack**. This backend is written in **Node.js + Express**, uses **MongoDB** for the database, and is configured for deployment on **AWS EC2**.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js  
- **Framework**: Express.js  
- **Database**: MongoDB, Mongoose  
- **Authentication**: JWT, Bcrypt  
- **Environment**: AWS EC2 (Linux), Render (for dev/testing)  
- **Deployment Tools**: PM2, Git, Nginx (optional)  

---

## 📁 Project Structure

```
stockmate-backend/
├── config/           # DB and app configurations
├── controllers/      # Business logic for routes
├── middleware/       # Auth middleware and error handlers
├── models/           # Mongoose schemas and models
├── routes/           # Express route handlers
├── utils/            # Utility functions
├── .env.example      # Sample environment configuration
├── server.js         # Entry point of the server
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/stockmate-backend.git
cd stockmate-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Then edit `.env` with your own values:

```dotenv
PORT=5000
MONGODB_URI=mongodb+srv://<your-mongo-uri>
JWT_SECRET=your_jwt_secret
```

### 4. Run the Server (Development)

```bash
npm run dev
```

Or in production mode:

```bash
npm start
```

---

## 🚀 AWS EC2 Deployment Guide

> This section assumes you already have a running Ubuntu EC2 instance.

### 1. SSH into your EC2 Instance

```bash
ssh -i "your-key.pem" ubuntu@your-ec2-ip
```

### 2. Install Node.js and Git

```bash
sudo apt update
sudo apt install nodejs npm git -y
```

### 3. Clone Your Repo and Setup

```bash
git clone https://github.com/your-username/stockmate-backend.git
cd stockmate-backend
npm install
```

### 4. Setup `.env` and Start App

Add your `.env` file and run:

```bash
npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

### 5. (Optional) Setup Nginx for Reverse Proxy + HTTPS

Configure Nginx to serve your app and secure it with SSL using Let’s Encrypt.

---

## 🧪 API Endpoints Overview

| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| GET    | /api/stocks        | Get all stocks            |
| POST   | /api/stocks        | Add a new stock           |
| PUT    | /api/stocks/:id    | Update stock by ID        |
| DELETE | /api/stocks/:id    | Delete stock by ID        |
| POST   | /api/auth/login    | User login                |
| POST   | /api/auth/register | User registration         |

> Note: Authentication required for protected routes

---

## 🔐 Security Tips

- Keep your `.env` file private (add it to `.gitignore`)  
- Use HTTPS for production  
- Rotate JWT secrets periodically  

---

## 📌 Future Enhancements

- Add email/SMS alerts for low stock  
- Unit and integration testing  
- Dockerize the application  
- Add CI/CD for AWS deployment  

---

## 🤝 Contributing

Feel free to fork this repo, raise issues, or submit pull requests. All contributions are welcome!

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Bikash Kumar Giri**  
- 📧 [giribikashkumar097@gmail.com](mailto:giribikashkumar097@gmail.com)  
- 🌐 [LinkedIn](https://www.linkedin.com/in/bikash-kumar-giri-60ab32288)  
- 💻 [GitHub](https://github.com/bikashgiri2002)

---
