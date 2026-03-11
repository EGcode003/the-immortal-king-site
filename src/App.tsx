import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Loader2,
  Play,
  Pause
} from 'lucide-react';
import { STORY_CHAPTERS, Chapter } from './constants';
import { generateSpeech, generateChapterImage } from './services/gemini';

export default function App() {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [chapterImages, setChapterImages] = useState<Record<string, string>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentChapter = STORY_CHAPTERS[currentChapterIndex];

  // Handle narration
  const handleNarrate = async () => {
    if (isNarrating) {
      audioRef.current?.pause();
      setIsNarrating(false);
      return;
    }

    if (audioUrl) {
      audioRef.current?.play();
      setIsNarrating(true);
      return;
    }

    setIsGeneratingAudio(true);
    const url = await generateSpeech(currentChapter.content);
    setIsGeneratingAudio(false);
    
    if (url) {
      setAudioUrl(url);
      setIsNarrating(true);
    }
  };

  // Handle image generation
  const handleGenerateImage = async () => {
    if (chapterImages[currentChapter.id]) return;

    setIsGeneratingImage(true);
    const url = await generateChapterImage(currentChapter.imagePrompt);
    setIsGeneratingImage(false);

    if (url) {
      setChapterImages(prev => ({ ...prev, [currentChapter.id]: url }));
    }
  };

  // Reset audio when chapter changes
  useEffect(() => {
    if (audioUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setIsNarrating(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Auto-generate image for the first chapter
    if (currentChapterIndex === 0 && !chapterImages[currentChapter.id]) {
      handleGenerateImage();
    }
  }, [currentChapterIndex]);

  const nextChapter = () => {
    if (currentChapterIndex < STORY_CHAPTERS.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-noctara-bg text-noctara-text overflow-hidden relative">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_30%,#1e3a8a33_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#3b82f611_0%,transparent_50%)]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-24 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-noctara-accent/20 border border-noctara-accent/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-noctara-accent" />
            </div>
            <h1 className="text-xl font-serif italic tracking-wider uppercase opacity-70">Noctara Chronicles</h1>
          </div>
          <div className="text-sm font-mono opacity-50">
            {currentChapterIndex + 1} / {STORY_CHAPTERS.length}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-full rounded-3xl overflow-hidden glass-panel glow-border relative group"
              >
                {chapterImages[currentChapter.id] ? (
                  <img 
                    src={chapterImages[currentChapter.id]} 
                    alt={currentChapter.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-white/5 to-transparent">
                    {isGeneratingImage ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-noctara-accent animate-spin" />
                        <p className="text-sm font-mono animate-pulse">Manifesting Noctara...</p>
                      </div>
                    ) : (
                      <button 
                        onClick={handleGenerateImage}
                        className="flex flex-col items-center gap-4 hover:text-noctara-accent transition-colors"
                      >
                        <Sparkles className="w-12 h-12 opacity-30" />
                        <p className="text-sm font-mono opacity-50">Click to visualize this chapter</p>
                      </button>
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-noctara-bg/80 via-transparent to-transparent opacity-60" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Text Section */}
          <div className="flex flex-col gap-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-6"
              >
                <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight glow-text">
                  {currentChapter.title}
                </h2>
                <div className="h-1 w-24 bg-noctara-accent/50 rounded-full" />
                <p className="text-lg md:text-xl leading-relaxed text-noctara-text/80 font-light italic">
                  {currentChapter.content}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={handleNarrate}
                disabled={isGeneratingAudio}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${
                  isNarrating 
                    ? 'bg-noctara-accent text-white border-noctara-accent' 
                    : 'bg-white/5 border-white/10 hover:border-noctara-accent/50 text-noctara-text'
                }`}
              >
                {isGeneratingAudio ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isNarrating ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span className="font-mono text-sm uppercase tracking-widest">
                  {isGeneratingAudio ? 'Generating...' : isNarrating ? 'Stop Narration' : 'Listen to Story'}
                </span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={prevChapter}
                  disabled={currentChapterIndex === 0}
                  className="p-3 rounded-full border border-white/10 hover:border-noctara-accent/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextChapter}
                  disabled={currentChapterIndex === STORY_CHAPTERS.length - 1}
                  className="p-3 rounded-full border border-white/10 hover:border-noctara-accent/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 text-xs font-mono uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Noctara Chronicles</p>
          <p>Powered by Gemini AI</p>
        </footer>
      </main>

      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsNarrating(false)}
          autoPlay
          className="hidden"
        />
      )}
    </div>
  );
}
