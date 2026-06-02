import React, { useState, useEffect } from 'react';
import { Upload, FileAudio, Users, PlusCircle, CheckCircle, Clock, Trash, Sparkles } from 'lucide-react';
import { Track, ContactLead } from '../types';

interface AdminPortalProps {
  token: string | null;
  onTrackCreated: () => void;
}

export default function AdminPortal({ token, onTrackCreated }: AdminPortalProps) {
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [errorLeads, setErrorLeads] = useState('');

  // Track Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('15:00');
  const [frequency, setFrequency] = useState('7.83 Hz');
  const [category, setCategory] = useState<'theta' | 'alpha' | 'delta' | 'solfeggio' | 'gamma'>('theta');
  const [premium, setPremium] = useState(true);
  const [synthType, setSynthType] = useState<'binaural' | 'sine'>('binaural');
  const [binauralCarrier, setBinauralCarrier] = useState(200);
  const [binauralBeat, setBinauralBeat] = useState(7.83);
  const [synthHz, setSynthHz] = useState(432);
  const [audioBase64, setAudioBase64] = useState('');
  const [creatingTrack, setCreatingTrack] = useState(false);
  const [trackMessage, setTrackMessage] = useState('');
  const [trackError, setTrackError] = useState('');

  // Render Tabs inside Admin
  const [adminTab, setAdminTab] = useState<'tracks' | 'leads'>('tracks');

  useEffect(() => {
    fetchLeads();
  }, [token]);

  const fetchLeads = async () => {
    if (!token) return;
    setLoadingLeads(true);
    setErrorLeads('');
    try {
      const response = await fetch('/api/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to retrieve contact leads list.');
      }
      const data = await response.json();
      setLeads(data);
    } catch (err: any) {
      setErrorLeads(err.message || 'Error occurred fetching leads.');
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: 'contacted' | 'reviewed') => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchLeads(); // refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAudioBase64(reader.result as string);
      setTrackMessage(`Audio file "${file.name}" loaded successfully in buffer memory.`);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingTrack(true);
    setTrackError('');
    setTrackMessage('');

    if (!title || !description || !frequency) {
      setTrackError('Title, description, and targeting frequencies are strictly mandatory fields.');
      setCreatingTrack(false);
      return;
    }

    try {
      const bodyPayload = {
        title,
        description,
        duration,
        frequency,
        category,
        premium,
        synthType,
        binauralCarrier,
        binauralBeat,
        synthHz,
        audioData: audioBase64
      };

      const response = await fetch('/api/tracks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyPayload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed compiling the track.');
      }

      setTrackMessage('Track instantiated successfully. It is now dynamically available in core streams.');
      // reset form
      setTitle('');
      setDescription('');
      setAudioBase64('');
      onTrackCreated(); // callback to refresh Discover lists
    } catch (err: any) {
      setTrackError(err.message || 'Error adding track.');
    } finally {
      setCreatingTrack(false);
    }
  };

  return (
    <div className="space-y-8" id="admin-portal-view">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-display mb-1">Admin Control Portals</h2>
          <p className="text-sm text-gray-500">Configure core sound waves, design parameters, and capture non-technical direct client requests</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-gray-50 border border-gray-200 rounded-md">
          <button
            onClick={() => setAdminTab('tracks')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              adminTab === 'tracks' ? 'bg-black text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Track Wizard
          </button>
          
          <button
            onClick={() => setAdminTab('leads')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              adminTab === 'leads' ? 'bg-black text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Managed Leads</span>
            {leads.filter(l => l.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 block"></span>
            )}
          </button>
        </div>
      </div>

      {/* Track Compilation panel */}
      {adminTab === 'tracks' && (
        <form onSubmit={handleCreateTrack} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls form */}
          <div className="lg:col-span-2 space-y-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 block pb-2 border-b border-gray-50">Calibrated Track Specifications</h3>

            {trackError && <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-md">{trackError}</div>}
            {trackMessage && <div className="p-3 text-xs text-green-700 bg-green-50 border border-green-100 rounded-md">{trackMessage}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Track Header Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Earth Schuman Resonance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:border-black focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Spatial Frequency Heading (Text label)</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., 7.83 Hz"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:border-black focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Duration Parameter</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., 15:00"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:border-black focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Wave Category Group</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:border-black focus:outline-none"
                >
                  <option value="theta">Theta (Visions)</option>
                  <option value="alpha">Alpha (Active Focus)</option>
                  <option value="delta">Delta (Deep Rem Recovery)</option>
                  <option value="solfeggio">Solfeggio (Cellular Balance)</option>
                  <option value="gamma">Gamma (High Cognition)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Access Level Rule</label>
                <div className="flex items-center h-8 gap-2">
                  <input
                    type="checkbox"
                    id="track-premium-toggle"
                    checked={premium}
                    onChange={(e) => setPremium(e.target.checked)}
                    className="w-4 h-4 accent-black border-gray-200 rounded"
                  />
                  <label htmlFor="track-premium-toggle" className="text-xs text-gray-600 font-medium">Gated Premium Content</label>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-wider uppercase text-gray-500 block">Binaural / Resonance Sound Description</label>
              <textarea
                required
                rows={3}
                placeholder="Give clinical details about research parameters, somatic impacts, left/right alignments..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded focus:border-black focus:outline-none resize-none"
              />
            </div>

            {/* Synthesizer Parameters */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Physical Oscillator Synthesis Link</span>
                <select
                  value={synthType}
                  onChange={(e: any) => setSynthType(e.target.value)}
                  className="px-2 py-1 text-[11px] bg-white border border-gray-100 rounded focus:outline-none"
                >
                  <option value="binaural">Two-Channel Binaural Beat</option>
                  <option value="sine">Monophonic Sine Resonance</option>
                </select>
              </div>

              {synthType === 'binaural' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-gray-500">
                      <span>Left Carrier Pitch</span>
                      <span>{binauralCarrier} Hz</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={400}
                      step={5}
                      value={binauralCarrier}
                      onChange={(e) => setBinauralCarrier(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-gray-500">
                      <span>Differential (Binaural Beat)</span>
                      <span>{binauralBeat} Hz</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={45}
                      step={0.5}
                      value={binauralBeat}
                      onChange={(e) => setBinauralBeat(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 max-w-sm">
                  <div className="flex justify-between text-xs font-mono text-gray-500">
                    <span>Harmonic Target Frequency</span>
                    <span>{synthHz} Hz</span>
                  </div>
                  <input
                    type="range"
                    min={150}
                    max={1000}
                    step={10}
                    value={synthHz}
                    onChange={(e) => setSynthHz(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Audio file dropzone trigger */}
          <div className="space-y-6">
            <div className="border border-gray-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 block pb-2 border-b border-gray-50">Upload Vector Assets</h3>
              
              {/* Dashed Upload Dropzone */}
              <div className="border-2 border-dashed border-gray-200 hover:border-black rounded-lg p-6 bg-gray-50/50 text-center transition-colors relative">
                <input
                  type="file"
                  id="admin-audio-drop"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-900">Drag or click to load wave sound</p>
                    <p className="text-[10px] text-gray-500">Standard MP3, FLAC, or WAV frequencies</p>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 leading-normal bg-gray-50 p-3 rounded">
                Note: Standard self-hosting parses physical oscillator synthesizers out-of-the-box. Loading custom MP3 vectors binds binary attachments natively into Supabase Storage.
              </div>
            </div>

            <button
              type="submit"
              disabled={creatingTrack}
              id="admin-uninstantiate-track-btn"
              className="w-full px-4 py-3 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg text-xs tracking-wider uppercase transition-colors cursor-pointer text-center"
            >
              {creatingTrack ? 'Compiling Parameters...' : 'Deploy Track into Storage'}
            </button>
          </div>

        </form>
      )}

      {/* Done-For-You Managed Setup Leads viewer */}
      {adminTab === 'leads' && (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm" id="leads-submissions-viewer">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600">Active Setup Integration Request Leads</h3>
            <span className="text-xs font-mono font-bold text-gray-900 bg-white py-1 px-3 border border-gray-200 rounded">
              {leads.length} Inbound Leads
            </span>
          </div>

          {loadingLeads ? (
            <div className="p-12 text-center text-xs text-gray-500">
              Querying table rows ...
            </div>
          ) : errorLeads ? (
            <div className="p-12 text-center text-xs text-red-600 bg-red-50">
              {errorLeads}
            </div>
          ) : leads.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <div key={lead.id} className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{lead.name}</span>
                      <span className="text-xs text-gray-500 font-mono">({lead.email})</span>
                    </div>
                    
                    <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border border-gray-100">
                      "{lead.message}"
                    </p>

                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono">
                      <span>Submitted: {new Date(lead.createdAt).toLocaleString()}</span>
                      <span className="flex items-center gap-1">
                        {lead.status === 'pending' ? (
                          <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            <Clock className="w-2.5 h-2.5 animate-spin" /> Inbound Request
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                            <CheckCircle className="w-2.5 h-2.5" /> Handled / Contacted
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {lead.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateLeadStatus(lead.id, 'contacted')}
                        className="px-3 py-1.5 bg-black hover:bg-gray-900 text-white font-semibold rounded text-xs whitespace-nowrap transition-colors cursor-pointer"
                      >
                        Mark Contacted & Convert
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-gray-500 space-y-2">
              <Users className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="font-semibold text-gray-900">Zero Managed Deployments requested yet.</p>
              <p className="text-[11px]">Leads captured via the landing page Non-Technical modal will manifest here immediately.</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
