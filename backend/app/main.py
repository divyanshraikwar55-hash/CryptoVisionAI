from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np
import os
import xgboost as xgb


app = FastAPI()

# CORS (restrict later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

def load_model(name):
    path = os.path.join(MODEL_DIR, name)
    model = pickle.load(open(path, "rb"))

    try:
        model.set_params(tree_method="hist")
    except:
        pass

    return model

models = {
    "BTC": load_model("BTC-USD_model.pkl"),
    "ETH": load_model("ETH-USD_model.pkl"),
    "DOGE": load_model("DOGE-USD_model.pkl"),
}


class PredictionRequest(BaseModel):
    crypto: str
    open: float
    high: float
    low: float
    close: float
    volume: float


def create_features(open_, high, low, close, volume):
    df = pd.DataFrame([{
        "Open": open_,
        "High": high,
        "Low": low,
        "Close": close,
        "Volume": volume
    }])

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
    return {"status": "CryptoVision AI Backend Running"}


@app.post("/predict")
def predict(data: PredictionRequest):
    try:
        crypto = data.crypto.upper()

        if crypto not in models:
            return {"error": "Invalid crypto selected"}

        model = models[crypto]

        input_df = create_features(
            data.open,
            data.high,
            data.low,
            data.close,
            data.volume
        )


        dtest = xgb.DMatrix(input_df)

        booster = model.get_booster()

        prediction = float(booster.predict(dtest)[0])

        if prediction > data.close:
            trend = "Bullish"
            recommendation = "BUY"
        elif prediction < data.close:
            trend = "Bearish"
            recommendation = "SELL"
        else:
            trend = "Neutral"
            recommendation = "HOLD"

        difference = abs(prediction - data.close) / data.close

        confidence = 90 if difference > 0.05 else 75 if difference > 0.02 else 60

        reasons = []

        if data.close > data.open:
            reasons.append("Price closed higher than it opened")

        if data.high - data.low > data.close * 0.05:
            reasons.append("High volatility detected")

        if data.volume > 30000000000:
            reasons.append("Strong trading volume observed")

        reasons.append(f"Model predicts {trend.lower()} movement")

        return {
            "crypto": crypto,
            "predicted_price": round(prediction, 2),
            "trend": trend,
            "recommendation": recommendation,
            "confidence": confidence,
            "reasons": reasons
        }

    except Exception as e:
        return {"detail": f"Prediction failed: {str(e)}"}