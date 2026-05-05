# 🚀 CryptoVision AI

### AI-Powered Cryptocurrency Forecasting & Analytics Platform

![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![ML](https://img.shields.io/badge/Machine%20Learning-XGBoost-blue)
![Status](https://img.shields.io/badge/Status-Production--Ready-success)

---

## 🧠 Overview

CryptoVision AI is a **full-stack AI-powered crypto analytics platform** that combines:

* 📊 Real-time market visualization
* 🤖 Machine learning predictions
* 📈 Technical indicators
* 🧪 Scenario-based forecasting

It is designed to simulate a **professional trading dashboard experience**, enabling users to analyze trends and predict market behavior.

---

## 🌐 Live Demo

👉 **Frontend:** https://your-frontend.vercel.app
👉 **Backend API:** https://your-backend.onrender.com

---


### 📊 Dashboard

![Dashboard](./images/dashboard.png)

### 📈 Chart & Indicators

![Chart](./images/chart.png)

### 🤖 Prediction Panel

![Prediction](./images/prediction.png)

---

## ✨ Features

### 📊 Real-Time Market Dashboard

* Live crypto price tracking
* Auto-refresh + manual refresh
* Dynamic sentiment display

---

### 📈 Advanced Chart System

* Candlestick chart (OHLC)

* Moving Averages:

  * MA(7) → short-term trend
  * MA(21) → mid-term trend

* Crosshair interaction:

  * Displays OHLC values
  * Shows indicator values in real-time

---

### 📌 Crosshair Data Panel

* Displays:

  * Open / High / Low / Close
  * MA(7), MA(21)
  * RSI (value-based)

* Built using:

```text
Time-based mapping → ensures accuracy across zoom & scaling
```

---

### 🤖 AI Prediction Engine

* Predicts:

  * BUY / SELL / HOLD signal
  * Confidence score
  * Expected market movement

* Powered by:

  * XGBoost
  * Random Forest

---

### 🧪 Scenario Simulator

* Input custom market values:

  * Open, High, Low, Close, Volume
* Get predicted outcome instantly

---

### 📉 RSI Indicator (Optimized)

* RSI calculated but **not plotted as graph**
* Displayed numerically to:

  * Improve readability
  * Avoid UI clutter

---

## 🏗️ System Architecture

```text
User → Next.js Frontend → FastAPI Backend → ML Models → Prediction Response
```

---

## ⚙️ Tech Stack

### 🔹 Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS + ShadCN UI
* Lightweight Charts

---

### 🔹 Backend

* FastAPI (Python)
* REST API architecture
* Model inference system

---

### 🔹 Machine Learning

* XGBoost (primary model)
* Random Forest (support model)
* Feature engineering on OHLC data

---

## 📁 Project Structure

```bash
crypto-project/
│
├── backend/
│   ├── main.py
│   ├── predictor.py
│   ├── model_loader.py
│   └── schemas.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   │   └── ui/
│   │       └── CandlestickChart.tsx
│   └── public/
│       └── files/
│
├── PROJECT_SUMMARY.md
└── README.md
```

---

## 🚀 Getting Started

### 🔹 Clone Repository

```bash
git clone https://github.com/divyanshraikwar55-hash/CryptoVisionAI.git
cd CryptoVisionAI
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 🔹 Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🔑 Environment Variables

Create `.env.local` in frontend:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## 🔧 Key Engineering Decisions

### ✔ Time-Based Crosshair Mapping

```text
Avoided logical index → ensured accurate data alignment
```

---

### ✔ Indicator Calculation Outside Chart

```text
MA & RSI computed independently → avoids chart API limitations
```

---

### ✔ UI Optimization

* Removed RSI graph → improved clarity
* Reduced visual clutter
* Enhanced readability

---


## 🔮 Future Enhancements

* 📉 MACD indicator
* 📊 Volume bars
* ⏱ Multi-timeframe analysis
* 🔄 WebSocket real-time updates
* 🔐 Authentication system
* 📊 Portfolio tracking

---

## ⚠️ Disclaimer

This project is built for **educational purposes only**.
It does **not provide financial advice**.

---

## 🏁 Conclusion

CryptoVision AI demonstrates:

```text
✔ Full-Stack Development  
✔ Machine Learning Integration  
✔ Real-Time Data Visualization  
✔ Product-Level UI/UX Design  
```

---

## 📄 Project Summary

👉 [Download Full Project Summary](./PROJECT_SUMMARY.md)
