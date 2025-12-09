"use client"

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export function HomePage() {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20 md:py-32">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-emerald-400 blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-teal-400 blur-3xl animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-center md:text-left">
              <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 font-medium text-sm animate-bounce">
                🇮🇳 India's #1 Quit Smoking Platform
              </div>
              <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-7xl text-balance leading-tight">
                Stop Cigarettes <span className="text-emerald-600">Today</span>
              </h1>
              <p className="mb-8 text-lg text-gray-600 md:text-xl leading-relaxed max-w-xl">
                Join thousands of Indians on their journey to a smoke-free life. Track your progress, understand the
                impact, and reclaim your health with data-driven insights.
              </p>
              <div className="flex flex-col items-center md:items-start justify-center gap-4 sm:flex-row">
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="bg-emerald-500 hover:bg-emerald-600 hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
                  >
                    Start Your Journey →
                  </Button>
                </Link>
                <Link to="/sample-journey">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:scale-105 transition-transform bg-transparent"
                  >
                    View Sample Journey
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - Hero image with interactive elements */}
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-transform group-hover:scale-105 duration-500">
                <img src="/healthy-person-breathing-fresh-air-outdoors-nature.jpg" alt="Healthy lifestyle" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Floating stat cards */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl transform transition-transform hover:scale-110 hover:-translate-y-2 duration-300 cursor-pointer">
                <div className="text-3xl font-bold text-emerald-600">1M+</div>
                <div className="text-sm text-gray-600">Lives Changed</div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl transform transition-transform hover:scale-110 hover:-translate-y-2 duration-300 cursor-pointer">
                <div className="text-3xl font-bold text-emerald-600">85%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Showcase Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">Your Journey to Freedom</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Watch how your body transforms when you quit smoking
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { time: "20 Minutes", effect: "Heart rate drops to normal", icon: "❤️", color: "rose" },
              { time: "24 Hours", effect: "Carbon monoxide levels normalize", icon: "🫁", color: "blue" },
              { time: "2 Weeks", effect: "Circulation & lung function improve", icon: "💪", color: "amber" },
              { time: "1 Year", effect: "Heart disease risk cut in half", icon: "🎉", color: "emerald" },
            ].map((milestone, idx) => (
              <Card
                key={idx}
                className="p-6 text-center cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:bg-gradient-to-br hover:from-white hover:to-emerald-50 group"
                onMouseEnter={() => setHoveredStat(milestone.time)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div
                  className={`text-5xl mb-4 transform transition-transform duration-300 ${hoveredStat === milestone.time ? "scale-125 rotate-12" : ""}`}
                >
                  {milestone.icon}
                </div>
                <div className={`text-2xl font-bold mb-2 text-${milestone.color}-600`}>{milestone.time}</div>
                <p className="text-gray-600 leading-relaxed">{milestone.effect}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Images */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900 text-balance">Why Quit Smoking?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="p-0 overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/money-savings-piggy-bank-financial-freedom.jpg"
                  alt="Save money"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-semibold text-gray-900">Save Money</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  At ₹10 per cigarette, quitting 20/day saves you{" "}
                  <span className="font-bold text-emerald-600">₹73,000 annually</span>.
                </p>
                <div className="text-sm text-emerald-600 font-medium group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                  Calculate your savings →
                </div>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/healthy-heart-cardiovascular-health-wellness.jpg"
                  alt="Live longer"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-semibold text-gray-900">Live Longer</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Each cigarette reduces your life by <span className="font-bold text-rose-600">11 minutes</span>.
                  Quitting adds years back.
                </p>
                <div className="text-sm text-emerald-600 font-medium group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                  See health benefits →
                </div>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/person-exercising-healthy-lungs-breathing-wellness.jpg"
                  alt="Better health"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-semibold text-gray-900">Better Health</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Reduce risk of <span className="font-bold text-blue-600">cancer, heart disease</span>, and respiratory
                  problems significantly.
                </p>
                <div className="text-sm text-emerald-600 font-medium group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                  View recovery timeline →
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">Real Stories, Real Results</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Hear from people who successfully quit smoking with SmokeFree India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                days: 365,
                saved: "₹73,000",
                city: "Mumbai",
                image: "indian man smiling happy success",
              },
              {
                name: "Priya Sharma",
                days: 180,
                saved: "₹36,000",
                city: "Delhi",
                image: "indian woman smiling wellness",
              },
              {
                name: "Amit Patel",
                days: 90,
                saved: "₹18,000",
                city: "Bangalore",
                image: "young indian man healthy lifestyle",
              },
            ].map((person, idx) => (
              <Card
                key={idx}
                className="p-6 text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-emerald-50 group"
              >
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-emerald-500 group-hover:border-emerald-600 transition-colors">
                    <img
                      src={`/.jpg?height=200&width=200&query=${person.image}`}
                      alt={person.name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm shadow-lg">
                    ✓
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{person.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{person.city}</p>
                <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">{person.days}</div>
                  <div className="text-sm text-gray-600">Days Smoke-Free</div>
                </div>
                <div className="text-lg font-semibold text-emerald-600">{person.saved} Saved</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-emerald-600 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/nature-landscape-fresh-air-freedom.jpg" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="mb-4 text-4xl font-bold text-white text-balance">Ready to Take Control?</h2>
          <p className="mb-8 text-xl text-emerald-50 max-w-2xl mx-auto leading-relaxed">
            Start tracking your progress today and join the smoke-free movement. Your journey to better health starts
            now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-gray-100 hover:scale-105 transition-transform shadow-xl"
              >
                Get Started Free →
              </Button>
            </Link>
            <Link to="/states">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 hover:scale-105 transition-transform bg-transparent"
              >
                Explore Data Insights
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
