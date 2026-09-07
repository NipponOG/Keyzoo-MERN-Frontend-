import React from 'react'

const GlassCard = ({ title, value, color }) => {
    return (
        <div class="bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-sm">
            <div class="text-white flex flex-col items-center">
                {/* <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg mb-4 flex items-center justify-center">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div> */}
                <h3 class="text-xl font-semibold mb-2">{title}</h3>
                <p class={`text-xl font-bold ${color}`}>{value}</p>
                {/* <button class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm transition-colors">
                    Learn More
                </button> */}
            </div>
        </div>
    )
}

export default GlassCard