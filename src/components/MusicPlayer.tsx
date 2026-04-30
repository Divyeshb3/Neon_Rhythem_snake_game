import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Radio } from 'lucide-react';
import { Track } from '../types';

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'AI Oracle',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&h=300&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Synth Waves',
    artist: 'Digital Dreamer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&h=300&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Neon Serpent',
    artist: 'Pixel Viper',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=300&h=300&auto=format&fit=crop',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    }
    setProgress(0);
  };

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="flex flex-col w-[320px] bg-black/40 border-2 border-[var(--neon-magenta)] shadow-[4px_4px_0_var(--neon-cyan)] p-6 relative overflow-hidden h-fit glitch-border">
      <div className="scanline"></div>
      
      {/* Visualizer bars */}
      <div className="flex items-end justify-center gap-1 mb-8 h-12 overflow-hidden border-b border-white/5 pb-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: isPlaying ? [10, Math.random() * 40 + 10, 10] : 10,
              backgroundColor: isPlaying ? (i % 2 === 0 ? '#00f3ff' : '#ff00ff') : '#333',
            }}
            transition={{
              duration: 0.3 + Math.random() * 0.3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-1.5 rounded-t-sm shadow-[0_0_8px_rgba(0,243,255,0.3)]"
          />
        ))}
      </div>

      <div className="relative aspect-square overflow-hidden mb-6 group border-2 border-[var(--neon-cyan)] shadow-[4px_4px_0_rgba(0,243,255,0.2)]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 1.2, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            transition={{ duration: 0.2, ease: "circOut" }}
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover sepia-[0.5] hue-rotate-[280deg]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <Radio className="w-12 h-12 text-[var(--neon-cyan)] animate-ping" />
        </div>
      </div>

      <div className="mb-6">
        <h3 
            className="text-xl font-bold text-white tracking-tight mb-1 truncate neon-text-cyan glitch-text"
            data-text={currentTrack.title}
        >
            {currentTrack.title}
        </h3>
        <p className="text-[10px] text-[var(--neon-magenta)] font-mono uppercase tracking-[0.2em] truncate">SOURCE_ENTITY: {currentTrack.artist}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-white/10 appearance-none cursor-pointer accent-[var(--neon-cyan)]"
            id="music-progress"
          />
          <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
            <span>TS_{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor((audioRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')}</span>
            <span>END_{Math.floor((audioRef.current?.duration || 0) / 60)}:{(Math.floor((audioRef.current?.duration || 0) % 60)).toString().padStart(2, '0')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => handleSkip('prev')}
            className="p-2 text-white/40 hover:text-[var(--neon-cyan)] transition-colors hover:scale-110 active:scale-95"
            id="prev-track"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9, rotate: -5 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 bg-[var(--neon-cyan)] text-black flex items-center justify-center shadow-[4px_4px_0_var(--neon-magenta)]"
            id="play-pause"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </motion.button>

          <button
            onClick={() => handleSkip('next')}
            className="p-2 text-white/40 hover:text-[var(--neon-cyan)] transition-colors hover:scale-110 active:scale-95"
            id="next-track"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-3 border-l-2 border-[var(--neon-magenta)]">
          <Volume2 className="w-4 h-4 text-white/40" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
            }}
            className="flex-1 h-1 bg-white/10 appearance-none cursor-pointer accent-white/60"
            id="volume-control"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => handleSkip('next')}
      />

      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--neon-cyan)] animate-pulse" />
            <span className="text-[8px] font-mono text-[var(--neon-cyan)]/60 uppercase tracking-[0.2em]">AMPLITUDE_LOCKED</span>
        </div>
        <span className="text-[10px] font-mono text-[var(--neon-magenta)]/60 uppercase tracking-widest">SIGNAL_V1.0.4</span>
      </div>
    </div>
  );
}
