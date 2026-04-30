import yfinance as yf
import pandas as pd

# Download Bitcoin data
btc = yf.download("BTC-USD", start="2020-01-01", end="2025-12-31")

# Fix multi-level columns if they exist
if isinstance(btc.columns, pd.MultiIndex):
    btc.columns = btc.columns.get_level_values(0)

# Reset index so Date becomes a normal column
btc = btc.reset_index()

# Save clean CSV
btc.to_csv("data/btc_data.csv", index=False)

print("Bitcoin data downloaded successfully!")
print("\nColumns:")
print(btc.columns)
print("\nFirst 5 rows:")
print(btc.head())