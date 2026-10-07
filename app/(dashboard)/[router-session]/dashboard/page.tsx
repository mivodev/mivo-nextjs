"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Cpu, HardDrive, Wifi, Activity, Users, DollarSign, ShieldCheck } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getRouterBySessionName } from "@/modules/router/actions"
import type { RouterRecord } from "@/modules/router/types"

// Simulated data types (until RouterOS API is integrated)
interface ResourceUsage {
  cpuLoad: number
  freeMemoryMB: number
  totalMemoryMB: number
  freeHddMB: number
  totalHddMB: number
}

interface HotspotStats {
  activeUsers: number
  totalUsers: number
  incomeToday: number
}

interface TrafficPoint {
  time: string
  rxBitsPerSecond: number
  txBitsPerSecond: number
}

// Placeholder resource/hotspot data until RouterOS API is connected
const placeholderResources: ResourceUsage = {
  cpuLoad: 0, freeMemoryMB: 0, totalMemoryMB: 0, freeHddMB: 0, totalHddMB: 0,
}
const placeholderHotspot: HotspotStats = {
  activeUsers: 0, totalUsers: 0, incomeToday: 0,
}

export default function DynamicDashboardPage() {
  const params = useParams()
  const sessionName = (params['router-session'] as string) || "Router-Main"

  const [routerData, setRouterData] = React.useState<RouterRecord | null>(null)
  const [resources] = React.useState<ResourceUsage>(placeholderResources)
  const [hotspot] = React.useState<HotspotStats>(placeholderHotspot)

  // Fetch router from DB
  React.useEffect(() => {
    async function load() {
      const result = await getRouterBySessionName(sessionName)
      if (result.success && result.data) {
        setRouterData(result.data)
      }
    }
    load()
  }, [sessionName])
  const [trafficData, setTrafficData] = React.useState<TrafficPoint[]>(
    Array.from({ length: 15 }, (_, i) => ({
      time: `${i * 2}s`,
      rxBitsPerSecond: 0,
      txBitsPerSecond: 0,
    }))
  )
  const [selectedInterface, setSelectedInterface] = React.useState("ether1")

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData((prev) => {
        const nextTime = `${(prev.length + 1) * 2}s`
        const newRx = Math.floor(Math.random() * 8000000) + 2000000
        const newTx = Math.floor(Math.random() * 4000000) + 1000000
        const updated = [...prev.slice(1), { time: nextTime, rxBitsPerSecond: newRx, txBitsPerSecond: newTx }]
        return updated
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [sessionName])

  // Helper to format bps/Mbps
  const formatBits = (bits: number) => {
    if (bits === 0) return "0 bps"
    const units = ["bps", "Kbps", "Mbps", "Gbps"]
    const i = Math.floor(Math.log(bits) / Math.log(1024))
    return parseFloat((bits / Math.pow(1024, i)).toFixed(1)) + " " + units[i]
  }

  // Memory & HDD percentages (guard against NaN when totals are 0)
  const memoryUsedPercent = resources.totalMemoryMB
    ? Math.round(((resources.totalMemoryMB - resources.freeMemoryMB) / resources.totalMemoryMB) * 100)
    : 0
  const hddUsedPercent = resources.totalHddMB
    ? Math.round(((resources.totalHddMB - resources.freeHddMB) / resources.totalHddMB) * 100)
    : 0

  return (
    <div className="space-y-8 pb-12">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span>Session:</span>
            <strong className="text-foreground font-semibold">{routerData?.sessionName ?? sessionName}</strong>
          </p>
        </div>

        <Badge variant="outline" className="w-fit gap-1.5 py-1 px-3 border-emerald-500/30 text-emerald-500">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Router {routerData ? `Connected (${routerData.ipAddress})` : "Loading..."}</span>
        </Badge>
      </div>

      {/* Grid: System Info, Resources, Hotspot Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Info Card */}
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Cpu className="size-5 text-primary" />
              <span>System Info</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Model</span>
              <span className="font-medium text-foreground">{routerData?.name ?? "—"}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Board Name</span>
              <span className="font-medium text-foreground">{routerData?.ipAddress ?? "—"}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">RouterOS</span>
              <span className="font-medium text-foreground">{routerData?.rosVersion ?? "—"}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Architecture</span>
              <span className="font-medium text-foreground uppercase">{routerData?.connectionType ?? "—"}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground">Uptime</span>
              <span className="font-medium text-foreground">—</span>
            </div>
          </CardContent>
        </Card>

        {/* Resources Card */}
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <HardDrive className="size-5 text-primary" />
              <span>Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* CPU Load */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CPU Load</span>
                <span className="font-bold text-foreground">{resources.cpuLoad}%</span>
              </div>
              <Progress value={resources.cpuLoad} className="h-2" />
            </div>

            {/* Memory Usage */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Memory</span>
                <span className="text-xs text-muted-foreground">
                  {resources.freeMemoryMB} MB Free
                </span>
              </div>
              <Progress value={memoryUsedPercent} className="h-2" />
            </div>

            {/* HDD Usage */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">HDD Space</span>
                <span className="text-xs text-muted-foreground">
                  {(resources.freeHddMB / 1024).toFixed(1)} GB Free
                </span>
              </div>
              <Progress value={hddUsedPercent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Hotspot Stats */}
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Wifi className="size-5 text-primary" />
              <span>Hotspot Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {/* Active Users */}
              <div className="rounded-xl border border-border bg-muted/40 p-4 text-center space-y-1">
                <div className="flex justify-center text-blue-500 mb-1">
                  <Activity className="size-5" />
                </div>
                <div className="text-2xl font-bold text-foreground">{hotspot.activeUsers}</div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Active Users
                </div>
              </div>

              {/* Total Users */}
              <div className="rounded-xl border border-border bg-muted/40 p-4 text-center space-y-1">
                <div className="flex justify-center text-purple-500 mb-1">
                  <Users className="size-5" />
                </div>
                <div className="text-2xl font-bold text-foreground">{hotspot.totalUsers}</div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Users
                </div>
              </div>

              {/* Income Today */}
              <div className="col-span-2 rounded-xl border border-border bg-muted/40 p-3 text-center space-y-1">
                <div className="flex justify-center text-emerald-500 mb-1">
                  <DollarSign className="size-5" />
                </div>
                <div className="text-xl font-bold text-foreground">
                  Rp {hotspot.incomeToday.toLocaleString("id-ID")}
                </div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Income Today
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Monitor Chart Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Activity className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Realtime Traffic Monitor</CardTitle>
                <CardDescription>
                  Interface bandwidth monitoring ({routerData?.sessionName ?? sessionName})
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Interface Select */}
              <Select value={selectedInterface} onValueChange={(val) => { if (val) setSelectedInterface(val) }}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Interface" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ether1">ether1 (WAN)</SelectItem>
                  <SelectItem value="ether2">ether2 (LAN)</SelectItem>
                  <SelectItem value="wlan1">wlan1 (WiFi)</SelectItem>
                </SelectContent>
              </Select>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="size-2 rounded-full bg-blue-500" />
                  <span>Download (Rx)</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>Upload (Tx)</span>
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rxColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="txColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis
                  tickFormatter={(val) => formatBits(val)}
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip
                  formatter={(value: any) => [formatBits(Number(value)), "Speed"]}
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rxBitsPerSecond"
                  name="Download (Rx)"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#rxColor)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="txBitsPerSecond"
                  name="Upload (Tx)"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#txColor)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
