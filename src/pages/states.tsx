"use client"

import { useState, useMemo } from "react"
import {
  getUniqueStates,
  getStateData,
  getIndiaData,
  getEstimatedUsers,
  getEstimatedDeaths,
} from "../lib/india-states-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FlippableChart } from "../components/flippable-chart"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
} from "chart.js"
import { Bar, Pie, Doughnut, Line, Radar, PolarArea } from "react-chartjs-2"
import { Search, Users, AlertCircle, Smartphone, Zap } from "lucide-react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
)

export function StatesPage() {
  const [selectedStateName, setSelectedStateName] = useState<string>("India")
  const [searchInput, setSearchInput] = useState<string>("")
  const states = useMemo(() => ["India", ...getUniqueStates()], [])

  // State categories for grouped display
  const statesByCategory = useMemo(() => {
    const unionTerritories = ["Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"]
    const categorized = {
      overall: states.filter(s => s === "India"),
      states: states.filter(s => s !== "India" && !unionTerritories.includes(s)),
      territories: states.filter(s => unionTerritories.includes(s))
    }
    return categorized
  }, [states])

  // Filter states based on search
  const filteredStates = useMemo(() => {
    if (!searchInput.trim()) return statesByCategory
    
    const query = searchInput.toLowerCase()
    return {
      overall: statesByCategory.overall.filter(s => s.toLowerCase().includes(query)),
      states: statesByCategory.states.filter(s => s.toLowerCase().includes(query)),
      territories: statesByCategory.territories.filter(s => s.toLowerCase().includes(query))
    }
  }, [searchInput, statesByCategory])

  const stateData = useMemo(() => {
    if (selectedStateName === "India") {
      return getIndiaData()
    }
    return getStateData(selectedStateName)
  }, [selectedStateName])

  const totalData = stateData.find((d) => d.area === "Total")
  const urbanData = stateData.find((d) => d.area === "Urban")
  const ruralData = stateData.find((d) => d.area === "Rural")

  if (!totalData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    )
  }

  const estimatedUsers = getEstimatedUsers(selectedStateName, totalData.currentTobaccoUsers)
  const estimatedDeaths = getEstimatedDeaths(selectedStateName, totalData.currentTobaccoUsers)

  // Chart configurations with hover effects
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: { family: "Inter", size: 12 },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { family: "Inter", size: 14 },
        bodyFont: { family: "Inter", size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart" as const,
    },
    hover: {
      mode: "nearest" as const,
      intersect: true,
    },
  }

  // 1. Overall Prevalence Comparison (Horizontal Bar)
  const prevalenceComparisonData = {
    labels: ["Ever Tobacco Users", "Current Tobacco Users", "Ever Smokers", "Current Smokers", "Smokeless Users"],
    datasets: [
      {
        label: selectedStateName,
        data: [
          totalData.everTobaccoUsers,
          totalData.currentTobaccoUsers,
          totalData.everTobaccoSmokers,
          totalData.currentTobaccoSmokers,
          totalData.currentSmokelessUsers,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(52, 211, 153, 0.8)",
          "rgba(110, 231, 183, 0.8)",
          "rgba(167, 243, 208, 0.8)",
          "rgba(209, 250, 229, 0.8)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(52, 211, 153, 1)",
          "rgba(110, 231, 183, 1)",
          "rgba(167, 243, 208, 1)",
          "rgba(209, 250, 229, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(52, 211, 153, 1)",
          "rgba(110, 231, 183, 1)",
          "rgba(167, 243, 208, 1)",
          "rgba(209, 250, 229, 1)",
        ],
      },
    ],
  }

  // 2. Smoked vs Smokeless (Doughnut)
  const smokedVsSmokelessData = {
    labels: ["Smoked Tobacco", "Smokeless Tobacco"],
    datasets: [
      {
        data: [totalData.currentTobaccoSmokers, totalData.currentSmokelessUsers],
        backgroundColor: ["rgba(239, 68, 68, 0.8)", "rgba(16, 185, 129, 0.8)"],
        borderColor: ["rgba(239, 68, 68, 1)", "rgba(16, 185, 129, 1)"],
        borderWidth: 3,
        hoverOffset: 20,
        hoverBorderWidth: 4,
      },
    ],
  }

  // 3. Product Type Breakdown (Pie)
  const productTypeData = {
    labels: ["Cigarettes", "Bidis", "Paan Masala", "Other Smokeless"],
    datasets: [
      {
        data: [
          totalData.currentCigaretteUsers,
          totalData.currentBidiUsers,
          totalData.everPaanMasalaUsers,
          Math.max(0, totalData.currentSmokelessUsers - totalData.everPaanMasalaUsers),
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(250, 204, 21, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(251, 146, 60, 1)",
          "rgba(250, 204, 21, 1)",
          "rgba(16, 185, 129, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  }

  // 4. Urban vs Rural Comparison (Grouped Bar)
  const urbanRuralData = {
    labels: ["Current Users", "Smokers", "Smokeless", "E-Cigarette Awareness"],
    datasets: [
      {
        label: "Urban",
        data: [
          urbanData?.currentTobaccoUsers || 0,
          urbanData?.currentTobaccoSmokers || 0,
          urbanData?.currentSmokelessUsers || 0,
          urbanData?.awarenessECigarette || 0,
        ],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: "rgba(59, 130, 246, 1)",
      },
      {
        label: "Rural",
        data: [
          ruralData?.currentTobaccoUsers || 0,
          ruralData?.currentTobaccoSmokers || 0,
          ruralData?.currentSmokelessUsers || 0,
          ruralData?.awarenessECigarette || 0,
        ],
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: "rgba(16, 185, 129, 1)",
      },
    ],
  }

  // 5. Quit Attempts Radar
  const quitAttemptsData = {
    labels: [
      "Quit Smoking (12mo)",
      "Tried to Quit Smoking",
      "Wants to Quit Smoking",
      "Quit Smokeless (12mo)",
      "Tried Quit Smokeless",
      "Wants Quit Smokeless",
    ],
    datasets: [
      {
        label: selectedStateName,
        data: [
          totalData.quitSmokingLast12Months,
          totalData.triedQuitSmoking,
          totalData.wantedQuitSmoking,
          totalData.quitSmokelessLast12Months,
          totalData.triedQuitSmokeless,
          totalData.wantedQuitSmokeless,
        ],
        backgroundColor: "rgba(16, 185, 129, 0.3)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 3,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(16, 185, 129, 1)",
        pointRadius: 6,
        pointHoverRadius: 10,
      },
    ],
  }

  // 6. Exposure Locations (Polar Area)
  const exposureData = {
    labels: ["Home/Public", "At Home", "Enclosed Public", "Outdoor Public", "At School"],
    datasets: [
      {
        data: [
          totalData.exposureAtHomeOrPublic,
          totalData.exposureAtHome,
          totalData.exposureEnclosedPublic,
          totalData.exposureOutdoorPublic,
          totalData.sawSmokingAtSchool,
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.7)",
          "rgba(251, 146, 60, 0.7)",
          "rgba(250, 204, 21, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(59, 130, 246, 0.7)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(251, 146, 60, 1)",
          "rgba(250, 204, 21, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
        ],
        borderWidth: 2,
      },
    ],
  }

  // 7. Median Age of Initiation (Line)
  const ageInitiationData = {
    labels: ["Cigarette", "Bidi", "Smokeless"],
    datasets: [
      {
        label: "Median Age (years)",
        data: [totalData.medianAgeCigarette, totalData.medianAgeBidi, totalData.medianAgeSmokeless],
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 4,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(239, 68, 68, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
      },
    ],
  }

  // 8. E-Cigarette Awareness & Use (Bar)
  const eCigaretteData = {
    labels: ["E-Cigarette Awareness", "Ever Used E-Cigarette", "Future Smoking Susceptibility"],
    datasets: [
      {
        label: "Percentage (%)",
        data: [totalData.awarenessECigarette, totalData.everECigaretteUse, totalData.susceptibleToFutureSmoking],
        backgroundColor: ["rgba(147, 51, 234, 0.8)", "rgba(192, 132, 252, 0.8)", "rgba(239, 68, 68, 0.8)"],
        borderColor: ["rgba(147, 51, 234, 1)", "rgba(192, 132, 252, 1)", "rgba(239, 68, 68, 1)"],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: ["rgba(147, 51, 234, 1)", "rgba(192, 132, 252, 1)", "rgba(239, 68, 68, 1)"],
      },
    ],
  }

  // 9. State Comparison with India (Horizontal Bar)
  const indiaData = getIndiaData().find((d) => d.area === "Total")
  const comparisonWithIndiaData = {
    labels: ["Current Users", "Smokers", "Smokeless", "Quit Rate", "Awareness"],
    datasets: [
      {
        label: selectedStateName,
        data: [
          totalData.currentTobaccoUsers,
          totalData.currentTobaccoSmokers,
          totalData.currentSmokelessUsers,
          totalData.quitSmokingLast12Months,
          totalData.awarenessECigarette,
        ],
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: "India Average",
        data: [
          indiaData?.currentTobaccoUsers || 0,
          indiaData?.currentTobaccoSmokers || 0,
          indiaData?.currentSmokelessUsers || 0,
          indiaData?.quitSmokingLast12Months || 0,
          indiaData?.awarenessECigarette || 0,
        ],
        backgroundColor: "rgba(156, 163, 175, 0.8)",
        borderColor: "rgba(156, 163, 175, 1)",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 py-8">
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        <div className="mb-10 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full">
            <span className="text-sm font-semibold text-emerald-700">📊 Real-time Analytics</span>
          </div>
          <h1 className="mb-3 text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            All States Insights
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            Comprehensive tobacco usage statistics across Indian states and union territories
          </p>
          <p className="text-sm text-emerald-600 font-medium">
            📋 Data Source: Global Adult Tobacco Survey (GATS) - Youth Tobacco Survey India
          </p>
        </div>

        {/* Enhanced State Selector Card */}
        <Card className="mb-10 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span className="text-3xl">🌍</span>
                  Select State or Union Territory
                </CardTitle>
                <CardDescription className="text-emerald-100 text-base mt-2">
                  Choose a location to view detailed tobacco statistics with interactive charts
                </CardDescription>
              </div>
              <div className="text-4xl opacity-30">🗺️</div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-8 pb-6">
            {/* Main Selection Area with Quick Access */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Left Side: Quick Access & Stats */}
              <div className="flex-1 space-y-4">
                {/* Quick Stats Banner */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 rounded-lg border border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
                    <div className="text-xs text-emerald-600 font-semibold mb-1">TOTAL STATES</div>
                    <div className="text-2xl font-bold text-emerald-700 group-hover:scale-110 transition-transform">28</div>
                    <div className="text-xs text-gray-600 mt-1">+ 8 UTs</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200 hover:shadow-md transition-all cursor-pointer group">
                    <div className="text-xs text-blue-600 font-semibold mb-1">SELECTED</div>
                    <div className="text-xl font-bold text-blue-700 truncate group-hover:scale-110 transition-transform">
                      {selectedStateName === "India" ? "🇮🇳" : "📍"} {selectedStateName.split(' ')[0]}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Current view</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200 hover:shadow-md transition-all cursor-pointer group">
                    <div className="text-xs text-orange-600 font-semibold mb-1">AVG USAGE</div>
                    <div className="text-2xl font-bold text-orange-700 group-hover:scale-110 transition-transform">{totalData.currentTobaccoUsers}%</div>
                    <div className="text-xs text-gray-600 mt-1">Youth tobacco</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200 hover:shadow-md transition-all cursor-pointer group">
                    <div className="text-xs text-purple-600 font-semibold mb-1">E-CIGARETTE</div>
                    <div className="text-2xl font-bold text-purple-700 group-hover:scale-110 transition-transform">{totalData.awarenessECigarette}%</div>
                    <div className="text-xs text-gray-600 mt-1">Awareness</div>
                  </div>
                </div>

                {/* Quick Access Popular States */}
                <div className="bg-gradient-to-r from-gray-50 to-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Zap className="text-emerald-600" size={16} />
                      QUICK ACCESS
                    </h3>
                    <span className="text-xs text-gray-500">Popular states</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["India", "Maharashtra", "Delhi", "Tamil Nadu", "Karnataka", "Gujarat", "Uttar Pradesh", "West Bengal"].map((state) => (
                      <button
                        key={state}
                        onClick={() => { setSelectedStateName(state); setSearchInput(""); }}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          selectedStateName === state
                            ? "bg-emerald-500 text-white shadow-md scale-105"
                            : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                        }`}
                      >
                        {state === "India" ? "🇮🇳" : "📍"} {state}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Search & Dropdown */}
              <div className="w-full md:w-80 space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search states..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-gray-700 bg-white"
                  />
                  {searchInput && (
                    <button
                      onClick={() => setSearchInput("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Dropdown Selector */}
                <div className="relative">
                  <Select value={selectedStateName} onValueChange={(value) => { setSelectedStateName(value); setSearchInput(""); }}>
                    <SelectTrigger className="w-full text-lg h-14 border-2 border-emerald-200 focus:border-emerald-500 transition-all rounded-lg focus:ring-2 focus:ring-emerald-200 shadow-sm hover:border-emerald-300 hover:shadow-md bg-white">
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                  
                  <SelectContent className="max-h-96 bg-white border-2 border-emerald-200 shadow-xl">
                  {/* Overall Section */}
                  {filteredStates.overall.length > 0 && (
                    <>
                      <div className="px-2 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        🇮🇳 National
                      </div>
                      {filteredStates.overall.map((state) => (
                        <SelectItem 
                          key={state} 
                          value={state} 
                          className="text-base py-3 cursor-pointer hover:bg-emerald-50 focus:bg-emerald-100"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-lg">🇮🇳</span>
                            <span className="font-semibold">{state} (Overall)</span>
                          </span>
                        </SelectItem>
                      ))}
                    </>
                  )}
                  
                  {/* States Section */}
                  {filteredStates.states.length > 0 && (
                    <>
                      <div className="px-2 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">
                        🏛️ States
                      </div>
                      {filteredStates.states.map((state) => (
                        <SelectItem 
                          key={state} 
                          value={state} 
                          className="text-base py-3 cursor-pointer hover:bg-teal-50 focus:bg-teal-100"
                        >
                          <span className="flex items-center gap-2">
                            <span>📍</span>
                            <span>{state}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </>
                  )}
                  
                  {/* Union Territories Section */}
                  {filteredStates.territories.length > 0 && (
                    <>
                      <div className="px-2 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">
                        🏝️ Union Territories
                      </div>
                      {filteredStates.territories.map((state) => (
                        <SelectItem 
                          key={state} 
                          value={state} 
                          className="text-base py-3 cursor-pointer hover:bg-cyan-50 focus:bg-cyan-100"
                        >
                          <span className="flex items-center gap-2">
                            <span>🏝️</span>
                            <span>{state}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </>
                  )}

                  {/* No results message */}
                  {filteredStates.overall.length === 0 && 
                   filteredStates.states.length === 0 && 
                   filteredStates.territories.length === 0 && (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <p className="text-sm">No states found matching "{searchInput}"</p>
                      <p className="text-xs text-gray-400 mt-2">Try a different search term</p>
                    </div>
                  )}
                  </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Selected State Display */}
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Currently viewing</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">
                    {selectedStateName === "India" ? "🇮🇳 " : "📍 "}{selectedStateName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 uppercase font-semibold">Tobacco Usage</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl font-bold text-emerald-600">{totalData.currentTobaccoUsers}%</span>
                    <span className="text-sm text-gray-600">of youth</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Big Number Cards */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Current Tobacco Users */}
          <Card className="group border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200 rounded-full -translate-y-8 translate-x-8 opacity-20 group-hover:scale-110 transition-transform" />
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-start justify-between">
                <CardDescription className="text-sm font-semibold text-gray-700">Current Tobacco Users</CardDescription>
                <div className="text-3xl">👥</div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-5xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                {totalData.currentTobaccoUsers}%
              </div>
              <p className="mt-2 text-sm text-gray-600">of youth population</p>
              <div className="mt-4 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(totalData.currentTobaccoUsers * 2, 100)}%` }}
                />
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center justify-between text-xs">
                <span className="text-gray-600">National average</span>
                <span className="font-semibold text-emerald-600">~25%</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Estimated Users */}
          <Card className="group border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -translate-y-8 translate-x-8 opacity-20 group-hover:scale-110 transition-transform" />
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-start justify-between">
                <CardDescription className="text-sm font-semibold text-gray-700">Estimated Users</CardDescription>
                <Users className="text-blue-500" size={24} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-5xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                {estimatedUsers >= 1000000
                  ? `${(estimatedUsers / 1000000).toFixed(1)}M`
                  : `${(estimatedUsers / 1000).toFixed(0)}K`}
              </div>
              <p className="mt-2 text-sm text-gray-600">people affected</p>
              <div className="mt-4 p-2 bg-blue-100/50 rounded-lg">
                <p className="text-xs text-blue-700">
                  📊 Based on population estimates and prevalence data
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between text-xs">
                <span className="text-gray-600">Estimated total</span>
                <span className="font-semibold text-blue-600">High impact</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Estimated Annual Deaths */}
          <Card className="group border-0 bg-gradient-to-br from-red-50 to-orange-50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-200 rounded-full -translate-y-8 translate-x-8 opacity-20 group-hover:scale-110 transition-transform" />
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-start justify-between">
                <CardDescription className="text-sm font-semibold text-gray-700">Annual Deaths</CardDescription>
                <AlertCircle className="text-red-500" size={24} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-5xl font-bold text-red-600 group-hover:text-red-700 transition-colors">
                {estimatedDeaths >= 1000 ? `${(estimatedDeaths / 1000).toFixed(1)}K` : estimatedDeaths}
              </div>
              <p className="mt-2 text-sm text-gray-600">tobacco-related deaths</p>
              <div className="mt-4 p-2 bg-red-100/50 rounded-lg">
                <p className="text-xs text-red-700">
                  ⚠️ Preventable deaths that could be saved
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-red-200 flex items-center justify-between text-xs">
                <span className="text-gray-600">Annual impact</span>
                <span className="font-semibold text-red-600">Critical</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: E-Cigarette Awareness */}
          <Card className="group border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -translate-y-8 translate-x-8 opacity-20 group-hover:scale-110 transition-transform" />
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-start justify-between">
                <CardDescription className="text-sm font-semibold text-gray-700">E-Cigarette Awareness</CardDescription>
                <Smartphone className="text-purple-500" size={24} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-5xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                {totalData.awarenessECigarette}%
              </div>
              <p className="mt-2 text-sm text-gray-600">aware of e-cigarettes</p>
              <div className="mt-4 p-2 bg-purple-100/50 rounded-lg">
                <p className="text-xs text-purple-700">
                  💨 {totalData.everECigaretteUse}% have tried e-cigarettes
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-purple-200 flex items-center justify-between text-xs">
                <span className="text-gray-600">Emerging trend</span>
                <span className="font-semibold text-purple-600">Rising</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 1. Overall Prevalence - FIXED: overflow-hidden, flex-col, flex-1 on CardContent */}
          <Card className="lg:col-span-2 border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-200 rounded-full -translate-y-16 -translate-x-16 opacity-10 group-hover:scale-110 transition-transform" />
            <CardHeader className="relative z-10 flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl line-clamp-2">
                <span className="text-xl sm:text-2xl flex-shrink-0">📊</span>
                <span>Overall Tobacco Prevalence</span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm line-clamp-2">Percentage comparison of different usage metrics</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
              <div className="w-full h-96">
                <FlippableChart
                  title="Overall Tobacco Prevalence"
                  description="Percentage comparison of different usage metrics"
                  insights={[
                    {
                      title: "🔍 Prevalence Breakdown",
                      points: [
                        `Ever tobacco users: ${totalData.everTobaccoUsers}%`,
                        `Current tobacco users: ${totalData.currentTobaccoUsers}%`,
                        `Ever smokers: ${totalData.everTobaccoSmokers}%`,
                        `Current smokers: ${totalData.currentTobaccoSmokers}%`,
                        `Smokeless users: ${totalData.currentSmokelessUsers}%`,
                      ],
                    },
                    {
                      title: "💡 Key Observations",
                      points: [
                        "High prevalence indicates endemic tobacco use in this region",
                        `Smoking dominance: ${totalData.currentTobaccoSmokers > totalData.currentSmokelessUsers ? "Smoked tobacco is primary form" : "Smokeless tobacco is more prevalent"}`,
                        "Legacy users (ever users) significantly exceed current users - opportunity for prevention",
                      ],
                    },
                    {
                      title: "🎯 Policy Recommendations",
                      points: [
                        "Enforce tobacco control laws: Raise taxes, restrict advertising, ban promotional activities",
                        "School-based prevention: Integrate tobacco education into curriculum",
                        "Cessation support: Establish quit-smoking centers, offer counseling services",
                        "Community awareness: Organize campaigns highlighting health risks",
                      ],
                    },
                  ]}
                >
                  <Bar
                    data={prevalenceComparisonData}
                    options={{
                      ...chartOptions,
                      indexAxis: "y" as const,
                      scales: {
                        x: { max: 100, grid: { color: "rgba(0,0,0,0.05)" } },
                        y: { grid: { display: false } },
                      },
                    }}
                  />
                </FlippableChart>
              </div>
            </CardContent>
          </Card>

          {/* 2. Smoked vs Smokeless */}
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200 rounded-full -translate-y-16 translate-x-16 opacity-10 group-hover:scale-110 transition-transform" />
            <CardHeader className="relative z-10 flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="text-2xl">🥧</span>
                Smoked vs Smokeless
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm line-clamp-2">Distribution of tobacco types</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
              <div className="w-full h-80 sm:h-96">
                <FlippableChart
                  title="Smoked vs Smokeless Tobacco"
                  description="Distribution of different tobacco consumption methods"
                  insights={[
                    {
                      title: "📊 Distribution Analysis",
                      points: [
                        `Smoked tobacco users: ${totalData.currentTobaccoSmokers}%`,
                        `Smokeless tobacco users: ${totalData.currentSmokelessUsers}%`,
                        `Ratio: ${(totalData.currentTobaccoSmokers / Math.max(totalData.currentSmokelessUsers, 1)).toFixed(1)}:1 (Smoked:Smokeless)`,
                      ],
                    },
                    {
                      title: "💡 Health Implications",
                      points: [
                        "Smoked tobacco: Direct lung damage, COPD, cancer risks",
                        "Smokeless tobacco: Oral cancer, gum disease, nicotine addiction",
                        "Both forms carry equal addiction potential and mortality risks",
                      ],
                    },
                    {
                      title: "🎯 Targeted Interventions",
                      points: [
                        `Primary form (${totalData.currentTobaccoSmokers > totalData.currentSmokelessUsers ? "Smoking" : "Smokeless"}): Design specific cessation campaigns`,
                        "Educate about health consequences of both forms",
                        "Promote NRT (nicotine patches, gum) across demographic groups",
                        "Partner with health workers for behavior change support",
                      ],
                    },
                  ]}
                >
                  <Doughnut
                    data={smokedVsSmokelessData}
                    options={{
                      ...chartOptions,
                      cutout: "60%",
                    }}
                  />
                </FlippableChart>
              </div>
            </CardContent>
          </Card>

          {/* 3. Product Type Breakdown */}
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-200 rounded-full -translate-y-16 translate-x-16 opacity-10 group-hover:scale-110 transition-transform" />
            <CardHeader className="relative z-10 flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="text-2xl">🚬</span>
                Product Types
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm line-clamp-2">Breakdown by tobacco product</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
              <div className="w-full h-80 sm:h-96">
                <FlippableChart
                  title="Product Type Breakdown"
                  description="Percentage distribution by specific tobacco products"
                  insights={[
                    {
                      title: "📋 Product Prevalence",
                      points: [
                        `Cigarettes: ${totalData.currentCigaretteUsers}% (urban preference)`,
                        `Bidis: ${totalData.currentBidiUsers}% (cheaper alternative)`,
                        `Paan Masala: ${totalData.everPaanMasalaUsers}% (widespread in India)`,
                        `Other smokeless: ${Math.max(0, totalData.currentSmokelessUsers - totalData.everPaanMasalaUsers)}% (gutka, snus)`,
                      ],
                    },
                    {
                      title: "💡 Market & Cultural Factors",
                      points: [
                        "Bidis popular among low-income groups (cheaper, accessible)",
                        "Paan masala deeply rooted in social/cultural practices",
                        "Cigarettes: Status symbol among affluent youth",
                        "Marketing restrictions on traditional forms: Less enforcement",
                      ],
                    },
                    {
                      title: "🎯 Product-Specific Strategies",
                      points: [
                        "Cigarettes: Tax increases, packaging warnings, reduce displays",
                        "Bidis: Occupational health programs for workers, cottage industry support for alternatives",
                        "Paan: Community engagement, cultural re-framing, ingredient regulations",
                        "E-cigarettes: Regulatory framework, youth education, market monitoring",
                      ],
                    },
                  ]}
                >
                  <Pie data={productTypeData} options={chartOptions} />
                </FlippableChart>
              </div>
            </CardContent>
          </Card>

          {/* 4. Urban vs Rural */}
          <Card className="lg:col-span-2 border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-200 rounded-full -translate-y-16 -translate-x-16 opacity-10 group-hover:scale-110 transition-transform" />
            <CardHeader className="relative z-10 flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="text-2xl">🏙️</span>
                Urban vs Rural Comparison
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm line-clamp-2">Regional differences in tobacco usage</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
              <div className="w-full h-80 sm:h-96">
                <FlippableChart
                  title="Urban vs Rural Comparison"
                  description="Regional differences in tobacco consumption patterns"
                  insights={[
                    {
                      title: "📊 Regional Breakdown",
                      points: [
                        `Urban - Current users: ${urbanData?.currentTobaccoUsers || 0}%, Smokers: ${urbanData?.currentTobaccoSmokers || 0}%`,
                        `Rural - Current users: ${ruralData?.currentTobaccoUsers || 0}%, Smokers: ${ruralData?.currentTobaccoSmokers || 0}%`,
                        `E-Cig awareness - Urban: ${urbanData?.awarenessECigarette || 0}%, Rural: ${ruralData?.awarenessECigarette || 0}%`,
                      ],
                    },
                    {
                      title: "💡 Socio-Economic Factors",
                      points: [
                        `${(urbanData?.currentTobaccoUsers || 0) > (ruralData?.currentTobaccoUsers || 0) ? "Urban higher prevalence: Economic affordability, social stress, marketing exposure" : "Rural higher prevalence: Agricultural labor patterns, limited education, cultural acceptance"}`,
                        "Infrastructure differences: Healthcare, cessation support availability",
                        "E-cigarette trend: Urban youth adopt modern products; rural lag in awareness",
                      ],
                    },
                    {
                      title: "🎯 Regional Strategies",
                      points: [
                        "Urban: Youth programs, workplace policies, digital campaigns on social media",
                        "Rural: Grassroots campaigns, mobile health clinics, farmer transition support",
                        "Both: Culturally tailored messaging, local language resources",
                        "Equity: Ensure affordable cessation services in underserved areas",
                      ],
                    },
                  ]}
                >
                  <Bar
                    data={urbanRuralData}
                    options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          max:
                            Math.max(
                              urbanData?.currentTobaccoUsers || 0,
                              ruralData?.currentTobaccoUsers || 0,
                              urbanData?.awarenessECigarette || 0,
                              ruralData?.awarenessECigarette || 0,
                            ) + 10,
                        },
                      },
                    }}
                  />
                </FlippableChart>
              </div>
            </CardContent>
          </Card>

          {/* 5. Quit Attempts Radar */}
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200 rounded-full -translate-y-16 translate-x-16 opacity-10 group-hover:scale-110 transition-transform" />
            <CardHeader className="relative z-10 flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="text-2xl">🎯</span>
                Quit Attempts Profile
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm line-clamp-2">Cessation behavior analysis</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
              <div className="w-full h-80 sm:h-96">
                <FlippableChart
                  title="Quit Attempts Profile"
                  description="Cessation behavior and readiness to quit"
                  insights={[
                    {
                      title: "📊 Quit Behavior Metrics",
                      points: [
                        `Quit smoking in 12mo: ${totalData.quitSmokingLast12Months}%`,
                        `Tried to quit smoking: ${totalData.triedQuitSmoking}%`,
                        `Want to quit smoking: ${totalData.wantedQuitSmoking}%`,
                        `Quit smokeless in 12mo: ${totalData.quitSmokelessLast12Months}%`,
                      ],
                    },
                    {
                      title: "💡 Cessation Readiness",
                      points: [
                        `Want-to-quit vs actual quit: Gap indicates need for better support`,
                        "Tried-to-quit failures: Need access to evidence-based interventions",
                        "Success stories (12mo quit): Scalable intervention model needed",
                      ],
                    },
                    {
                      title: "🎯 Cessation Support Strategy",
                      points: [
                        "Increase cessation support infrastructure: Quit lines, counseling centers",
                        "Provide evidence-based treatment: Nicotine replacement therapy (NRT)",
                        "Behavioral support: Group counseling, motivational interviewing",
                        "Follow-up: 3-6 month check-ins to prevent relapse",
                      ],
                    },
                  ]}
                >
                  <Radar
                    data={quitAttemptsData}
                    options={{
                      ...chartOptions,
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100,
                          ticks: { stepSize: 20 },
                          pointLabels: { font: { size: 9 } },
                        },
                      },
                    }}
                  />
                </FlippableChart>
              </div>
            </CardContent>
          </Card>

          {/* 6. Exposure Locations */}
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-200 rounded-full -translate-y-16 -translate-x-16 opacity-10 group-hover:scale-110 transition-transform" />
            <CardHeader className="relative z-10 flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="text-2xl">🌍</span>
                Exposure Locations
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm line-clamp-2">Where youth are exposed to smoke</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
              <div className="w-full h-80 sm:h-96">
                <FlippableChart
                  title="Secondhand Smoke Exposure"
                  description="Where youth encounter tobacco smoke and users"
                  insights={[
                    {
                      title: "📍 Exposure Hotspots",
                      points: [
                        `Home/Public: ${totalData.exposureAtHomeOrPublic}%`,
                        `At home: ${totalData.exposureAtHome}%`,
                        `Enclosed public spaces: ${totalData.exposureEnclosedPublic}%`,
                        `Outdoor public: ${totalData.exposureOutdoorPublic}%`,
                        `School environment: ${totalData.sawSmokingAtSchool}%`,
                      ],
                    },
                    {
                      title: "💡 Health Impact",
                      points: [
                        "Secondhand smoke contains 7,000+ chemicals; 70+ known carcinogens",
                        "Home exposure: Most damaging, lifelong impact on children",
                        "School exposure: Normalizes tobacco, accelerates youth initiation",
                        "Public spaces: Limited enforcement of smoke-free regulations",
                      ],
                    },
                    {
                      title: "🎯 Protective Measures",
                      points: [
                        "Smoke-free homes & schools: Key protective policy",
                        "Enforce public place bans: Restaurants, transport, workplaces",
                        "Raise awareness: Secondhand smoke health risks",
                        "Support smokers to quit: Best way to protect families",
                      ],
                    },
                  ]}
                >
                  <PolarArea
                    data={exposureData}
                    options={{
                      ...chartOptions,
                      scales: {
                        r: { beginAtZero: true },
                      },
                    }}
                  />
                </FlippableChart>
              </div>
            </CardContent>
          </Card>

          {/* 7. Age of Initiation */}
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full -translate-y-16 translate-x-16 opacity-10 group-hover:scale-110 transition-transform" />
            <CardHeader className="relative z-10 flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="text-2xl">📅</span>
                Median Age of Initiation
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm line-clamp-2">When youth start using tobacco</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
              <div className="w-full h-80 sm:h-96">
                <FlippableChart
                  title="Median Age of Initiation"
                  description="Average age when youth first use tobacco products"
                  insights={[
                    {
                      title: "📊 Initiation Age Metrics",
                      points: [
                        `Cigarettes: ${totalData.medianAgeCigarette} years`,
                        `Bidis: ${totalData.medianAgeBidi} years`,
                        `Smokeless: ${totalData.medianAgeSmokeless} years`,
                        `Trend: Younger initiation = Higher lifetime addiction risk`,
                      ],
                    },
                    {
                      title: "💡 Why Early Initiation?",
                      points: [
                        "Peer influence & social pressure during adolescence",
                        "Brain still developing: More susceptible to addiction",
                        "Product availability & affordability in communities",
                        "Limited enforcement of age-of-sale laws",
                      ],
                    },
                    {
                      title: "🎯 Prevention Strategy",
                      points: [
                        "Target pre-teen education: Elementary school tobacco awareness",
                        "Strict age-of-sale enforcement: Regular vendor inspections",
                        "Family engagement: Parental education on peer pressure response",
                        "School & community programs: Delay initiation by 4-5 years = 70% less likely to become user",
                      ],
                    },
                  ]}
                >
                  <Line
                    data={ageInitiationData}
                    options={{
                      ...chartOptions,
                      scales: {
                        y: { min: 0, max: 16, title: { display: true, text: "Age (years)" } },
                      },
                    }}
                  />
                </FlippableChart>
              </div>
            </CardContent>
          </Card>

          {/* 8. E-Cigarette Stats */}
          <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
            <div className="absolute top-0 left-0 w-32 h-32 bg-teal-200 rounded-full -translate-y-16 -translate-x-16 opacity-10 group-hover:scale-110 transition-transform" />
            <CardHeader className="relative z-10 flex-shrink-0">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="text-2xl">💨</span>
                E-Cigarette & Future Risk
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm line-clamp-2">Modern tobacco trends</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
              <div className="w-full h-80 sm:h-96">
                <FlippableChart
                  title="E-Cigarette Trends & Susceptibility"
                  description="Emerging products and future smoking risk"
                  insights={[
                    {
                      title: "📊 E-Cigarette Metrics",
                      points: [
                        `Awareness: ${totalData.awarenessECigarette}%`,
                        `Ever used: ${totalData.everECigaretteUse}%`,
                        `Susceptible to future smoking: ${totalData.susceptibleToFutureSmoking}%`,
                        `Gap: High awareness but moderate usage = market still developing`,
                      ],
                    },
                    {
                      title: "💡 Emerging Threat",
                      points: [
                        "Marketing claims: 'Safer' but nicotine equally addictive",
                        "Gateway effect: E-cig users 4x more likely to start cigarettes",
                        "Youth appeal: Flavors, sleek design, social media trends",
                        "Long-term effects unknown: Insufficient evidence on lung health",
                      ],
                    },
                    {
                      title: "🎯 Regulatory Action",
                      points: [
                        "Restrict flavor sales: Focus on tobacco flavor only",
                        "Ban online sales & social media marketing",
                        "Enforce age-of-sale: Treat like cigarettes",
                        "Education: Demystify false health claims",
                        "Monitor: Track prevalence and disease outcomes",
                      ],
                    },
                  ]}
                >
                  <Bar
                    data={eCigaretteData}
                    options={{
                      ...chartOptions,
                      scales: {
                        y: { max: 60 },
                      },
                    }}
                  />
                </FlippableChart>
              </div>
            </CardContent>
          </Card>

          {/* 9. Comparison with India */}
          {selectedStateName !== "India" && (
            <Card className="lg:col-span-3 border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-200 rounded-full -translate-y-16 translate-x-16 opacity-10 group-hover:scale-110 transition-transform" />
              <CardHeader className="relative z-10 flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <span className="text-2xl">🇮🇳</span>
                  {selectedStateName} vs India Average
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm line-clamp-2">How this state compares to the national average</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
                <div className="w-full h-80 sm:h-96">
                  <FlippableChart
                    title={`${selectedStateName} vs National Average`}
                    description="Comparative analysis with India-wide statistics"
                    insights={[
                      {
                        title: "📊 State vs National Comparison",
                        points: [
                          `Current users - ${selectedStateName}: ${totalData.currentTobaccoUsers}% vs India: ${indiaData?.currentTobaccoUsers || 0}%`,
                          `Smokers - ${selectedStateName}: ${totalData.currentTobaccoSmokers}% vs India: ${indiaData?.currentTobaccoSmokers || 0}%`,
                          `Smokeless - ${selectedStateName}: ${totalData.currentSmokelessUsers}% vs India: ${indiaData?.currentSmokelessUsers || 0}%`,
                          `${totalData.currentTobaccoUsers > (indiaData?.currentTobaccoUsers || 0) ? "Above-average" : "Below-average"} prevalence compared to national average`,
                        ],
                      },
                      {
                        title: "💡 Performance Insights",
                        points: [
                          `Quit rate - ${selectedStateName}: ${totalData.quitSmokingLast12Months}% vs India: ${indiaData?.quitSmokingLast12Months || 0}%`,
                          `E-Cigarette awareness - ${selectedStateName}: ${totalData.awarenessECigarette}% vs India: ${indiaData?.awarenessECigarette || 0}%`,
                          `${totalData.quitSmokingLast12Months > (indiaData?.quitSmokingLast12Months || 0) ? "Better cessation support" : "Needs improved cessation programs"}`,
                        ],
                      },
                      {
                        title: "🎯 Targeted Improvement Plan",
                        points: [
                          `If above-average: Share best practices with other states; strengthen local programs`,
                          `If below-average: Learn from high-performing states; scale evidence-based interventions`,
                          "Invest in data collection: Monitor progress quarterly",
                          "Set state-specific targets: Align with WHO FCTC commitments",
                        ],
                      },
                    ]}
                  >
                    <Bar
                      data={comparisonWithIndiaData}
                      options={{
                        ...chartOptions,
                        indexAxis: "y" as const,
                        scales: {
                          x: { max: Math.max(totalData.currentTobaccoUsers, totalData.awarenessECigarette, 30) + 10 },
                        },
                      }}
                    />
                  </FlippableChart>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enhanced Key Insights */}
        <Card className="mt-10 border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-200 rounded-full -translate-y-20 -translate-x-20 opacity-20" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-200 rounded-full translate-y-20 translate-x-20 opacity-20" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span className="text-3xl">💡</span>
              Key Insights for {selectedStateName}
            </CardTitle>
            <CardDescription className="text-gray-700 text-base mt-2">
              Critical findings and recommendations based on current data
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {/* Insight 1: Prevalence Level */}
              <div className="group p-5 bg-white/80 backdrop-blur rounded-lg shadow-sm border-2 border-transparent hover:border-emerald-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">
                    {totalData.currentTobaccoUsers > 20 ? "⚠️" : totalData.currentTobaccoUsers > 10 ? "📊" : "✅"}
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">Prevalence Level</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {totalData.currentTobaccoUsers > 20
                    ? "🔴 HIGH - Urgent intervention needed. Tobacco usage exceeds 20%, indicating a critical public health situation."
                    : totalData.currentTobaccoUsers > 10
                      ? "🟡 MODERATE - Continued awareness campaigns and cessation support required to reduce prevalence."
                      : "🟢 GOOD - Below national average. Maintain prevention efforts and monitor trends."}
                </p>
              </div>

              {/* Insight 2: Primary Concern */}
              <div className="group p-5 bg-white/80 backdrop-blur rounded-lg shadow-sm border-2 border-transparent hover:border-teal-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">
                    {totalData.currentTobaccoSmokers > totalData.currentSmokelessUsers ? "🚬" : "🍃"}
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">Primary Concern</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {totalData.currentTobaccoSmokers > totalData.currentSmokelessUsers
                    ? `Smoking dominates at ${totalData.currentTobaccoSmokers}%. Focus interventions on reducing cigarette and bidi consumption through awareness campaigns.`
                    : `Smokeless tobacco is primary concern at ${totalData.currentSmokelessUsers}%. Promote alternatives and cessation programs targeting this specific form.`}
                </p>
              </div>

              {/* Insight 3: Quit Success */}
              <div className="group p-5 bg-white/80 backdrop-blur rounded-lg shadow-sm border-2 border-transparent hover:border-cyan-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">
                    {totalData.quitSmokingLast12Months > 15 ? "🎉" : "📈"}
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">Quit Success Rate</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {totalData.quitSmokingLast12Months > 15
                    ? `Encouraging progress with ${totalData.quitSmokingLast12Months}% quit rate. Scale up successful cessation support programs.`
                    : `Current quit rate: ${totalData.quitSmokingLast12Months}%. Expand cessation support centers and counseling services.`}
                </p>
              </div>

              {/* Insight 4: E-Cigarette Trend */}
              <div className="group p-5 bg-white/80 backdrop-blur rounded-lg shadow-sm border-2 border-transparent hover:border-purple-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">💨</div>
                  <h4 className="font-bold text-gray-900 text-lg">E-Cigarette Trend</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {totalData.awarenessECigarette > 50
                    ? `High awareness (${totalData.awarenessECigarette}%) of e-cigarettes. Implement strict regulations and prevention programs for this emerging threat.`
                    : `Growing awareness of e-cigarettes. Educate youth about risks associated with modern tobacco products.`}
                </p>
              </div>

              {/* Insight 5: Urban vs Rural */}
              <div className="group p-5 bg-white/80 backdrop-blur rounded-lg shadow-sm border-2 border-transparent hover:border-pink-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">🏙️</div>
                  <h4 className="font-bold text-gray-900 text-lg">Urban vs Rural</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {(urbanData?.currentTobaccoUsers || 0) > (ruralData?.currentTobaccoUsers || 0)
                    ? `Urban areas show higher usage (${urbanData?.currentTobaccoUsers}%). Tailor interventions for urban youth lifestyles.`
                    : `Rural areas show higher usage (${ruralData?.currentTobaccoUsers}%). Address agricultural and socio-economic factors.`}
                </p>
              </div>

              {/* Insight 6: Action Needed */}
              <div className="group p-5 bg-white/80 backdrop-blur rounded-lg shadow-sm border-2 border-transparent hover:border-red-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">🎯</div>
                  <h4 className="font-bold text-gray-900 text-lg">Priority Action</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedStateName === "India"
                    ? "Focus on states with highest prevalence. Strengthen NTEP programs and enforce tobacco control laws across all states."
                    : `Develop targeted cessation programs. Engage stakeholders and implement evidence-based interventions for maximum impact.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
