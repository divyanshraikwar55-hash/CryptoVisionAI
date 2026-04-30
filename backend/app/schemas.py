from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    crypto: str = Field(..., example="BTC")
    open: float = Field(..., example=68000)
    high: float = Field(..., example=69000)
    low: float = Field(..., example=67000)
    close: float = Field(..., example=68500)
    volume: float = Field(..., example=1200000)

class PredictionResponse(BaseModel):
    crypto: str
    predicted_price: float
    trend: str