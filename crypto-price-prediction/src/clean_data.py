import pandas as pd

# Load dataset
df = pd.read_csv("data/btc_data.csv")

print("Original Columns:", df.columns)

# Convert Date column to datetime
df['Date'] = pd.to_datetime(df['Date'])

# Sort by date
df = df.sort_values('Date')

# Reset index
df = df.reset_index(drop=True)

# Drop Adj Close if present
if 'Adj Close' in df.columns:
    df = df.drop(columns=['Adj Close'])

# Save cleaned dataset
df.to_csv("data/btc_cleaned.csv", index=False)

print("\nCleaned dataset saved successfully!")
print(df.head())
print("\nColumns after cleaning:")
print(df.columns)