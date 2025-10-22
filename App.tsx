import React, { useState, useCallback } from 'react';
import { fetchSourcesForTickers, generatePodcastScript, generatePodcastAudio } from './services/geminiService';
import { decode, decodeAudioData } from './utils/audio';
import { LoadingStep, Source } from './types';
import { Loader } from './components/Loader';
import { PodcastPlayer } from './components/PodcastPlayer';
import { SourceList } from './components/SourceList';

const voices = [
  { name: 'Kore (Male, Calm)', value: 'Kore' },
  { name: 'Puck (Male, Energetic)', value: 'Puck' },
  { name: 'Zephyr (Female, Calm)', value: 'Zephyr' },
  { name: 'Charon (Male, Deep)', value: 'Charon' },
  { name: 'Fenrir (Male, Energetic)', value: 'Fenrir' },
];

const App: React.FC = () => {
  const [tickers, setTickers] = useState<string>('GOOG,TSLA');
  const [selectedVoice, setSelectedVoice] = useState<string>('Charon');
  const [loadingStep, setLoadingStep] = useState<LoadingStep>(LoadingStep.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [podcastAudioUrl, setPodcastAudioUrl] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  
  const isLoading = loadingStep !== LoadingStep.IDLE;

  const handleGeneratePodcast = useCallback(async () => {
    setError(null);
    setPodcastAudioUrl(null);
    setSources([]);

    const tickerList = tickers.split(',').map(t => t.trim()).filter(Boolean);
    if (tickerList.length === 0) {
      setError("Please enter at least one security ticker.");
      return;
    }
    if (tickerList.length > 4) {
      setError("Please enter a maximum of 4 security tickers.");
      return;
    }
    
    let audioContext: AudioContext | null = null;

    try {
      setLoadingStep(LoadingStep.FETCHING_SOURCES);
      const { aggregatedContent, sources: fetchedSources } = await fetchSourcesForTickers(tickerList);
      setSources(fetchedSources);

      setLoadingStep(LoadingStep.GENERATING_SCRIPT);
      const script = await generatePodcastScript(aggregatedContent, tickerList);
      
      setLoadingStep(LoadingStep.GENERATING_AUDIO);
      const base64Audio = await generatePodcastAudio(script, selectedVoice);

      // Decode audio
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedBytes = decode(base64Audio);
      // The TTS model returns 24000Hz mono audio
      const audioBuffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
      
      // Convert AudioBuffer to a Blob
      const pcmData = audioBuffer.getChannelData(0);
      const wavBuffer = createWavBuffer(pcmData, audioBuffer.sampleRate);
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });

      const url = URL.createObjectURL(blob);
      setPodcastAudioUrl(url);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoadingStep(LoadingStep.IDLE);
       if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    }
  }, [tickers, selectedVoice]);

  // Helper to create a WAV file buffer from raw PCM data
  const createWavBuffer = (pcmData: Float32Array, sampleRate: number): ArrayBuffer => {
    const numSamples = pcmData.length;
    const numChannels = 1;
    const bytesPerSample = 2; // 16-bit audio
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numSamples * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF header
    view.setUint32(0, 0x46464952, true); // "RIFF"
    view.setUint32(4, 36 + dataSize, true);
    view.setUint32(8, 0x45564157, true); // "WAVE"
    // "fmt " sub-chunk
    view.setUint32(12, 0x20746d66, true); // "fmt "
    view.setUint32(16, 16, true); // Sub-chunk size
    view.setUint16(20, 1, true); // Audio format (1 for PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // Bits per sample
    // "data" sub-chunk
    view.setUint32(36, 0x61746164, true); // "data"
    view.setUint32(40, dataSize, true);

    // Write PCM data
    for (let i = 0; i < numSamples; i++) {
        const s = Math.max(-1, Math.min(1, pcmData[i]));
        view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return buffer;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {isLoading && <Loader message={loadingStep} />}
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-schw-blue to-schw-green">
          Schwab AI Market Minute
        </h1>
        <p className="mt-4 text-lg text-schw-text-light">
          Enter comma-separated stock tickers to generate a personalized audio briefing on the latest market intelligence.
        </p>
      </div>

      <div className="w-full max-w-2xl mt-8 bg-white rounded-xl shadow-md border border-schw-gray p-6">
        <div className="mb-4">
            <label htmlFor="voice-select" className="block text-sm font-medium text-schw-text mb-2">
              Podcast Voice
            </label>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white text-schw-text border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-schw-blue focus:border-schw-blue focus:outline-none transition-all duration-200"
            >
              {voices.map((voice) => (
                <option key={voice.value} value={voice.value}>
                  {voice.name}
                </option>
              ))}
            </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={tickers}
            onChange={(e) => setTickers(e.target.value)}
            placeholder="e.g., AAPL, NVDA, MSFT"
            disabled={isLoading}
            aria-label="Security Tickers"
            className="flex-grow bg-white text-schw-text placeholder-gray-400 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-schw-blue focus:border-schw-blue focus:outline-none transition-all duration-200"
          />
          <button
            onClick={handleGeneratePodcast}
            disabled={isLoading}
            className="bg-schw-blue text-white font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
          >
            Generate Podcast
          </button>
        </div>
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
      
      {podcastAudioUrl && <PodcastPlayer audioUrl={podcastAudioUrl} />}
      {sources.length > 0 && <SourceList sources={sources} />}
    </div>
  );
};

export default App;
