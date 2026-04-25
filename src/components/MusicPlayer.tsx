import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS = [
  {
    id: 1,
    title: "SYNTH_VOUNCER.dll",
    artist: "NEURAL_LINK",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00ffff"
  },
  {
    id: 2,
    title: "MAC_ERROR_JAZZ.exe",
    artist: "DATA_VOID",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff"
  },
  {
    id: 3,
    title: "GLITCHED_LULLABY.sh",
    artist: "EMPTY_BUFFER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#ffffff"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="h-24 glass-card w-full px-8 flex items-center justify-between">
      <audio
        ref={audioRef}
        src={track.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-4 w-1/4">
        <div className="w-12 h-12 bg-neon-blue/20 rounded-lg flex items-center justify-center p-1 border border-neon-blue/30">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          >
             <Disc size={24} className="text-neon-blue" />
          </motion.div>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-sm font-bold truncate text-white">{track.title}</div>
          <div className="text-xs text-white/40 truncate uppercase tracking-widest">{track.artist}</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 w-2/4">
        <div className="flex items-center gap-8">
          <button onClick={handlePrev} className="opacity-50 hover:opacity-100 text-white transition-opacity">
            <SkipBack size={20} fill="white" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
          </button>
          <button onClick={handleNext} className="opacity-50 hover:opacity-100 text-white transition-opacity">
            <SkipForward size={20} fill="white" />
          </button>
        </div>
        
        <div className="w-full flex items-center gap-3 px-10">
          <span className="text-[10px] text-white/50 font-mono">
            {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ":" + String(Math.floor(audioRef.current.currentTime % 60)).padStart(2, '0') : "0:00"}
          </span>
          <div className="flex-1 h-1 bg-white/10 rounded-full relative">
            <motion.div 
              className="absolute h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
              style={{ width: `${progress}%` }}
            />
            <motion.div 
              className="absolute h-3 w-3 bg-white rounded-full -top-1 shadow-lg"
              style={{ left: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-white/50 font-mono">
            {audioRef.current?.duration ? Math.floor(audioRef.current.duration / 60) + ":" + String(Math.floor(audioRef.current.duration % 60)).padStart(2, '0') : "--:--"}
          </span>
        </div>
      </div>

      <div className="w-1/4 flex justify-end items-center gap-4">
        <Volume2 size={18} className="text-white/40" />
        <div className="w-24 h-1 bg-white/10 rounded-full">
          <div className="h-full w-2/3 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
