import React from 'react'

export default function GloveVisual() {
  return (
    <div className="relative w-full aspect-4/3 max-w-lg mx-auto bg-navy-dark rounded-3xl border border-navy-light/80 p-6 overflow-hidden shadow-2xl flex flex-col justify-between">
      {/* Background Subtle Sensor Grid */}
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#2563EB_1px,transparent_1px),linear-gradient(to_bottom,#2563EB_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Top Header Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase font-semibold">
            ESP32-S3 Hub · Telemetry Live
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-light px-2 py-0.5 rounded bg-navy-light/60 border border-slate-light/20">
          22-CH SENSOR MESH
        </span>
      </div>

      {/* Main Glove Hardware Schematic Graphic */}
      <div className="relative z-10 my-auto flex items-center justify-center">
        <svg
          viewBox="0 0 320 220"
          className="w-full max-w-[280px] sm:max-w-[320px] h-auto drop-shadow-[0_10px_20px_rgba(37,99,235,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glove Base Outline */}
          <path
            d="M90 200 C80 180, 75 140, 80 110 C82 95, 92 80, 102 75 C108 72, 114 78, 115 88 L122 130 C125 100, 130 50, 140 45 C148 40, 155 48, 153 62 L150 125 C155 90, 165 40, 175 35 C185 30, 192 38, 190 55 L182 128 C188 105, 200 65, 210 60 C220 55, 226 65, 222 80 L208 140 C215 120, 230 95, 240 92 C248 90, 252 100, 248 112 C238 145, 225 180, 210 200 Z"
            fill="#102A43"
            stroke="#243B53"
            strokeWidth="2"
          />

          {/* 22-Channel Sensor traces on fingers */}
          {/* Thumb Sensors */}
          <path d="M96 140 L108 85" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
          <circle cx="108" cy="85" r="3.5" fill="#60A5FA" />
          
          {/* Index Sensors */}
          <path d="M135 150 L146 55" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 2" />
          <circle cx="146" cy="55" r="3.5" fill="#60A5FA" />
          <circle cx="141" cy="95" r="2.5" fill="#93C5FD" />

          {/* Middle Sensors */}
          <path d="M168 150 L181 45" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 2" />
          <circle cx="181" cy="45" r="3.5" fill="#60A5FA" />
          <circle cx="174" cy="90" r="2.5" fill="#93C5FD" />

          {/* Ring Sensors */}
          <path d="M195 155 L215 70" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 2" />
          <circle cx="215" cy="70" r="3.5" fill="#60A5FA" />

          {/* Pinky Sensors */}
          <path d="M218 165 L242 100" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
          <circle cx="242" cy="100" r="3.5" fill="#60A5FA" />

          {/* Central IMU / Processing Node (ESP32 Hub on wrist) */}
          <rect x="130" y="165" width="45" height="35" rx="6" fill="#0B1D30" stroke="#3B82F6" strokeWidth="2" />
          <text x="152" y="186" textAnchor="middle" fill="#60A5FA" fontSize="8" fontFamily="monospace" fontWeight="bold">
            ESP32-S3
          </text>
          
          {/* Bus Wiring to Microcontroller */}
          <path d="M100 170 Q120 180 130 180" stroke="#3B82F6" strokeWidth="1.5" />
          <path d="M205 175 Q185 185 175 185" stroke="#3B82F6" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Floating Conversion Card: Gesture -> Text -> Audio */}
      <div className="relative z-10 bg-navy/90 backdrop-blur-md rounded-xl border border-navy-light p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-xs font-mono font-bold">
            60c
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-light tracking-wider">Classified Gesture</div>
            <div className="text-xs font-semibold text-white">"Thank You" (98.4%)</div>
          </div>
        </div>

        {/* Live Audio Waveform Simulation */}
        <div className="flex items-center gap-1 pl-4 border-l border-navy-light">
          <span className="w-1 h-3 rounded-full bg-primary animate-pulse" />
          <span className="w-1 h-5 rounded-full bg-blue-400 animate-pulse delay-75" />
          <span className="w-1 h-6 rounded-full bg-primary animate-pulse delay-150" />
          <span className="w-1 h-4 rounded-full bg-blue-400 animate-pulse delay-100" />
          <span className="w-1 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 ml-1">eSpeak</span>
        </div>
      </div>
    </div>
  )
}
