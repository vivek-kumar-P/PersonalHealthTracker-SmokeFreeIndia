"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Users, TrendingUp, Calendar, Target } from "lucide-react"
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
} from "chart.js"
import { Line, Bar, Pie, Doughnut, Radar } from "react-chartjs-2"

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
)

// Sample data from the CSV
const sampleJourneys = {
  "Person1's 30-Day Journey": [
    {
      date: "01-11-2025",
      cigarettes: 15,
      smokeless: 3,
      craving: 8,
      mood: "Stressed",
      notes: "Started quit attempt today",
      moneySaved: 0,
    },
    { date: "02-11-2025", cigarettes: 12, smokeless: 2, craving: 7, mood: "Anxious", notes: "", moneySaved: 30 },
    { date: "03-11-2025", cigarettes: 10, smokeless: 2, craving: 7, mood: "Irritable", notes: "", moneySaved: 65 },
    {
      date: "04-11-2025",
      cigarettes: 8,
      smokeless: 1,
      craving: 6,
      mood: "Okay",
      notes: "Used nicotine gum",
      moneySaved: 110,
    },
    { date: "05-11-2025", cigarettes: 9, smokeless: 1, craving: 6, mood: "Tired", notes: "", moneySaved: 150 },
    { date: "06-11-2025", cigarettes: 7, smokeless: 1, craving: 5, mood: "Better", notes: "", moneySaved: 200 },
    {
      date: "07-11-2025",
      cigarettes: 6,
      smokeless: 0,
      craving: 5,
      mood: "Good",
      notes: "First day no gutkha!",
      moneySaved: 255,
    },
    { date: "08-11-2025", cigarettes: 5, smokeless: 0, craving: 4, mood: "Calm", notes: "", moneySaved: 315 },
    { date: "09-11-2025", cigarettes: 4, smokeless: 0, craving: 4, mood: "Happy", notes: "", moneySaved: 380 },
    { date: "10-11-2025", cigarettes: 3, smokeless: 0, craving: 3, mood: "Motivated", notes: "", moneySaved: 450 },
    { date: "11-11-2025", cigarettes: 3, smokeless: 0, craving: 3, mood: "Stable", notes: "", moneySaved: 520 },
    { date: "12-11-2025", cigarettes: 2, smokeless: 0, craving: 2, mood: "Proud", notes: "", moneySaved: 595 },
    { date: "13-11-2025", cigarettes: 2, smokeless: 0, craving: 2, mood: "Relaxed", notes: "", moneySaved: 670 },
    {
      date: "14-11-2025",
      cigarettes: 1,
      smokeless: 0,
      craving: 2,
      mood: "Strong",
      notes: "Almost there",
      moneySaved: 750,
    },
    {
      date: "15-11-2025",
      cigarettes: 0,
      smokeless: 0,
      craving: 3,
      mood: "Amazing",
      notes: "First smoke-free day!",
      moneySaved: 835,
    },
    { date: "16-11-2025", cigarettes: 0, smokeless: 0, craving: 2, mood: "Peaceful", notes: "", moneySaved: 920 },
    { date: "17-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Energetic", notes: "", moneySaved: 1005 },
    {
      date: "18-11-2025",
      cigarettes: 0,
      smokeless: 0,
      craving: 1,
      mood: "Happy",
      notes: "Breathing feels better",
      moneySaved: 1090,
    },
    { date: "19-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Confident", notes: "", moneySaved: 1175 },
    {
      date: "20-11-2025",
      cigarettes: 0,
      smokeless: 0,
      craving: 1,
      mood: "Free",
      notes: "5 days smoke-free!",
      moneySaved: 1260,
    },
    { date: "21-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Grateful", notes: "", moneySaved: 1345 },
    { date: "22-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Healthy", notes: "", moneySaved: 1430 },
    {
      date: "23-11-2025",
      cigarettes: 0,
      smokeless: 0,
      craving: 1,
      mood: "Victorious",
      notes: "1 week completed",
      moneySaved: 1515,
    },
    { date: "24-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Normal", notes: "", moneySaved: 1600 },
    { date: "25-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Fresh", notes: "", moneySaved: 1685 },
    { date: "26-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Alive", notes: "", moneySaved: 1770 },
    { date: "27-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Proud", notes: "", moneySaved: 1855 },
    { date: "28-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Strong", notes: "", moneySaved: 1940 },
    {
      date: "29-11-2025",
      cigarettes: 0,
      smokeless: 0,
      craving: 1,
      mood: "Reborn",
      notes: "2 weeks smoke-free!",
      moneySaved: 2025,
    },
    {
      date: "30-11-2025",
      cigarettes: 0,
      smokeless: 0,
      craving: 1,
      mood: "Champion",
      notes: "₹2025 saved this month!",
      moneySaved: 2110,
    },
  ],
  "Person2's 30-Day Journey": [
    { date: "01-11-2025", cigarettes: 20, smokeless: 4, craving: 10, mood: "Stressed", notes: "Starting my quit journey today", moneySaved: 0 },
    { date: "02-11-2025", cigarettes: 18, smokeless: 3, craving: 9, mood: "Anxious", notes: "Tough day at work", moneySaved: 65 },
    { date: "03-11-2025", cigarettes: 16, smokeless: 3, craving: 9, mood: "Restless", notes: "", moneySaved: 145 },
    { date: "04-11-2025", cigarettes: 15, smokeless: 2, craving: 8, mood: "Determined", notes: "Feeling better", moneySaved: 235 },
    { date: "05-11-2025", cigarettes: 14, smokeless: 2, craving: 8, mood: "Hopeful", notes: "", moneySaved: 330 },
    { date: "06-11-2025", cigarettes: 12, smokeless: 1, craving: 7, mood: "Positive", notes: "First week almost done", moneySaved: 440 },
    { date: "07-11-2025", cigarettes: 10, smokeless: 1, craving: 7, mood: "Good", notes: "", moneySaved: 565 },
    { date: "08-11-2025", cigarettes: 9, smokeless: 0, craving: 6, mood: "Calm", notes: "No gutkha today!", moneySaved: 700 },
    { date: "09-11-2025", cigarettes: 8, smokeless: 0, craving: 6, mood: "Steady", notes: "", moneySaved: 840 },
    { date: "10-11-2025", cigarettes: 7, smokeless: 0, craving: 5, mood: "Motivated", notes: "", moneySaved: 985 },
    { date: "11-11-2025", cigarettes: 6, smokeless: 0, craving: 5, mood: "Happy", notes: "Feeling healthier", moneySaved: 1135 },
    { date: "12-11-2025", cigarettes: 5, smokeless: 0, craving: 4, mood: "Positive", notes: "", moneySaved: 1295 },
    { date: "13-11-2025", cigarettes: 4, smokeless: 0, craving: 4, mood: "Confident", notes: "", moneySaved: 1460 },
    { date: "14-11-2025", cigarettes: 3, smokeless: 0, craving: 3, mood: "Energized", notes: "Two weeks!", moneySaved: 1635 },
    { date: "15-11-2025", cigarettes: 2, smokeless: 0, craving: 3, mood: "Strong", notes: "", moneySaved: 1815 },
    { date: "16-11-2025", cigarettes: 2, smokeless: 0, craving: 2, mood: "Calm", notes: "", moneySaved: 1985 },
    { date: "17-11-2025", cigarettes: 1, smokeless: 0, craving: 2, mood: "Happy", notes: "", moneySaved: 2170 },
    { date: "18-11-2025", cigarettes: 1, smokeless: 0, craving: 2, mood: "Proud", notes: "Almost there", moneySaved: 2340 },
    { date: "19-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Amazing", notes: "First smoke-free day!", moneySaved: 2525 },
    { date: "20-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Free", notes: "", moneySaved: 2610 },
    { date: "21-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Healthy", notes: "", moneySaved: 2695 },
    { date: "22-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Victorious", notes: "", moneySaved: 2780 },
    { date: "23-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Alive", notes: "", moneySaved: 2865 },
    { date: "24-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Fresh", notes: "No cravings today!", moneySaved: 2950 },
    { date: "25-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Clear", notes: "", moneySaved: 3035 },
    { date: "26-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Strong", notes: "", moneySaved: 3120 },
    { date: "27-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Confident", notes: "", moneySaved: 3205 },
    { date: "28-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Happy", notes: "", moneySaved: 3290 },
    { date: "29-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Proud", notes: "Nearly one month!", moneySaved: 3375 },
    { date: "30-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Champion", notes: "30 days smoke-free! ₹3460 saved!", moneySaved: 3460 },
  ],
  "Person3's 30-Day Journey": [
    { date: "01-11-2025", cigarettes: 12, smokeless: 1, craving: 8, mood: "Anxious", notes: "Ready to quit", moneySaved: 0 },
    { date: "02-11-2025", cigarettes: 10, smokeless: 1, craving: 7, mood: "Determined", notes: "", moneySaved: 75 },
    { date: "03-11-2025", cigarettes: 9, smokeless: 0, craving: 7, mood: "Good", notes: "No gutkha from today", moneySaved: 155 },
    { date: "04-11-2025", cigarettes: 8, smokeless: 0, craving: 6, mood: "Positive", notes: "", moneySaved: 240 },
    { date: "05-11-2025", cigarettes: 7, smokeless: 0, craving: 6, mood: "Calm", notes: "", moneySaved: 330 },
    { date: "06-11-2025", cigarettes: 6, smokeless: 0, craving: 5, mood: "Happy", notes: "Feeling good", moneySaved: 425 },
    { date: "07-11-2025", cigarettes: 5, smokeless: 0, craving: 5, mood: "Motivated", notes: "One week done!", moneySaved: 525 },
    { date: "08-11-2025", cigarettes: 4, smokeless: 0, craving: 4, mood: "Energized", notes: "", moneySaved: 635 },
    { date: "09-11-2025", cigarettes: 3, smokeless: 0, craving: 4, mood: "Strong", notes: "", moneySaved: 750 },
    { date: "10-11-2025", cigarettes: 3, smokeless: 0, craving: 3, mood: "Confident", notes: "", moneySaved: 860 },
    { date: "11-11-2025", cigarettes: 2, smokeless: 0, craving: 3, mood: "Great", notes: "", moneySaved: 985 },
    { date: "12-11-2025", cigarettes: 2, smokeless: 0, craving: 2, mood: "Happy", notes: "Going strong", moneySaved: 1095 },
    { date: "13-11-2025", cigarettes: 1, smokeless: 0, craving: 2, mood: "Proud", notes: "", moneySaved: 1220 },
    { date: "14-11-2025", cigarettes: 1, smokeless: 0, craving: 2, mood: "Calm", notes: "Two weeks!", moneySaved: 1330 },
    { date: "15-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Amazing", notes: "First smoke-free day!", moneySaved: 1455 },
    { date: "16-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Fresh", notes: "", moneySaved: 1540 },
    { date: "17-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Clear", notes: "", moneySaved: 1625 },
    { date: "18-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Free", notes: "3 days smoke-free!", moneySaved: 1710 },
    { date: "19-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Healthy", notes: "No cravings!", moneySaved: 1795 },
    { date: "20-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Strong", notes: "", moneySaved: 1880 },
    { date: "21-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Victorious", notes: "One week smoke-free!", moneySaved: 1965 },
    { date: "22-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Happy", notes: "", moneySaved: 2050 },
    { date: "23-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Alive", notes: "", moneySaved: 2135 },
    { date: "24-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Proud", notes: "", moneySaved: 2220 },
    { date: "25-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Confident", notes: "", moneySaved: 2305 },
    { date: "26-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Energized", notes: "", moneySaved: 2390 },
    { date: "27-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Positive", notes: "", moneySaved: 2475 },
    { date: "28-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Fresh", notes: "Two weeks smoke-free!", moneySaved: 2560 },
    { date: "29-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Reborn", notes: "", moneySaved: 2645 },
    { date: "30-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Champion", notes: "₹2730 saved! 30 days complete!", moneySaved: 2730 },
  ],
  "Person4's 30-Day Journey": [
    { date: "01-11-2025", cigarettes: 25, smokeless: 5, craving: 10, mood: "Stressed", notes: "Heavy smoker, need to quit", moneySaved: 0 },
    { date: "02-11-2025", cigarettes: 22, smokeless: 4, craving: 10, mood: "Anxious", notes: "Struggling", moneySaved: 85 },
    { date: "03-11-2025", cigarettes: 20, smokeless: 4, craving: 9, mood: "Restless", notes: "", moneySaved: 185 },
    { date: "04-11-2025", cigarettes: 18, smokeless: 3, craving: 9, mood: "Tense", notes: "", moneySaved: 305 },
    { date: "05-11-2025", cigarettes: 17, smokeless: 3, craving: 8, mood: "Anxious", notes: "Tough week", moneySaved: 425 },
    { date: "06-11-2025", cigarettes: 15, smokeless: 2, craving: 8, mood: "Determined", notes: "", moneySaved: 565 },
    { date: "07-11-2025", cigarettes: 14, smokeless: 2, craving: 7, mood: "Hopeful", notes: "Getting better", moneySaved: 705 },
    { date: "08-11-2025", cigarettes: 12, smokeless: 1, craving: 7, mood: "Positive", notes: "", moneySaved: 865 },
    { date: "09-11-2025", cigarettes: 11, smokeless: 1, craving: 6, mood: "Calm", notes: "", moneySaved: 1025 },
    { date: "10-11-2025", cigarettes: 10, smokeless: 0, craving: 6, mood: "Good", notes: "No gutkha today", moneySaved: 1190 },
    { date: "11-11-2025", cigarettes: 9, smokeless: 0, craving: 5, mood: "Motivated", notes: "", moneySaved: 1355 },
    { date: "12-11-2025", cigarettes: 8, smokeless: 0, craving: 5, mood: "Happy", notes: "", moneySaved: 1525 },
    { date: "13-11-2025", cigarettes: 7, smokeless: 0, craving: 4, mood: "Strong", notes: "", moneySaved: 1700 },
    { date: "14-11-2025", cigarettes: 6, smokeless: 0, craving: 4, mood: "Confident", notes: "Two weeks done", moneySaved: 1880 },
    { date: "15-11-2025", cigarettes: 5, smokeless: 0, craving: 3, mood: "Proud", notes: "", moneySaved: 2070 },
    { date: "16-11-2025", cigarettes: 4, smokeless: 0, craving: 3, mood: "Energized", notes: "", moneySaved: 2265 },
    { date: "17-11-2025", cigarettes: 3, smokeless: 0, craving: 2, mood: "Great", notes: "Major progress", moneySaved: 2470 },
    { date: "18-11-2025", cigarettes: 2, smokeless: 0, craving: 2, mood: "Happy", notes: "", moneySaved: 2685 },
    { date: "19-11-2025", cigarettes: 2, smokeless: 0, craving: 2, mood: "Calm", notes: "", moneySaved: 2885 },
    { date: "20-11-2025", cigarettes: 1, smokeless: 0, craving: 1, mood: "Positive", notes: "", moneySaved: 3100 },
    { date: "21-11-2025", cigarettes: 1, smokeless: 0, craving: 1, mood: "Strong", notes: "Almost there", moneySaved: 3300 },
    { date: "22-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Amazing", notes: "First smoke-free day!", moneySaved: 3515 },
    { date: "23-11-2025", cigarettes: 0, smokeless: 0, craving: 1, mood: "Free", notes: "", moneySaved: 3600 },
    { date: "24-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Fresh", notes: "No cravings!", moneySaved: 3685 },
    { date: "25-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Healthy", notes: "", moneySaved: 3770 },
    { date: "26-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Alive", notes: "", moneySaved: 3855 },
    { date: "27-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Victorious", notes: "5 days smoke-free!", moneySaved: 3940 },
    { date: "28-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Proud", notes: "", moneySaved: 4025 },
    { date: "29-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Confident", notes: "One week smoke-free!", moneySaved: 4110 },
    { date: "30-11-2025", cigarettes: 0, smokeless: 0, craving: 0, mood: "Champion", notes: "30 days! ₹4195 saved from ₹25/day habit!", moneySaved: 4195 },
  ],
}

export function SampleJourneyPage() {
  const [selectedJourney, setSelectedJourney] = useState<keyof typeof sampleJourneys>("Person1's 30-Day Journey")
  const [searchTerm, setSearchTerm] = useState("")

  const data = sampleJourneys[selectedJourney]

  // Filter journeys based on search
  const journeyKeys = Object.keys(sampleJourneys) as Array<keyof typeof sampleJourneys>
  const filteredJourneys = journeyKeys.filter((journey) =>
    journey.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate statistics
  const totalDays = data.length
  const smokeFreedays = data.filter((d) => d.cigarettes === 0 && d.smokeless === 0).length
  const avgCigarettesPerDay = (data.reduce((sum, d) => sum + d.cigarettes, 0) / totalDays).toFixed(1)
  const totalMoneySaved = data[data.length - 1].moneySaved
  const avgCraving = (data.reduce((sum, d) => sum + d.craving, 0) / totalDays).toFixed(1)

  // Chart 1: Daily Cigarettes Line Chart
  const dailyCigarettesData = {
    labels: data.map((d) => d.date.substring(0, 5)),
    datasets: [
      {
        label: "Cigarettes",
        data: data.map((d) => d.cigarettes),
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Smokeless",
        data: data.map((d) => d.smokeless),
        borderColor: "rgba(249, 115, 22, 1)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Chart 2: Craving Level Line Chart
  const cravingData = {
    labels: data.map((d) => d.date.substring(0, 5)),
    datasets: [
      {
        label: "Craving Level (1-10)",
        data: data.map((d) => d.craving),
        borderColor: "rgba(168, 85, 247, 1)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Chart 3: Money Saved Progress
  const moneySavedData = {
    labels: data.map((d) => d.date.substring(0, 5)),
    datasets: [
      {
        label: "Money Saved (₹)",
        data: data.map((d) => d.moneySaved),
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Chart 4: Weekly Summary Bar Chart
  const weeklyData = [
    { week: "Week 1", cigarettes: data.slice(0, 7).reduce((sum, d) => sum + d.cigarettes, 0) },
    { week: "Week 2", cigarettes: data.slice(7, 14).reduce((sum, d) => sum + d.cigarettes, 0) },
    { week: "Week 3", cigarettes: data.slice(14, 21).reduce((sum, d) => sum + d.cigarettes, 0) },
    { week: "Week 4", cigarettes: data.slice(21, 28).reduce((sum, d) => sum + d.cigarettes, 0) },
    { week: "Week 5", cigarettes: data.slice(28).reduce((sum, d) => sum + d.cigarettes, 0) },
  ]

  const weeklyBarData = {
    labels: weeklyData.map((w) => w.week),
    datasets: [
      {
        label: "Cigarettes per Week",
        data: weeklyData.map((w) => w.cigarettes),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
      },
    ],
  }

  // Chart 5: Mood Distribution Pie Chart
  const moodCounts = data.reduce((acc: any, d) => {
    acc[d.mood] = (acc[d.mood] || 0) + 1
    return acc
  }, {})

  const moodPieData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        data: Object.values(moodCounts),
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(148, 163, 184, 0.8)",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  }

  // Chart 6: Progress Phases Doughnut
  const phases = {
    "Heavy Use (10+ cigs)": data.filter((d) => d.cigarettes >= 10).length,
    "Moderate (5-9 cigs)": data.filter((d) => d.cigarettes >= 5 && d.cigarettes < 10).length,
    "Light (1-4 cigs)": data.filter((d) => d.cigarettes >= 1 && d.cigarettes < 5).length,
    "Smoke-Free": smokeFreedays,
  }

  const phasesData = {
    labels: Object.keys(phases),
    datasets: [
      {
        data: Object.values(phases),
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: "#fff",
        borderWidth: 3,
      },
    ],
  }

  // Chart 7: Combined Health Metrics Radar
  const healthMetrics = {
    "Cigarettes Reduced": ((15 - Number.parseFloat(avgCigarettesPerDay)) / 15) * 100,
    "Craving Control": ((10 - Number.parseFloat(avgCraving)) / 10) * 100,
    "Money Saved": (totalMoneySaved / 2500) * 100,
    "Smoke-Free Days": (smokeFreedays / totalDays) * 100,
    Commitment: (totalDays / 30) * 100,
  }

  const radarData = {
    labels: Object.keys(healthMetrics),
    datasets: [
      {
        label: "Progress %",
        data: Object.values(healthMetrics),
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(16, 185, 129, 1)",
      },
    ],
  }

  // Chart 8: Daily Progress Bar
  const dailyProgressData = {
    labels: data.map((d) => d.date.substring(0, 5)),
    datasets: [
      {
        label: "Cigarettes",
        data: data.map((d) => d.cigarettes),
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        stack: "Stack 0",
      },
      {
        label: "Smokeless",
        data: data.map((d) => d.smokeless),
        backgroundColor: "rgba(249, 115, 22, 0.7)",
        stack: "Stack 0",
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Sample Quit Journey</h1>
          <p className="text-gray-600">See a real example of someone's 30-day journey to becoming smoke-free</p>
          <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-4">
            <p className="text-sm text-emerald-800">
              <strong>No account needed!</strong> Explore this sample journey to see how our platform helps track
              progress, visualize improvements, and celebrate milestones.
            </p>
          </div>
        </div>

        {/* Journey Selector & Quick Stats Dashboard */}
        <div className="mb-8 flex flex-col md:flex-row gap-6">
          {/* Quick Stats Dashboard - Takes 3/4 width */}
          <div className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Quick Journey Overview
                </CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {/* Mini Stat Card 1 */}
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <p className="text-xs font-medium text-blue-900">Available Journeys</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{Object.keys(sampleJourneys).length}</p>
                    <p className="text-xs text-blue-600 mt-1">Sample stories</p>
                  </div>

                  {/* Mini Stat Card 2 */}
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-emerald-600" />
                      <p className="text-xs font-medium text-emerald-900">Current Success</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-700">{smokeFreedays}</p>
                    <p className="text-xs text-emerald-600 mt-1">Smoke-free days</p>
                  </div>

                  {/* Mini Stat Card 3 */}
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <p className="text-xs font-medium text-orange-900">Avg Reduction</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">{avgCigarettesPerDay}</p>
                    <p className="text-xs text-orange-600 mt-1">Cigarettes/day</p>
                  </div>

                  {/* Mini Stat Card 4 */}
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <p className="text-xs font-medium text-purple-900">Journey Length</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">{totalDays}</p>
                    <p className="text-xs text-purple-600 mt-1">Days tracked</p>
                  </div>
                </div>

                {/* Quick Access Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">Quick Access:</p>
                  <div className="flex flex-wrap gap-2">
                    {journeyKeys.slice(0, 4).map((journey) => (
                      <Button
                        key={journey}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedJourney(journey)}
                        className={`text-xs ${
                          selectedJourney === journey
                            ? "bg-emerald-100 border-emerald-300 text-emerald-700 font-semibold"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {journey.split("'")[0]}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Journey Selector - Takes 1/4 width */}
          <div className="w-full md:w-1/4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Select Journey</CardTitle>
                <CardDescription className="text-xs">Choose a story</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search journeys..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 text-sm"
                  />
                </div>

                {/* Journey Dropdown */}
                <Select
                  value={selectedJourney}
                  onValueChange={(value) => setSelectedJourney(value as keyof typeof sampleJourneys)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select a journey" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Sample Journeys ({filteredJourneys.length})</span>
                      </div>
                    </div>
                    {filteredJourneys.length > 0 ? (
                      filteredJourneys.map((journey) => (
                        <SelectItem key={journey} value={journey}>
                          {journey}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-3 text-center text-sm text-gray-500">No journeys found</div>
                    )}
                  </SelectContent>
                </Select>

                {/* Journey Info */}
                <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">Currently viewing:</p>
                  <p className="text-emerald-600 font-semibold">{selectedJourney}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Days Tracked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalDays}</div>
              <p className="mt-1 text-sm text-gray-600">days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Smoke-Free Days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{smokeFreedays}</div>
              <p className="mt-1 text-sm text-gray-600">days clean</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Cigarettes/Day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{avgCigarettesPerDay}</div>
              <p className="mt-1 text-sm text-gray-600">per day</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Money Saved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">₹{totalMoneySaved}</div>
              <p className="mt-1 text-sm text-gray-600">total saved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Craving Level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{avgCraving}/10</div>
              <p className="mt-1 text-sm text-gray-600">intensity</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6">
          {/* Row 1 */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Consumption Trend</CardTitle>
                <CardDescription>Cigarettes and smokeless tobacco over 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line data={dailyCigarettesData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Craving Level Journey</CardTitle>
                <CardDescription>How cravings decreased over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line data={cravingData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2 */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Money Saved Progress</CardTitle>
                <CardDescription>Cumulative savings at ₹10 per cigarette</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line data={moneySavedData} options={{ ...chartOptions, scales: { y: { beginAtZero: true } } }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
                <CardDescription>Total cigarettes consumed each week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar data={weeklyBarData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 3 */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Mood Distribution</CardTitle>
                <CardDescription>Emotional states throughout journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Pie data={moodPieData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Phases</CardTitle>
                <CardDescription>Days spent in each usage level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Doughnut data={phasesData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Metrics</CardTitle>
                <CardDescription>Overall progress across key indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Radar data={radarData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 4 */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Stacked Progress</CardTitle>
              <CardDescription>Combined cigarette and smokeless tobacco usage per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar
                  data={dailyProgressData}
                  options={{
                    ...chartOptions,
                    scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="py-8 text-center">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Ready to Start Your Own Journey?</h2>
            <p className="mb-6 text-gray-600 max-w-2xl mx-auto">
              Track your progress with detailed charts, celebrate milestones, and join thousands of Indians on their
              path to a smoke-free life.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
              >
                Create Free Account
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md border border-emerald-500 px-6 py-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                View My Dashboard
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
