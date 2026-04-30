import os
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_DIR = os.path.join(BASE_DIR, "crypto-price-prediction", "models")

MODEL_MAP = {
    "BTC": "BTC-USD_model.pkl",
    "ETH": "ETH-USD_model.pkl",
    "DOGE": "DOGE-USD_model.pkl"
}

def load_model(crypto: str):
    crypto = crypto.upper()

    if crypto not in MODEL_MAP:
        raise ValueError(f"Unsupported crypto: {crypto}")

    model_path = os.path.join(MODEL_DIR, MODEL_MAP[crypto])

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")

    model = joblib.load(model_path)
    return model