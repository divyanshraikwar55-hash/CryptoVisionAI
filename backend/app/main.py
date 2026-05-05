from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    crypto: str
    open: float
    high: float
    low: float
    close: float
    volume: float


models = {
    "BTC": pickle.load(open("../crypto-price-prediction/models/BTC-USD_model.pkl", "rb")),
    "ETH": pickle.load(open("../crypto-price-prediction/models/ETH-USD_model.pkl", "rb")),
    "DOGE": pickle.load(open("../crypto-price-prediction/models/DOGE-USD_model.pkl", "rb")),
}

def create_features(open_, high, low, close, volume):
    df = pd.DataFrame([{
        "Open": open_,
        "High": high,
        "Low": low,
        "Close": close,
        "Volume": volume
    }])

    # same features used in training
    df["Daily_Return"] = 0
    df["MA_7"] = close
    df["MA_30"] = close
    df["Volatility_7"] = 0
    df["Lag_1"] = close
    df["Lag_2"] = close
    df["Lag_3"] = close
    df["RSI"] = 50
    df["MACD"] = 0
    df["MACD_Signal"] = 0

    return df

@app.get("/")
def home():
    return {"message": "CryptoVision AI Backend is running"}

@app.post("/predict")
def predict(data: PredictionRequest):
    try:
        crypto = data.crypto.upper()

        if crypto not in models:
            return {"error": "Invalid crypto selected"}

        model = models[crypto]

        # Extract values
        open_ = data.open
        high = data.high
        low = data.low
        close = data.close
        volume = data.volume

        # Create features
        input_df = create_features(open_, high, low, close, volume)

        # Prediction
        prediction = float(model.predict(input_df)[0])

        if prediction > close:
            trend = "Bullish"
            recommendation = "BUY"
        elif prediction < close:
            trend = "Bearish"
            recommendation = "SELL"
        else:
            trend = "Neutral"
            recommendation = "HOLD"

        difference = abs(prediction - close) / close

        if difference > 0.05:
            confidence = 90
        elif difference > 0.02:
            confidence = 75
        else:
            confidence = 60

        reasons = []

        if close > open_:
            reasons.append("Price closed higher than it opened (bullish momentum)")

        if high - low > close * 0.05:
            reasons.append("High volatility detected in market")

        if volume > 30000000000:
            reasons.append("Strong trading volume observed")

        if prediction > close:
            reasons.append("Model predicts upward movement")

        if prediction < close:
            reasons.append("Model predicts downward movement")

        if len(reasons) == 0:
            reasons.append("Market conditions are neutral")

        return {
            "crypto": crypto,
            "predicted_price": round(prediction, 2),
            "trend": trend,
            "recommendation": recommendation,
            "confidence": confidence,
            "reasons": reasons
        }
        

    except Exception as e:
        return {
            "detail": f"Prediction failed. {str(e)}"
        }