"use client";


import React, { useMemo, useState, useEffect } from "react";
import CandleChart from "../components/ui/CandlestickChart";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FlaskConical,
  BrainCircuit,
  Info,
  Rocket,
  TrendingUp,
  TrendingDown,
  Minus,
  Bitcoin,
  CandlestickChart,
  Activity,
  ShieldCheck,
  BarChart3,
  Sparkles,
  ArrowRight,
  Download,
  RefreshCcw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

type ScenarioType = {
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
};
type CandleType = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

const navItems = [
  { id: "home", label: "Home", icon: Rocket },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "simulator", label: "Simulator", icon: FlaskConical },
  { id: "model-lab", label: "Model Lab", icon: BrainCircuit },
  { id: "about", label: "About", icon: Info },
];

const coinOptions = [
  { label: "Bitcoin (BTC)", value: "BTCUSDT", short: "BTC" },
  { label: "Ethereum (ETH)", value: "ETHUSDT", short: "ETH" },
  { label: "Dogecoin (DOGE)", value: "DOGEUSDT", short: "DOGE" },
];



const modelMetrics = [
  { model: "Linear Regression", mae: 1420.55, rmse: 1888.24, r2: 0.92 },
  { model: "Random Forest", mae: 978.14, rmse: 1310.89, r2: 0.96 },
  { model: "XGBoost", mae: 811.63, rmse: 1104.12, r2: 0.97 },
];

const featureImportance = [
  { feature: "Close", value: 96 },
  { feature: "Lag_1", value: 88 },
  { feature: "MA_7", value: 82 },
  { feature: "RSI", value: 71 },
  { feature: "MACD", value: 66 },
  { feature: "Volume", value: 54 },
];

const latestRows = [
  { date: "2026-03-26", close: 68420, volume: "34.1B", rsi: 63.8, macd: 412.3 },
  { date: "2026-03-27", close: 68910, volume: "36.5B", rsi: 66.1, macd: 435.9 },
  { date: "2026-03-28", close: 68670, volume: "31.8B", rsi: 61.4, macd: 401.1 },
  { date: "2026-03-29", close: 69340, volume: "39.2B", rsi: 67.3, macd: 448.6 },
  { date: "2026-03-30", close: 69890, volume: "41.0B", rsi: 69.1, macd: 472.8 },
];

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function GlassCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <Card
      className={cn(
        "border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-cyan-500/5 text-slate-200",
        className
      )}
    >
      {children}
    </Card>
  );
}

function MetricCard({
  title,
  value,
  sub,
  icon: Icon,
  tone = "neutral",
}: {
  title: string;
  value: string;
  sub?: string;
  icon: any;
  tone?: "up" | "down" | "neutral";
}) {
  const toneClasses = {
    up: "from-emerald-500/20 to-emerald-400/5 border-emerald-400/20",
    down: "from-rose-500/20 to-rose-400/5 border-rose-400/20",
    neutral: "from-cyan-500/20 to-blue-400/5 border-cyan-400/20",
  };

  return (
    <GlassCard className={cn("bg-gradient-to-br", toneClasses[tone])}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</h3>
            {sub && <p className="mt-2 text-xs text-slate-400">{sub}</p>}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <Icon className="h-5 w-5 text-cyan-300" />
          </div>
        </div>
      </CardContent>
    </GlassCard>
  );
}

function SignalBadge({ signal }: { signal: "BUY" | "HOLD" | "SELL" }) {
  const map = {
    BUY: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
    HOLD: "bg-amber-500/15 text-amber-300 border-amber-400/20",
    SELL: "bg-rose-500/15 text-rose-300 border-rose-400/20",
  };
  return <Badge className={cn("rounded-full border px-3 py-1 text-xs", map[signal])}>{signal}</Badge>;
}

function ConfidenceMeter({ value }: { value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">AI Confidence</span>
        <span className="font-medium text-white">{value}%</span>
      </div>
      <Progress
  value={value}
  className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-blue-500"
/>
    </div>
  );
}

export default function CryptoVisionAIFrontend() {
  const [mounted, setMounted] = useState(false);

  const [history, setHistory] = useState<any[]>([]);
  const [page, setPage] = useState("home");
  const [selectedCoin, setSelectedCoin] = useState("BTCUSDT");

  const [chartData, setChartData] = useState<CandleType[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [signal, setSignal] = useState<"BUY" | "HOLD" | "SELL">("BUY");
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [lockedScenario, setLockedScenario] = useState<ScenarioType | null>(null);

  const [scenario, setScenario] = useState({
    open: "65000",
    high: "66200",
    low: "64400",
    close: "65850",
    volume: "39000000000",
  });
  useEffect(() => {
  if (selectedCoin === "BTCUSDT") {
    setScenario({
      open: "68000",
      high: "68500",
      low: "67500",
      close: "67800",
      volume: "15000000000",
    });
  } else if (selectedCoin === "ETHUSDT") {
    setScenario({
      open: "3500",
      high: "3600",
      low: "3400",
      close: "3550",
      volume: "8000000000",
    });
  } else if (selectedCoin === "DOGEUSDT") {
    setScenario({
      open: "0.12",
      high: "0.13",
      low: "0.11",
      close: "0.125",
      volume: "500000000",
    });
  }
}, [selectedCoin]);

  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState("");
  const [predictionResult, setPredictionResult] = useState<any>(null);

  // Move useMemo BEFORE the early return to comply with Rules of Hooks
  const activeCoin = useMemo(
    () => coinOptions.find((c) => c.value === selectedCoin) || coinOptions[0],
    [selectedCoin]
  );

  const fetchChartData = async () => {
  try {
    setLoadingChart(true);

    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${selectedCoin}&interval=1h&limit=30`
    );

    if (!res.ok) {
      throw new Error("API request failed");
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Invalid response:", data);
      return;
    }

    const formatted = data.map((item: any) => ({
      time: Math.floor(item[0] / 1000),
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));

    setChartData(formatted);
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    setLoadingChart(false);
  }
};

  const getSentiment = () => {
  if (!livePrice || !lockedScenario) {
    return { label: "Neutral", value: 50 };
  }

  const change =
    ((livePrice - Number(lockedScenario.close)) /
      Number(lockedScenario.close)) *
    100;

  let value = 50 + change * 2;

  value = Math.max(0, Math.min(100, value));

  let label = "Neutral";

  if (value >= 75) label = "Strong Bullish";
  else if (value >= 60) label = "Moderately Bullish";
  else if (value >= 40) label = "Neutral";
  else if (value >= 25) label = "Moderately Bearish";
  else label = "Strong Bearish";

  return { label, value: Math.round(value) };
};

  // Fallback data when API is unavailable
  const generateFallbackChartData = () => {
    const basePrice = selectedCoin === "bitcoin" ? 69000 : selectedCoin === "ethereum" ? 3500 : 0.15;
    return Array.from({ length: 30 }, (_, i) => ({
      day: `D${i + 1}`,
      price: basePrice + (Math.random() - 0.5) * basePrice * 0.1,
    }));
  };

  const fetchLivePrice = async () => {
    try {
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${selectedCoin}`
      );

      const data = await res.json();

      if (data && data.price) {
        setLivePrice(parseFloat(data.price));
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.error("Live price error:", err);

      
      setLivePrice(69000);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchChartData();
    fetchLivePrice();

    const interval = setInterval(() => {
      fetchLivePrice(); // updates every 5 sec
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedCoin]);

  if (!mounted) return null;
      
  

  const handleRunPrediction = async () => {
    setLoadingPrediction(true);
    setPredictionError("");
    setPredictionResult(null);
    setLockedScenario({ ...scenario });

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crypto: activeCoin.short,
          open: parseFloat(scenario.open),
          high: parseFloat(scenario.high),
          low: parseFloat(scenario.low),
          close: parseFloat(scenario.close),
          volume: parseFloat(scenario.volume),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed");
      }

      setPredictionResult(data);
      setHistory((prev) => {
      const newEntry = {
        coin: activeCoin.label,
        price: data.predicted_price,
        trend: data.trend,
        time: new Date().toLocaleTimeString(),
      };

  return [newEntry, ...prev].slice(0, 5); // keep only last 5
});

      if (data.trend === "Bullish") {
        setSignal("BUY");
      } else if (data.trend === "Bearish") {
        setSignal("SELL");
      } else {
        setSignal("HOLD");
      }
    } catch (error: any) {
      setPredictionError(error.message || "Something went wrong");
    } finally {
      setLoadingPrediction(false);
    }
  };

  const handleAutoFill = async () => {
  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${selectedCoin}&interval=1d&limit=1`
    );

    const data = await res.json();

    if (!data || !data.length) {
      console.error("No Binance data", data);
      return;
    }

    const latest = data[data.length - 1];

    setScenario({
      open: parseFloat(latest[1]).toString(),
      high: parseFloat(latest[2]).toString(),
      low: parseFloat(latest[3]).toString(),
      close: parseFloat(latest[4]).toString(),
      volume: parseFloat(latest[5]).toString(),
    });

  } catch (err) {
    console.error("AutoFill error:", err);
  }
};
  const handlePresetScenario = (type: string) => {
  if (type === "bullish") {
    setScenario({
      open: "65000",
      high: "70000",
      low: "64000",
      close: "69000",
      volume: "45000000000",
    });
  }

  else if (type === "bearish") {
    setScenario({
      open: "70000",
      high: "70500",
      low: "65000",
      close: "66000",
      volume: "42000000000",
    });
  }

  else if (type === "volatility") {
    setScenario({
      open: "68000",
      high: "75000",
      low: "60000",
      close: "69000",
      volume: "60000000000",
    });
  }

  else if (type === "breakout") {
    setScenario({
      open: "67000",
      high: "72000",
      low: "66000",
      close: "71500",
      volume: "55000000000",
    });
  }

  else if (type === "lowvolume") {
    setScenario({
      open: "68000",
      high: "68500",
      low: "67500",
      close: "67800",
      volume: "15000000000",
    });
  }
};

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return (
  <DashboardPage
    activeCoin={activeCoin}
    signal={signal}
    selectedCoin={selectedCoin}
    setSelectedCoin={setSelectedCoin}
    chartData={chartData}
    loadingChart={loadingChart}
    livePrice={livePrice}
    fetchChartData={fetchChartData}
    sentiment={getSentiment()}  
  />
);
      case "simulator":
        return (
          <SimulatorPage
            activeCoin={activeCoin}
            selectedCoin={selectedCoin}
            setSelectedCoin={setSelectedCoin}
            scenario={scenario}
            setScenario={setScenario}
            onRunPrediction={handleRunPrediction}
            onAutoFill={handleAutoFill}
            onPreset={handlePresetScenario}
            loadingPrediction={loadingPrediction}
            predictionResult={predictionResult}
            predictionError={predictionError}
            signal={signal}
            lockedScenario={lockedScenario}
            history={history}
          />
        );
      case "model-lab":
        return <ModelLabPage chartData={chartData} />;
      case "about":
        return <AboutPage />;
      default:
        return (
  <HomePage
    onLaunch={() => setPage("dashboard")}
    onSimulator={() => setPage("simulator")}
    chartData={chartData}
  />
);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.15),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.12),_transparent_25%)]" />

      <div className="relative flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/5 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-400/15 p-3">
                <Sparkles className="h-6 w-6 text-cyan-300" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">CryptoVision AI</h1>
                <p className="text-xs text-slate-400">Forecasting & Intelligence</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-all",
                    active
                      ? "bg-cyan-400/15 text-white shadow-lg shadow-cyan-500/10"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <GlassCard>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Model Status</span>
                  <Badge className="border-emerald-400/20 bg-emerald-500/15 text-emerald-300">Online</Badge>
                </div>
                <p className="text-sm text-slate-300">XGBoost forecasting engine is ready for BTC, ETH, and DOGE.</p>
                <Button
  onClick={() => setPage("dashboard")}
  className="w-full rounded-2xl bg-cyan-500 text-slate-950 hover:bg-cyan-400"
>
  Open Dashboard
</Button>
              </CardContent>
            </GlassCard>
          </div>
        </aside>

        <main className="relative flex-1 overflow-x-hidden">
          <div className="border-b border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl sm:px-6 lg:hidden">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold">CryptoVision AI</h1>
                <p className="text-xs text-slate-400">AI-powered crypto analytics</p>
              </div>
              <Select value={page} onValueChange={setPage}>
                <SelectTrigger className="w-44 rounded-2xl border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Navigate" />
                </SelectTrigger>
                <SelectContent>
                  {navItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}

function HomePage({
  onLaunch,
  onSimulator,
  chartData,
}: {
  onLaunch: () => void;
  onSimulator: () => void;
  chartData: CandleType[];
}) {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Badge className="rounded-full border-cyan-400/20 bg-cyan-500/15 px-4 py-1 text-cyan-300">AI-Powered Forecasting Platform</Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
              Predict Crypto <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Smarter</span> with AI
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Forecast Bitcoin, Ethereum, and Dogecoin using machine learning, technical indicators, market scenario simulation, and a polished analytics dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onLaunch} className="rounded-2xl bg-cyan-500 px-6 text-slate-950 hover:bg-cyan-400">
              Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={onSimulator} variant="outline" className="rounded-2xl border-white/10 bg-white/5 px-6 text-white hover:bg-white/10">
              Try Simulator
            </Button>
            
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {[
              "Multi-Crypto Support",
              "Scenario Simulator",
              "Technical Indicators",
              "Model Intelligence",
            ].map((item) => (
              <Badge key={item} className="rounded-full border-white/10 bg-white/5 px-4 py-1 text-slate-300">
                {item}
              </Badge>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <GlassCard className="overflow-hidden">
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Live AI Snapshot</p>
                  <h3 className="mt-1 text-2xl font-semibold">Bitcoin (BTC)</h3>
                </div>
                <SignalBadge signal="BUY" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <MetricCard title="Current Price" value="$69,890" sub="+2.34% in 24h" icon={TrendingUp} tone="up" />
                <MetricCard title="Predicted Price" value="$71,120" sub="Next-day AI estimate" icon={Sparkles} tone="neutral" />
              </div>
              <GlassCard>
                <CardContent className="h-56 p-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData.slice(-14)}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="close" stroke="#06B6D4" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </GlassCard>
              <ConfidenceMeter value={84} />
            </CardContent>
          </GlassCard>
        </motion.div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["AI Price Forecast", "Predict next-day closing prices using trained ML models.", BrainCircuit],
          ["Candlestick Analysis", "Visualize market movement with a premium charting experience.", CandlestickChart],
          ["Scenario Simulator", "Test hypothetical market conditions using OHLCV inputs.", FlaskConical],
          ["Technical Indicators", "Track RSI, MACD, moving averages, and volatility.", Activity],
          ["Model Insights", "Compare model performance and understand feature importance.", BarChart3],
          ["Confidence Score", "Interpret forecasts with an AI confidence meter.", ShieldCheck],
        ].map(([title, desc, Icon]: any) => (
          <GlassCard key={title}>
            <CardContent className="space-y-4 p-6">
              <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3">
                <Icon className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
              </div>
            </CardContent>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}

function DashboardPage({
  activeCoin,
  signal,
  chartData,
  loadingChart,
  livePrice,
  fetchChartData,
  selectedCoin,
  setSelectedCoin,
  sentiment,
}: {
  activeCoin: any;
  signal: "BUY" | "HOLD" | "SELL";
  chartData: CandleType[];
  loadingChart: boolean;
  livePrice: number | null;
  fetchChartData: () => void;
  selectedCoin: string;
  setSelectedCoin: (value: string) => void;
  sentiment: { label: string; value: number };
}) {
  const trendIcon = signal === "BUY" ? TrendingUp : signal === "SELL" ? TrendingDown : Minus;
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">Dashboard</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">{activeCoin.label} Market Intelligence</h2>
          <p className="mt-2 text-slate-400">Real-time market context, ML forecast, and actionable crypto insights.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger className="w-48 rounded-2xl border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Select Coin" />
            </SelectTrigger>
            <SelectContent>
              {coinOptions.map((coin) => (
                <SelectItem key={coin.value} value={coin.value}>
                  {coin.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
  onClick={fetchChartData}
  variant="outline"
  className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
>
  <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
</Button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <GlassCard>
  <CardContent className="p-5 space-y-4">

    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-400">
        Market Sentiment Index
      </p>
      <p className="text-lg font-semibold text-white">
        {sentiment.value} / 100
      </p>
    </div>

    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full transition-all duration-700"
        style={{
          width: `${sentiment.value}%`,
          background:
            "linear-gradient(90deg, #ef4444, #f59e0b, #10b981)",
        }}
      />
    </div>

    <div className="flex items-center justify-between text-xs text-slate-400">
      <span>Bearish</span>
      <span className="text-white font-medium">
        {sentiment.label}
      </span>
      <span>Bullish</span>
    </div>

  </CardContent>
</GlassCard>
        <MetricCard
  title="Current Price"
  value={livePrice ? `$${livePrice.toFixed(2)}` : "Loading..."}
  sub="Live market data"
  icon={TrendingUp}
  tone="up"
/>
        <MetricCard title="Predicted Price" value="$71,120" sub="Next-day estimate" icon={Sparkles} tone="neutral" />
        <MetricCard title="24h Change" value="+2.34%" sub="Short-term momentum" icon={Activity} tone="up" />
        <GlassCard>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">AI Signal</p>
              <SignalBadge signal={signal} />
            </div>
            <div className="flex items-center gap-3">
              {React.createElement(trendIcon, { className: "h-8 w-8 text-cyan-300" })}
              <div>
                <h3 className="text-2xl font-semibold text-white">Bullish</h3>
                <p className="text-xs text-slate-400">Positive short-term continuation</p>
              </div>
            </div>
          </CardContent>
        </GlassCard>
        <GlassCard>
          <CardContent className="space-y-4 p-5">
            <ConfidenceMeter value={84} />
            <p className="text-xs leading-6 text-slate-400">Confidence is derived from trend alignment, volatility profile, and recent model consistency.</p>
          </CardContent>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-white text-white">
  Candlestick / Trend View
</CardTitle>
            <CardDescription className="text-slate-400">
  Use this area later for Plotly candlestick + MA overlays from your backend.
</CardDescription>
          </CardHeader>
          <CardContent className="h-[380px]">
            <CardContent className="h-[380px]">
  <CandleChart data={chartData} />
</CardContent>
          </CardContent>
        </GlassCard>

        <div className="space-y-5">
          <GlassCard>
            <CardContent className="space-y-3 p-5 text-slate-300">
              <p className="text-sm text-slate-400">Trend Summary</p>
              <h3 className="text-2xl font-semibold text-white">
  Moderate Bullish Momentum
</h3>
              <p className="text-sm leading-7 text-slate-400">Price remains above the short-term moving average, while RSI is elevated but not overheated.</p>
            </CardContent>
          </GlassCard>
          <GlassCard>
            <CardContent className="space-y-3 p-5 text-slate-300">
              <p className="text-sm text-slate-400">Forecast Insight</p>
              <h3 className="text-2xl font-semibold text-cyan-300 tracking-tight">
  +1.76% Expected Move
</h3>
              <p className="text-sm leading-7 text-slate-400">Model anticipates slight upside continuation with stable momentum and healthy volume support.</p>
            </CardContent>
          </GlassCard>
          <GlassCard>
            <CardContent className="space-y-3 p-5 text-slate-300">
              <p className="text-sm text-slate-400">Volatility</p>
              <h3 className="text-2xl font-semibold text-white">
  Medium
</h3>
              <p className="text-sm leading-7 text-slate-400">Recent price fluctuations are elevated but still within expected market range.</p>
            </CardContent>
          </GlassCard>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="RSI" value="68.2" sub="Neutral / Slightly Overbought" icon={Activity} tone="neutral" />
        <MetricCard title="MACD" value="472.8" sub="Positive crossover structure" icon={BarChart3} tone="up" />
        <MetricCard title="MA Trend" value="Bullish" sub="Price above MA_7 and MA_30" icon={TrendingUp} tone="up" />
        <MetricCard title="Volume Trend" value="High" sub="Strong participation observed" icon={CandlestickChart} tone="neutral" />
      </div>

      <GlassCard>
        <CardHeader>
          <CardTitle className="text-white">AI Market Insight</CardTitle>
          <CardDescription className="text-slate-400">Rule-based explanation block for your current forecast.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="max-w-4xl text-sm text-slate-300 leading-8 text-slate-300">
            Bitcoin is currently showing moderate bullish momentum, supported by rising volume, a positive MACD structure, and price stability above short-term moving averages. The forecasting model expects a mild upward move in the next session, though momentum should still be monitored for overextension.
          </p>
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardHeader>
          <CardTitle className="text-white">Latest Market Snapshot</CardTitle>
          <CardDescription className="text-slate-400">Replace this with your live backend response later.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400">Date</TableHead>
                <TableHead className="text-slate-400">Close</TableHead>
                <TableHead className="text-slate-400">Volume</TableHead>
                <TableHead className="text-slate-400">RSI</TableHead>
                <TableHead className="text-slate-400">MACD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestRows.map((row) => (
                <TableRow key={row.date} className="border-white/10">
                  <TableCell>{row.date}</TableCell>
                  <TableCell>${row.close.toLocaleString()}</TableCell>
                  <TableCell>{row.volume}</TableCell>
                  <TableCell>{row.rsi}</TableCell>
                  <TableCell>{row.macd}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </GlassCard>
    </div>
  );
}

function SimulatorPage({
  activeCoin,
  selectedCoin,
  setSelectedCoin,
  scenario,
  setScenario,
  onRunPrediction,
  onAutoFill,
  onPreset,
  loadingPrediction,
  predictionResult,
  predictionError,
  signal,
  lockedScenario,
  history,

}: {
  activeCoin: any;
  selectedCoin: string;
  setSelectedCoin: (v: string) => void;
  scenario: any;
  setScenario: (v: any) => void;
  onRunPrediction: () => void;
  onAutoFill: () => void;
  onPreset: (type: string) => void;
  loadingPrediction: boolean;
  predictionResult: any;
  predictionError: string;
  signal: "BUY" | "HOLD" | "SELL";
  lockedScenario: any;
  history: any[];
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-slate-300 uppercase tracking-[0.2em] text-cyan-300/80">Scenario Simulator</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">What-if Market Forecasting</h2>
        <p className="mt-2 max-w-3xl text-slate-400">Manually test OHLCV conditions and simulate how your model may respond to hypothetical market scenarios.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
  <GlassCard>
    <CardHeader>
      <CardTitle className="text-white">Simulate Market Scenario</CardTitle>
      <CardDescription className="text-slate-400">
        This form will send data to your FastAPI backend.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-5">
      <div className="space-y-2">
        <Label className="text-slate-300">Cryptocurrency</Label>
        <Select value={selectedCoin} onValueChange={setSelectedCoin}>
          <SelectTrigger className="rounded-2xl border-white/10 bg-white/5 text-white">
            <SelectValue placeholder="Select Coin" />
          </SelectTrigger>
          <SelectContent>
            {coinOptions.map((coin) => (
              <SelectItem key={coin.value} value={coin.value}>
                {coin.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Open", "open"],
          ["High", "high"],
          ["Low", "low"],
          ["Close", "close"],
          ["Volume", "volume"],
        ].map(([label, key]) => (
          <div className="space-y-2" key={key}>
            <Label className="text-slate-300">{label}</Label>
            <Input
              value={scenario[key]}
              onChange={(e) =>
                setScenario((prev: any) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
              className="rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-500"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          onClick={onRunPrediction}
          disabled={loadingPrediction}
          className="rounded-2xl bg-cyan-500 text-slate-950 hover:bg-cyan-400"
        >
          {loadingPrediction ? "Running..." : "Run Scenario"}
        </Button>

        <Button
    onClick={onAutoFill} 
    variant="outline"
    className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
  >
    Auto-fill Current Values
</Button>

        <Button
          variant="outline"
          className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
          onClick={() =>
            setScenario({
              open: "",
              high: "",
              low: "",
              close: "",
              volume: "",
            })
          }
        >
          Reset
        </Button>
      </div>

      {predictionError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {predictionError}
        </div>
      )}

      {predictionResult && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          Prediction Generated Successfully
        </div>
      )}
    </CardContent>
  </GlassCard>

  <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
  <MetricCard
    title="Predicted Price"
    value={
      predictionResult
        ? `$${Number(predictionResult.predicted_price).toLocaleString()}`
        : "--"
    }
    sub={`${activeCoin.short} next-day estimate`}
    icon={Sparkles}
    tone="neutral"
  />

  <MetricCard
    title="Expected Change"
    value={
  predictionResult && lockedScenario
    ? `${(
        ((predictionResult.predicted_price - Number(lockedScenario?.close || 0)) /
          Number(lockedScenario?.close || 1)) *
        100
      ).toFixed(2)}%`
    : "--"
}
    sub="Scenario-based forecast"
    icon={
      predictionResult && predictionResult.predicted_price >= Number(scenario.close)
        ? TrendingUp
        : TrendingDown
    }
    tone={
      predictionResult && predictionResult.predicted_price >= Number(scenario.close)
        ? "up"
        : "down"
    }
  />

  <GlassCard>
    <CardContent className="space-y-4 p-5">
      <p className="text-sm text-slate-400">AI Signal</p>
      <SignalBadge signal={signal} />
      <p className="text-xs leading-6 text-slate-400">
        {predictionResult
          ? `The model predicts a ${predictionResult.trend.toLowerCase()} outlook based on your input scenario.`
          : "Run a scenario to generate a real AI signal."}
      </p>
    </CardContent>
  </GlassCard>

  <GlassCard>
    <CardContent className="space-y-4 p-5">
      <ConfidenceMeter value={predictionResult ? 84 : 0} />
    </CardContent>
  </GlassCard>
</div>

          <GlassCard>
            <CardHeader>
              <CardTitle className="text-white">Scenario Summary</CardTitle>
              <CardDescription className="text-slate-400">Narrative explanation of your simulated market structure.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm leading-8 text-slate-300">
  {predictionResult && predictionResult.reasons
    ? predictionResult.reasons.map((reason: string, index: number) => (
        <div key={index}>• {reason}</div>
      ))
    : "Run a scenario to see AI explanation."}
</div>
            </CardContent>
          </GlassCard>
          <GlassCard>
  <CardContent className="p-4 space-y-3">
    <h3 className="text-lg font-semibold text-white">
      Prediction History
    </h3>

    {history.length === 0 ? (
      <p className="text-slate-400 text-sm">
        No predictions yet
      </p>
    ) : (
      history.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center border-b border-white/10 pb-2 text-sm"
        >
          <div>
            <p className="text-white">{item.coin}</p>
            <p className="text-slate-400 text-xs">{item.time}</p>
          </div>

          <div className="text-right">
            <p className="text-cyan-400">${item.price}</p>
            <p
              className={
                item.trend === "Bullish"
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {item.trend}
            </p>
          </div>
        </div>
      ))
    )}
  </CardContent>
</GlassCard>

          <GlassCard>
            <CardHeader>
              <CardTitle className="text-white">Preset Scenarios</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {[
                  ["Bullish Day", "bullish"],
                  ["Bearish Day", "bearish"],
                  ["High Volatility", "volatility"],
                  ["Breakout Attempt", "breakout"],
                  ["Low Volume Drift", "lowvolume"],
                ].map(([label, type]) => (
                  <Button
                    key={type}
                    onClick={() => onPreset(type)}
                    variant="outline"
                    className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    {label}
                  </Button>
                ))}
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function ModelLabPage({
  chartData,
}: {
  chartData: CandleType[];
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">Model Lab</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Model Performance & ML Transparency</h2>
        <p className="mt-2 max-w-3xl text-slate-400">Showcase evaluation metrics, feature importance, and actual vs predicted behavior to make your ML pipeline credible.</p>
      </div>

      <GlassCard>
        <CardHeader>
          <CardTitle className="text-white">Model Comparison</CardTitle>
          <CardDescription className="text-slate-400">Use your real results from outputs/model_results.csv later.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400">Model</TableHead>
                <TableHead className="text-slate-400">MAE</TableHead>
                <TableHead className="text-slate-400">RMSE</TableHead>
                <TableHead className="text-slate-400">R²</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelMetrics.map((row) => (
                <TableRow key={row.model} className="border-white/10">
                  <TableCell className="text-slate-200">{row.model}</TableCell>
                  <TableCell className="text-slate-200">{row.mae}</TableCell>
                  <TableCell className="text-slate-200">{row.rmse}</TableCell>
                  <TableCell className="text-slate-200">{row.r2}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </GlassCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-white">Feature Importance</CardTitle>
            <CardDescription className="text-slate-400">Perfect for your XGBoost explanation section.</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureImportance} layout="vertical">
                <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" stroke="#CBD5F5" />
                <YAxis dataKey="feature" type="category" stroke="#CBD5F5" width={90} />
                <Tooltip />
                <Bar dataKey="value" fill="#06B6D4" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader>
            <CardTitle className="text-white">Actual vs Predicted</CardTitle>
            <CardDescription className="text-slate-400">Later replace with real prediction curves from your outputs folder.</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.slice(-18)}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="time" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="#06B6D4" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </GlassCard>
      </div>

      <GlassCard>
        <CardHeader>
          <CardTitle className="text-white">ML Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              "Data Collection",
              "Data Cleaning",
              "Feature Engineering",
              "Model Training",
              "Prediction API",
            ].map((step, i) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/70">Step {i + 1}</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{step}</h3>
              </div>
            ))}
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">About</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">About CryptoVision AI</h2>
        <p className="mt-2 max-w-3xl text-slate-400">An educational full-stack ML product for multi-cryptocurrency forecasting, analytics, and interactive market scenario simulation.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-white">What This Platform Does</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-8 text-slate-300">
            <p>CryptoVision AI combines historical crypto market data, technical indicators, and machine learning models to forecast next-day closing prices for selected cryptocurrencies.</p>
            <p>It also includes a manual market scenario simulator, model transparency tools, and a polished dashboard experience designed for portfolio and educational use.</p>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader>
            <CardTitle className="text-white">Indicator Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-8 text-slate-300">
            <p><span className="font-semibold text-white">RSI:</span> Measures whether an asset may be overbought or oversold.</p>
            <p><span className="font-semibold text-white">MACD:</span> Helps identify momentum and trend direction.</p>
            <p><span className="font-semibold text-white">Moving Average:</span> Smooths price to reveal short-term and long-term trends.</p>
            <p><span className="font-semibold text-white">Volatility:</span> Indicates how unstable or fast-moving the market is.</p>
          </CardContent>
        </GlassCard>
      </div>

      <GlassCard>
        <CardHeader>
          <CardTitle className="text-white">Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm leading-8 text-slate-300">
            This platform is intended for educational, analytical, and portfolio demonstration purposes only. It does not provide financial advice and should not be used as the sole basis for investment or trading decisions.
          </div>
        </CardContent>
      </GlassCard>

      <div className="flex flex-wrap gap-3">
        <Button className="rounded-2xl bg-cyan-500 text-slate-950 hover:bg-cyan-400">
          <Download className="mr-2 h-4 w-4" /> Download Project Summary
        </Button>
        <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10">
          View GitHub
        </Button>
      </div>
    </div>
  );
}
