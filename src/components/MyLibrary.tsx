import React from 'react';
import { Bookmark, Headphones, ExternalLink, Play, Pause } from 'lucide-react';
import { Track } from '../types';

interface MyLibraryProps {
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
  onPauseTrack: () => void;
  activeTrack: Track | null;
  isPlaying: boolean;
  onNavigateToDiscover: () => void;
}

export default function MyLibrary({
  tracks,
  onPlayTrack,
  onPauseTrack,
  activeTrack,
  isPlaying,
  onNavigateToDiscover
}: MyLibraryProps) {
  // Free Solfeggio 528Hz and other non-locked tracks are immediately unlocked
  const unlockedFavorites = tracks.filter(t => !t.locked);

  return (
    <div className="space-y-6" id="my-library-view">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-display mb-1">Your Listening Lab</h2>
        <p className="text-sm text-gray-500">Your saved, custom-configured, and unlocked sound waves</p>
      </div>

      {unlockedFavorites.length > 0 ? (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600">Available Sound Systems</h3>
            <span className="text-xs font-mono text-gray-500">{unlockedFavorites.length} Offline Tracks</span>
          </div>

          <div className="divide-y divide-gray-100">
            {unlockedFavorites.map((track) => {
              const isActive = activeTrack?.id === track.id;
              const isCurrentPlaying = isActive && isPlaying;
              return (
                <div key={track.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                      <Headphones className="w-4 h-4 text-gray-600 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900">{track.title}</h4>
                      <p className="text-[11px] text-gray-400 font-mono">Offset Freq: {track.frequency} ({track.category})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-mono mr-4">{track.duration}</span>
                    <button
                      onClick={() => isCurrentPlaying ? onPauseTrack() : onPlayTrack(track)}
                      className={`p-2 rounded-md transition-all cursor-pointer ${
                        isCurrentPlaying
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-gray-50 text-gray-900 border border-gray-200 hover:border-black'
                      }`}
                    >
                      {isCurrentPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-white" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-gray-200 rounded-xl space-y-4 bg-white">
          <Bookmark className="w-8 h-8 text-gray-300 mx-auto" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-900">Your Listening Lab is Silent</p>
            <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed">
              Unlock spatial theta and delta waves by purchasing a streaming pass or setting up your own Supabase hosting node.
            </p>
          </div>
          <button
            onClick={onNavigateToDiscover}
            className="px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-gray-900 rounded-md transition-all cursor-pointer"
          >
            Explore Free Frequencies
          </button>
        </div>
      )}

      {/* Developers Section */}
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
        <h4 className="text-xs font-semibold tracking-wider uppercase text-gray-900">Developer Storage Binding Node:</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          The public client is currently storing offline play histories in <code className="font-mono bg-white p-1 rounded font-bold border border-gray-200">localStorage.active_deck_synced</code>. Upon linking Supabase Storage Buckets in your settings panel, user cache will dynamically upload to your custom object-storage endpoints transparently.
        </p>
      </div>

    </div>
  );
}
