import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Share2, Settings, Ghost, Power } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white flex flex-col font-sans relative overflow-hidden noise-bg">
      {/* Visual background layers */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[var(--neon-cyan)]/10 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--neon-magenta)]/10 rounded-full blur-[180px]"></div>
        
        {/* Background grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'linear-gradient(var(--neon-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--neon-cyan) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>
      
      {/* Navigation Rail */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 border-r-2 border-[var(--neon-cyan)]/20 flex flex-col items-center py-10 gap-10 backdrop-blur-xl z-50 bg-black/60 shadow-[4px_0_15px_rgba(0,0,0,0.8)]">
        <div className="w-12 h-12 border-2 border-[var(--neon-cyan)] flex items-center justify-center p-2 shadow-[2px_2px_0_var(--neon-magenta)]">
          <Ghost className="text-[var(--neon-cyan)] w-full h-full" />
        </div>
        <div className="flex-1 flex flex-col gap-8">
          {[Share2, Settings, Power].map((Icon, i) => (
            <button key={i} className="p-4 text-white/20 hover:text-[var(--neon-magenta)] transition-all hover:scale-110 active:scale-95 group relative">
              <Icon className="w-6 h-6" />
              <div className="absolute inset-0 border border-[var(--neon-magenta)] opacity-0 group-hover:opacity-40 -rotate-6 scale-110"></div>
            </button>
          ))}
        </div>
        <div className="text-[12px] font-mono font-black tracking-[0.4em] uppercase origin-center -rotate-90 whitespace-nowrap text-[var(--neon-cyan)]/20 mb-12">
          RHYTHM_CORE_V4
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="ml-20 flex-1 container mx-auto px-6 py-10 flex flex-col lg:flex-row items-center justify-center gap-16 z-10">
        
        {/* Left Section: Info / Branding */}
        <div className="lg:w-1/4 flex flex-col items-start gap-8 hidden xl:flex">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col">
              <h1 
                className="text-8xl font-black italic tracking-tighter leading-[0.8] uppercase glitch-text mb-4"
                data-text="NEON"
              >
                NEON
              </h1>
              <h1 
                className="text-8xl font-black italic tracking-tighter leading-[0.8] uppercase glitch-text text-[var(--neon-magenta)] ml-8"
                data-text="RHYTHM"
              >
                RHYTHM
              </h1>
            </div>
            <p className="text-white/40 text-[10px] font-mono leading-relaxed max-w-[240px] uppercase tracking-[0.2em] border-l-2 border-[var(--neon-cyan)] pl-4">
              CRITICAL_ALERT: SYNC DETECTED.
              NEURAL INTERFACE ENGAGED.
              GRID_INITIALIZED @ 0.002ms.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col bg-white/5 p-4 border border-[var(--neon-cyan)]/10 shadow-[2px_2px_0_var(--neon-cyan)]">
              <span className="text-[8px] uppercase tracking-[0.5em] text-white/40 mb-2 underline">SIGNAL_STATUS</span>
              <span className="text-[12px] uppercase tracking-widest text-[var(--neon-cyan)] flex items-center gap-3 font-bold">
                <span className="w-2 h-2 bg-[var(--neon-cyan)] animate-ping"></span>
                STABLE_LINK_ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Center Section: Game */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 flex justify-center perspective-[1000px]"
        >
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
                <SnakeGame />
            </div>
        </motion.div>

        {/* Right Section: Player */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:w-auto"
        >
          <MusicPlayer />
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="ml-20 p-6 border-t border-[var(--neon-cyan)]/10 flex justify-between items-center backdrop-blur-2xl bg-black/40">
        <div className="flex items-center gap-12">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/30">KEY_ENCRYPT</span>
            <span className="text-[10px] font-mono text-[var(--neon-cyan)] font-bold">RSA_NEURAL_4096</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/30">BUFFER_LAG</span>
            <span className="text-[10px] font-mono text-[var(--neon-magenta)] font-bold">0.000001 SEC</span>
          </div>
        </div>
        <div className="text-[8px] font-mono uppercase tracking-[1em] text-white/10 italic">
          DESIGNED_FOR_VOID.SYS [EXEC_2026]
        </div>
      </footer>
    </div>
  );
}

