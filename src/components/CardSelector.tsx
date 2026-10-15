import React, { useState } from 'react';
import { FlashCard, ExerciseInfo } from '../types/game';
import { soundManager } from '../utils/audio';
import { Sparkles, Play, Flame, Target, RotateCcw, ChevronRight, Zap, Eye, Lock } from 'lucide-react';
import cardBackMysticImg from '../assets/images/card_back_mystic_cyber_1792053387727.jpg';

interface CardSelectorProps {
  cards: FlashCard[];
  selectedCard: FlashCard | null;
  onSelectCard: (card: FlashCard) => void;
  onStartWorkout: (customReps?: number) => void;
  onRedrawDeck: () => void;
}

export const CardSelector: React.FC<CardSelectorProps> = ({
  cards,
  selectedCard,
  onSelectCard,
  onStartWorkout,
  onRedrawDeck
}) => {
  const [targetReps, setTargetReps] = useState<number>(10);

  const handleCardClick = (card: FlashCard) => {
    soundManager.playCardFlip();
    onSelectCard(card);
    setTargetReps(card.exercise.defaultReps);
  };

  const getCardBorder = (exercise: ExerciseInfo, isSelected: boolean) => {
    if (!isSelected) return 'border-slate-800 hover:border-slate-600';
    switch (exercise.accentColor) {
      case 'cyan': return 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)]';
      case 'pink': return 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.6)]';
      case 'lime': return 'border-lime-400 shadow-[0_0_30px_rgba(132,204,22,0.6)]';
      case 'amber': return 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.6)]';
      case 'purple': return 'border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.6)]';
      default: return 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)]';
    }
  };

  const getBadgeColor = (accent: string) => {
    switch (accent) {
      case 'cyan': return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/50';
      case 'pink': return 'text-pink-400 border-pink-500/30 bg-pink-950/50';
      case 'lime': return 'text-lime-400 border-lime-500/30 bg-lime-950/50';
      case 'amber': return 'text-amber-400 border-amber-500/30 bg-amber-950/50';
      default: return 'text-purple-400 border-purple-500/30 bg-purple-950/50';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-2">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>เลือกไพ่เพียง 1 ใบเพื่อค้นหาภารกิจท้าทาย</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase">
          เปิดไพ่โมชั่น AR FLASHCARD
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          แตะเลือกไพ่ปริศนา 1 ใน 3 ใบเพื่อเปิดเผยท่าออกกำลังกาย โดยไพ่อีก 2 ใบจะยังคงปิดเป็นปริศนาไว้
        </p>
      </div>

      {/* 3 Flashcards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 perspective-1500 mb-8">
        {cards.map((card, index) => {
          const isSelected = selectedCard?.cardId === card.cardId;
          const isFlipped = card.isFlipped;

          return (
            <div
              key={card.cardId}
              onClick={() => handleCardClick(card)}
              className="relative h-[500px] w-full cursor-pointer group"
              style={{ perspective: '1200px' }}
            >
              <div
                className={`w-full h-full duration-700 transition-transform transform-style-3d rounded-2xl relative ${
                  isFlipped ? 'rotate-y-180' : 'group-hover:scale-[1.03]'
                }`}
              >
                
                {/* BACK OF CARD: Thrilling & Enigmatic Mystic Cyber Portal Artwork */}
                <div className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl border-2 overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.2)] transition-all ${
                  isSelected 
                    ? 'border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.5)] ring-2 ring-cyan-400' 
                    : 'border-cyan-500/40 group-hover:border-cyan-300 group-hover:shadow-[0_0_45px_rgba(6,182,212,0.4)]'
                }`}>
                  
                  {/* Full-bleed Mystic Artwork */}
                  <img
                    src={cardBackMysticImg}
                    alt="ไพ่ปริศนา นีออนไซเบอร์"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* High-voltage Hologram Tint and Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/70" />
                  
                  {/* Glowing card frame */}
                  <div className="absolute inset-2 border border-cyan-400/30 rounded-xl pointer-events-none group-hover:border-cyan-400/60 transition-colors" />

                  {/* Top card metadata */}
                  <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
                    <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase px-2 py-0.5 rounded bg-slate-950/70 backdrop-blur-sm border border-cyan-500/30">
                      MYSTIC CARD
                    </span>
                    <span className="text-xs font-mono font-black text-yellow-300 px-2.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm border border-yellow-500/40 shadow-sm">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Mystery Center Aura Banner */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-4">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-300/80 bg-slate-950/50 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)] group-hover:scale-115 group-hover:border-yellow-300 transition-all duration-300">
                      <Sparkles className="w-9 h-9 text-cyan-300 group-hover:text-yellow-300 animate-pulse" />
                    </div>
                    <span className="mt-4 px-3 py-1 rounded-full text-xs font-extrabold tracking-widest text-white uppercase bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 shadow-lg group-hover:border-yellow-400 group-hover:text-yellow-300 transition-colors">
                      แตะเพื่อเปิดไพ่ใบนี้
                    </span>
                    <span className="text-[11px] font-medium text-cyan-300/90 mt-1.5 drop-shadow">
                      โบนัสคะแนน {card.bonusMultiplier}x
                    </span>
                  </div>

                  {/* Bottom Mystery Kicker */}
                  <div className="absolute bottom-4 inset-x-4 z-10 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300 font-medium py-1.5 px-3 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-slate-800">
                      <Lock className="w-3 h-3 text-cyan-400" />
                      <span>สุ่ม 1 ใน 12 ท่าออกกำลังกายลับ</span>
                    </div>
                  </div>

                </div>

                {/* FRONT OF CARD (Revealed Exercise with Cartoon Illustration - ONLY for chosen card!) */}
                <div 
                  className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-slate-900 border-2 p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 ${getCardBorder(
                    card.exercise,
                    isSelected
                  )}`}
                >
                  {/* Top Header */}
                  <div className="flex items-center justify-between z-10">
                    <span className={`text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-md border ${getBadgeColor(card.exercise.accentColor)}`}>
                      {card.exercise.categoryTh}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold font-display">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{card.bonusMultiplier}x โบนัส</span>
                    </div>
                  </div>

                  {/* Cartoon Exercise Illustration */}
                  <div className="relative w-full h-44 rounded-xl overflow-hidden my-3 border border-slate-800 bg-slate-950 group-hover:border-slate-700">
                    <img
                      src={card.exercise.imageSrc}
                      alt={card.exercise.titleTh}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-300 font-medium px-2 py-1 rounded bg-slate-950/70 backdrop-blur-sm">
                      <span>{card.exercise.difficulty}</span>
                      <span>~{Math.round(card.exercise.caloriesPerRep * card.exercise.defaultReps * 10) / 10} kcal</span>
                    </div>
                  </div>

                  {/* Exercise Title and Description */}
                  <div className="space-y-1.5 text-left z-10">
                    <h3 className="text-lg font-bold font-display text-white line-clamp-1">
                      {card.exercise.titleTh}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {card.exercise.descriptionTh}
                    </p>
                    <div className="text-[11px] text-cyan-300/90 font-mono pt-1 line-clamp-1">
                      🎯 {card.exercise.metricGuide}
                    </div>
                  </div>

                  {/* Selection Status indicator */}
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs z-10">
                    <span className="text-slate-400">เป้าหมายเริ่มต้น:</span>
                    <span className="font-bold text-white font-display text-sm">
                      {card.exercise.defaultReps} ครั้ง
                    </span>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Control Actions & Selected Card Detail */}
      {selectedCard && (
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-md max-w-3xl mx-auto shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-fade-in">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left Info */}
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>ไพ่ที่เปิดเผย: {selectedCard.exercise.titleTh}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                {selectedCard.exercise.tipsTh}
              </p>
              
              {/* Reps Customizer */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-slate-400">จำนวนครั้งที่ต้องการ:</span>
                <div className="flex items-center gap-1.5">
                  {[5, 8, 10, 15, 20].map((reps) => (
                    <button
                      key={reps}
                      onClick={() => setTargetReps(reps)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        targetReps === reps
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {reps}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={onRedrawDeck}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>สับไพ่สุ่มใหม่</span>
              </button>

              <button
                onClick={() => onStartWorkout(targetReps)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-yellow-300 hover:from-cyan-300 hover:to-yellow-200 text-slate-950 font-bold font-display text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>เริ่มออกกำลังกาย ({targetReps} ครั้ง)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {!selectedCard && (
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={onRedrawDeck}
            className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>สับไพ่และแจกใหม่</span>
          </button>
        </div>
      )}

    </div>
  );
};
