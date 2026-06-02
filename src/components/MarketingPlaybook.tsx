import React, { useState } from 'react';
import { 
  BookOpen, 
  Music, 
  Video, 
  Smartphone, 
  Youtube, 
  Mail, 
  Users, 
  Copy, 
  Check, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Terminal, 
  Play, 
  Volume2, 
  Sliders, 
  Clock, 
  Send 
} from 'lucide-react';

export default function MarketingPlaybook() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scriptsAndPrompts = {
    sunoPrompt: 'binaural beats, 40Hz gamma waves, deep focus ambient drone, cinematic synth, continuous frequency, no percussion, no melodies, dark atmospheric, seamless loop',
    mjPrompt: 'ultra realistic cinematic lighting, 8K resolution, dark cyberpunk study room, glowing neon green desk lamp, rain on window, highly detailed textures, moody atmosphere, volumetric fog',
    tiktokScript: `Stop scrolling and put your headphones on right now.
Listen to this frequency for three seconds.
If you have an exam tomorrow or a massive deadline you are avoiding you need this.
This functional audio forces your brain into a deep focus state.
Go to the link in my profile to grab an unlimited 24 hour stream pass for two bucks.
Block out the noise and get your work done.`,
    emailScript: `Hey there,
I saw you grabbed the 24 hour focus pass yesterday.
Your access expires in a few hours but I wanted to give you a quick upgrade option before you get locked out.
Instead of paying 2 dollars every single time you need to lock in and do deep work you can get unlimited monthly access for just 25 bucks.
Click the link below to upgrade your account and keep your access open.
Stay focused.`
  };

  return (
    <div className="space-y-8" id="marketing-playbook-dashboard">
      
      {/* Header Banner */}
      <div className="border-b border-gray-100 pb-5 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <TrendingUp className="w-3 h-3 text-amber-700" />
          Growth Blueprint Active
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-display flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-black stroke-[2]" />
          The Brain-Hacker Content Marketing Manual
        </h2>
        <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">
          This is your step-by-step master plan to monetizing your neuro-audio platform. You own the software capability—now configure the traffic engine. This organic marketing blueprint relies on high-conversion visual hooks and traffic stream hijacking.
        </p>
      </div>

      {/* Manual Introduction Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="playbook-stats-grid">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-2">
          <span className="text-2xl font-bold text-gray-900">Organic First</span>
          <p className="text-xs text-gray-400">Zero budget ads. Entirely built on social algorithm optimization and search volume capture.</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-2">
          <span className="text-2xl font-bold text-gray-900">$2 Day Pass</span>
          <p className="text-xs text-gray-400">Low-friction entry pricing designed for impulse checkout via mobile-short clips.</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-2">
          <span className="text-2xl font-bold text-gray-900">$25/mo Upsell</span>
          <p className="text-xs text-gray-400">Automated drip workflows to capture active deep-workers into recurring subscription customers.</p>
        </div>
      </div>

      {/* Modules Stack */}
      <div className="space-y-8" id="playbook-modules">
        
        {/* Module 1: Sourcing Your Audio Inventory */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-600 shrink-0">
                <Music className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-amber-600 font-bold tracking-wider">Module 1</span>
                <h3 className="text-base font-bold text-gray-900 font-display">Sourcing Your Audio Inventory</h3>
                <p className="text-xs text-gray-400">Acquire a continuous, unmetered supply of custom binaural and ambient tracks.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white bg-black w-5 h-5 rounded-full flex items-center justify-center">A</span>
                <h4 className="text-xs font-bold text-gray-900">AI Audio Generation (Suno / Udio)</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Create accounts on Suno or Udio to generate continuous acoustic backdrops with commercially owned rights. Use this exact optimized prompt:
              </p>
              <div className="relative group bg-white border border-gray-100 rounded-lg p-3">
                <p className="text-[11px] font-mono text-gray-600 pr-8 leading-relaxed">
                  {scriptsAndPrompts.sunoPrompt}
                </p>
                <button
                  onClick={() => handleCopy(scriptsAndPrompts.sunoPrompt, 'suno')}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
                  title="Copy Prompt"
                >
                  {copiedId === 'suno' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white bg-black w-5 h-5 rounded-full flex items-center justify-center">B</span>
                <h4 className="text-xs font-bold text-gray-900">The "Slowed & Reverb" Hack</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Bypass generative limitations using existing high-quality audio licensing strategies. Convert standard royalty-free loops into immersive drone-works:
              </p>
              <ul className="text-[11px] text-gray-600 space-y-1.5 pl-3 list-disc">
                <li>Purchase bulk royalty-free ambient track packs from <strong className="text-gray-900">Envato Elements</strong> or <strong className="text-gray-900">AudioJungle</strong>.</li>
                <li>Import tracks into a free timeline tool (such as <strong className="text-gray-900">CapCut / Premiere</strong>).</li>
                <li>Drop playback speed multiplier down to <strong className="text-gray-900">0.8x</strong> to expand physical transients.</li>
                <li>Apply a premium <strong className="text-gray-900">reverb or chamber depth</strong> effect to space out the sonic signature. Export as 320kbps MP3.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Module 2: The Visual Hook Engine */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-indigo-600 font-bold tracking-wider">Module 2</span>
              <h3 className="text-base font-bold text-gray-900 font-display">The Visual Hook Engine</h3>
              <p className="text-xs text-gray-400">Match raw acoustics with high-immersion looping backgrounds to lock in scrolling audiences.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                1. Generate base static artwork
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Trigger dopamine on Midjourney or Leonardo AI platforms with visual setups optimized to capture late-night focus crowds:
              </p>
              <div className="relative group bg-gray-50 border border-gray-100 rounded-lg p-3.5">
                <span className="text-[10px] font-bold text-gray-400 block mb-1">PROMPT</span>
                <p className="text-[11px] font-mono text-gray-600 pr-8 leading-relaxed">
                  {scriptsAndPrompts.mjPrompt}
                </p>
                <button
                  onClick={() => handleCopy(scriptsAndPrompts.mjPrompt, 'mj')}
                  className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-900 transition-colors"
                  title="Copy Prompt"
                >
                  {copiedId === 'mj' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-indigo-500" />
                2. Apply temporal frame animation
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed text-left">
                Avoid frozen static imagery. Looping video creates continuous attention retention. Feed the high-definition asset into AI engines like <strong className="text-gray-900">Luma Dream Machine</strong>, <strong className="text-gray-900">Runway Gen-3</strong>, or <strong className="text-gray-900">Kling</strong> format using simple frame modifiers:
              </p>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-[11px] space-y-1.5 text-gray-600 font-mono">
                <div><span className="text-xs text-indigo-600 font-bold">&#187;</span> "slow cinematic camera pan, atmospheric mist"</div>
                <div><span className="text-xs text-indigo-600 font-bold">&#187;</span> "continuous soft rain sliding down the glass pane"</div>
                <div><span className="text-xs text-indigo-600 font-bold">&#187;</span> "subtle steam curls rising from the neon desk setup"</div>
              </div>
            </div>
          </div>
        </div>

        {/* Module 3: The Short-Form Traffic Funnel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-rose-600 font-bold tracking-wider">Module 3</span>
              <h3 className="text-base font-bold text-gray-900 font-display">The Short-Form Traffic Funnel</h3>
              <p className="text-xs text-gray-400">Deliver constant volume to self-host domains using 7-second high-intent conversions.</p>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                <span className="font-bold text-gray-900 block text-xs">Aesthetic Layout</span>
                <p className="text-[11px] text-gray-500 leading-relaxed">Import your 4K looping visual on CapCut. Overlay the 40Hz focus frequency, then crop the timeline to exactly 7 seconds to provoke visual loop multipliers.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                <span className="font-bold text-gray-900 block text-xs">Vocal Overlays</span>
                <p className="text-[11px] text-gray-500 leading-relaxed">Record your voice speaking the direct conversion template. Maintain calm, unwavering vocal presence, avoiding energetic marketing inflections.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl space-y-1">
                <span className="font-bold text-gray-900 block text-xs">Formatting Engine</span>
                <p className="text-[11px] text-gray-500 leading-relaxed">Leverage bold yellow center-screen visual captions. Build anticipation, drop checkout links in profiles, and output to active study networks.</p>
              </div>
            </div>

            {/* Script Box */}
            <div className="border border-rose-100 bg-rose-50/20 rounded-xl p-4 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="w-3 h-3" />
                  TikTok / Reels Verbal Conversion Script
                </span>
                <button
                  onClick={() => handleCopy(scriptsAndPrompts.tiktokScript, 'tiktok')}
                  className="flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 px-2 py-1 rounded transition-all"
                >
                  {copiedId === 'tiktok' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === 'tiktok' ? 'Copied' : 'Copy Script'}</span>
                </button>
              </div>
              <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed font-mono select-all pt-1 border-t border-rose-100/45">
                {scriptsAndPrompts.tiktokScript}
              </p>
            </div>
          </div>
        </div>

        {/* Module 4: The YouTube Search Trap */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 shrink-0">
              <Youtube className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-red-600 font-bold tracking-wider">Module 4</span>
              <h3 className="text-base font-bold text-gray-900 font-display">The YouTube Search Trap</h3>
              <p className="text-xs text-gray-400">Capture long-term academic query traffic from users trying to lock out distraction.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-red-600 font-semibold" />
                <h4 className="text-xs font-bold text-gray-900">The 1-Hour Focus Asset</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed text-left">
                Stitch your looping video and high fidelity audio track to exactly <span className="font-semibold text-gray-900">1 hour</span>. Avoid complex visual cuts; viewers choose these assets specifically to ignore their screens.
              </p>
              <div className="text-[11px] text-gray-600 bg-white p-2 rounded border border-gray-100 leading-relaxed font-mono">
                <span className="font-bold text-red-700">Target SEO Title:</span> ADHD Deep Focus Music 40Hz Binaural Beats 1 Hour
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-3">
              <span className="text-[9px] uppercase tracking-wider bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                High-Conversion Visual Barrier
              </span>
              <h4 className="text-xs font-bold font-display text-white">The 15-Minute Visual Interruption Trap</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Every 15 minutes, insert a solid black screen layout lasting exactly 10 seconds. Direct their sudden eye-focus to plain, centered text on screen:
              </p>
              <div className="bg-black border border-slate-800 p-3 rounded text-[11px] text-center font-mono text-slate-100 leading-relaxed">
                "Tired of YouTube compressing the audio and showing ads? Get the uncompressed 24-hour stream pass for $2. Link in description."
              </div>
            </div>
          </div>
        </div>

        {/* Module 5: The Backend Email Upsell */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-sky-600 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-sky-600 font-bold tracking-wider">Module 5</span>
              <h3 className="text-base font-bold text-gray-900 font-display">The Backend Email Upsell</h3>
              <p className="text-xs text-gray-400">Scale the lifetime value from $2 micro-purchases to high-margin recurring $25 monthly plans.</p>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-gray-100">
            {/* Automation steps */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between" id="email-automation-flow">
              <div className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Trigger Event</span>
                <span className="block font-bold text-gray-900 text-xs text-left">1. 1-Day Pass Purchase</span>
                <p className="text-[10px] text-gray-400 leading-tight text-left">n8n/Make automation listens to database for incoming checkout webhooks.</p>
              </div>
              <div className="text-gray-300 hidden md:block"><ArrowRight className="w-5 h-5" /></div>
              <div className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Trigger Delay</span>
                <span className="block font-bold text-gray-900 text-xs text-left">2. Delay Exactly 20 Hours</span>
                <p className="text-[10px] text-gray-400 leading-tight text-left">Fyre-delay module schedules delivery 4 hours prior to pass expiration.</p>
              </div>
              <div className="text-gray-300 hidden md:block"><ArrowRight className="w-5 h-5" /></div>
              <div className="w-full bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase">Action Result</span>
                <span className="block font-bold text-indigo-900 text-xs text-left">3. Shoot Subscription Drip</span>
                <p className="text-[10px] text-indigo-400 leading-tight text-left">Send plain-text template looking like a personal note from the developer.</p>
              </div>
            </div>

            {/* Email Body template */}
            <div className="border border-sky-100 bg-sky-50/20 rounded-xl p-4 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Send className="w-3 h-3" />
                  Plain-Text Upsell Template
                </span>
                <button
                  onClick={() => handleCopy(scriptsAndPrompts.emailScript, 'email')}
                  className="flex items-center gap-1 text-[10px] font-bold text-sky-800 bg-sky-100 hover:bg-sky-200 px-2 py-1 rounded transition-all"
                >
                  {copiedId === 'email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === 'email' ? 'Copied' : 'Copy Template'}</span>
                </button>
              </div>
              <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed font-mono select-all pt-1 border-t border-sky-100/45">
                {scriptsAndPrompts.emailScript}
              </p>
            </div>
          </div>
        </div>

        {/* Module 6: The Community Trojan Horse */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-600 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-purple-600 font-bold tracking-wider">Module 6</span>
              <h3 className="text-base font-bold text-gray-900 font-display">The Community Trojan Horse</h3>
              <p className="text-xs text-gray-400">Mine active digital communities hungry for concentration and cognitive focus improvements.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 border-t border-gray-100 text-xs">
            
            <div className="space-y-1.5 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-gray-950 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                Target Nodes
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Identify specialized Discord servers, subreddits (e.g., <strong className="text-gray-900">r/ADHD</strong>, <strong className="text-gray-900">r/studytips</strong>, <strong className="text-gray-900">r/startups</strong>), and academic WhatsApp networks.
              </p>
            </div>

            <div className="space-y-1.5 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-gray-950 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                Provide Scientific Value
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Avoid straight link drop spam. Post a research summary detailing neural phase-locking effects and explaining why ordinary music distracts.
              </p>
            </div>

            <div className="space-y-1.5 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-gray-950 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                Seed Free Passes
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Announce you developed a custom software script for yourself and are opening 50 free seats to stress-test your system. Once they redeem, upsell them.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
