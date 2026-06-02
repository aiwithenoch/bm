import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Headphones, 
  Copy, 
  Check, 
  Compass, 
  AlertCircle, 
  BookOpen, 
  CheckCircle2, 
  Moon, 
  Volume2, 
  Brain, 
  Heart, 
  Sliders 
} from 'lucide-react';

export default function PromptPack() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'all' | 'sleep' | 'meditation' | 'focus' | 'anxiety' | 'specialized'>('all');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const categories = [
    {
      id: 'sleep',
      title: 'Deep Sleep & Delta Restoration (0.5–4 Hz)',
      subtitle: 'Target: Unconscious healing, deep rest, and growth hormone release.',
      icon: <Moon className="w-4 h-4 text-sky-400" />,
      prompts: [
        {
          num: 1,
          name: 'The "Void" Delta Drone',
          prompt: 'Generate a 20-minute continuous soundscape anchored in Delta wave frequencies (0.5–4 Hz). Use a sub-bass warm drone tuned to 174 Hz for pain relief, layered with extremely slow-moving felt piano notes that decay over 15 seconds. Constraints: Absolutely no drums, no percussion, no melody, no vocals. The dynamic range must be flat with no sudden volume spikes. Texture should be dense but soft, like thick velvet. Stereo width should be wide to simulate a large, safe cavern. Ideal for deep unconscious sleep.'
        },
        {
          num: 2,
          name: 'Lucid Dreaming Theta-Delta Bridge',
          prompt: 'Create a transitional track moving from Theta (4 Hz) to Delta (2 Hz). Start with soft, hazy ambient pads and introduce a very faint, distant choir singing wordless "oohs" with heavy reverb. Include subtle binaural pulsing that mimics slow breathing. Constraints: No rhythmic elements, no sharp highs, no distinct instruments. The sound should feel like sinking into water. Use a 432 Hz tuning reference. Designed for hypnagogic states and lucid dream induction.'
        },
        {
          num: 3,
          name: 'Heavy Sleep Entrainment (Isochronic Style)',
          prompt: 'Produce a heavy sleep track featuring audible isochronic pulses at 2.5 Hz embedded within a dark ambient drone. The pulse should be soft, like a distant heartbeat, not a click. Layer with deep brown noise and low-frequency rumble. Constraints: No melody, no harmony changes, no vocals. The texture must be monolithic and unchanging for 30 minutes. Perfect for insomnia relief and resetting circadian rhythms.'
        },
        {
          num: 4,
          name: 'The "Blackout" Room Tone',
          prompt: 'Simulate the sound of a perfectly soundproofed room with a subtle Delta frequency undercurrent. Use extremely low-volume pink noise blended with a 110 Hz sine wave drone. Constraints: Zero melodic content, zero percussion, zero atmospheric effects (no rain, no wind). Pure, flat, static sonic mass. The goal is sensory deprivation and total brain shutdown. Mastered for low-volume listening.'
        }
      ]
    },
    {
      id: 'meditation',
      title: 'Meditation, Healing & Theta States (4–8 Hz)',
      subtitle: 'Target: Deep meditation, creativity, emotional processing, and REM sleep.',
      icon: <Brain className="w-4 h-4 text-purple-400" />,
      prompts: [
        {
          num: 5,
          name: '528 Hz "Miracle" Tone Healing',
          prompt: 'Compose a healing soundscape centered strictly on the 528 Hz Solfeggio frequency. Use crystal singing bowls and glass-like synth pads that resonate at this specific pitch. Add gentle harmonic overtones at 1056 Hz. Constraints: No drums, no bass, no minor keys. The mood must be uplifting, bright, and weightless. Slow attack and infinite sustain on all notes. Designed for DNA repair visualization and emotional clearing.'
        },
        {
          num: 6,
          name: 'Theta Hypnosis & Subconscious Reprogramming',
          prompt: 'Generate a monotonous, hypnotic track in the Theta range (6 Hz). Use a repetitive, slow-swelling organ pad that never resolves, creating a trance loop. Layer with very distant, reversed piano textures that are unrecognizable as piano. Constraints: No distinct melody, no rhythm, no vocals. The sound should feel like a swirling vortex or fog. Ideal for listening during affirmations or subconscious reprogramming sessions.'
        },
        {
          num: 7,
          name: '432 Hz Nature Resonance',
          prompt: 'Create a warm, organic ambient track tuned to A=432 Hz. Blend soft wooden flute drones with the sound of gentle wind through trees and distant flowing water. Embed a subtle 7.83 Hz (Schumann Resonance) pulse within the mix. Constraints: No percussion, no synthetic sounds, no sharp transients. The texture should be earthy, brown, and green. Promotes grounding and connection to nature.'
        },
        {
          num: 8,
          name: 'The "Inner Space" Void Meditation',
          prompt: 'Design a track for advanced meditation featuring a "void" aesthetic. Use a deep, empty drone with vast amounts of reverb (10+ second decay). Introduce sparse, high-frequency chimes that appear only once every 30 seconds. Constraints: No rhythm, no melody, no bass. The silence between sounds is as important as the sound. Creates a sense of infinite space and ego dissolution.'
        },
        {
          num: 9,
          name: 'Emotional Release Theta Wash',
          prompt: 'Produce a melancholic but safe Theta wave track (5 Hz). Use minor-key ambient strings that swell slowly without ever reaching a climax. Layer with a soft, crying cello texture that is heavily processed to sound distant. Constraints: No drums, no vocals, no sudden changes. The dynamic arc should be a flat line. Facilitates safe emotional catharsis and tearful release.'
        }
      ]
    },
    {
      id: 'focus',
      title: 'Focus, Flow & Alpha Waves (8–13 Hz)',
      subtitle: 'Target: Relaxed alertness, study, reading, and "flow state".',
      icon: <NotebookIcon className="w-4 h-4 text-emerald-400" />,
      prompts: [
        {
          num: 10,
          name: 'Alpha "Clean Room" Focus',
          prompt: 'Generate a sterile, clean ambient track for deep work. Use a mid-range Alpha frequency (10 Hz) embedded in a smooth, white-noise-like synth pad. Add a very faint, high-pitched sine wave whistle that is barely audible. Constraints: No nature sounds, no melody, no rhythm, no vocals. The sound should feel like a bright, white, empty laboratory. Maximizes concentration by eliminating distraction.'
        },
        {
          num: 11,
          name: 'Binaural Reading Companion (12 Hz)',
          prompt: 'Create a 12 Hz Alpha binaural beat track specifically for reading. Use two slightly detuned warm synth pads to create the beating effect naturally within the music. Layer with the sound of turning pages and soft library ambience. Constraints: No drums, no bass drops, no vocals. The texture must be consistent and non-intrusive. Prevents eye strain and mental fatigue during long study sessions.'
        },
        {
          num: 12,
          name: 'Flow State "Green" Noise',
          prompt: 'Produce a "Green Noise" soundscape (balanced mid-frequencies) modulated at an Alpha rhythm (9 Hz). Blend the sound of a gentle forest stream with a soft, pulsing drone. Constraints: No melody, no percussion, no sudden bird calls. The water sound should be continuous and masking. Ideal for coding, writing, and creative flow states.'
        },
        {
          num: 13,
          name: 'Minimalist Piano for Concentration',
          prompt: 'Compose a minimalist piano track for focus. Single notes played very slowly (one every 10 seconds) with long reverb tails, set against a static Alpha wave drone background. Constraints: No chords, no rhythm, no bass, no drums. The piano should be felt more than heard. Keeps the brain engaged just enough to prevent daydreaming without causing distraction.'
        },
        {
          num: 14,
          name: 'Cyber-Alpha Productivity',
          prompt: 'Generate a futuristic, sci-fi ambient track for high-tech work. Use metallic, shimmering pads and soft digital glitches that occur randomly but softly. Embed a 14 Hz (low Beta/high Alpha) pulse for alertness. Constraints: No drums, no beats, no vocals. The aesthetic should be "clean energy" and "electric calm". Good for programming and data analysis.'
        }
      ]
    },
    {
      id: 'anxiety',
      title: 'Anxiety Relief & Stress Reduction (Mixed Alpha/Theta)',
      subtitle: 'Target: Calming the nervous system, panic attack recovery, and relaxation.',
      icon: <Heart className="w-4 h-4 text-rose-400" />,
      prompts: [
        {
          num: 15,
          name: '396 Hz Fear & Guilt Liberation',
          prompt: 'Create a liberating soundscape tuned to 396 Hz. Use deep, resonant bass drones that feel like a warm hug. Layer with soft, airy wind textures. Constraints: No high frequencies, no sharp sounds, no rhythm. The music should feel heavy and grounding, pulling energy down from the head to the feet. Designed to alleviate subconscious fear and guilt.'
        },
        {
          num: 16,
          name: '639 Hz Heart Chord Harmony',
          prompt: 'Compose a relationship-healing track based on 639 Hz. Use major-key harmonic progressions that resolve very slowly, played on warm string ensembles. Constraints: No percussion, no dissonance, no minor keys. The mood is pure love, connection, and safety. Promotes oxytocin release and feelings of social bonding.'
        },
        {
          num: 17,
          name: 'Panic Attack "Anchor" Tone',
          prompt: 'Generate an emergency calming track. A single, unwavering 40 Hz Gamma tone blended with a heavy, slow Alpha drone (8 Hz). The sound should be thick and enveloping, filling the entire stereo field. Constraints: Absolutely no variation, no melody, no rhythm. Pure sonic stability to anchor a racing mind during high anxiety or panic.'
        },
        {
          num: 18,
          name: '741 Hz Detox & Clarity',
          prompt: 'Produce a cleansing track tuned to 741 Hz. Use bright, crystalline synth textures and high-frequency chimes that sound like cleaning agents for the mind. Constraints: No mud, no low-end rumble, no drums. The sound should feel "scrubbed" and clear. Helps in solving problems and expressing oneself clearly.'
        }
      ]
    },
    {
      id: 'specialized',
      title: 'Specialized & Experimental Entrainment',
      subtitle: 'Target: Specific cognitive enhancements and unique sensory experiences.',
      icon: <Sliders className="w-4 h-4 text-amber-400" />,
      prompts: [
        {
          num: 19,
          name: '40 Hz Gamma for Cognitive Boost',
          prompt: 'Create a high-frequency Gamma wave track at exactly 40 Hz. Use rapid (but soft) pulsing synth stabs or modulated noise to drive the frequency. Layer with a neutral ambient background. Constraints: No melody, no slow drones, no sleep-inducing elements. The sound should be alert and buzzing. Aimed at improving memory recall and high-level cognitive processing.'
        },
        {
          num: 20,
          name: 'The "Full Spectrum" Brain Sweep',
          prompt: 'Generate a 30-minute track that slowly sweeps from Delta (1 Hz) up to Gamma (40 Hz) and back down. Start with deep sleep drones, gradually introduce Alpha focus pads, peak with gentle Gamma pulses, and return to sleep. Constraints: The transition must be imperceptibly slow (over 5 minutes per stage). No drums, no melody. Acts as a full "wash" cycle for the brain, suitable for long naps or extended meditation.'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8" id="prompt-pack-dashboard">
      
      {/* Title & Introduction block */}
      <div className="border-b border-gray-100 pb-5 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-display flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-black stroke-[2.25]" />
          Acoustic Pro Prompt Pack
        </h2>
        <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">
          Unlock high-fidelity acoustic generation. Use these copy-ready blueprints to override standard musical defaults inside text-to-music generators and shape custom binaural wellness sessions.
        </p>
      </div>

      {/* Instructions & Prerequisites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="instructions-prereq-grid">
        
        {/* Step-by-step instructions box */}
        <div className="lg:col-span-2 bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-900" />
            <h3 className="text-sm font-bold text-gray-900 font-display">Step-by-Step Generation Guide</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="space-y-1.5 p-3 bg-white rounded-xl border border-gray-100/50">
              <div className="font-semibold text-gray-900">1. Select blueprint below</div>
              <p className="text-[11px] text-gray-500 leading-relaxed">Select a target brainwave state. Each prompt specifies exact frequencies and structural limits suited for neurology.</p>
            </div>

            <div className="space-y-1.5 p-3 bg-white rounded-xl border border-gray-100/50">
              <div className="font-semibold text-gray-900">2. Strip default musical rules</div>
              <p className="text-[11px] text-gray-500 leading-relaxed">AI systems love predictable choruses. Blueprints actively suppress vocals, beats, and chord progressions.</p>
            </div>

            <div className="space-y-1.5 p-3 bg-white rounded-xl border border-gray-100/50">
              <div className="font-semibold text-gray-900">3. Match human vitals</div>
              <p className="text-[11px] text-gray-500 leading-relaxed">By forcing extremely slow rhythmic pulses, audio simulates standard respiratory rates for deep relaxation.</p>
            </div>

            <div className="space-y-1.5 p-3 bg-white rounded-xl border border-gray-100/50">
              <div className="font-semibold text-gray-900">4. Run and evaluate</div>
              <p className="text-[11px] text-gray-500 leading-relaxed">Copy the customized prompt to your music tool of choice. Listen exclusively with stereo headphones for maximum effect.</p>
            </div>
          </div>
        </div>

        {/* Prerequisites box */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-gray-900" />
              <h3 className="text-sm font-bold text-gray-900 font-display">Prerequisites</h3>
            </div>
            
            <ul className="space-y-3.5 text-xs text-gray-600">
              <li className="flex gap-2.5">
                <div className="p-1 bg-gray-50 border border-gray-200 rounded shrink-0">
                  <Compass className="w-3.5 h-3.5 text-gray-700" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 block leading-tight mb-0.5">AI Music Generator</span>
                  <span className="text-[11px] text-gray-400">Access Suno, Udio, Soundverse, Mubert, or Beatoven.ai.</span>
                </div>
              </li>

              <li className="flex gap-2.5">
                <div className="p-1 bg-gray-50 border border-gray-200 rounded shrink-0">
                  <Headphones className="w-3.5 h-3.5 text-gray-700" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 block leading-tight mb-0.5">Stereo Headphones</span>
                  <span className="text-[11px] text-gray-400">Crucial for brainwave entrainment to separate left/right carrier offsets.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 block text-center">
              Target Reference: 432Hz & 528Hz Solfeggio
            </span>
          </div>
        </div>

      </div>

      {/* Crafting the Perfect Prompt Guidelines card */}
      <div className="p-5 bg-sky-950 border border-sky-900 rounded-2xl text-sky-100 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-sky-300" />
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-sky-200">
            Parameters for Crafting the Perfect Custom Prompt
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
              Define Brainwave State
            </h4>
            <p className="text-sky-300/90 leading-relaxed text-[11px]">
              Explicitly specify exact frequency ranges (e.g. "Delta waves 0.5–4 Hz", "Alpha waves 8–13 Hz"). Make the generator respect these constraints first.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
              Negative Boundaries
            </h4>
            <p className="text-sky-300/90 leading-relaxed text-[11px]">
              Always declare negatives. Command: "no drums", "no vocals", "no rhythmic patterns", "no sudden volume changes", "flat physical dynamics".
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
              Tempo to Breath Ratio
            </h4>
            <p className="text-sky-300/90 leading-relaxed text-[11px]">
              Instruct slow tempos mimicking humans, like "slow tempo matching 4-count nasal inhalation" or "gentle acoustic pulses with long silent gaps".
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
              Describe Sound Textures
            </h4>
            <p className="text-sky-300/90 leading-relaxed text-[11px]">
              Avoid note annotations. Use: "dense layered compositions", "soft warm ambient pads", "resonant crystal-like chime tones", "deep velvet noise".
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Prompt Pack list tabbed by category */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="text-sm font-bold text-gray-900 font-display">
            Ready-to-Use Blueprint Library ({categories.reduce((acc, cat) => acc + cat.prompts.length, 0)} prompts)
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-1" id="prompt-category-selector">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                selectedTab === 'all' ? 'bg-black text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-500'
              }`}
            >
              All Prompts
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedTab(cat.id as any)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  selectedTab === cat.id ? 'bg-black text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-500'
                }`}
              >
                {cat.icon}
                <span>{cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Master prompt layout cards list */}
        <div className="space-y-8" id="prompt-blueprints-cards-library">
          {categories
            .filter((cat) => selectedTab === 'all' || selectedTab === cat.id)
            .map((cat) => (
              <div key={cat.id} className="space-y-4 border-l border-gray-200 pl-4 md:pl-6 pt-1">
                <div className="flex items-start gap-2.5 pb-1">
                  <div className="bg-gray-100 p-2.5 border border-gray-200 rounded-lg shrink-0">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 font-display leading-tight">{cat.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{cat.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id={`category-grid-${cat.id}`}>
                  {cat.prompts.map((p) => {
                    const uniqueId = `prompt-${cat.id}-${p.num}`;
                    const isCopied = copiedId === uniqueId;

                    return (
                      <div 
                        key={p.num} 
                        className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-all"
                        id={`card-prompt-item-${p.num}`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-0.5 border border-gray-100 rounded-full">
                              No. {p.num}
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-bold text-gray-900 leading-tight">
                              {p.name}
                            </h4>
                          </div>

                          <div className="relative group">
                            <div className="bg-gray-50 text-[11px] text-gray-600 font-mono p-3.5 rounded-lg border border-gray-100 leading-relaxed max-h-40 overflow-y-auto select-all">
                              {p.prompt}
                            </div>
                          </div>
                        </div>

                        {/* Copy trigger footer bar */}
                        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                          <span className="text-[10px] text-gray-400">Copy to Suno / Udio / Soundverse</span>
                          
                          <button
                            onClick={() => handleCopy(p.prompt, uniqueId)}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-all shadow-sm cursor-pointer ${
                              isCopied 
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                                : 'bg-black text-white hover:bg-gray-900'
                            }`}
                            id={`copy-btn-${p.num}`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Prompt</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

      </div>

    </div>
  );
}

// Simple custom component mock for NotebookIcon since Notebook is absent in some Lucide versions
function NotebookIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
