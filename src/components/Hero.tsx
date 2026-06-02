import React from 'react';
import { Github, Sparkles, Sliders, Server, Zap, Compass, Headphones } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onGetStarted: () => void;
  onOpenSetup: (msg: string) => void;
}

export default function Hero({ onGetStarted, onOpenSetup }: HeroProps) {
  return (
    <div className="bg-white" id="landing-hero-view">
      
      {/* Upper Navigation Row for Guest Landing */}
      <header className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
          </svg>
          <span className="text-lg font-bold tracking-tight text-gray-900 font-display">BrainMassage</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.open('https://github.com/aiwithenoch/brainmassage', '_blank')}
            className="text-xs text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            id="nav-github-link"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </button>
          <button
            onClick={onGetStarted}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-black hover:bg-gray-900 rounded-md transition-colors cursor-pointer"
            id="nav-get-started-btn"
          >
            Enter App
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 font-mono">
            <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
            <span>v1.2 Open-Source Released</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-2xl mx-auto leading-[1.12] font-display" id="hero-main-title">
            Deep neurological relaxation through calibrated spatial audio waves.
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed font-sans">
            Formulated to balance nervous system excitation. Stream precise binaural differentials, align your conscious frequency, or self-host your own streaming server in minutes.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGetStarted}
            id="hero-get-started-btn"
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-md shadow-sm transition-all focus:ring-1 focus:ring-black cursor-pointer text-center"
          >
            Get Started Streaming
          </button>
          <button
            onClick={() => window.open('https://github.com/aiwithenoch/brainmassage', '_blank')}
            id="hero-github-source-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:border-black hover:text-black rounded-md transition-all cursor-pointer"
          >
            <Github className="w-4 h-4" />
            <span>View Source on GitHub</span>
          </button>
        </div>

        {/* Done-For-You Setup Alert Banner */}
        <div className="max-w-3xl mx-auto pt-6" id="dfy-setup-alert-banner">
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Non-Technical? Done-For-You Managed Setup Service</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Want your own branded, private instance of this platform but don’t know how to write code? Our team will fully deploy, host, configure custom domains, and hook up payment pathways (Stripe/Mobile Money) for a one-time setup fee.
              </p>
            </div>
            <button
              onClick={() => onOpenSetup('I am eager to hear more about your Done-For-You (DFY) Managed Setup Service. Please reach out with pricing details!')}
              id="dfy-banner-trigger-btn"
              className="whitespace-nowrap px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-gray-800 rounded-md transition-colors cursor-pointer text-center"
            >
              Request Managed Setup
            </button>
          </div>
        </div>
      </section>

      {/* Value Grid: Minimalist 3-Column */}
      <section className="max-w-7xl mx-auto px-6 pb-24 border-t border-gray-100 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3" id="feature-card-1">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Compass className="w-4 h-4 text-gray-800" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Calibrated Spatial Waves</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Dynamically synthesizes binaural frequencies ranging from 1Hz delta to 40Hz gamma. Supports precise carrier offset selections to facilitate custom somatic resonance profiles.
            </p>
          </div>

          <div className="space-y-3" id="feature-card-2">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Server className="w-4 h-4 text-gray-800" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Apache 2.0 Self-Hosting</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Fully optimized for direct Lovable / Vercel static deployment and PostgreSQL Supabase backend integration. Customize parameters, add billing tables, and expand without limits.
            </p>
          </div>

          <div className="space-y-3" id="feature-card-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-gray-800" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Automated Audio Delivery</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Features an on-the-fly client-side spatial synthesiser operating on standard Web Audio guidelines, bypasses server bandwidth overhead and ensures flawless sound generation.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
