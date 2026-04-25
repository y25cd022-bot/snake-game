import { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Cpu, Zap, Activity, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [bootSequence, setBootSequence] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      "> INITIALIZING GLITCH_OS v.0.4.2...",
      "> LOADING KERNEL... [OK]",
      "> MOUNTING VIRTUAL_AUDIO_DRIVE... [OK]",
      "> DETECTING SNAKE_MODULE... [PATCHED]",
      "> ESTABLISHING NEURAL_LINK... [ESTABLISHED]",
      "> BYPASSING SECURITY_FIREWALL_v7... [SUCCESS]",
      "> SYSTEM READY. WELCOME, USER_ANON."
    ];

    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev, sequence[i]]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => setBootSequence(false), 1000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  if (bootSequence) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neon-bg p-8 font-mono text-cyan-glitch">
         <div className="w-full max-w-md space-y-2">
            {logs.map((log, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm"
              >
                {log}
              </motion.div>
            ))}
            <motion.div 
               animate={{ opacity: [0, 1] }} 
               transition={{ repeat: Infinity, duration: 0.5 }}
               className="inline-block h-4 w-2 bg-cyan-glitch ml-1"
            />
         </div>
         <div className="crt-overlay" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen bg-sleek-bg text-white overflow-hidden">
      
      <div className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden">
        
        {/* Left Sidebar - Sleek Playlist Style */}
        <aside className="col-span-3 flex flex-col gap-6 overflow-hidden">
          <div className="p-4 glass-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45 shadow-[0_0_10px_white]"></div>
            </div>
            <h1 className="font-bold text-xl tracking-tight">NEON<span className="text-neon-blue">SYNTH</span></h1>
          </div>

          <div className="flex-1 glass-card p-6 overflow-hidden flex flex-col">
            <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6">Subsystem Status</h2>
            <div className="space-y-4 flex-1">
              {[
                { label: 'Neural Link', status: 'Active', color: 'text-neon-green' },
                { label: 'Audio Engine', status: 'Locked', color: 'text-neon-blue' },
                { label: 'Glitch Core', status: 'Stable', color: 'text-neon-purple' },
              ].map((sub, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/40 uppercase font-bold tracking-tighter">{sub.label}</div>
                    <div className={`text-sm font-bold ${sub.color}`}>{sub.status}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${sub.color} animate-pulse shadow-[0_0_10px_currentcolor]`} />
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4">Diagnostic Logs</h3>
              <div className="space-y-2 font-mono text-[9px] text-white/30 max-h-40 overflow-y-auto scrollbar-hide">
                {logs.slice(-10).map((log, i) => (
                  <div key={i} className="truncate">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Snake Game in Neon Border */}
        <main className="col-span-6 flex flex-col items-center justify-center">
           <SnakeGame />
        </main>

        {/* Right Sidebar - Stats glass cards */}
        <aside className="col-span-3 flex flex-col gap-6">
          <div className="glass-card p-8 h-full flex flex-col items-center text-center">
            <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-10">Neural Stats</h2>
            <div className="space-y-12 w-full">
              <div className="flex flex-col items-center">
                <div className="text-xs text-white/50 mb-2 uppercase tracking-widest">Efficiency</div>
                <div className="text-5xl font-bold tracking-tighter italic">98.2</div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "98.2%" }}
                    className="h-full bg-neon-blue rounded-full shadow-[0_0_12px_rgba(0,210,255,0.8)]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 w-full">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Game Seed</div>
                  <div className="text-lg font-mono text-neon-blue">0x7F4A2</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Vector Scale</div>
                  <div className="text-lg font-mono text-neon-purple">1.442</div>
                </div>
              </div>
            </div>

            <div className="mt-auto p-4 rounded-2xl border border-dashed border-white/20 text-xs text-white/40 leading-relaxed italic">
              "The anomaly grows as you vibe. Every step is data. Don't touch the boundaries."
            </div>
          </div>
        </aside>

      </div>

      {/* Bottom Music Player Bar */}
      <footer className="m-6 mt-0">
        <MusicPlayer />
      </footer>
    </div>
  );
}
