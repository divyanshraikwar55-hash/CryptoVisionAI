import pandas as pd
import matplotlib.pyplot as plt

# Load cleaned data
df = pd.read_csv("data/btc_cleaned.csv")

print("Columns in cleaned data:", df.columns)

# Convert Date column
df['Date'] = pd.to_datetime(df['Date'])

# Plot Close price
plt.figure(figsize=(12, 6))
plt.plot(df['Date'], df['Close'])
plt.title("Bitcoin Closing Price Over Time")
plt.xlabel("Date")
plt.ylabel("Price (USD)")
plt.grid(True)
plt.show()