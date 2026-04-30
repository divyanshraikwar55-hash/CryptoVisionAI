import pandas as pd
import numpy as np
import joblib

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

symbols = ["BTC-USD", "ETH-USD", "DOGE-USD"]

# Common feature list
features = [
    'Open', 'High', 'Low', 'Close', 'Volume',
    'Daily_Return', 'MA_7', 'MA_30', 'Volatility_7',
    'Lag_1', 'Lag_2', 'Lag_3',
    'RSI', 'MACD', 'MACD_Signal'
]

def evaluate_model(y_true, y_pred, model_name):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)

    print(f"\n📌 {model_name} Performance:")
    print(f"MAE  : {mae:.4f}")
    print(f"RMSE : {rmse:.4f}")
    print(f"R²   : {r2:.4f}")

    return mae, rmse, r2

for symbol in symbols:
    print(f"\n{'='*50}")
    print(f"Training models for {symbol}")
    print(f"{'='*50}")

    # Load dataset
    df = pd.read_csv(f"data/{symbol}_features.csv")

    X = df[features]
    y = df['Target']

    # Time-series split
    split = int(len(df) * 0.8)

    X_train = X[:split]
    X_test = X[split:]

    y_train = y[:split]
    y_test = y[split:]

    print("\nTraining data shape:", X_train.shape)
    print("Testing data shape :", X_test.shape)

    # ---------------------------
    # Linear Regression
    # ---------------------------
    lr = LinearRegression()
    lr.fit(X_train, y_train)
    y_pred_lr = lr.predict(X_test)

    evaluate_model(y_test, y_pred_lr, "Linear Regression")

    # ---------------------------
    # Random Forest
    # ---------------------------
    rf = RandomForestRegressor(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    y_pred_rf = rf.predict(X_test)

    evaluate_model(y_test, y_pred_rf, "Random Forest")

    # ---------------------------
    # XGBoost
    # ---------------------------
    xgb = XGBRegressor(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=6,
        random_state=42
    )

    xgb.fit(X_train, y_train)
    y_pred_xgb = xgb.predict(X_test)

    evaluate_model(y_test, y_pred_xgb, "XGBoost")

    # Save best model (XGBoost)
    joblib.dump(xgb, f"models/{symbol}_model.pkl")
    print(f"\n✅ Saved model for {symbol} as models/{symbol}_model.pkl")