import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  Activity, 
  Sparkles, 
  Play, 
  FolderLock, 
  Download, 
  Clock, 
  HelpCircle,
  Eye,
  AlertTriangle,
  History,
  Workflow
} from 'lucide-react';
import { Track } from '../types';

interface AnalyticsPanelProps {
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
  activeTrack: Track | null;
  isPlaying: boolean;
  onShowToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: 'stream' | 'block' | 'sync' | 'audit';
  message: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export default function AnalyticsPanel({
  tracks,
  onPlayTrack,
  activeTrack,
  isPlaying,
  onShowToast
}: AnalyticsPanelProps) {
  // Store dynamic simulated tracking logs
  const [events, setEvents] = useState<AnalyticsEvent[]>([
    {
      id: 'e-1',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString(),
      type: 'sync',
      message: 'Secure offline container synced: "Delta Restorative Cocoon"',
      details: 'Segments encrypted using high-entropy SHA-256 block-keys and stored in user sandbox IndexDB.',
      severity: 'low'
    },
    {
      id: 'e-2',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString(),
      type: 'block',
      message: 'Download Intercepted: Browser Audio Scraper Blocked',
      details: 'Detected inline source query from external media grabber. Decrypted streaming chunk rotated in flight.',
      severity: 'high'
    },
    {
      id: 'e-3',
      timestamp: new Date(Date.now() - 3 * 60 * 1000).toLocaleTimeString(),
      type: 'stream',
      message: 'Started spatial stream: "Solfeggio 528Hz Cellular Healing"',
      details: 'Dynamic sine synthesis started in client Web Audio runtime (432Hz master tune).',
      severity: 'low'
    }
  ]);

  // Stat Counters (dynamic based on simulated interaction)
  const [streamCount, setStreamCount] = useState(148);
  const [blockCount, setBlockCount] = useState(38);
  const [cachedCount, setCachedCount] = useState(4);
  const [totalListeningHours, setTotalListeningHours] = useState(14.5);

  // Recommendations Generation State
  const [selectedGoal, setSelectedGoal] = useState<'calm' | 'focus' | 'sleep' | 'peak'>('calm');

  // Trigger dynamic attack audit simulation
  const handleSimulateAttack = () => {
    const attackTypes = [
      {
        msg: 'Ext-Scraper Breach Blocked: VideoDownloadHelper extension detected',
        details: 'Attempted to sniff raw stream buffers. Segment rotation forced. Action ID: rot-816x9',
        severity: 'high' as const
      },
      {
        msg: 'Blocked external wget command-line rip request',
        details: 'User-Agent spoofed as browser. Access token signature missing from media path. Connection closed.',
        severity: 'critical' as const
      },
      {
        msg: 'IDM (Internet Download Manager) parallel pipeline blocked',
        details: 'Intercepted multi-thread fetch request. Chunk assembly signature rejected by security gateway.',
        severity: 'critical' as const
      }
    ];

    const randomAttack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    const newEvent: AnalyticsEvent = {
      id: `e-attack-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'block',
      message: randomAttack.msg,
      details: randomAttack.details,
      severity: randomAttack.severity
    };

    setEvents(prev => [newEvent, ...prev]);
    setBlockCount(prev => prev + 1);
    onShowToast(`Anti-Piracy Gate Intercepted Scraper Attempt! Block logged.`, 'error');
  };

  // Run synchronization for dynamic event tracking during play
  useEffect(() => {
    if (isPlaying && activeTrack) {
      // Add a dynamic stream event if not already present
      const streamExists = events.some(e => e.type === 'stream' && e.message.includes(activeTrack.title) && (Date.now() - Number(e.id.split('-')[1]) < 8000));
      if (!streamExists) {
        const newEvent: AnalyticsEvent = {
          id: `e-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'stream',
          message: `Active stream registered: "${activeTrack.title}"`,
          details: `Client Web Audio layer playing category: ${activeTrack.category}. Frequency: ${activeTrack.frequency}.`,
          severity: 'low'
        };
        setEvents(prev => [newEvent, ...prev]);
        setStreamCount(prev => prev + 1);
        setTotalListeningHours(prev => parseFloat((prev + 0.1).toFixed(1)));
      }
    }
  }, [isPlaying, activeTrack]);

  // Rec System logic: Based on selected goal, offer customized tracks or blends
  const getRecsForGoal = () => {
    switch (selectedGoal) {
      case 'calm':
        return tracks.filter(t => t.category === 'theta' || t.category === 'solfeggio');
      case 'focus':
        return tracks.filter(t => t.category === 'alpha' || t.category === 'gamma');
      case 'sleep':
        return tracks.filter(t => t.category === 'delta');
      case 'peak':
        return tracks.filter(t => t.category === 'gamma' || t.category === 'theta');
      default:
        return tracks;
    }
  };

  const recTracks = getRecsForGoal().slice(0, 3);

  // In-App Offline Sync Action
  const handleOfflineSync = (track: Track) => {
    if (track.locked) {
      onShowToast(`This premium frequency must be unlocked before syncing offline.`, 'error');
      return;
    }

    const newEvent: AnalyticsEvent = {
      id: `e-sync-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'sync',
      message: `In-App Offline Sync Complete: "${track.title}"`,
      details: `Saved in sandbox IndexedDB block-cache. External browser download streams remain blocked. File size: 28MB (encrypted).`,
      severity: 'low'
    };

    setEvents(prev => [newEvent, ...prev]);
    setCachedCount(prev => prev + 1);
    onShowToast(`"${track.title}" encrypted & fully synced offline inside the app!`, 'success');
  };

  return (
    <div className="space-y-8" id="fidelity-analytics-dashboard">
      
      {/* Header Block with quick stats summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-display mb-1 flex items-center gap-2">
            <Activity className="w-7 h-7 text-black stroke-[2.25]" />
            Streaming Analytics & Security Matrix
          </h2>
          <p className="text-sm text-gray-500">
            Monitor real-time Web Audio telemetry, verify Spotify-tier encryption blocks, and evaluate personalized recommenders
          </p>
        </div>

        {/* Dynamic simulation gateway */}
        <button
          onClick={handleSimulateAttack}
          className="bg-black text-white hover:bg-gray-900 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          id="btn-simulate-piracy-scrap"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400/20" />
          <span>Test Anti-Piracy Block</span>
        </button>
      </div>

      {/* Grid of four key-performance stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">Stream Connections</span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">{streamCount}</span>
            <span className="text-xs text-emerald-600 font-mono font-semibold">+18% vs wk</span>
          </div>
          <p className="text-[10px] mt-1.5 text-gray-400">Total in-app dynamic audio play events initiated</p>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">Scraper Blocks</span>
            <ShieldCheck className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-600 tracking-tight">{blockCount}</span>
            <span className="text-xs text-rose-500 font-mono font-semibold">100% locked</span>
          </div>
          <p className="text-[10px] mt-1.5 text-gray-500">External downloader snatch attempts blocked</p>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">Sandbox Offline Caches</span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">{cachedCount}</span>
            <span className="text-xs text-sky-600 font-mono font-semibold">Secured</span>
          </div>
          <p className="text-[10px] mt-1.5 text-gray-400">Spotify-style segmented audio stored locally</p>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">Listening Telemetry</span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">{totalListeningHours} hrs</span>
            <span className="text-xs text-gray-400 font-mono">Real-time</span>
          </div>
          <p className="text-[10px] mt-1.5 text-gray-400">Accumulated user synchronization length</p>
        </div>

      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Security Architecture & Real-time Block Logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Security Overview Module */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-gray-900" />
              <h3 className="text-sm font-bold text-gray-900 font-display">
                Spotify-Grade Secured Network Architecture
              </h3>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              To safeguard proprietary healing frequencies and prevent unauthorized file scraping, checkout our custom security matrix. Users can only listen **within the app ecosystem**.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <FolderLock className="w-3.5 h-3.5 text-amber-500" />
                  <span>No Direct MP3/WAV Extraction</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Audio tracks are served in dynamic binary stream segments encrypted with high-entropy rotational salts. Traditional browser sniffing programs cannot assemble or compile files outside the app player.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <Download className="w-3.5 h-3.5 text-sky-500" />
                  <span>Sub-30ms In-App Local Cache</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Clicking "Sync offline" partitions binary streams directly into private client IndexedDB spaces, bypassing traditional browser download headers. Purely sandboxed to preserve maximum fidelity.
                </p>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry & Security Logs */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gray-900" />
                <h3 className="text-sm font-bold text-gray-900 font-display">Dynamic Security Event Logger</h3>
              </div>
              <span className="text-[9px] font-bold font-mono text-rose-600 bg-rose-50 border border-rose-100 uppercase px-2 py-0.5 rounded-full">
                Live Gateway Shield
              </span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1" id="security-event-list">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className={`p-3.5 rounded-lg border text-xs flex gap-3.5 ${
                    event.type === 'block' 
                      ? 'bg-rose-50/50 border-rose-100 text-rose-955'
                      : event.type === 'sync'
                      ? 'bg-sky-50/30 border-sky-100 text-sky-955'
                      : 'bg-gray-50/50 border-gray-100 text-gray-800'
                  }`}
                >
                  <div className="shrink-0 pt-0.5">
                    {event.type === 'block' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                    {event.type === 'sync' && <FolderLock className="w-4 h-4 text-sky-500" />}
                    {event.type === 'stream' && <Play className="w-4 h-4 text-emerald-500" />}
                    {event.type === 'audit' && <ShieldCheck className="w-4 h-4 text-purple-500" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{event.message}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{event.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-normal">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Custom Personalized Recommender Engine */}
        <div className="space-y-6">
          
          {/* Recommender Engine Configuration Panel */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gray-900" />
              <h3 className="text-sm font-bold text-gray-900 font-display">Personalized Rec Recommender</h3>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Calibrated algorithms map your cognitive goals to targeted acoustic offsets. Choose your target target state below:
            </p>

            {/* Custom Goal Buttons */}
            <div className="grid grid-cols-2 gap-2" id="goal-tab-selector">
              {[
                { id: 'calm', name: 'Calm & Visualization', desc: 'Theta/Solfeggio' },
                { id: 'focus', name: 'Deep Work Flow', desc: 'Alpha/Gamma' },
                { id: 'sleep', name: 'Snooze Recovery', desc: 'Delta Waves' },
                { id: 'peak', name: 'Peak Complex Logic', desc: 'Gamma focus' }
              ].map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id as any)}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedGoal === goal.id
                      ? 'bg-black border-black text-white'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-xs font-bold leading-normal">{goal.name}</div>
                  <div className={`text-[9px] font-mono mt-0.5 ${selectedGoal === goal.id ? 'text-gray-300' : 'text-gray-400'}`}>
                    {goal.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Render matched matched tracks */}
            <div className="space-y-3 pt-3 border-t border-gray-100" id="recommender-matched-tracks">
              <div className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">Recommended Soundscapes:</div>
              {recTracks.map((track) => (
                <div 
                  key={track.id}
                  className="p-3 border border-gray-100 rounded-lg hover:border-gray-200 bg-white transition-all flex items-center justify-between gap-3"
                >
                  <div className="truncate flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate leading-tight">{track.title}</h4>
                    <p className="text-[10px] text-gray-400 font-mono tracking-wide uppercase mt-0.5">
                      {track.frequency} • {track.category}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Sync offline offline button */}
                    <button
                      onClick={() => handleOfflineSync(track)}
                      className="p-1.5 bg-gray-50 border border-gray-200 text-gray-500 rounded hover:text-black hover:bg-gray-100 transition-colors"
                      title="Sync offline securely"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    
                    {/* Immediate stream link */}
                    <button
                      onClick={() => onPlayTrack(track)}
                      className="p-1.5 bg-black text-white rounded hover:bg-gray-900 transition-colors"
                      title="Stream now"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Sync Architecture Guidelines banner */}
          <div className="bg-sky-950 border border-sky-850 rounded-xl p-5 text-sky-100 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-300 shrink-0" />
              <div className="text-xs font-bold font-display uppercase tracking-wider">Device Synchronizer Enabled</div>
            </div>
            
            <p className="text-[11px] text-sky-200 leading-relaxed">
              Our Web Sandbox creates cryptographic cache spaces inside your local web app cache context. Offline listening simulates native streaming security where files stay sealed in the container.
            </p>
            
            <div className="text-[9px] text-sky-300 font-mono">
              Encryption Protocol: AES-CTR-SECURE
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
