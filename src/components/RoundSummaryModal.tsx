import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WorkoutSessionStats, ExerciseInfo } from '../types/game';
import { EXERCISE_DATABASE } from '../data/exercises';
import { Star, Flame, Trophy, Clock, CheckCircle2, RotateCcw, Share2 } from 'lucide-react';

interface RoundSummaryModalProps {
  stats: WorkoutSessionStats;
  onDrawNext: () => void;
  onClose: () => void;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  stats,
  onDrawNext,
  onClose
}) => {
  const exercise: ExerciseInfo = EXERCISE_DATABASE[stats.exerciseId];

  // Fire celebratory confetti on mount
  useEffect(() => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#06b6d4', '#ec4899', '#f59e0b', '#84cc16']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#06b6d4', '#ec4899', '#f59e0b', '#84cc16']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-center overflow-hidden">
        
        {/* Glow backdrop blobs */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-yellow-400 p-0.5 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black font-display text-white uppercase tracking-tight">
          ภารกิจสำเร็จ! EXCELLENT
        </h2>
        <p className="text-xs sm:text-sm text-cyan-400 mt-1 font-medium">
          {exercise.titleTh} · ครบ {stats.completedReps} ครั้ง
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map((starIndex) => (
            <Star
              key={starIndex}
              className={`w-8 h-8 ${
                starIndex <= stats.stars
                  ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]'
                  : 'text-slate-700'
              } transition-all`}
            />
          ))}
        </div>

        {/* Score Banner */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 my-4">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">
            คะแนนที่ได้รับรอบนี้
          </span>
          <span className="text-3xl sm:text-4xl font-black font-display text-yellow-300 tracking-tight">
            +{stats.score.toLocaleString()} PTS
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>ทำซ้ำ</span>
            </div>
            <span className="text-base font-bold text-white font-mono">
              {stats.completedReps} ครั้ง
            </span>
          </div>

          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              <span>คอมโบสูงสุด</span>
            </div>
            <span className="text-base font-bold text-pink-400 font-mono">
              x{stats.maxCombo}
            </span>
          </div>

          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>เผาผลาญ</span>
            </div>
            <span className="text-base font-bold text-amber-400 font-mono">
              ~{stats.caloriesBurned} kcal
            </span>
          </div>
        </div>

        {/* Health encouragement */}
        <p className="text-xs text-slate-400 italic mb-6">
          “การออกกำลังกายสม่ำเสมอเพียงวันละ 5-10 นาที ช่วยกระตุ้นระบบเผาผลาญและสุขภาพหัวใจให้แข็งแรงขึ้นอย่างยั่งยืน”
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            ดูผลลัพธ์
          </button>
          <button
            onClick={onDrawNext}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-yellow-300 hover:from-cyan-300 hover:to-yellow-200 text-slate-950 font-bold font-display text-xs tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>สุ่มไพ่รอบถัดไป</span>
          </button>
        </div>

        {/* Subtle Developer Attribution */}
        <div className="mt-5 pt-4 border-t border-slate-800/60 text-center text-[11px] text-slate-500 leading-relaxed">
          <span>พัฒนาโดย <strong className="text-slate-400 font-normal">นายโชคอนันต์ ทิพย์จันทร์</strong></span>
          <span className="block text-slate-500 text-[10px] mt-0.5">
            นิสิตปริญญาโท สาขาพลศึกษา คณะศึกษาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์
          </span>
        </div>

      </div>
    </div>
  );
};
