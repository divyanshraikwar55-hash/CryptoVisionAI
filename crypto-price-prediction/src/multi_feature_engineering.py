import pandas as pd
from ta.momentum import RSIIndicator
from ta.trend import MACD

symbols = ["BTC-USD", "ETH-USD", "DOGE-USD"]

for symbol in symbols:
    print(f"\nCreating features for {symbol}...")

    df = pd.read_csv(f"data/{symbol}_cleaned.csv")

    # Convert Date
    df['Date'] = pd.to_datetime(df['Date'])

    # Daily Return
    df['Daily_Return'] = df['Close'].pct_change()

    # Moving Averages
    df['MA_7'] = df['Close'].rolling(window=7).mean()
    df['MA_30'] = df['Close'].rolling(window=30).mean()

    # Volatility
    df['Volatility_7'] = df['Close'].rolling(window=7).std()

    # Lag Features
    df['Lag_1'] = df['Close'].shift(1)
    df['Lag_2'] = df['Close'].shift(2)
    df['Lag_3'] = df['Close'].shift(3)

    # RSI
    df['RSI'] = RSIIndicator(close=df['Close'], window=14).rsi()

    # MACD
    macd = MACD(close=df['Close'])
    df['MACD'] = macd.macd()
    df['MACD_Signal'] = macd.macd_signal()

    # Target = next day close
    df['Target'] = df['Close'].shift(-1)

    # Remove missing rows
    df.dropna(inplace=True)

    # Save feature dataset
    df.to_csv(f"data/{symbol}_features.csv", index=False)

    print(f"✅ {symbol} feature engineering completed!")
    print(df.head())