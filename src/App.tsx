import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Loader2,
  Play,
  Pause,
  BookOpen,
  Image as ImageIcon,
  Scroll,
  ArrowDown,
  Github,
  Twitter,
  ExternalLink
} from 'lucide-react';
import { STORY_CHAPTERS, Chapter, LORE_ENTRIES } from './constants';
import { generateSpeech, generateChapterImage } from './services/gemini';

const LoreIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Citadel': return <Scroll className="w-8 h-8 text-noctara-accent" />;
    case 'Twilight': return <Sparkles className="w-8 h-8 text-noctara-accent" />;
    case 'Creatures': return <BookOpen className="w-8 h-8 text-noctara-accent" />;
    case 'Rivers': return <Sparkles className="w-8 h-8 text-noctara-accent" />;
    case 'City': return <Scroll className="w-8 h-8 text-noctara-accent" />;
    case 'Mountains': return <BookOpen className="w-8 h-8 text-noctara-accent" />;
    default: return <Scroll className="w-8 h-8 text-noctara-accent" />;
  }
};

export default function App() {
  const [activeSection, setActiveSection] = useState<'home' | 'story' | 'lore' | 'gallery'>('home');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [chapterImages, setChapterImages] = useState<Record<string, string>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const currentChapter = STORY_CHAPTERS[currentChapterIndex];

  // Handle narration
  const handleNarrate = async () => {
    if (isNarrating) {
      audioRef.current?.pause();
      setIsNarrating(false);
      return;
    }

    if (audioUrl) {
      if (audioRef.current) {
        if (audioRef.current.ended) {
          audioRef.current.currentTime = 0;
        }
        audioRef.current.play();
      }
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
    
    // Auto-generate image for the first chapter if in story mode
    if (activeSection === 'story' && currentChapterIndex === 0 && !chapterImages[currentChapter.id]) {
      handleGenerateImage();
    }
  }, [currentChapterIndex, activeSection]);

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
    <div className="min-h-screen bg-noctara-bg text-noctara-text font-sans selection:bg-noctara-accent/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_30%,#1e3a8a22_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#3b82f608_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass-panel px-6 py-3 border-white/5">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setActiveSection('home')}
          >
            <Sparkles className="w-5 h-5 text-noctara-accent group-hover:rotate-12 transition-transform" />
            <span className="font-serif italic tracking-widest uppercase text-sm">Noctara</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest">
            {[
              { id: 'home', label: 'Home' },
              { id: 'story', label: 'The Legend' },
              { id: 'lore', label: 'Lore' },
              { id: 'gallery', label: 'Gallery' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`transition-all hover:text-noctara-accent relative py-1 ${
                  activeSection === item.id ? 'text-noctara-accent' : 'text-noctara-text/60'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 w-full h-px bg-noctara-accent"
                  />
                )}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setActiveSection('story')}
            className="bg-noctara-accent text-white px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Begin Journey
          </button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {activeSection === 'home' && (
          <motion.section
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl"
            >
              <span className="text-noctara-accent font-mono text-xs uppercase tracking-[0.3em] mb-6 block">A Dark Fantasy Experience</span>
              <h1 className="text-6xl md:text-9xl font-serif font-bold leading-none mb-8 glow-text">
                The Immortal <br /> <span className="italic">King</span>
              </h1>
              <p className="text-lg md:text-xl text-noctara-text/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                In a world where the sun has forgotten how to shine, one boy carries a secret that will reshape the darkness of Noctara forever.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={() => setActiveSection('story')}
                  className="group relative px-8 py-4 bg-noctara-accent text-white rounded-full overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                >
                  <span className="relative z-10 font-mono text-sm uppercase tracking-widest">Enter the Citadel</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
                
                <button 
                  onClick={() => setActiveSection('lore')}
                  className="px-8 py-4 border border-white/10 rounded-full font-mono text-sm uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                  Explore Lore
                </button>
              </div>
            </motion.div>

            <motion.div 
              style={{ opacity }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest">Scroll to discover</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </motion.div>
          </motion.section>
        )}

        {activeSection === 'story' && (
          <motion.section
            key="story"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-24 px-6 min-h-screen flex flex-col"
          >
            <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-grow">
                {/* Image Section */}
                <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentChapter.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.8 }}
                      className="w-full h-full rounded-3xl overflow-hidden glass-panel glow-border relative"
                    >
                      {chapterImages[currentChapter.id] ? (
                        <img 
                          src={chapterImages[currentChapter.id]} 
                          alt={currentChapter.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white/5">
                          {isGeneratingImage ? (
                            <div className="flex flex-col items-center gap-4">
                              <Loader2 className="w-12 h-12 text-noctara-accent animate-spin" />
                              <p className="text-xs font-mono animate-pulse">Manifesting Noctara...</p>
                            </div>
                          ) : (
                            <button 
                              onClick={handleGenerateImage}
                              className="flex flex-col items-center gap-4 hover:text-noctara-accent transition-colors"
                            >
                              <ImageIcon className="w-12 h-12 opacity-20" />
                              <p className="text-xs font-mono opacity-40">Visualize Chapter</p>
                            </button>
                          )}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-noctara-bg/60 to-transparent" />
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
                      className="flex flex-col gap-6"
                    >
                      <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight glow-text">
                        {currentChapter.title}
                      </h2>
                      <div className="h-1 w-24 bg-noctara-accent/50 rounded-full" />
                      <p className="text-xl md:text-2xl leading-relaxed text-noctara-text/80 font-light italic">
                        {currentChapter.content}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex items-center gap-6 mt-8">
                    <button
                      onClick={handleNarrate}
                      disabled={isGeneratingAudio}
                      className={`flex items-center gap-3 px-8 py-4 rounded-full border transition-all duration-300 ${
                        isNarrating 
                          ? 'bg-noctara-accent text-white border-noctara-accent' 
                          : 'bg-white/5 border-white/10 hover:border-noctara-accent/50'
                      }`}
                    >
                      {isGeneratingAudio ? <Loader2 className="w-5 h-5 animate-spin" /> : isNarrating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      <span className="font-mono text-xs uppercase tracking-widest">
                        {isGeneratingAudio ? 'Generating...' : isNarrating ? 'Stop' : 'Listen'}
                      </span>
                    </button>

                    <div className="flex gap-3">
                      <button
                        onClick={prevChapter}
                        disabled={currentChapterIndex === 0}
                        className="p-4 rounded-full border border-white/10 hover:border-noctara-accent/50 disabled:opacity-10 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextChapter}
                        disabled={currentChapterIndex === STORY_CHAPTERS.length - 1}
                        className="p-4 rounded-full border border-white/10 hover:border-noctara-accent/50 disabled:opacity-10 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeSection === 'lore' && (
          <motion.section
            key="lore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-24 px-6 max-w-5xl mx-auto"
          >
            <div className="flex flex-col gap-16">
              <div className="text-center">
                <h2 className="text-5xl font-serif font-bold mb-6">The World of Noctara</h2>
                <p className="text-noctara-text/60 max-w-2xl mx-auto">A land defined by its shadows, where the line between myth and reality has long since faded.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {LORE_ENTRIES.map((item, i) => (
                  <div key={i} className="glass-panel p-8 flex flex-col gap-4 border-white/5 hover:border-noctara-accent/30 transition-colors">
                    <LoreIcon type={item.icon} />
                    <h3 className="text-xl font-serif font-bold">{item.title}</h3>
                    <p className="text-sm text-noctara-text/50 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="glass-panel p-12 border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-3xl font-serif font-bold mb-6">The Legend of Kael</h3>
                    <div className="space-y-4 text-noctara-text/70 leading-relaxed">
                      <p>Kael is not just a boy; he is a bridge between the past and the future. His immortality is a mystery that even the ancient scrolls cannot fully explain.</p>
                      <p>Born in the ruins of the Silver City, he was found by travelers after surviving a fall that should have been fatal. Since then, he has walked the lands of Noctara, searching for his purpose.</p>
                    </div>
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 opacity-10" />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeSection === 'gallery' && (
          <motion.section
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-24 px-6 max-w-7xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif font-bold mb-6">Citadel Gallery</h2>
              <p className="text-noctara-text/60">Visual fragments of Kael's journey, manifested through the power of AI.</p>
            </div>

            {Object.keys(chapterImages).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(chapterImages).map(([id, url]) => (
                  <motion.div 
                    key={id}
                    layoutId={`gallery-${id}`}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden glass-panel border-white/5 glow-border"
                  >
                    <img src={url} alt="Chapter visual" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-noctara-bg to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                      <span className="text-xs font-mono uppercase tracking-widest text-noctara-accent mb-2">Chapter Fragment</span>
                      <h4 className="text-lg font-serif font-bold">{STORY_CHAPTERS.find(c => c.id === id)?.title}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 glass-panel border-white/5 opacity-40">
                <ImageIcon className="w-16 h-16 mb-6" />
                <p className="font-mono text-sm uppercase tracking-widest">No visions manifested yet</p>
                <button 
                  onClick={() => setActiveSection('story')}
                  className="mt-6 text-noctara-accent hover:underline text-xs font-mono uppercase tracking-widest"
                >
                  Start the Story
                </button>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/5 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-noctara-accent" />
              <span className="font-serif italic tracking-widest uppercase text-xl">Noctara</span>
            </div>
            <p className="text-noctara-text/40 text-sm max-w-sm leading-relaxed mb-8">
              An experimental interactive storytelling platform exploring the intersection of dark fantasy and generative artificial intelligence.
            </p>
            <div className="flex gap-4">
              <button className="p-2 rounded-full bg-white/5 hover:bg-noctara-accent/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full bg-white/5 hover:bg-noctara-accent/20 transition-colors">
                <Github className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <h5 className="font-mono text-[10px] uppercase tracking-[0.3em] text-noctara-accent mb-6">Navigation</h5>
            <ul className="space-y-4 text-sm text-noctara-text/60 font-light">
              <li><button onClick={() => setActiveSection('home')} className="hover:text-noctara-accent transition-colors">Home</button></li>
              <li><button onClick={() => setActiveSection('story')} className="hover:text-noctara-accent transition-colors">The Story</button></li>
              <li><button onClick={() => setActiveSection('lore')} className="hover:text-noctara-accent transition-colors">World Lore</button></li>
              <li><button onClick={() => setActiveSection('gallery')} className="hover:text-noctara-accent transition-colors">Gallery</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[10px] uppercase tracking-[0.3em] text-noctara-accent mb-6">Resources</h5>
            <ul className="space-y-4 text-sm text-noctara-text/60 font-light">
              <li className="flex items-center gap-2 hover:text-noctara-accent cursor-pointer transition-colors">
                <span>Gemini API</span>
                <ExternalLink className="w-3 h-3" />
              </li>
              <li className="flex items-center gap-2 hover:text-noctara-accent cursor-pointer transition-colors">
                <span>Documentation</span>
                <ExternalLink className="w-3 h-3" />
              </li>
              <li className="flex items-center gap-2 hover:text-noctara-accent cursor-pointer transition-colors">
                <span>Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 opacity-30 text-[10px] font-mono uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Noctara Chronicles. All rights reserved.</p>
          <p>Designed for the Twilight World</p>
        </div>
      </footer>

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
