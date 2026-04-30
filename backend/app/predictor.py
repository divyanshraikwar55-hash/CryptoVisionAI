import pandas as pd
from app.model_loader import load_model

def create_features(open_price, high, low, close, volume):
    """
    Create exact features expected by the trained model.
    Since user enters only one row manually, some historical indicators
    are approximated using current close price.
    """

    # Basic engineered features
    daily_return = ((close - open_price) / open_price) if open_price != 0 else 0

    # Since we do not have historical rows yet, approximate moving averages
    ma_7 = close
    ma_30 = close

    # Approximate rolling volatility
    volatility_7 = ((high - low) / close) if close != 0 else 0

    # Approximate lag values
    lag_1 = close
    lag_2 = close
    lag_3 = close

    # Approximate RSI
    price_change = close - open_price
    rsi = 50 + ((price_change / open_price) * 100 if open_price != 0 else 0)

    # Approximate MACD and MACD Signal
    macd = ma_7 - ma_30
    macd_signal = macd

    features = {
        "Open": open_price,
        "High": high,
        "Low": low,
        "Close": close,
        "Volume": volume,
        "Daily_Return": daily_return,
        "MA_7": ma_7,
        "MA_30": ma_30,
        "Volatility_7": volatility_7,
        "Lag_1": lag_1,
        "Lag_2": lag_2,
        "Lag_3": lag_3,
        "RSI": rsi,
        "MACD": macd,
        "MACD_Signal": macd_signal
    }

    return pd.DataFrame([features])

def predict_crypto_price(crypto, open_price, high, low, close, volume):
    model = load_model(crypto)

    input_df = create_features(open_price, high, low, close, volume)

    try:
        prediction = model.predict(input_df)[0]
    except Exception as e:
        raise ValueError(f"Prediction failed. Details: {str(e)}")

    trend = "Bullish" if prediction > close else "Bearish"

    return {
        "crypto": crypto.upper(),
        "predicted_price": round(float(prediction), 4),
        "trend": trend
    }