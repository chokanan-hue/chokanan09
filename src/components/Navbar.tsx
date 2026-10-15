import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, BarChart3 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  onOpenGuide: () => void;
  onOpenStats: () => void;
  onNewDeck: () => void;
  currentScore: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenGuide,
  onOpenStats,
  onNewDeck,
  currentScore,
  isMuted,
  onToggleMute
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onNewDeck}
            className="text-left group cursor-pointer focus-visible:outline-none"
          >
            <span className="text-xl font-extrabold tracking-wider font-display bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity whitespace-nowrap">
              NEONFIT AR
            </span>
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={onNewDeck}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>สุ่มไพ่ 3 ใบ</span>
          </button>
          <button
            onClick={onOpenGuide}
            className="hover:text-pink-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-pink-400" />
            <span>คู่มือท่าออกกำลังกาย</span>
          </button>
          <button
            onClick={onOpenStats}
            className="hover:text-yellow-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-yellow-400" />
            <span>สถิติสะสม</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action or status controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 tabular-nums">
            <span>คะแนนรวม</span>
            <span className="text-sm font-bold text-cyan-300 font-display">
              {currentScore.toLocaleString()} PTS
            </span>
          </div>

          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer"
            title={isMuted ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียงเอฟเฟกต์'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={onNewDeck}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95"
          >
            เปิดไพ่ใบใหม่
          </button>
        </div>

      </div>
    </header>
  );
};
