import streamlit as st
import pandas as pd
import joblib
import yfinance as yf
import plotly.graph_objects as go

from ta.momentum import RSIIndicator
from ta.trend import MACD

st.set_page_config(page_title="Multi-Crypto Price Predictor", layout="wide")

st.title("📈 Multi-Cryptocurrency Price Prediction App")
st.write("Predict next-day closing price using Machine Learning")

# ---------------------------
# 1. User selects cryptocurrency
# ---------------------------
crypto_options = {
    "Bitcoin (BTC)": "BTC-USD",
    "Ethereum (ETH)": "ETH-USD",
    "Dogecoin (DOGE)": "DOGE-USD"
}

selected_crypto = st.selectbox("Select Cryptocurrency", list(crypto_options.keys()))
symbol = crypto_options[selected_crypto]

# ---------------------------
# 2. Load trained model
# ---------------------------
model = joblib.load(f"models/{symbol}_model.pkl")

# ---------------------------
# 3. Download latest market data
# ---------------------------
df = yf.download(symbol, period="180d", auto_adjust=False)

# Fix multi-level columns if needed
if isinstance(df.columns, pd.MultiIndex):
    df.columns = df.columns.get_level_values(0)

# Reset index
df = df.reset_index()

# ---------------------------
# 4. Feature Engineering
# ---------------------------
df['Date'] = pd.to_datetime(df['Date'])

df['Daily_Return'] = df['Close'].pct_change()
df['MA_7'] = df['Close'].rolling(window=7).mean()
df['MA_30'] = df['Close'].rolling(window=30).mean()
df['Volatility_7'] = df['Close'].rolling(window=7).std()

df['Lag_1'] = df['Close'].shift(1)
df['Lag_2'] = df['Close'].shift(2)
df['Lag_3'] = df['Close'].shift(3)

df['RSI'] = RSIIndicator(close=df['Close'], window=14).rsi()

macd = MACD(close=df['Close'])
df['MACD'] = macd.macd()
df['MACD_Signal'] = macd.macd_signal()

df.dropna(inplace=True)

# ---------------------------
# 5. Select latest row for prediction
# ---------------------------
features = [
    'Open', 'High', 'Low', 'Close', 'Volume',
    'Daily_Return', 'MA_7', 'MA_30', 'Volatility_7',
    'Lag_1', 'Lag_2', 'Lag_3',
    'RSI', 'MACD', 'MACD_Signal'
]

latest_data = df.iloc[-1:][features]

prediction = model.predict(latest_data)[0]
current_price = df.iloc[-1]['Close']

# ---------------------------
# 6. Display Prediction
# ---------------------------
st.subheader(f"📌 Prediction for {selected_crypto}")
st.metric("Current Closing Price", f"${current_price:,.2f}")
st.metric("Predicted Next-Day Closing Price", f"${prediction:,.2f}")

change_percent = ((prediction - current_price) / current_price) * 100

if change_percent > 2:
    st.success(f"📈 Potential Bullish Signal (+{change_percent:.2f}%)")
elif change_percent < -2:
    st.error(f"📉 Potential Bearish Signal ({change_percent:.2f}%)")
else:
    st.info(f"⚖️ Neutral / Low Movement Expected ({change_percent:.2f}%)")

st.caption("⚠️ This is an ML-based educational forecast, not financial advice.")

# ---------------------------
# 7. Historical Price Chart
# ---------------------------
st.subheader("📊 Historical Closing Price")

fig = go.Figure()
fig.add_trace(go.Scatter(
    x=df['Date'],
    y=df['Close'],
    mode='lines',
    name='Close Price'
))

fig.update_layout(
    title=f"{selected_crypto} Closing Price (Last 180 Days)",
    xaxis_title="Date",
    yaxis_title="Price (USD)",
    template="plotly_white"
)

st.plotly_chart(fig, use_container_width=True)

# ---------------------------
# 8. Show latest data
# ---------------------------
st.subheader("🧾 Latest Feature Snapshot")
st.dataframe(df.tail(5))