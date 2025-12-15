# 📈 StockSagu - Real-Time Stock Dashboard

A clean and simple stock dashboard that shows **real stock prices** using the **Alpha Vantage API**, and verifies users with **Brevo email OTP**.

---

## 🌟 Live Demo
**Frontend:** https://stocksagu-stock-dashboard-1.onrender.com  
**Backend API:** https://stocksagu-stock-dashboard.onrender.com  

---

## 🔐 Authentication
- Login using **email OTP**  
- OTP sent using **Brevo Email Service**  
- OTP expires in **10 minutes**  
- Simple token session system  

---

## 📈 Real-Time Stock Updates
- Fetches **real stock values** from Alpha Vantage  
- Supports stocks: **GOOG, TSLA, AMZN, META, NVDA**  
- Auto-updates every **15 seconds**  
- Saves last **24 hours** of price history  

---

## 📊 Charts
- Candlestick charts  
- Real-time price markers  
- Indicators: **SMA, RSI, MACD, Bollinger Bands**  

---

## 💼 Portfolio & Subscriptions
- Subscribe to favourite stocks  
- Live update feed  
- Simple and clean watchlist  

---

## 🖥️ Simple UI
- Modern dark theme  
- Works on phone, tablet, and desktop  
- Smooth charts and clean buttons  

---

# 🧱 Complete Project Structure

```
backend/
├── .env
├── package.json
├── server.js
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   ├── Subscription.js
│   └── StockHistory.js
├── controllers/
│   ├── authController.js
│   ├── stockController.js
│   └── subscriptionController.js
├── routes/
│   ├── authRoutes.js
│   ├── stockRoutes.js
│   └── subscriptionRoutes.js
├── services/
│   ├── stockService.js
│   └── socketService.js
├── utils/
│   ├── constants.js
│   └── helpers.js
└── middleware/
    └── auth.js


frontend/
├── package.json
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   ├── App.js
│   ├── App.css
│   ├── index.css
│   ├── api/
│   │   └── api.js
│   ├── components/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── StockList.js
│   │   ├── StockCard.js
│   │   └── SubscriptionManager.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   └── useWebSocket.js
│   └── utils/
│       └── constants.js
```

---

## 🗄️ MongoDB Screenshots (To Add)
Please attach screenshots of:
- User collection  
- Subscription collection  
- StockHistory collection  
- Any other collection  

---

## 🧪 Backend Health Check (POSTMAN Screenshot Needed)
Please add screenshot of hitting:
```
GET /health
```
It shows:
- Backend is running  
- Database connected  
- Stock API working  
- Socket connected  

---

## 🚀 Setup

### Backend
```
cd backend
npm install
npm run dev
```

### Frontend
```
cd frontend
npm install
npm start
```

---

## 🔌 API (Short)
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `GET /api/stocks/prices`
- `POST /api/subscriptions/subscribe`
- `GET /health`

---

## 🙏 Support
Email: **sagarshegunasi2664@gmail.com**

Made with ❤️ by Sagar

Last Updated: December 2024
