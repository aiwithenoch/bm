// Web Audio API Binaural Beat & Spatial Sound Synthesizer for Brain Massage LMS
let audioCtx: AudioContext | null = null;
let leftOsc: OscillatorNode | null = null;
let rightOsc: OscillatorNode | null = null;
let leftGain: GainNode | null = null;
let rightGain: GainNode | null = null;
let noiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
let masterGain: GainNode | null = null;
let bufferSource: AudioBufferSourceNode | null = null;

// Convert base64 to ArrayBuffer for Web Audio API decoding
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  // Strip optional data URL prefix
  const base64Clean = base64.replace(/^data:audio\/[^;]+;base64,/, '');
  const binaryString = window.atob(base64Clean);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function stopSynth() {
  try {
    if (bufferSource) {
      try {
        bufferSource.stop();
      } catch (err) {}
      bufferSource.disconnect();
      bufferSource = null;
    }
    if (leftOsc) {
      leftOsc.stop();
      leftOsc.disconnect();
      leftOsc = null;
    }
    if (rightOsc) {
      rightOsc.stop();
      rightOsc.disconnect();
      rightOsc = null;
    }
    if (leftGain) { leftGain.disconnect(); leftGain = null; }
    if (rightGain) { rightGain.disconnect(); rightGain = null; }
    if (noiseNode) { noiseNode.disconnect(); noiseNode = null; }
    if (masterGain) { masterGain.disconnect(); masterGain = null; }
  } catch (e) {
    console.error("Error stopping synthesis:", e);
  }
}

export function startSynth(
  type: 'sine' | 'square' | 'sawtooth' | 'triangle' | 'binaural' | 'audio',
  carrierHz: number = 200,
  beatHz: number = 4,
  frequencyHz?: number,
  audioData?: string
) {
  // Stop existing before launching fresh one
  stopSynth();

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.warn("Web Audio API is not supported in this browser.");
      return;
    }

    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.3, audioCtx.currentTime); // Standard safe volume
    masterGain.connect(audioCtx.destination);

    // If real base64 file data is passed, play it directly!
    if (audioData) {
      try {
        const arrayBuf = base64ToArrayBuffer(audioData);
        audioCtx.decodeAudioData(arrayBuf).then((decodedBuffer) => {
          if (!audioCtx) return;
          bufferSource = audioCtx.createBufferSource();
          bufferSource.buffer = decodedBuffer;
          bufferSource.loop = true;
          bufferSource.connect(masterGain!);
          bufferSource.start(0);
        }).catch((err) => {
          console.error("Error decoding audio uploaded data:", err);
        });
      } catch (err) {
        console.error("Error parsing base64 audio data:", err);
      }
    } else if (type === 'binaural') {
      // Create Stereo Panner or Channels split
      const merger = audioCtx.createChannelMerger(2);

      // Left Channel
      leftOsc = audioCtx.createOscillator();
      leftOsc.type = 'sine';
      leftOsc.frequency.setValueAtTime(carrierHz, audioCtx.currentTime);

      leftGain = audioCtx.createGain();
      leftGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      leftOsc.connect(leftGain);
      leftGain.connect(merger, 0, 0); // Connect to Left input of merger

      // Right Channel
      rightOsc = audioCtx.createOscillator();
      rightOsc.type = 'sine';
      rightOsc.frequency.setValueAtTime(carrierHz + beatHz, audioCtx.currentTime);

      rightGain = audioCtx.createGain();
      rightGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      rightOsc.connect(rightGain);
      rightGain.connect(merger, 0, 1); // Connect to Right input of merger

      // Add a mild soothing ambient low rumble (pink/brown noise) using ScriptProcessor for compatibility
      const bufferSize = 4096;
      noiseNode = audioCtx.createScriptProcessor(bufferSize, 1, 1);
      let lastOut = 0.0;
      noiseNode.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Brownian low pass filter style rumble
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          // Volume attenuation on background ambient noise
          output[i] *= 0.12;
        }
      };
      
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      noiseNode.connect(noiseGain);
      noiseGain.connect(masterGain);

      // Connect combined binaural merger to master gain
      merger.connect(masterGain);

      leftOsc.start();
      rightOsc.start();
    } else {
      // Standard resonance tone
      const osc = audioCtx.createOscillator();
      osc.type = type as OscillatorType || 'sine';
      osc.frequency.setValueAtTime(frequencyHz || carrierHz, audioCtx.currentTime);

      leftOsc = osc; // track reference

      const resGain = audioCtx.createGain();
      resGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      osc.connect(resGain);
      resGain.connect(masterGain);

      osc.start();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (err) {
    console.error("Failed to initialize physical synthesiser:", err);
  }
}

export function setVolume(vol: number) {
  if (masterGain && audioCtx) {
    // Vol is 0.0 to 1.0
    masterGain.gain.setValueAtTime(vol * 0.4, audioCtx.currentTime); 
  }
}
