import React, { useState } from 'react';
import { User, Key, Database, Globe, HelpCircle, HardDrive } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsMainProps {
  user: UserType | null;
  token: string | null;
  onLogout: () => void;
}

export default function SettingsMain({ user, token, onLogout }: SettingsMainProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'tokens' | 'hosting'>('account');
  const [copiedToken, setCopiedToken] = useState(false);

  if (!user) return null;

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="space-y-8" id="user-settings-view">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-display mb-1">Platform Settings</h2>
        <p className="text-sm text-gray-500">Manage your listener account data, secure tokens, and self-hosted instances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Simple Tab Select list */}
        <div className="flex flex-col space-y-1">
          <button
            onClick={() => setActiveTab('account')}
            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'account' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span>Profile Identity</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tokens')}
            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tokens' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Key className="w-3.5 h-3.5 shrink-0" />
            <span>Session Tokens</span>
          </button>

          <button
            onClick={() => setActiveTab('hosting')}
            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'hosting' ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Database className="w-3.5 h-3.5 shrink-0" />
            <span>Self-Hosting Specs</span>
          </button>
        </div>

        {/* Tab content panel */}
        <div className="col-span-1 md:col-span-3 border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
          
          {activeTab === 'account' && (
            <div className="space-y-6" id="settings-tab-account">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Account Identity Metrics</h3>
              
              <div className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">User Name</label>
                  <input
                    type="text"
                    disabled
                    value={user.name}
                    className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded select-none cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Email Address</label>
                  <input
                    type="text"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded select-none cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Current Role Access</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold uppercase bg-gray-50 border border-gray-200 py-1 px-3.5 rounded text-gray-900">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Active Subscription Pass</label>
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded text-xs text-gray-700 leading-normal">
                    {user.subscriptionStatus === 'none' ? (
                      <span>No active streaming subscription. Purchase a premium pass to stream theta waves.</span>
                    ) : (
                      <span>
                        Active: <strong className="text-gray-950 font-semibold uppercase">{user.subscriptionStatus}</strong> (Expires at: {user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).toLocaleDateString() : 'N/A'})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between">
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-all cursor-pointer"
                  id="settings-logout-btn"
                >
                  Log Out Session
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="space-y-6" id="settings-tab-tokens">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Bearer Session Authentication Keys</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Provide this private authorization string in standard HTTP request headers (<code className="font-mono bg-gray-50 p-0.5 border rounded">Authorization: Bearer &lt;token&gt;</code>) to query the API programmatically or hook up custom headless audio players.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Bearer Token Key</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      readOnly
                      value={token || ''}
                      className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded font-mono select-none"
                    />
                    <button
                      onClick={handleCopyToken}
                      className="px-4 py-1.5 bg-black hover:bg-gray-900 text-white font-semibold rounded text-xs whitespace-nowrap transition-all cursor-pointer"
                      id="copy-settings-token-btn"
                    >
                      {copiedToken ? 'Copied!' : 'Copy Key'}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded border border-gray-100 text-xs text-gray-600 space-y-2">
                  <p className="font-semibold text-gray-900">API Playback Authorization Middleware Example:</p>
                  <pre className="p-3 bg-gray-950 text-gray-300 font-mono text-[10px] rounded overflow-x-auto border border-gray-900 max-h-40">
{`curl -X GET ${window.location.origin}/api/tracks \\
  -H "Authorization: Bearer ${token || 'YOUR_TOKEN'}"`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hosting' && (
            <div className="space-y-6" id="settings-tab-hosting">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Custom Hosting Parameter Bounds</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">GitHub Deployment Target URL</label>
                  <input
                    type="text"
                    readOnly
                    value="https://github.com/aiwithenoch/brainmassage"
                    className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded select-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Target Supabase Environment</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 border border-gray-200 rounded">
                      <span className="font-medium text-gray-900 block mb-0.5">PUBLIC_SUPABASE_URL</span>
                      <span className="font-mono text-[10px] text-gray-400">https://tfcbax.supabase.co</span>
                    </div>
                    <div className="p-3 border border-gray-200 rounded">
                      <span className="font-medium text-gray-900 block mb-0.5">PUBLIC_SUPABASE_ANON_KEY</span>
                      <span className="font-mono text-[10px] text-gray-400">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded border border-gray-100 text-xs text-gray-500 space-y-1">
                  <span className="font-semibold text-gray-900 block">Self-Hosted RLS Security Check:</span>
                  <p>
                    Please verify that your database contains correct policies before disabling public access. Ensure that `auth.uid() = profiles.id` allows profiles schema access by users selectively.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
