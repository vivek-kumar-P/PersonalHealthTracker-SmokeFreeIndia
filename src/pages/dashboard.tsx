"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { logs } from "../lib/api"
import { useAuth } from "../lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FlippableChart } from "../components/flippable-chart"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"
import confetti from "canvas-confetti"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement)

interface Log {
  _id: string
  date: string
  cigarettes: number
  smokeless: number
  notes: string
}

export function DashboardPage() {
  const { user } = useAuth()
  const [userLogs, setUserLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showCSVTemplate, setShowCSVTemplate] = useState(false)

  // Form state
  const [date, setDate] = useState(() => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    return `${day}-${month}-${year}`
  })
  const [cigarettes, setCigarettes] = useState("0")
  const [smokeless, setSmokeless] = useState("0")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      const data = await logs.getAll()
      setUserLogs(data)
      checkMilestones(data)
    } catch (error) {
      console.error("Failed to load logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkMilestones = (logsData: Log[]) => {
    const smokeFreedays = logsData.filter((log) => log.cigarettes === 0 && log.smokeless === 0).length
    if (smokeFreedays === 7 || smokeFreedays === 30 || smokeFreedays === 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Parse DD-MM-YYYY format to YYYY-MM-DD for API
      const parts = date.split('-')
      if (parts.length !== 3) {
        alert("Please use DD-MM-YYYY format for date")
        return
      }
      const day = parts[0]
      const month = parts[1]
      const year = parts[2]
      const formattedDate = `${year}-${month}-${day}`

      await logs.create({
        date: formattedDate,
        cigarettes: Number(cigarettes),
        smokeless: Number(smokeless),
        notes,
      })
      // Reset form with today's date
      const today = new Date()
      const todayDay = String(today.getDate()).padStart(2, '0')
      const todayMonth = String(today.getMonth() + 1).padStart(2, '0')
      const todayYear = today.getFullYear()
      setDate(`${todayDay}-${todayMonth}-${todayYear}`)
      setCigarettes("0")
      setSmokeless("0")
      setNotes("")
      setShowForm(false)
      loadLogs()
    } catch (error) {
      console.error("Failed to create log:", error)
      alert("Failed to create log")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await logs.upload(file)
      loadLogs()
    } catch (error) {
      console.error("Failed to upload file:", error)
      alert("Failed to upload file. Please check the format.")
    } finally {
      setUploading(false)
    }
  }

  // Calculate stats
  const totalCigarettes = userLogs.reduce((sum, log) => sum + log.cigarettes, 0)
  const smokeFreedays = userLogs.filter((log) => log.cigarettes === 0 && log.smokeless === 0).length
  const moneySaved = totalCigarettes > 0 ? (userLogs.length * 20 - totalCigarettes) * 10 : 0
  const lifeRegained = totalCigarettes > 0 ? (userLogs.length * 20 - totalCigarettes) * 11 : 0

  // Chart data
  const dailyData = {
    labels: userLogs
      .slice(-30)
      .map((log) => {
        const date = new Date(log.date)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
      }),
    datasets: [
      {
        label: "Daily Cigarettes",
        data: userLogs.slice(-30).map((log) => log.cigarettes),
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Group by week
  const weeklyData = userLogs.reduce((acc: any, log) => {
    const week = `Week ${Math.floor((new Date().getTime() - new Date(log.date).getTime()) / (7 * 24 * 60 * 60 * 1000))}`
    if (!acc[week]) acc[week] = 0
    acc[week] += log.cigarettes
    return acc
  }, {})

  const weeklyChartData = {
    labels: Object.keys(weeklyData).slice(0, 12).reverse(),
    datasets: [
      {
        label: "Weekly Cigarettes",
        data: Object.values(weeklyData).slice(0, 12).reverse(),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Track your progress on your smoke-free journey</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-500 hover:bg-emerald-600">
              {showForm ? "Cancel" : "Add Log"}
            </Button>
            <label>
              <Button variant="outline" disabled={uploading} asChild>
                <span>{uploading ? "Uploading..." : "Upload CSV"}</span>
              </Button>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <Button variant="outline" onClick={() => setShowCSVTemplate(!showCSVTemplate)}>
              CSV Format
            </Button>
          </div>
        </div>

        {/* CSV Template Guide */}
        {showCSVTemplate && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">CSV Upload Format Guide</CardTitle>
              <CardDescription>Use these exact column headers for your CSV file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-blue-300 bg-blue-100">
                      <th className="px-3 py-2 text-left font-semibold text-blue-900">Date</th>
                      <th className="px-3 py-2 text-left font-semibold text-blue-900">Cigarettes</th>
                      <th className="px-3 py-2 text-left font-semibold text-blue-900">Smokeless (gutkha/paan)</th>
                      <th className="px-3 py-2 text-left font-semibold text-blue-900">Craving_Level (1-10)</th>
                      <th className="px-3 py-2 text-left font-semibold text-blue-900">Mood</th>
                      <th className="px-3 py-2 text-left font-semibold text-blue-900">Notes</th>
                      <th className="px-3 py-2 text-left font-semibold text-blue-900">Money_Saved (?)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-blue-200">
                      <td className="px-3 py-2">01-12-2024</td>
                      <td className="px-3 py-2">10</td>
                      <td className="px-3 py-2">2</td>
                      <td className="px-3 py-2">8</td>
                      <td className="px-3 py-2">Anxious</td>
                      <td className="px-3 py-2">First day</td>
                      <td className="px-3 py-2">65</td>
                    </tr>
                    <tr className="border-b border-blue-200">
                      <td className="px-3 py-2">02-12-2024</td>
                      <td className="px-3 py-2">8</td>
                      <td className="px-3 py-2">1</td>
                      <td className="px-3 py-2">7</td>
                      <td className="px-3 py-2">Good</td>
                      <td className="px-3 py-2">Feeling better</td>
                      <td className="px-3 py-2">145</td>
                    </tr>
                    <tr className="border-b border-blue-200">
                      <td className="px-3 py-2">03-12-2024</td>
                      <td className="px-3 py-2">5</td>
                      <td className="px-3 py-2">0</td>
                      <td className="px-3 py-2">5</td>
                      <td className="px-3 py-2">Happy</td>
                      <td className="px-3 py-2">Great progress</td>
                      <td className="px-3 py-2">245</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded-lg bg-blue-100 p-3 text-sm text-blue-800">
                <p className="mb-2"><strong>Column Requirements:</strong></p>
                <ul className="list-inside list-disc space-y-1">
                <li><strong>Date</strong> (required): Format DD-MM-YYYY (e.g., 01-12-2024)</li>
                  <li><strong>Cigarettes</strong> (required): Number of cigarettes (0+)</li>
                  <li><strong>Smokeless</strong> (optional): Gutkha/paan consumption</li>
                  <li><strong>Craving_Level</strong> (optional): 1-10 scale</li>
                  <li><strong>Mood</strong> (optional): Your mood (e.g., Happy, Anxious)</li>
                  <li><strong>Notes</strong> (optional): Additional notes</li>
                  <li><strong>Money_Saved</strong> (optional): Amount saved in ₹</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Log Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add Daily Log</CardTitle>
              <CardDescription>Record your tobacco usage for today</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date (DD-MM-YYYY)</Label>
                    <Input
                      id="date"
                      type="text"
                      placeholder="01-11-2025"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cigarettes">Cigarettes</Label>
                    <Input
                      id="cigarettes"
                      type="number"
                      min="0"
                      value={cigarettes}
                      onChange={(e) => setCigarettes(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smokeless">Smokeless</Label>
                    <Input
                      id="smokeless"
                      type="number"
                      min="0"
                      value={smokeless}
                      onChange={(e) => setSmokeless(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="How are you feeling today?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                  Save Log
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards - FIXED: Proper overflow handling */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardDescription>Days Smoke-Free</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{smokeFreedays}</div>
              <p className="mt-1 text-sm text-gray-600">Keep it up!</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardDescription>Money Saved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 break-words">₹{moneySaved.toLocaleString()}</div>
              <p className="mt-1 text-sm text-gray-600">at ₹10/cigarette</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardDescription>Life Regained</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{Math.floor(lifeRegained / 60)}h</div>
              <p className="mt-1 text-sm text-gray-600">{lifeRegained % 60}min extra</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardDescription>Total Logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{userLogs.length}</div>
              <p className="mt-1 text-sm text-gray-600">days tracked</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {userLogs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Daily Cigarettes Chart - Flippable - FIXED: Proper overflow handling */}
            <Card className="h-full border-0 shadow-md overflow-hidden flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Daily Cigarettes (Last 30 Days)</CardTitle>
                <CardDescription>Track your daily consumption</CardDescription>
              </CardHeader>
              {/* Chart content wrapper - FIXED: h-96 ensures proper sizing, overflow-hidden prevents breakout */}
              <CardContent className="flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
                <div className="w-full h-80 sm:h-96">
                  <FlippableChart
                    title="Daily Cigarettes (Last 30 Days)"
                    description="Track your daily consumption over the past month"
                    insights={[
                      {
                        title: "📊 Trend Analysis",
                        points: [
                          `Average: ${(userLogs.slice(-30).reduce((sum, log) => sum + log.cigarettes, 0) / Math.max(userLogs.slice(-30).length, 1)).toFixed(1)} cigarettes/day`,
                          userLogs.slice(-30).every(log => log.cigarettes <= userLogs.slice(-30)[0]?.cigarettes || 0) 
                            ? "Positive trend: Consistent reduction"
                            : "Fluctuating consumption - identify trigger patterns",
                          `Peak consumption: ${Math.max(...userLogs.slice(-30).map(log => log.cigarettes))} cigarettes`,
                        ],
                      },
                      {
                        title: "💡 Possible Reasons",
                        points: [
                          "Stress or anxiety triggers increased consumption",
                          "Social situations or peer influence",
                          "Habit-driven smoking (e.g., after meals, morning coffee)",
                          "Withdrawal symptoms during initial quit attempts",
                        ],
                      },
                      {
                        title: "🎯 Recommended Actions",
                        points: [
                          "Identify patterns: Note time of day and triggers for each cigarette",
                          "Use NRT (Nicotine Replacement Therapy) patches or gum for cravings",
                          "Practice stress management: Exercise, meditation, or deep breathing",
                          "Replace habit: Chew gum, sip water, or walk when urge strikes",
                          "Celebrate daily wins: Reward smoke-free days",
                        ],
                      },
                    ]}
                  >
                    <Line data={dailyData} options={chartOptions} />
                  </FlippableChart>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Summary Chart - Flippable - FIXED: Proper overflow handling */}
            <Card className="h-full border-0 shadow-md overflow-hidden flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Weekly Summary</CardTitle>
                <CardDescription>Cigarettes per week</CardDescription>
              </CardHeader>
              {/* Chart content wrapper - FIXED: h-96 ensures proper sizing, overflow-hidden prevents breakout */}
              <CardContent className="flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
                <div className="w-full h-80 sm:h-96">
                  <FlippableChart
                    title="Weekly Summary"
                    description="Total cigarettes consumed per week"
                    insights={[
                      {
                        title: "📈 Progress Assessment",
                        points: [
                          `Total cigarettes this month: ${userLogs.slice(-30).reduce((sum, log) => sum + log.cigarettes, 0)}`,
                          `Weekly average: ${(userLogs.slice(-30).reduce((sum, log) => sum + log.cigarettes, 0) / Math.ceil(Math.max(userLogs.slice(-30).length, 1) / 7)).toFixed(0)}`,
                          `Most cigarettes in a week: ${Math.max(...Object.values(weeklyData).filter(v => typeof v === 'number') as number[])}`,
                          `Weeks with improvement: Track your downward trend`,
                        ],
                      },
                      {
                        title: "💡 Positive Reinforcement",
                        points: [
                          "Every reduction counts - celebrate weekly wins",
                          "Visualize health improvements: Lungs healing, taste improving",
                          "Financial impact: Each avoided cigarette = ₹10 saved",
                          "Social benefits: Fresher breath, cleaner clothes, healthier appearance",
                        ],
                      },
                      {
                        title: "🎯 Next Steps",
                        points: [
                          "Set a weekly reduction goal: Aim for 10% less than last week",
                          "Share progress with support group or counselor",
                          "Plan activities to replace smoking habits",
                          "Avoid alcohol/coffee initially (common triggers)",
                          "Keep emergency contacts for cravings: Friends, helpline (1800-11-7656)",
                        ],
                      },
                    ]}
                  >
                    <Bar data={weeklyChartData} options={chartOptions} />
                  </FlippableChart>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex min-h-64 items-center justify-center">
              <div className="text-center">
                <p className="mb-4 text-gray-600">No logs yet. Start tracking your progress!</p>
                <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600">
                  Add Your First Log
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
