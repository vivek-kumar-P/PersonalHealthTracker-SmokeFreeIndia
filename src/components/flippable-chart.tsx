"use client"

import type React from "react"
import { useState } from "react"
import { Info } from "lucide-react"

interface FlippableChartProps {
  children: React.ReactNode
  title: string
  description: string
  insights: {
    title: string
    points: string[]
  }[]
}

/**
 * FlippableChart Component
 * 
 * Wraps a chart in a 3D flippable card with perspective effect.
 * Front: Chart + hover info button
 * Back: Insights, reasons, and recommended actions in bullet points
 * Animation: Pure Tailwind CSS (rotateY 180deg)
 */
export function FlippableChart({ children, title, description, insights }: FlippableChartProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="h-full w-full flex flex-col" style={{ perspective: "1000px" }}>
      {/* Flippable Container - front/back flip without inverting content */}
      <div className="relative w-full h-full overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
        {/* FRONT SIDE - Chart */}
        <div
          className="absolute inset-0 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-4 sm:p-6 flex flex-col overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.5s ease-out",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Header - Fixed height to prevent chart overflow */}
          <div className="mb-3 sm:mb-4 flex items-start justify-between flex-shrink-0">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
            </div>
            {/* Info Button - Always visible on mobile, appears on hover on desktop */}
            <button
              onClick={() => setIsFlipped(true)}
              className="ml-2 p-1.5 sm:p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 transition-all duration-200 opacity-100 sm:opacity-0 sm:hover:opacity-100 sm:group-hover:opacity-100 sm:focus:opacity-100 flex-shrink-0"
              title="View insights"
              aria-label="View insights"
            >
              <Info size={18} />
            </button>
          </div>

          {/* Chart Container - Takes remaining space */}
          <div className="flex-1 w-full min-h-0 overflow-hidden">
            {/* Canvas wrapper - Responsive and contained */}
            <div className="w-full h-full">
              {children}
            </div>
          </div>
        </div>

        {/* BACK SIDE - Insights */}
        <div
          className="absolute inset-0 bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 flex flex-col overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)",
            transition: "transform 0.5s ease-out",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Back Header - Fixed height */}
          <div className="mb-3 sm:mb-4 flex items-center justify-between flex-shrink-0">
            <h3 className="text-base sm:text-lg font-semibold text-emerald-700 truncate">📌 Insights & Actions</h3>
            {/* Flip Back Button */}
            <button
              onClick={() => setIsFlipped(false)}
              className="p-1.5 sm:p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 transition-all duration-200 flex-shrink-0"
              title="Back to chart"
              aria-label="Back to chart"
            >
              <Info size={18} />
            </button>
          </div>

          {/* Insights Content - Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0">
            {insights.map((section, idx) => (
              <div
                key={idx}
                className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 flex-shrink-0"
              >
                <h4 className="font-semibold text-emerald-700 text-xs sm:text-sm mb-2">
                  {section.title}
                </h4>
                <ul className="space-y-1.5">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex gap-2 text-xs text-gray-700">
                      <span className="text-emerald-600 font-bold mt-0.5 flex-shrink-0">•</span>
                      <span className="break-words">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Back Footer - Call to Action */}
          <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600 flex-shrink-0">
            Click the info button to flip back to the chart
          </div>
        </div>
      </div>
    </div>
  )
}
