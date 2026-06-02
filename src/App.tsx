import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Bookmark,
  CreditCard,
  Settings,
  Shield,
  LogOut,
  Play,
  Pause,
  Volume2,
  StopCircle,
  HelpCircle,
  Menu,
  X,
  Sparkles,
  Github,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track, User } from './types';
import { startSynth, stopSynth, setVolume } from './utils/audioSynth';

import Hero from './components/Hero';
import SetupModal from './components/SetupModal';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import MyLibrary from './components/MyLibrary';
import Pricing from './components/Pricing';
import SettingsMain from './components/SettingsMain';
import AdminPortal from './components/AdminPortal';
import AnalyticsPanel from './components/AnalyticsPanel';
import PromptPack from './components/PromptPack';
import MarketingPlaybook from './components/MarketingPlaybook';

export default function App() {
  // Global States
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [appPage, setAppPage] = useState<'discover' | 'library' | 'pricing' | 'settings' | 'admin' | 'analytics' | 'prompts' | 'marketing'>('discover');
  
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('brain_massage_token'));
  
  // Custom Toast Notification States
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  // Audio Play states
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackVolume, setPlaybackVolume] = useState(0.6);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Setup Modal triggers
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupModalMsg, setSetupModalMsg] = useState('');

  // Mobile Sidebar
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Initial Sync session
  useEffect(() => {
    if (token) {
      if (token !== 'temporary-form') {
        fetchUserSession();
      }
    } else {
      setView('landing');
    }
    fetchTracks();
  }, [token]);

  // Handle active playback timer counts
  useEffect(() => {
    if (isPlaying && activeTrack) {
      trackingIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          // parse mm:ss to seconds limit
          const [m, s] = activeTrack.duration.split(':').map(Number);
          const limit = m * 60 + s;
          if (prev >= limit) {
            handleStopTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    }

    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, [isPlaying, activeTrack]);

  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setUser(data);
          setView('app');
          return;
        }
      }
      
      // Fallback: Check if Token matches a simulated user in localStorage
      const simulatedUsersDb = localStorage.getItem('simulated_users_db');
      if (simulatedUsersDb) {
        try {
          const users = JSON.parse(simulatedUsersDb);
          const found = users.find((u: any) => u.id === token);
          if (found) {
            const { password, ...userSafe } = found;
            setUser(userSafe);
            setView('app');
            return;
          }
        } catch (e) {
          // ignore
        }
      }

      // Default Admin account fallback if matching standard token
      if (token === 'user-admin') {
        setUser({
          id: "user-admin",
          email: "admin@brainmassage.co",
          name: "Admin Host",
          role: "admin",
          subscriptionStatus: "monthly",
          subscriptionExpiresAt: "2030-12-31T23:59:59.000Z",
          createdAt: new Date().toISOString()
        });
        setView('app');
        return;
      }

      // Default Demo account fallback
      if (token === 'user-demo') {
        setUser({
          id: "user-demo",
          email: "demo@user.com",
          name: "Demo Listener",
          role: "user",
          subscriptionStatus: "none",
          subscriptionExpiresAt: null,
          createdAt: new Date().toISOString()
        });
        setView('app');
        return;
      }

      handleLogout();
    } catch (err) {
      console.warn("API offline or CORS enabled. Initiating local user recovery:", err);
      // Try resolving client-side simulated user
      const simulatedUsersDb = localStorage.getItem('simulated_users_db');
      if (simulatedUsersDb) {
        try {
          const users = JSON.parse(simulatedUsersDb);
          const found = users.find((u: any) => u.id === token);
          if (found) {
            const { password, ...userSafe } = found;
            setUser(userSafe);
            setView('app');
            return;
          }
        } catch (e) {}
      }
      if (token === 'user-admin') {
        setUser({
          id: "user-admin",
          email: "admin@brainmassage.co",
          name: "Admin Host",
          role: "admin",
          subscriptionStatus: "monthly",
          subscriptionExpiresAt: "2030-12-31T23:59:59.000Z",
          createdAt: new Date().toISOString()
        });
        setView('app');
        return;
      }
      handleLogout();
    }
  };

  const fetchTracks = async () => {
    const defaultTracks = [
      {
        id: "track-1",
        title: "Theta Deep Meditation",
        description: "Binaural carrier wave set at 200Hz combined with a 4Hz differential offset. Ideal for inducing deep alpha-theta brain states, expanding creative visualization, and easing somatic tension.",
        duration: "15:00",
        frequency: "4.0 Hz",
        category: "theta",
        premium: true,
        synthType: "binaural",
        binauralCarrier: 200,
        binauralBeat: 4
      },
      {
        id: "track-2",
        title: "Alpha Focus Highway",
        description: "Binaural carrier wave set at 220Hz combined with a 10Hz offset. Optimizes attention density, accelerates information assimilation, and maintains creative composure during deep-work intervals.",
        duration: "20:00",
        frequency: "10.0 Hz",
        category: "alpha",
        premium: true,
        synthType: "binaural",
        binauralCarrier: 220,
        binauralBeat: 10
      },
      {
        id: "track-3",
        title: "Delta Restorative Cocoon",
        description: "binaural wave designed around a ultra-low 2.5Hz difference. Recommended for active sleep support, rapid athletic physical recovery, and deep slow-wave neuromodulation.",
        duration: "30:00",
        frequency: "2.5 Hz",
        category: "delta",
        premium: true,
        synthType: "binaural",
        binauralCarrier: 150,
        binauralBeat: 2.5
      },
      {
        id: "track-4",
        title: "Solfeggio 528Hz Cellular Healing",
        description: "Direct resonance frequency tuned perfectly to 528Hz. Often called the Frequency of Transformation, highly recommended for emotional equilibrium, physical reset, and stress relief.",
        duration: "12:00",
        frequency: "528 Hz",
        category: "solfeggio",
        premium: false,
        synthType: "sine",
        synthHz: 528
      },
      {
        id: "track-5",
        title: "Gamma Cognitive Peak",
        description: "High-frequency binaural configuration designed at 40Hz with 250Hz carrier waves. Drives peak cognitive synthesis, enhanced focus resolution, and complex problem-solving acceleration.",
        duration: "10:00",
        frequency: "40.0 Hz",
        category: "gamma",
        premium: true,
        synthType: "binaural",
        binauralCarrier: 250,
        binauralBeat: 40
      }
    ];

    try {
      const headersConfig: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch('/api/tracks', { headers: headersConfig });
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setTracks(data.tracks);
          return;
        }
      }
      
      // Fallback: apply lock state rules locally based on current user session
      applyLocalTracksFallback(defaultTracks);
    } catch (err) {
      console.warn("Error retrieving database sound tracks. Applying local fallback...", err);
      applyLocalTracksFallback(defaultTracks);
    }
  };

  const applyLocalTracksFallback = (defaults: any[]) => {
    let hasActiveSubscription = false;
    if (user) {
      if (user.role === 'admin' || user.subscriptionStatus === 'monthly') {
        hasActiveSubscription = true;
      } else if (user.subscriptionStatus === 'day_pass' && user.subscriptionExpiresAt) {
        const expiresDate = new Date(user.subscriptionExpiresAt);
        if (expiresDate.getTime() > Date.now()) {
          hasActiveSubscription = true;
        }
      }
    }

    const mapped = defaults.map((track: any) => {
      const isLocked = track.premium && !hasActiveSubscription;
      return {
        ...track,
        locked: isLocked
      };
    });
    setTracks(mapped);
  };

  const handleAuthSuccess = (authenticatedUser: any, sessionToken: string) => {
    localStorage.setItem('brain_massage_token', sessionToken);
    setToken(sessionToken);
    setUser(authenticatedUser);
    setView('app');
    fetchTracks();
  };

  const handleLogout = () => {
    localStorage.removeItem('brain_massage_token');
    setToken(null);
    setUser(null);
    setView('landing');
    handleStopTrack();
  };

  const handlePlayTrack = (track: Track) => {
    // Restrict playback if gated
    if (track.locked) {
      showToast("This frequency is restricted in code. Please obtain a streaming pass first.", 'error');
      return;
    }

    // Set synthesiser
    setActiveTrack(track);
    setIsPlaying(true);
    setElapsedSeconds(0);

    // Call synthesizer code
    if (track.audioData) {
      startSynth('audio', undefined, undefined, undefined, track.audioData);
    } else if (track.synthType === 'binaural') {
      startSynth('binaural', track.binauralCarrier, track.binauralBeat);
    } else {
      startSynth(track.synthType || 'sine', track.binauralCarrier || 200, 4, track.synthHz);
    }
    setVolume(playbackVolume);
  };

  const handlePauseTrack = () => {
    setIsPlaying(false);
    stopSynth();
  };

  const handleStopTrack = () => {
    setIsPlaying(false);
    setActiveTrack(null);
    setElapsedSeconds(0);
    stopSynth();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volVal = parseFloat(e.target.value);
    setPlaybackVolume(volVal);
    setVolume(volVal);
  };

  // Helper formatting mm:ss
  const formatTime = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const openSubscriptionSuccess = (updatedUser: any) => {
    setUser(updatedUser);
    fetchTracks(); // refresh track locks state
  };

  const handleTriggerSetupModal = (customMessage: string) => {
    setSetupModalMsg(customMessage);
    setSetupModalOpen(true);
  };

  const isAppState = view === 'app' && !!user;

  return (
    <div className={`bg-white font-sans text-gray-900 selection:bg-gray-100 flex flex-col justify-between ${isAppState ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      
      {/* Design-aligned Managed Instance Advertisement Header */}
      <div className="bg-gray-900 text-white px-6 py-3 flex flex-col sm:flex-row justify-between items-center z-20 gap-3 text-center sm:text-left select-none shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium tracking-wide uppercase font-mono">Managed Service Available</span>
        </div>
        <p className="text-sm text-gray-300">Want your own dedicated instance? We will deploy and configure everything for you.</p>
        <button
          onClick={() => handleTriggerSetupModal('Hi! I would love to have my own dedicated instance of Brain Massage LMS deployed and configured. Please send details about the setup service.')}
          className="bg-white text-gray-900 px-4 py-1.5 rounded-md text-xs font-bold hover:bg-gray-100 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
        >
          Learn More
        </button>
      </div>

      {/* 1. Unauthenticated Guest Landing Hero UI */}
      {view === 'landing' && !token && (
        <div className="flex-1">
          <Hero
            onGetStarted={() => {
              if (token) {
                setView('app');
              } else {
                // Render authentication flow immediately
                setToken('temporary-form'); 
              }
            }}
            onOpenSetup={handleTriggerSetupModal}
          />
        </div>
      )}

      {/* 2. Authentication Block (If token initialized as placeholder or expired) */}
      {view === 'landing' && token === 'temporary-form' && (
        <div className="flex-1">
          {/* Header to bail back to landing */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white max-w-7xl mx-auto">
            <button
              onClick={() => setToken(null)}
              className="text-xs text-gray-500 hover:text-black font-semibold cursor-pointer"
            >
              ← Back to Main Page
            </button>
            <div className="text-xs text-gray-400 font-mono">Brain Massage Open-Source v1.2</div>
          </div>
          <Auth
            onAuthSuccess={handleAuthSuccess}
            openSetupModal={handleTriggerSetupModal}
            onShowToast={showToast}
          />
        </div>
      )}

      {/* 3. Authenticated Host shell panel */}
      {view === 'app' && user && (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
            
            {/* Sidebar Area */}
            <aside className="hidden md:flex flex-col justify-between w-64 bg-gray-50 border-r border-gray-200 p-6 shrink-0">
            <div className="space-y-8">
              
              {/* Brand identifier */}
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-gray-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                </svg>
                <span className="text-lg font-bold tracking-tight text-gray-900 font-display">BrainMassage</span>
              </div>

              {/* Navigation lists */}
              <nav className="space-y-1">
                <button
                  onClick={() => setAppPage('discover')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    appPage === 'discover'
                      ? 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                  id="side-btn-discover"
                >
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  <span>Discover Tracks</span>
                </button>

                <button
                  onClick={() => setAppPage('library')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    appPage === 'library'
                      ? 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                  id="side-btn-library"
                >
                  <Bookmark className="w-3.5 h-3.5 shrink-0" />
                  <span>My Listening Lab</span>
                </button>

                <button
                  onClick={() => setAppPage('analytics')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    appPage === 'analytics'
                      ? 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                  id="side-btn-analytics"
                >
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span>Fidelity & Analytics</span>
                </button>

                <button
                  onClick={() => setAppPage('prompts')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    appPage === 'prompts'
                      ? 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                  id="side-btn-prompts"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                  <span>Prompt Pack</span>
                </button>

                <button
                  onClick={() => setAppPage('marketing')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    appPage === 'marketing'
                      ? 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                  id="side-btn-marketing"
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0 text-sky-500" />
                  <span>Marketing Playbook</span>
                </button>

                <button
                  onClick={() => setAppPage('pricing')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    appPage === 'pricing'
                      ? 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                  id="side-btn-pricing"
                >
                  <CreditCard className="w-3.5 h-3.5 shrink-0" />
                  <span>Sub Passes ($)</span>
                </button>

                <button
                  onClick={() => setAppPage('settings')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    appPage === 'settings'
                      ? 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                  id="side-btn-settings"
                >
                  <Settings className="w-3.5 h-3.5 shrink-0" />
                  <span>Settings Matrix</span>
                </button>

                {user.role === 'admin' && (
                  <button
                    onClick={() => setAppPage('admin')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      appPage === 'admin'
                        ? 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                    id="side-btn-admin"
                  >
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span>Admin Control</span>
                  </button>
                )}
              </nav>

              {/* Open-Source code hosting alert */}
              <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-900 font-mono tracking-wider uppercase">
                  <Github className="w-3 h-3 text-black" />
                  <span>Self-Hosting Core</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-normal">
                  Want this exact app running dedicated on your domain with custom billing? Request our DFY Managed Setup today!
                </p>
                <button
                  onClick={() => handleTriggerSetupModal('Please let me know how to start self-hosting this app using the Managed Setup')}
                  className="text-[10px] text-black font-semibold hover:underline block leading-none"
                >
                  Request managed deployment
                </button>
              </div>

            </div>

            {/* Admin/User Profile bottom area */}
            <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-950 truncate max-w-[140px]" id="user-display-name">{user.name}</p>
                  <p className="text-[10px] text-gray-400 truncate max-w-[140px]">{user.email}</p>
                </div>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 border border-gray-200 rounded-full font-bold">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-2 mt-1 cursor-pointer"
                id="sidebar-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Mobile Top Navigation */}
          <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <div className="text-xs font-mono font-bold tracking-widest text-gray-900 py-1 px-2.5 bg-white border border-gray-200 rounded-md">
                ~ 4 Hz
              </div>
              <span className="text-xs font-bold text-gray-900 uppercase">BM Stream</span>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-1 mr-2 bg-white rounded border border-gray-200 text-gray-500 hover:text-black"
              aria-label="Toggle structural layout menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </header>

          {/* Mobile navigation side drawer */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-40 flex bg-white/95 backdrop-blur shadow-lg md:hidden">
              <div className="flex flex-col justify-between w-64 p-6 border-r border-gray-200 bg-gray-50">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold uppercase">Binaural Waves</span>
                    <button onClick={() => setMobileSidebarOpen(false)}>
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <nav className="flex flex-col space-y-1">
                    <button
                      onClick={() => { setAppPage('discover'); setMobileSidebarOpen(false); }}
                      className={`text-left px-3 py-2 text-xs font-semibold rounded ${appPage === 'discover' ? 'bg-black text-white' : 'text-gray-600'}`}
                    >
                      Discover Waves
                    </button>
                    <button
                      onClick={() => { setAppPage('library'); setMobileSidebarOpen(false); }}
                      className={`text-left px-3 py-2 text-xs font-semibold rounded ${appPage === 'library' ? 'bg-black text-white' : 'text-gray-600'}`}
                    >
                      Listening Lab
                    </button>
                    <button
                      onClick={() => { setAppPage('analytics'); setMobileSidebarOpen(false); }}
                      className={`text-left px-3 py-2 text-xs font-semibold rounded ${appPage === 'analytics' ? 'bg-black text-white' : 'text-gray-600'}`}
                    >
                      Fidelity & Analytics
                    </button>
                    <button
                      onClick={() => { setAppPage('prompts'); setMobileSidebarOpen(false); }}
                      className={`text-left px-3 py-2 text-xs font-semibold rounded ${appPage === 'prompts' ? 'bg-black text-white' : 'text-gray-600'}`}
                    >
                      Prompt Pack
                    </button>
                    <button
                      onClick={() => { setAppPage('marketing'); setMobileSidebarOpen(false); }}
                      className={`text-left px-3 py-2 text-xs font-semibold rounded ${appPage === 'marketing' ? 'bg-black text-white' : 'text-gray-600'}`}
                    >
                      Marketing Playbook
                    </button>
                    <button
                      onClick={() => { setAppPage('pricing'); setMobileSidebarOpen(false); }}
                      className={`text-left px-3 py-2 text-xs font-semibold rounded ${appPage === 'pricing' ? 'bg-black text-white' : 'text-gray-600'}`}
                    >
                      Sub Passes ($)
                    </button>
                    <button
                      onClick={() => { setAppPage('settings'); setMobileSidebarOpen(false); }}
                      className={`text-left px-3 py-2 text-xs font-semibold rounded ${appPage === 'settings' ? 'bg-black text-white' : 'text-gray-600'}`}
                    >
                      Settings Matrix
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => { setAppPage('admin'); setMobileSidebarOpen(false); }}
                        className={`text-left px-3 py-2 text-xs font-semibold rounded ${appPage === 'admin' ? 'bg-black text-white' : 'text-gray-600'}`}
                      >
                        Admin Portal
                      </button>
                    )}
                  </nav>
                </div>

                <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
                  <p className="text-xs font-bold text-gray-900">{user.name}</p>
                  <button onClick={handleLogout} className="text-xs text-red-600 font-semibold text-left">Sign Out</button>
                </div>
              </div>
            </div>
          )}

          {/* Main workspace area */}
          <main className="flex-1 p-4 sm:p-6 md:p-10 lg:p-12 overflow-y-auto bg-white min-h-0" id="main-workspace-content">
            {appPage === 'discover' && (
              <Dashboard
                tracks={tracks}
                activeTrack={activeTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onPauseTrack={handlePauseTrack}
                userSubscription={user.subscriptionStatus}
                onNavigateToPricing={() => setAppPage('pricing')}
                onTriggerSetupModal={handleTriggerSetupModal}
              />
            )}

            {appPage === 'library' && (
              <MyLibrary
                tracks={tracks}
                onPlayTrack={handlePlayTrack}
                onPauseTrack={handlePauseTrack}
                activeTrack={activeTrack}
                isPlaying={isPlaying}
                onNavigateToDiscover={() => setAppPage('discover')}
              />
            )}

            {appPage === 'analytics' && (
              <AnalyticsPanel
                tracks={tracks}
                onPlayTrack={handlePlayTrack}
                activeTrack={activeTrack}
                isPlaying={isPlaying}
                onShowToast={showToast}
              />
            )}

            {appPage === 'prompts' && (
              <PromptPack />
            )}

            {appPage === 'marketing' && (
              <MarketingPlaybook />
            )}

            {appPage === 'pricing' && (
              <Pricing
                userSubscription={user.subscriptionStatus}
                onPaymentSuccess={openSubscriptionSuccess}
                token={token}
                onShowToast={showToast}
              />
            )}

            {appPage === 'settings' && (
              <SettingsMain
                user={user}
                token={token}
                onLogout={handleLogout}
              />
            )}

            {appPage === 'admin' && user.role === 'admin' && (
              <AdminPortal
                token={token}
                onTrackCreated={fetchTracks}
              />
            )}
          </main>

        </div>

        {/* 4. Grounded Global Audio Player */}
        {activeTrack && (
          <footer
            className="h-20 border-t border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6 md:px-8 z-30 shrink-0 select-none w-full gap-4"
            id="persistent-global-player-bar"
          >
            {/* Active track name, offsets */}
            <div className="flex items-center gap-3 flex-1 md:flex-initial md:w-1/3 min-w-0">
              <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <div className="truncate min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate leading-tight tracking-tight font-display mb-0.5">
                  {activeTrack.title}
                </h4>
                <p className="text-[10px] text-gray-400 font-mono tracking-wider uppercase leading-none truncate">
                  {activeTrack.frequency} • {activeTrack.category}
                </p>
              </div>
            </div>

            {/* Player control timeline and toggles */}
            <div className="flex-initial md:flex-1 flex flex-col items-center gap-1.5 md:max-w-lg shrink-0">
              <div className="flex items-center justify-center gap-4 sm:gap-5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const idx = tracks.findIndex(t => t.id === activeTrack.id);
                    if (idx > 0) {
                      const prevTrack = tracks[idx - 1];
                      if (!prevTrack.locked) handlePlayTrack(prevTrack);
                    }
                  }}
                  className="text-gray-400 hover:text-black transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                  disabled={tracks.findIndex(t => t.id === activeTrack.id) <= 0}
                  aria-label="Previous track"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => isPlaying ? handlePauseTrack() : handlePlayTrack(activeTrack)}
                  className="w-10 h-10 bg-gray-900 hover:bg-black text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                  id="bottom-player-play-pause"
                  aria-label={isPlaying ? "Pause track" : "Play track"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStopTrack}
                  className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                  id="bottom-player-stop"
                  aria-label="Stop audio"
                >
                  <StopCircle className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const idx = tracks.findIndex(t => t.id === activeTrack.id);
                    if (idx !== -1 && idx < tracks.length - 1) {
                      const nextTrack = tracks[idx + 1];
                      if (!nextTrack.locked) handlePlayTrack(nextTrack);
                    }
                  }}
                  className="text-gray-400 hover:text-black transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                  disabled={tracks.findIndex(t => t.id === activeTrack.id) === -1 || tracks.findIndex(t => t.id === activeTrack.id) >= tracks.length - 1}
                  aria-label="Next track"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar (Visible only on medium/large screens) */}
              <div className="hidden md:flex w-full items-center gap-3">
                <span className="text-[10px] text-gray-400 font-mono select-none w-8 text-right">
                  {formatTime(elapsedSeconds)}
                </span>
                
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden relative group/timeline cursor-pointer">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gray-900 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(() => {
                        const [m, s] = activeTrack.duration.split(':').map(Number);
                        const total = (m * 60) + s || 1;
                        return Math.min(100, (elapsedSeconds / total) * 100);
                      })()}%` 
                    }}
                  />
                </div>

                <span className="text-[10px] text-gray-400 font-mono select-none w-8 text-left">
                  {activeTrack.duration}
                </span>
              </div>
            </div>

            {/* Volume sliders control (Visible only on medium/large screens) */}
            <div className="hidden md:flex items-center gap-2 justify-end w-1/3 select-none">
              <Volume2 className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={playbackVolume}
                onChange={handleVolumeChange}
                className="w-20 sm:w-24 accent-gray-900 bg-gray-100 cursor-pointer h-1 rounded-lg shrink-0 hover:accent-black"
                id="bottom-player-volume-slider"
              />
              <span className="text-[10px] font-mono text-gray-400 shrink-0 min-w-[28px] text-right">
                {Math.round(playbackVolume * 100)}%
              </span>
            </div>
          </footer>
        )}

      </div>
    )}

      {/* Done-For-You Managed Setup Modal Layer */}
      <SetupModal
        isOpen={setupModalOpen}
        onClose={() => {
          setSetupModalOpen(false);
          setSetupModalMsg('');
        }}
        defaultMessage={setupModalMsg}
      />

      {/* Dynamic Floating Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border text-xs font-semibold max-w-sm ${
              toast.type === 'success'
                ? 'bg-emerald-950 border-emerald-800 text-emerald-100'
                : toast.type === 'error'
                ? 'bg-rose-950 border-rose-800 text-rose-100'
                : 'bg-gray-950 border-gray-800 text-gray-100'
            }`}
            id="toast-notification-banner"
          >
            {toast.type === 'success' && <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />}
            {toast.type === 'error' && <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />}
            {toast.type === 'info' && <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
