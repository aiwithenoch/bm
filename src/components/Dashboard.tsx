import React, { useState } from 'react';
import { Play, Pause, Lock, ShieldAlert, Sparkles, Volume2, Search, Filter, X } from 'lucide-react';
import { Track } from '../types';

interface DashboardProps {
  tracks: Track[];
  activeTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onPauseTrack: () => void;
  userSubscription: 'none' | 'day_pass' | 'monthly';
  onNavigateToPricing: () => void;
  onTriggerSetupModal: (msg: string) => void;
}

export default function Dashboard({
  tracks,
  activeTrack,
  isPlaying,
  onPlayTrack,
  onPauseTrack,
  userSubscription,
  onNavigateToPricing,
  onTriggerSetupModal
}: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lockPromptTrack, setLockPromptTrack] = useState<Track | null>(null);

  // Filter Tracks
  const filteredTracks = tracks.filter((track) => {
    const matchesCategory = selectedCategory === 'all' || track.category === selectedCategory;
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.frequency.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTrackClick = (track: Track) => {
    if (track.locked) {
      setLockPromptTrack(track);
    } else {
      if (activeTrack?.id === track.id && isPlaying) {
        onPauseTrack();
      } else {
        onPlayTrack(track);
      }
    }
  };

  const categories = [
    { id: 'all', name: 'All Waves' },
    { id: 'theta', name: 'Theta (4-8 Hz)' },
    { id: 'alpha', name: 'Alpha (8-12 Hz)' },
    { id: 'delta', name: 'Delta (0.5-4 Hz)' },
    { id: 'solfeggio', name: 'Solfeggio (528 Hz)' },
    { id: 'gamma', name: 'Gamma (30-100 Hz)' }
  ];

  return (
    <div className="space-y-8" id="discover-dashboard-view">
      
      {/* Upper Dashboard Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-display">Discover Frequencies</h2>
            {userSubscription === 'monthly' && (
              <span className="text-[10px] font-semibold bg-emerald-50/70 text-emerald-850 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                ● Premium Active
              </span>
            )}
            {userSubscription === 'day_pass' && (
              <span className="text-[10px] font-semibold bg-sky-50 text-sky-850 border border-sky-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                ● Day Pass Active
              </span>
            )}
            {userSubscription === 'none' && (
              <span className="text-[10px] font-semibold bg-amber-50 text-amber-850 border border-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                ● Free Tier
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">Pure spatial audio for neuro-synchronization and relaxation.</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search wave frequency or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 focus:border-black focus:outline-none rounded-md transition-colors shadow-sm"
            id="dashboard-search-input"
          />
        </div>
      </div>

      {/* Category selector row */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4" id="category-selector-row">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-black text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Acoustic Recommendations & Anti-Ripping Shield Prompt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/70 border border-gray-100 rounded-2xl p-5" id="rec-shield-quickinfo">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 font-display">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500/10" />
            <span>Curated Recommendation Engine Live</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Need customized acoustic blends tailored to your goals? Switch to our new <span className="font-semibold text-black">Fidelity & Analytics</span> panel to generate customized daily listening tracks!
          </p>
        </div>

        <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-gray-200/60 pt-3 md:pt-0 md:pl-5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 font-display">
            <Volume2 className="w-4 h-4 text-black" />
            <span>Spotify-Style Streaming Architecture</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            All waves operate under encrypted segmented streaming guidelines. Direct media grabbers are permanently blocked from harvesting files outside the sandbox environment.
          </p>
        </div>
      </div>

      {/* Grid of Audio Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="audio-tracks-grid">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track) => {
            const isCurrentPlaying = activeTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                className={`group border border-gray-200 rounded-xl p-6 transition-colors bg-white relative flex flex-col justify-between h-72 hover:border-gray-400 ${
                  track.locked ? 'opacity-90' : ''
                }`}
                id={`track-card-${track.id}`}
              >
                {/* Header Row */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-semibold tracking-widest text-gray-400 uppercase bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">
                      {track.frequency}
                    </span>
                    <div className="flex items-center gap-1">
                      {track.premium && (
                        <span className="flex items-center gap-1 text-[10px] bg-amber-50/70 text-amber-900 border border-amber-100 px-2 py-0.5 rounded font-medium">
                          <Lock className="w-2.5 h-2.5" /> Premium
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400 font-mono">{track.duration}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-gray-900 font-display group-hover:text-black transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 lowercase italic bg-gray-50/50 p-1 px-2 rounded">
                    Freq_Category / {track.category}
                  </span>

                  <button
                    onClick={() => handleTrackClick(track)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                      isCurrentPlaying
                        ? 'bg-black text-white hover:bg-gray-800'
                        : track.locked
                        ? 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-900 hover:bg-black hover:text-white border border-gray-200 hover:border-black'
                    }`}
                    id={`play-btn-${track.id}`}
                  >
                    {track.locked ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </>
                    ) : isCurrentPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-white" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Stream</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center border border-dashed border-gray-200 rounded-xl space-y-3">
            <Volume2 className="w-8 h-8 text-gray-300 mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-900">No calibrated soundscapes found</p>
              <p className="text-[11px] text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          </div>
        )}
      </div>

       {/* Dynamic Pop-up Modal when user attempts to interact with locked tracks */}
      {lockPromptTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" id="lock-prompt-modal">
          <div className="relative w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-xl p-6 space-y-6">
            <button
              onClick={() => setLockPromptTrack(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
              aria-label="Close premium modal"
              id="close-premium-modal-btn"
            >
              <X className="w-4.5 h-4.5" />
            </button>
            <div className="flex items-start gap-4 pr-6">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-gray-900" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-900">Playback Gated by License Key</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  The track <strong className="text-gray-900 font-medium font-display">"{lockPromptTrack.title}"</strong> is a premium binaural frequency reserved for subscribers or developers who deploy their own instances.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-100">
              <p className="text-xs text-gray-600 leading-relaxed font-semibold">Your Options For Infinite Access:</p>
              <ul className="text-[11px] text-gray-500 space-y-1.5 list-disc list-inside">
                <li>Subscribe to the hosted platform stream (24-Hour Pass or Monthly Membership)</li>
                <li>Self-Host this entire open-source repository on your own Supabase instance.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  setLockPromptTrack(null);
                  onNavigateToPricing();
                }}
                className="w-full px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-gray-900 rounded-md text-center transition-colors cursor-pointer"
                id="lock-prompt-subscribe-btn"
              >
                View Pricing Passes ($2+)
              </button>
              <button
                onClick={() => {
                  setLockPromptTrack(null);
                  onTriggerSetupModal(`Requesting Managed Instance configuration to self-host track ${lockPromptTrack.title}`);
                }}
                className="w-full px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:border-black hover:text-black rounded-md text-center transition-colors cursor-pointer"
                id="lock-prompt-managed-btn"
              >
                Request Custom Setup Fee
              </button>
            </div>

            <button
              onClick={() => setLockPromptTrack(null)}
              className="text-center w-full block text-[10px] text-gray-400 hover:text-gray-600 underline font-medium"
            >
              Continue testing other free tracks
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
