"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries, LineSeries, Time } from "lightweight-charts";

// TypeScript interfaces for type safety
interface CandleData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface LineData {
  time: Time;
  value: number;
}

interface CrosshairData {
  timestamp: string;
  candle: {
    open: number;
    high: number;
    low: number;
    close: number;
  } | null;
  ma7: number | null;
  ma21: number | null;
  rsi: number | null;
}




function calculateRSI(data: CandleData[], period: number = 14): LineData[] {
  const rsi: LineData[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;

    if (i <= period) {
      if (change > 0) gains += change;
      else losses -= change;

      if (i === period) {
        const rs = gains / losses;
        rsi.push({
          time: data[i].time,
          value: 100 - 100 / (1 + rs),
        });
      }
    } else {
      const prev = rsi[rsi.length - 1]?.value || 50;

      const gain = change > 0 ? change : 0;
      const loss = change < 0 ? -change : 0;

      gains = (gains * (period - 1) + gain) / period;
      losses = (losses * (period - 1) + loss) / period;

      const rs = gains / losses;

      rsi.push({
        time: data[i].time,
        value: 100 - 100 / (1 + rs),
      });
    }
  }

  return rsi;
}

function calculateMA(data: CandleData[], period: number): LineData[] {
  const result: LineData[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) continue;

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }

    result.push({
      time: data[i].time,
      value: sum / period,
    });
  }

  return result;
}
export default function CandlestickChart({
  data,
  onHoverChange,
}: {
  data: CandleData[];
  onHoverChange?: (data: CrosshairData | null) => void;
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<CrosshairData | null>(null);


  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 450,
      crosshair: {
        mode: 1,
      },
      timeScale: {
        rightBarStaysOnScroll: true,
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 8, // Reduced for better spacing
        minBarSpacing: 4,
        fixLeftEdge: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: {
          time: true,
          price: true,
        },
        mouseWheel: true,
        pinch: true,
      },
      layout: {
        background: { color: "#0B0F19" },
        textColor: "#CBD5F5",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
      
    });

    // Configure right price scale for candlesticks and MA
    chart.priceScale("right").applyOptions({
      autoScale: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
      mode: 0, // Normal mode
    });

    // Add series
    const candleSeries = chart.addSeries(CandlestickSeries);

    // MA Series - use default right scale
    const maSeries = chart.addSeries(LineSeries, {
      color: "#8B5CF6",
      lineWidth: 2,
      priceScaleId: "right",
    });

    const ma21Series = chart.addSeries(LineSeries, {
      color: "#22C55E",
      lineWidth: 2,
      priceScaleId: "right",
    });

    

    

    

    // Set data
    candleSeries.setData(data as any);

    const madata = calculateMA(data, 7);
    maSeries.setData(madata as any);
    ma21Series.setData(calculateMA(data, 21) as any);

    const rsiData = calculateRSI(data, 14);

    const ma21data = calculateMA(data, 21);
    ma21Series.setData(ma21data as any);


    // Set visible range: show last 50 candles
    const visibleCandles = Math.min(50, data.length);
    chart.timeScale().setVisibleLogicalRange({
      from: data.length - visibleCandles,
      to: data.length - 1,
    });

    // Subscribe to crosshair for hover data
    chart.subscribeCrosshairMove((param: any) => {
      console.log("PARAM:", param);
      
  if (!param || !param.time) {
    setHoverData(null);
    onHoverChange?.(null);
    return;
  }

  const time = param.time;

  const candle = data.find((d) => d.time === time);

  const ma7 = madata.find((d) => d.time === time)?.value ?? null;
  const ma21 = ma21data.find((d) => d.time === time)?.value ?? null;
  const rsi = rsiData.find((d) => d.time === time)?.value ?? null;
  console.log("DEBUG:", { ma7, ma21, rsi });
  const timestamp = param.time
    ? new Date(
        (typeof param.time === "string"
          ? parseInt(param.time)
          : param.time) * 1000
      ).toLocaleTimeString()
    : "--";

  const finalData = {
    timestamp,
    candle: candle
      ? {
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }
      : null,
    ma7: ma7,
    ma21: ma21,
    rsi: rsi,
  };

  setHoverData(finalData);
  onHoverChange?.(finalData);
});

    
    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <>
      <div
  ref={chartContainerRef}
  className="w-full h-[450px] overflow-hidden"
/>

      {/* Hover Data Display */}
      {hoverData && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="space-y-3">
            {/* Timestamp */}
            <div className="text-xs text-slate-400 font-mono">
              {hoverData.timestamp}
            </div>

            {/* Candlestick OHLC */}
            {hoverData.candle && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Open:</span>
                  <span className="ml-2 text-white font-semibold">
                    ${hoverData.candle.open.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">High:</span>
                  <span className="ml-2 text-emerald-400 font-semibold">
                    ${hoverData.candle.high.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Low:</span>
                  <span className="ml-2 text-rose-400 font-semibold">
                    ${hoverData.candle.low.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Close:</span>
                  <span className="ml-2 text-cyan-300 font-semibold">
                    ${hoverData.candle.close.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Moving Averages */}
            {(hoverData.ma7 !== null || hoverData.ma21 !== null) && (
              <div className="space-y-2 border-t border-white/10 pt-3">
                {hoverData.ma7 !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-400">MA7:</span>
                    <span className="font-semibold text-white">
                      ${hoverData.ma7.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
                {hoverData.ma21 !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-400">MA21:</span>
                    <span className="font-semibold text-white">
                      ${hoverData.ma21.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* RSI */}
            {hoverData.rsi !== null && (
              <div className="space-y-2 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-400">RSI (14):</span>
                  <span
                    className={`font-semibold ${
                      hoverData.rsi > 70
                        ? 'text-rose-400'
                        : hoverData.rsi < 30
                        ? 'text-emerald-400'
                        : 'text-white'
                    }`}
                  >
                    {hoverData.rsi.toFixed(2)}
                  </span>
                </div>
                {/* RSI Status Badge */}
                <div className="text-xs text-slate-400">
                  {hoverData.rsi > 70
                    ? '🔴 Overbought'
                    : hoverData.rsi < 30
                    ? '🟢 Oversold'
                    : '🟡 Neutral'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Data Message */}
      {!hoverData && (
        <div className="mt-4 text-center text-sm text-slate-500">
          Hover over the chart to see indicator values
        </div>
      )}
    </>
  );
}