import React from 'react';
import { EXERCISE_LIST } from '../data/exercises';
import { X, Check, Target, Sparkles } from 'lucide-react';

interface ExerciseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseGuideModal: React.FC<ExerciseGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase">
              <Sparkles className="w-4 h-4" />
              <span>คลังท่าออกกำลังกายและคำแนะนำ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
              คู่มือท่าออกกำลังกาย NeonFit AR
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Exercise Cards List */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
          {EXERCISE_LIST.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
            >
              {/* Exercise Cartoon Thumbnail */}
              <div className="relative w-full h-48 md:h-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                <img
                  src={exercise.imageSrc}
                  alt={exercise.titleTh}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-cyan-400 border border-cyan-500/30">
                  {exercise.difficulty}
                </div>
              </div>

              {/* Description & Steps */}
              <div className="md:col-span-2 space-y-3 text-left">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    {exercise.categoryTh}
                  </span>
                  <h3 className="text-lg font-bold font-display text-white">
                    {exercise.titleTh}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {exercise.descriptionTh}
                  </p>
                </div>

                {/* Instructions */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    วิธีปฏิบัติ:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {exercise.instructionsTh.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tips & Target Muscles */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs border-t border-slate-800/80">
                  <div className="flex-1">
                    <span className="text-slate-500 block">กล้ามเนื้อหลัก:</span>
                    <span className="text-slate-300 font-medium">{exercise.targetMusclesTh}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-amber-400/90 block">เทคนิคการนับรอบ:</span>
                    <span className="text-slate-300">{exercise.metricGuide}</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            เข้าใจแล้ว ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
