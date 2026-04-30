import pandas as pd
from ta.momentum import RSIIndicator
from ta.trend import MACD

# Load cleaned dataset
df = pd.read_csv("data/btc_cleaned.csv")

# Convert Date column
df['Date'] = pd.to_datetime(df['Date'])

# ---------------------------
# 1. Daily Return
# ---------------------------
df['Daily_Return'] = df['Close'].pct_change()

# ---------------------------
# 2. Moving Averages
# ---------------------------
df['MA_7'] = df['Close'].rolling(window=7).mean()
df['MA_30'] = df['Close'].rolling(window=30).mean()

# ---------------------------
# 3. Volatility
# ---------------------------
df['Volatility_7'] = df['Close'].rolling(window=7).std()

# ---------------------------
# 4. Lag Features
# ---------------------------
df['Lag_1'] = df['Close'].shift(1)
df['Lag_2'] = df['Close'].shift(2)
df['Lag_3'] = df['Close'].shift(3)

# ---------------------------
# 5. RSI
# ---------------------------
df['RSI'] = RSIIndicator(close=df['Close'], window=14).rsi()

# ---------------------------
# 6. MACD
# ---------------------------
macd = MACD(close=df['Close'])
df['MACD'] = macd.macd()
df['MACD_Signal'] = macd.macd_signal()

# ---------------------------
# 7. Target Column
# ---------------------------
df['Target'] = df['Close'].shift(-1)

# ---------------------------
# 8. Remove missing rows
# ---------------------------
df.dropna(inplace=True)

# Save final feature dataset
df.to_csv("data/btc_features.csv", index=False)

print("Feature engineering completed successfully!\n")
print("Columns in final dataset:\n")
print(df.columns)

print("\nFirst 5 rows:\n")
print(df.head())