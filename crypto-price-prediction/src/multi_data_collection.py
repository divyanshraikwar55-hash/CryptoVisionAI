import yfinance as yf
import pandas as pd

# List of cryptocurrencies
symbols = ["BTC-USD", "ETH-USD", "DOGE-USD"]

for symbol in symbols:
    print(f"\nDownloading data for {symbol}...")

    try:
        df = yf.download(symbol, start="2020-01-01", end="2025-12-31", auto_adjust=False)

        # If download failed or returned empty
        if df.empty:
            print(f"⚠️ No data found for {symbol}. Skipping...")
            continue

        # Fix multi-level columns if present
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # Reset index so Date becomes normal column
        df = df.reset_index()

        # Save CSV
        df.to_csv(f"data/{symbol}_data.csv", index=False)

        print(f"✅ {symbol} data saved successfully!")
        print(df.head())

    except Exception as e:
        print(f"❌ Error downloading {symbol}: {e}")