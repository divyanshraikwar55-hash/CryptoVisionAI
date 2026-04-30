import pandas as pd

symbols = ["BTC-USD", "ETH-USD", "DOGE-USD"]

for symbol in symbols:
    print(f"\nCleaning data for {symbol}...")

    df = pd.read_csv(f"data/{symbol}_data.csv")

    print("Original Columns:", df.columns)

    # Convert Date column
    df['Date'] = pd.to_datetime(df['Date'])

    # Sort by Date
    df = df.sort_values('Date')

    # Reset index
    df = df.reset_index(drop=True)

    # Drop Adj Close if present
    if 'Adj Close' in df.columns:
        df = df.drop(columns=['Adj Close'])

    # Save cleaned data
    df.to_csv(f"data/{symbol}_cleaned.csv", index=False)

    print(f"✅ {symbol} cleaned successfully!")
    print(df.head())