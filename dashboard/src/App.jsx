import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, MousePointer2, Flame, Zap, BarChart3,
  Settings, Search, ChevronDown, Circle, Bell, User,
  TrendingUp, TrendingDown, Clock, Globe, Monitor,
  Smartphone, Tablet, ChevronRight, ArrowUpRight,
  Filter, ChevronLeft, X, Activity, Eye, Navigation,
  Hash, Layers, AlertCircle, ArrowRight, Menu
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import axios from "axios";

// ─── DATA ────────────────────────────────────────────────────────────────────

const sessionTrend = [
  { day: "Mon", sessions: 1240, clicks: 8920 },
  { day: "Tue", sessions: 1890, clicks: 12340 },
  { day: "Wed", sessions: 1560, clicks: 10230 },
  { day: "Thu", sessions: 2100, clicks: 15600 },
  { day: "Fri", sessions: 1780, clicks: 13400 },
  { day: "Sat", sessions: 980,  clicks: 7200  },
  { day: "Sun", sessions: 820,  clicks: 6100  },
];

const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  value: Math.floor(Math.sin((i - 8) * 0.5) * 60 + 70 + Math.random() * 20),
}));

const deviceData = [
  { name: "Desktop", value: 58, color: "#7C3AED" },
  { name: "Mobile",  value: 31, color: "#22C55E" },
  { name: "Tablet",  value: 11, color: "#3B82F6" },
];

const recentActivity = [
  { id: "s_8f3a", type: "page_view",  path: "/pricing",   device: "Desktop", time: "2m ago",  browser: "Chrome" },
  { id: "s_2c1b", type: "click",      path: "/checkout",  device: "Mobile",  time: "4m ago",  browser: "Safari" },
  { id: "s_9d4e", type: "session",    path: "/",          device: "Desktop", time: "7m ago",  browser: "Firefox" },
  { id: "s_1a7f", type: "page_view",  path: "/features",  device: "Tablet",  time: "11m ago", browser: "Chrome" },
  { id: "s_6b2c", type: "click",      path: "/demo",      device: "Mobile",  time: "14m ago", browser: "Safari" },
  { id: "s_3e8d", type: "session",    path: "/blog",      device: "Desktop", time: "18m ago", browser: "Edge" },
];



const funnelData = [
  { label: "Landing Visit",   count: 12400, pct: 100 },
  { label: "Viewed Pricing",  count: 7820,  pct: 63  },
  { label: "Started Signup",  count: 3960,  pct: 32  },
  { label: "Completed Signup",count: 1840,  pct: 15  },
  { label: "First Event",     count: 980,   pct: 8   },
];

const topPages = [
  { path: "/",           views: 9840, bounce: "34%" },
  { path: "/pricing",    views: 6720, bounce: "28%" },
  { path: "/features",   views: 4320, bounce: "41%" },
  { path: "/blog",       views: 3100, bounce: "62%" },
  { path: "/checkout",   views: 2840, bounce: "19%" },
  { path: "/demo",       views: 1960, bounce: "31%" },
];



// ─── UTILS ───────────────────────────────────────────────────────────────────

const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

const TypeIcon = ({ type, size = 12 }) => {
  const map = { page_view: Eye, click: MousePointer2, session: Activity, form_submit: Layers };
  const Icon = map[type] || Circle;
  return <Icon size={size} />;
};

const TypeBadge = ({ type }) => {
  const styles = {
    page_view:   "bg-[#1e2a3b] text-[#58a6ff] border-[#1d3a5e]",
    click:       "bg-[#1f2a1f] text-[#22C55E] border-[#1a3a1a]",
    session:     "bg-[#2a1f3a] text-[#7C3AED] border-[#3a1f5a]",
    form_submit: "bg-[#2a2a1a] text-[#f0b429] border-[#3a3a1a]",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${styles[type] || "bg-[#1a1f2a] text-[#8B949E] border-[#2A2F3A]"}`}>
      <TypeIcon type={type} size={9} />
      {type}
    </span>
  );
};

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1c2130] border border-[#2A2F3A] rounded px-3 py-2 text-xs shadow-lg">
      <div className="text-[#8B949E] mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span style={{ color: p.color }} className="font-semibold">{fmt(p.value)}</span>
          <span className="text-[#8B949E]">{p.name}</span>
        </div>
      ))}
    </div>
  );
};

// ─── KPI CARD ─────────────────────────────────────────────────────────────────

const KpiCard = ({ label, value, trend, trendVal, icon: Icon, sub }) => (
  <div className="group bg-[#161B22] border border-[#2A2F3A] rounded p-4 hover:border-[#3d4452] hover:translate-y-[-1px] transition-all duration-200 cursor-default">
    <div className="flex items-start justify-between mb-3">
      <span className="text-[11px] text-[#8B949E] uppercase tracking-widest font-medium">{label}</span>
      <div className="w-7 h-7 rounded flex items-center justify-center bg-[#0F1117] border border-[#2A2F3A] text-[#8B949E] group-hover:text-[#7C3AED] group-hover:border-[#7C3AED]/30 transition-colors">
        <Icon size={13} />
      </div>
    </div>
    <div className="text-2xl font-semibold text-[#E6EDF3] tracking-tight mb-1">{value}</div>
    <div className="flex items-center gap-1.5">
      {trend === "up" ? (
        <TrendingUp size={11} className="text-[#22C55E]" />
      ) : (
        <TrendingDown size={11} className="text-red-400" />
      )}
      <span className={`text-[11px] font-medium ${trend === "up" ? "text-[#22C55E]" : "text-red-400"}`}>{trendVal}</span>
      {sub && <span className="text-[11px] text-[#8B949E]">{sub}</span>}
    </div>
  </div>
);

// ─── PAGE: OVERVIEW ───────────────────────────────────────────────────────────

const OverviewPage = () => (
  <div className="space-y-5">
    <div>
      <h1 className="text-[15px] font-semibold text-[#E6EDF3] tracking-tight">Overview</h1>
      <p className="text-[12px] text-[#8B949E] mt-0.5">Last 7 days · Updated 2 minutes ago</p>
    </div>

    {/* KPI Row */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard label="Total Sessions"    value="24,812"  trend="up"   trendVal="+12.4%"   sub="vs last week" icon={Activity}       />
      <KpiCard label="Total Clicks"      value="189,240" trend="up"   trendVal="+8.1%"    sub="vs last week" icon={MousePointer2}  />
      <KpiCard label="Avg Duration"      value="4m 38s"  trend="down" trendVal="−0.3%"    sub="vs last week" icon={Clock}          />
      <KpiCard label="Most Active Page"  value="/pricing" trend="up"  trendVal="+24.7%"   sub="page views"   icon={Globe}          />
    </div>

    {/* Charts Row 1 */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Session Trend */}
      <div className="lg:col-span-2 bg-[#161B22] border border-[#2A2F3A] rounded p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[12px] font-medium text-[#E6EDF3]">Session Trend</div>
            <div className="text-[11px] text-[#8B949E]">Daily sessions this week</div>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#8B949E]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7C3AED] inline-block" />Sessions</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22C55E] inline-block" />Clicks ÷10</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={sessionTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: "#8B949E", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8B949E", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="sessions" stroke="#7C3AED" strokeWidth={1.5} fill="url(#gSessions)" dot={false} name="Sessions" />
            <Area type="monotone" dataKey="clicks"   stroke="#22C55E" strokeWidth={1.5} fill="url(#gClicks)"   dot={false} name="Clicks" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Device Donut */}
      <div className="bg-[#161B22] border border-[#2A2F3A] rounded p-4">
        <div className="text-[12px] font-medium text-[#E6EDF3] mb-0.5">Device Split</div>
        <div className="text-[11px] text-[#8B949E] mb-3">Session distribution</div>
        <div className="flex items-center justify-center">
          <PieChart width={140} height={140}>
            <Pie data={deviceData} cx={65} cy={65} innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {deviceData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
        </div>
        <div className="space-y-1.5 mt-2">
          {deviceData.map(d => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-[11px] text-[#8B949E]">{d.name}</span>
              </div>
              <span className="text-[11px] font-medium text-[#E6EDF3]">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Charts Row 2 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {/* Hourly Activity */}
      <div className="bg-[#161B22] border border-[#2A2F3A] rounded p-4">
        <div className="text-[12px] font-medium text-[#E6EDF3] mb-0.5">Hourly Activity</div>
        <div className="text-[11px] text-[#8B949E] mb-3">Today's click density</div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={hourlyActivity} margin={{ top: 0, right: 0, bottom: 0, left: -20 }} barSize={7}>
            <XAxis dataKey="hour" tick={{ fill: "#8B949E", fontSize: 9 }} axisLine={false} tickLine={false}
              tickFormatter={h => h % 6 === 0 ? `${h}h` : ""} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Events" fill="#7C3AED" radius={[2, 2, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Click Activity */}
      <div className="bg-[#161B22] border border-[#2A2F3A] rounded p-4">
        <div className="text-[12px] font-medium text-[#E6EDF3] mb-0.5">Click Activity</div>
        <div className="text-[11px] text-[#8B949E] mb-3">Clicks vs sessions</div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={sessionTrend} margin={{ top: 0, right: 0, bottom: 0, left: -20 }} barSize={14} barGap={3}>
            <XAxis dataKey="day" tick={{ fill: "#8B949E", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="sessions" name="Sessions" fill="#7C3AED" radius={[2, 2, 0, 0]} opacity={0.9} />
            <Bar dataKey="clicks"   name="Clicks"   fill="#22C55E" radius={[2, 2, 0, 0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-[#161B22] border border-[#2A2F3A] rounded">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2F3A]">
        <div className="text-[12px] font-medium text-[#E6EDF3]">Recent Activity</div>
        <button className="text-[11px] text-[#7C3AED] hover:text-violet-400 flex items-center gap-1 transition-colors">
          View all <ArrowRight size={11} />
        </button>
      </div>
      <div className="divide-y divide-[#1e2530]">
        {recentActivity.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-[#1a2030] transition-colors group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-6 h-6 rounded bg-[#0F1117] border border-[#2A2F3A] flex items-center justify-center text-[#8B949E] flex-shrink-0">
                <TypeIcon type={item.type} size={11} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <TypeBadge type={item.type} />
                  <span className="text-[12px] font-mono text-[#E6EDF3] truncate">{item.path}</span>
                </div>
                <div className="text-[10px] text-[#8B949E] mt-0.5">{item.id} · {item.device} · {item.browser}</div>
              </div>
            </div>
            <span className="text-[11px] text-[#8B949E] flex-shrink-0 ml-4">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── PAGE: SESSIONS ───────────────────────────────────────────────────────────

const SessionDetailPanel = ({ session, onClose }) => (
  <div className="fixed inset-y-0 right-0 w-[400px] bg-[#161B22] border-l border-[#2A2F3A] z-50 flex flex-col shadow-2xl">
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2F3A]">
      <div>
        <div className="text-[13px] font-semibold text-[#E6EDF3] font-mono">{session.id}</div>
        <div className="text-[11px] text-[#8B949E] mt-0.5">{session.duration} · {session.events} events</div>
      </div>
      <button onClick={onClose} className="w-7 h-7 rounded hover:bg-[#2A2F3A] flex items-center justify-center text-[#8B949E] hover:text-[#E6EDF3] transition-colors">
        <X size={14} />
      </button>
    </div>

    <div className="p-5 border-b border-[#2A2F3A]">
      <div className="grid grid-cols-3 gap-3">
        {[["Device", session.device], ["Browser", session.browser], ["Country", session.country]].map(([k, v]) => (
          <div key={k} className="bg-[#0F1117] border border-[#2A2F3A] rounded p-2.5">
            <div className="text-[10px] text-[#8B949E] uppercase tracking-wider mb-1">{k}</div>
            <div className="text-[12px] font-medium text-[#E6EDF3]">{v}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-5">
      <div className="text-[11px] text-[#8B949E] uppercase tracking-widest mb-4">Session Journey</div>
      <div className="relative">
        <div className="absolute left-[22px] top-3 bottom-3 w-px bg-[#2A2F3A]" />
        <div className="space-y-1">
          {session.journey.map((step, i) => (
            <div key={i} className="flex items-start gap-3 group">
              <div className="flex-shrink-0 w-11 text-right">
                <span className="text-[10px] font-mono text-[#8B949E]">{step.time}</span>
              </div>
              <div className="flex-shrink-0 w-4 h-4 rounded-full border border-[#2A2F3A] bg-[#161B22] flex items-center justify-center mt-0.5 z-10 group-hover:border-[#7C3AED] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B949E] group-hover:bg-[#7C3AED] transition-colors" />
              </div>
              <div className="bg-[#0F1117] border border-[#2A2F3A] rounded px-3 py-2 flex-1 mb-2 group-hover:border-[#3d4452] transition-colors">
                <TypeBadge type={step.event} />
                <div className="text-[11px] font-mono text-[#E6EDF3] mt-1">{step.target}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SessionsPage = () => {

  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sessionEvents, setSessionEvents] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/api/sessions"
      );

      setSessions(res.data.data);

    } catch (error) {

      console.log(error);
    }
  };

  const fetchSessionEvents = async (sessionId) => {

    try {

      const res = await axios.get(
        `http://localhost:8000/api/sessions/${sessionId}`
      );

      setSessionEvents(res.data.data);

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div className="space-y-4">

      {/* Header */}
      <div>

        <h1 className="text-[15px] font-semibold text-[#E6EDF3] tracking-tight">
          Sessions
        </h1>

        <p className="text-[12px] text-[#8B949E] mt-0.5">
          {sessions.length} sessions found
        </p>

      </div>

      {/* Sessions Table */}
      <div className="bg-[#161B22] border border-[#2A2F3A] rounded overflow-hidden">

        <table className="w-full">

          <thead>

            <tr className="border-b border-[#2A2F3A]">

              <th className="px-4 py-3 text-left text-[11px] text-[#8B949E]">
                Session ID
              </th>

              <th className="px-4 py-3 text-left text-[11px] text-[#8B949E]">
                Total Events
              </th>

              <th className="px-4 py-3 text-left text-[11px] text-[#8B949E]">
                Last Activity
              </th>

            </tr>

          </thead>

          <tbody>

            {sessions.map((s, i) => (

              <tr
                key={i}

                onClick={() => {

                  setSelected(s);

                  fetchSessionEvents(
                    s._id
                  );
                }}

                className="border-b border-[#1a1f2a] hover:bg-[#1a2030] cursor-pointer transition-colors"
              >

                <td className="px-4 py-3">

                  <span className="font-mono text-[12px] text-violet-400">
                    {s._id}
                  </span>

                </td>

                <td className="px-4 py-3 text-white">
                  {s.total_events}
                </td>

                <td className="px-4 py-3 text-zinc-400 text-sm">
                  {new Date(
                    s.last_activity
                  ).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Session Modal */}
      {selected && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-[#161B22] border border-[#2A2F3A] rounded-2xl p-6 w-[600px] max-h-[80vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

              <h2 className="text-xl font-semibold text-white">
                Session Details
              </h2>

              <button
                onClick={() => {

                  setSelected(null);
                  setSessionEvents([]);

                }}

                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>

            </div>

            {/* Session Info */}
            <div className="space-y-4">

              <div>

                <p className="text-zinc-500 text-sm">
                  Session ID
                </p>

                <p className="text-violet-400 font-mono break-all">
                  {selected._id}
                </p>

              </div>

              <div>

                <p className="text-zinc-500 text-sm">
                  Total Events
                </p>

                <p className="text-white">
                  {selected.total_events}
                </p>

              </div>

              <div>

                <p className="text-zinc-500 text-sm">
                  Last Activity
                </p>

                <p className="text-white">
                  {new Date(
                    selected.last_activity
                  ).toLocaleString()}
                </p>

              </div>

            </div>

            {/* User Journey */}
            <div className="mt-8">

              <h3 className="text-white font-medium mb-4">
                User Journey
              </h3>

              <div className="space-y-3">

                {sessionEvents.map((event, index) => (

                  <div
                    key={index}
                    className="border border-[#2A2F3A] rounded-xl p-4 bg-[#0D1117]"
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-violet-400 text-sm font-medium uppercase">
                        {event.event_type}
                      </span>

                      <span className="text-zinc-500 text-xs">

                        {new Date(
                          event.timestamp
                        ).toLocaleTimeString()}

                      </span>

                    </div>

                    <p className="text-zinc-300 text-sm mt-3">
                      {event.page_url}
                    </p>

                    {event.coordinates && (

                      <div className="mt-2 text-xs text-zinc-500">

                        X: {event.coordinates.x}
                        {" • "}
                        Y: {event.coordinates.y}

                      </div>

                    )}

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

// ─── PAGE: HEATMAP ────────────────────────────────────────────────────────────

const HeatmapPage = () => {

  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    fetchHeatmap();
  }, []);

  const fetchHeatmap = async () => {
    try {

      const res = await axios.get(
        "http://localhost:8000/api/heatmap?page=/pricing"
      );

      setClicks(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Heatmap Analytics
          </h1>

          <p className="text-sm text-zinc-400 mt-1">
            Visualize user click interactions across your pages
          </p>
        </div>

        <select className="bg-[#161B22] border border-[#2A2F3A] text-zinc-300 text-sm rounded-lg px-4 py-2 outline-none">
          <option>/pricing</option>
          <option>/checkout</option>
          <option>/home</option>
        </select>
      </div>

      {/* Heatmap Container */}
      <div className="relative h-[600px] overflow-hidden rounded-2xl border border-[#2A2F3A] bg-[#0F1117]">

        {/* Mock Website UI */}
        <div className="absolute inset-0">

          {/* Navbar */}
          <div className="h-16 border-b border-[#2A2F3A] flex items-center justify-between px-8 bg-[#161B22]">
            <div className="text-white font-medium">
              Trackora
            </div>

            <div className="flex gap-6 text-sm text-zinc-400">
              <span>Features</span>
              <span>Pricing</span>
              <span>Docs</span>
              <span>Contact</span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="p-16">
            <h1 className="text-5xl font-bold text-white max-w-2xl leading-tight">
              Understand User Behavior In Real-Time
            </h1>

            <p className="mt-6 text-zinc-400 text-lg max-w-xl">
              Track clicks, sessions, heatmaps, and analytics
              through a modern event tracking platform.
            </p>

            <div className="flex gap-4 mt-8">
              <button className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium">
                Start Free Trial
              </button>

              <button className="px-6 py-3 rounded-xl border border-[#2A2F3A] text-zinc-300">
                View Demo
              </button>
            </div>
          </div>
        </div>

        {/* REAL HEATMAP CLICKS */}
        {clicks.map((click) => (
          <div
            key={click._id}
            className="absolute rounded-full pointer-events-none"

            style={{
              left: `${click.coordinates?.x}px`,
              top: `${click.coordinates?.y}px`,
              width: "18px",
              height: "18px",
              transform: "translate(-50%, -50%)",

              background:
                "radial-gradient(circle, rgba(239,68,68,0.7) 0%, transparent 70%)",

              filter: "blur(4px)",
            }}
          />
        ))}

      </div>
    </div>
  );
};

// ─── PAGE: ANALYTICS ─────────────────────────────────────────────────────────

const AnimatedNumber = ({ target }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1200, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <span>{fmt(val)}</span>;
};

const AnalyticsPage = () => (
  <div className="space-y-5">
    <div>
      <h1 className="text-[15px] font-semibold text-[#E6EDF3] tracking-tight">Analytics</h1>
      <p className="text-[12px] text-[#8B949E] mt-0.5">Funnel, pages, and event insights</p>
    </div>

    {/* Animated counters */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[["Unique Visitors", 18420, "#7C3AED"], ["Bounce Rate", 38, "#f0b429"], ["Avg Events/Session", 14, "#22C55E"], ["Conversion Rate", 7, "#3B82F6"]].map(([label, val, color]) => (
        <div key={label} className="bg-[#161B22] border border-[#2A2F3A] rounded p-4">
          <div className="text-[10px] text-[#8B949E] uppercase tracking-widest mb-2">{label}</div>
          <div className="text-2xl font-semibold tracking-tight" style={{ color }}>
            <AnimatedNumber target={val} />
            {label.includes("Rate") ? "%" : ""}
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {/* Funnel */}
      <div className="bg-[#161B22] border border-[#2A2F3A] rounded p-4">
        <div className="text-[12px] font-medium text-[#E6EDF3] mb-0.5">Conversion Funnel</div>
        <div className="text-[11px] text-[#8B949E] mb-4">User journey drop-off analysis</div>
        <div className="space-y-2">
          {funnelData.map((step, i) => (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#0F1117] border border-[#2A2F3A] text-[9px] text-[#8B949E] flex items-center justify-center">{i + 1}</span>
                  <span className="text-[11px] text-[#E6EDF3]">{step.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#8B949E]">{fmt(step.count)}</span>
                  <span className="text-[11px] text-[#7C3AED] w-8 text-right">{step.pct}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-[#0F1117] rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-700"
                  style={{ width: `${step.pct}%`, background: `rgba(124,58,237,${0.4 + i * 0.12})` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top pages */}
      <div className="bg-[#161B22] border border-[#2A2F3A] rounded p-4">
        <div className="text-[12px] font-medium text-[#E6EDF3] mb-0.5">Top Visited Pages</div>
        <div className="text-[11px] text-[#8B949E] mb-4">By pageview count</div>
        <div className="space-y-1">
          {topPages.map((p, i) => (
            <div key={i} className="flex items-center gap-3 group py-1.5 hover:bg-[#1a2030] -mx-2 px-2 rounded transition-colors">
              <span className="text-[10px] text-[#8B949E] w-4 text-right">{i + 1}</span>
              <span className="flex-1 text-[12px] font-mono text-[#E6EDF3] truncate">{p.path}</span>
              <span className="text-[11px] text-[#8B949E]">{fmt(p.views)}</span>
              <span className="text-[10px] text-[#8B949E] w-10 text-right">{p.bounce}</span>
            </div>
          ))}
          <div className="flex text-[10px] text-[#8B949E] pt-1 border-t border-[#2A2F3A] mt-1 -mx-0">
            <span className="w-4 mr-3" />
            <span className="flex-1">Path</span>
            <span>Views</span>
            <span className="w-10 text-right">Bounce</span>
          </div>
        </div>
      </div>
    </div>

    {/* Event type breakdown + Duration trend */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="bg-[#161B22] border border-[#2A2F3A] rounded p-4">
        <div className="text-[12px] font-medium text-[#E6EDF3] mb-4">Event Breakdown</div>
        <div className="space-y-3">
          {[["page_view", 48, "#3B82F6"], ["click", 34, "#7C3AED"], ["form_submit", 10, "#22C55E"], ["scroll", 8, "#f0b429"]].map(([type, pct, color]) => (
            <div key={type}>
              <div className="flex items-center justify-between mb-1">
                <TypeBadge type={type} />
                <span className="text-[11px] text-[#8B949E]">{pct}%</span>
              </div>
              <div className="h-1 bg-[#0F1117] rounded overflow-hidden">
                <div className="h-full rounded" style={{ width: `${pct}%`, background: color, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 bg-[#161B22] border border-[#2A2F3A] rounded p-4">
        <div className="text-[12px] font-medium text-[#E6EDF3] mb-0.5">Session Duration Trend</div>
        <div className="text-[11px] text-[#8B949E] mb-3">Average duration over 7 days</div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={sessionTrend.map((d, i) => ({ ...d, duration: [4.2,4.8,3.9,5.1,4.6,3.7,4.0][i] }))} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
            <defs>
              <linearGradient id="gDur" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: "#8B949E", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8B949E", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="duration" name="Avg Duration (min)" stroke="#22C55E" strokeWidth={1.5} fill="url(#gDur)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

const navItems = [
  { id: "overview",   label: "Overview",   icon: LayoutDashboard },
  { id: "sessions",   label: "Sessions",   icon: Activity        },
  { id: "heatmap",    label: "Heatmap",    icon: Flame           },
  { id: "events",     label: "Events",     icon: Zap             },
  { id: "analytics",  label: "Analytics",  icon: BarChart3       },
  { id: "settings",   label: "Settings",   icon: Settings        },
];

const Sidebar = ({ active, setActive, collapsed }) => (
  <aside className={`${collapsed ? "w-14" : "w-52"} flex-shrink-0 bg-[#0F1117] border-r border-[#2A2F3A] flex flex-col transition-all duration-200`}>
    {/* Logo */}
    <div className={`h-12 border-b border-[#2A2F3A] flex items-center ${collapsed ? "justify-center px-0" : "px-4"} gap-2.5 flex-shrink-0`}>
      <div className="w-6 h-6 rounded bg-[#7C3AED] flex items-center justify-center flex-shrink-0">
        <Activity size={12} className="text-white" />
      </div>
      {!collapsed && <span className="text-[13px] font-semibold text-[#E6EDF3] tracking-tight">Trackora</span>}
    </div>

    {/* Nav */}
    <nav className="flex-1 py-3 px-2 space-y-0.5">
      {navItems.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => setActive(id)}
            title={collapsed ? label : undefined}
            className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-2.5"} py-2 rounded text-[12px] transition-all duration-150 group relative
              ${isActive
                ? "bg-[#7C3AED]/10 text-violet-400 border border-[#7C3AED]/20"
                : "text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#161B22] border border-transparent"
              }`}
          >
            <Icon size={13} className="flex-shrink-0" />
            {!collapsed && <span className="font-medium">{label}</span>}
            {isActive && !collapsed && (
              <span className="ml-auto w-1 h-1 rounded-full bg-violet-400" />
            )}
          </button>
        );
      })}
    </nav>

    {/* Footer */}
    <div className={`border-t border-[#2A2F3A] p-3 ${collapsed ? "flex justify-center" : ""}`}>
      <div className={`flex items-center ${collapsed ? "" : "gap-2.5"}`}>
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center flex-shrink-0">
          <span className="text-[9px] text-white font-bold">AJ</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-[#E6EDF3] truncate">Alex Johnson</div>
            <div className="text-[10px] text-[#8B949E] truncate">Pro Plan</div>
          </div>
        )}
      </div>
    </div>
  </aside>
);

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const pages = {
    overview:  <OverviewPage />,
    sessions:  <SessionsPage />,
    heatmap:   <HeatmapPage />,
    events:    <OverviewPage />,   // placeholder
    analytics: <AnalyticsPage />,
    settings:  <div className="text-[#8B949E] text-sm p-4">Settings page</div>,
  };

  return (
    <div className="flex h-screen bg-[#0F1117] text-[#E6EDF3] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebar(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-52 bg-[#0F1117] border-r border-[#2A2F3A] z-50">
            <Sidebar active={active} setActive={(id) => { setActive(id); setMobileSidebar(false); }} collapsed={false} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar active={active} setActive={setActive} collapsed={collapsed} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-12 bg-[#0F1117] border-b border-[#2A2F3A] flex items-center px-4 gap-3 flex-shrink-0">
          {/* Mobile menu + collapse */}
          <button className="lg:hidden w-7 h-7 flex items-center justify-center rounded hover:bg-[#161B22] text-[#8B949E]" onClick={() => setMobileSidebar(true)}>
            <Menu size={14} />
          </button>
          <button className="hidden lg:flex w-7 h-7 items-center justify-center rounded hover:bg-[#161B22] text-[#8B949E] transition-colors" onClick={() => setCollapsed(c => !c)}>
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8B949E]" />
            <input
              placeholder="Search events, sessions…"
              className="w-full bg-[#161B22] border border-[#2A2F3A] rounded px-2.5 py-1.5 pl-7 text-[11px] text-[#E6EDF3] placeholder-[#8B949E] focus:outline-none focus:border-[#7C3AED]/40 transition-colors"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#8B949E] bg-[#2A2F3A] px-1 py-0.5 rounded">⌘K</span>
          </div>

          <div className="flex-1" />

          {/* Date range */}
          <button className="flex items-center gap-1.5 bg-[#161B22] border border-[#2A2F3A] rounded px-2.5 py-1.5 text-[11px] text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#3d4452] transition-colors">
            <span>Last 7 days</span>
            <ChevronDown size={10} />
          </button>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1a2a1a] border border-[#1a3a1a] rounded text-[11px] text-[#22C55E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            Live
          </div>

          {/* Bell */}
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#161B22] text-[#8B949E] hover:text-[#E6EDF3] transition-colors relative">
            <Bell size={13} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
          </button>

          {/* User */}
          <button className="flex items-center gap-1.5 hover:bg-[#161B22] rounded px-1.5 py-1 transition-colors">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">AJ</span>
            </div>
            <ChevronDown size={10} className="text-[#8B949E]" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {pages[active] || pages.overview}
        </main>
      </div>
    </div>
  );
}