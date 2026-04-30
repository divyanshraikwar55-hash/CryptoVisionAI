"use client";

import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";

export default function CandlestickChart({ data }: { data: any[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  if (!chartContainerRef.current) return;

  const chart = createChart(chartContainerRef.current, {
    width: chartContainerRef.current.clientWidth,
    height: 300,
    layout: {
      background: { color: "#0B0F19" },
      textColor: "#CBD5F5",
    },
    grid: {
      vertLines: { color: "rgba(255,255,255,0.05)" },
      horzLines: { color: "rgba(255,255,255,0.05)" },
    },
  });


  const candleSeries = chart.addSeries(CandlestickSeries);
  chart.timeScale().fitContent();

const handleResize = () => {
  if (chartContainerRef.current) {
    chart.applyOptions({
      width: chartContainerRef.current.clientWidth,
    });
  }
};

window.addEventListener("resize", handleResize);

  candleSeries.setData(data);

  return () => {
  window.removeEventListener("resize", handleResize);
  chart.remove();
};
}, [data]);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "300px" }} />;
}