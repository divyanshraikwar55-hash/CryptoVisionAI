import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import os

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Make sure outputs folder exists
os.makedirs("outputs", exist_ok=True)

symbols = ["BTC-USD", "ETH-USD", "DOGE-USD"]

features = [
    'Open', 'High', 'Low', 'Close', 'Volume',
    'Daily_Return', 'MA_7', 'MA_30', 'Volatility_7',
    'Lag_1', 'Lag_2', 'Lag_3',
    'RSI', 'MACD', 'MACD_Signal'
]

results = []

for symbol in symbols:
    print(f"\nEvaluating model for {symbol}...")

    # Load data
    df = pd.read_csv(f"data/{symbol}_features.csv")

    X = df[features]
    y = df['Target']

    # Time-series split
    split = int(len(df) * 0.8)

    X_test = X[split:]
    y_test = y[split:]

    # Load trained model
    model = joblib.load(f"models/{symbol}_model.pkl")

    # Predict
    y_pred = model.predict(X_test)

    # Metrics
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    results.append({
        "Crypto": symbol,
        "MAE": mae,
        "RMSE": rmse,
        "R2": r2
    })

    # Save Actual vs Predicted CSV
    pred_df = pd.DataFrame({
        "Actual": y_test.values,
        "Predicted": y_pred
    })

    pred_df.to_csv(f"outputs/{symbol}_predictions.csv", index=False)

    # Plot Actual vs Predicted
    plt.figure(figsize=(12, 6))
    plt.plot(y_test.values, label="Actual")
    plt.plot(y_pred, label="Predicted")
    plt.title(f"{symbol} - Actual vs Predicted")
    plt.xlabel("Time")
    plt.ylabel("Price")
    plt.legend()
    plt.grid(True)
    plt.savefig(f"outputs/{symbol}_actual_vs_predicted.png")
    plt.close()

    print(f"✅ Graph and predictions saved for {symbol}")

# Save overall results
results_df = pd.DataFrame(results)
results_df.to_csv("outputs/model_results.csv", index=False)

print("\n🎉 Evaluation completed successfully!")
print("\nFinal Model Comparison:")
print(results_df)