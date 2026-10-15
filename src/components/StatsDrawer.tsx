import React from 'react';
import { GlobalUserStats } from '../types/game';
import { X, Trophy, Flame, Zap, Award, RotateCcw } from 'lucide-react';

interface StatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GlobalUserStats;
  onResetStats: () => void;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="text-left">
            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider block">
              สถิติการออกกำลังกายของคุณ
            </span>
            <h3 className="text-xl font-bold font-display text-white">
              แดชบอร์ดนักสู้ NeonFit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Total Score */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-yellow-500/30 rounded-2xl p-5 mb-6 shadow-[0_0_25px_rgba(234,179,8,0.15)]">
          <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">
            คะแนนสะสมทั้งหมด
          </span>
          <span className="text-4xl font-black font-display text-yellow-300 tracking-tight">
            {stats.totalScore.toLocaleString()} PTS
          </span>
        </div>

        {/* Stat Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>จำนวนครั้งรวม</span>
            </div>
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {stats.totalReps.toLocaleString()} ครั้ง
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              <span>เผาผลาญรวม</span>
            </div>
            <span className="text-2xl font-bold font-mono text-pink-400">
              {Math.round(stats.totalCalories * 10) / 10} kcal
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>การ์ดที่ผ่านแล้ว</span>
            </div>
            <span className="text-2xl font-bold font-mono text-white">
              {stats.workoutsCompleted} รอบ
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>คอมโบสูงสุด</span>
            </div>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              x{stats.bestCombo}
            </span>
          </div>
        </div>

        {/* Reset / Close Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={onResetStats}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตสถิติ</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
};
