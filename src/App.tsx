import React, { useState, useEffect } from 'react';
import { GameState, FlashCard, WorkoutSessionStats, GlobalUserStats } from './types/game';
import { drawThreeCards } from './data/exercises';
import { soundManager } from './utils/audio';
import { Navbar } from './components/Navbar';
import { CardSelector } from './components/CardSelector';
import { ARWorkoutArena } from './components/ARWorkoutArena';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { ExerciseGuideModal } from './components/ExerciseGuideModal';
import { StatsDrawer } from './components/StatsDrawer';
import { Sparkles, Activity, ShieldCheck, HeartPulse } from 'lucide-react';

const STORAGE_KEY = 'neonfit_user_stats';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('CARD_DRAW');
  const [cards, setCards] = useState<FlashCard[]>(() => drawThreeCards());
  const [selectedCard, setSelectedCard] = useState<FlashCard | null>(null);
  const [targetReps, setTargetReps] = useState<number>(10);
  
  // Modals
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [roundStats, setRoundStats] = useState<WorkoutSessionStats | null>(null);

  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.isMuted);

  // Global lifetime statistics
  const [stats, setStats] = useState<GlobalUserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      totalReps: 0,
      totalScore: 0,
      totalCalories: 0,
      workoutsCompleted: 0,
      bestCombo: 0
    };
  });

  // Save stats on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const [recentExerciseIds, setRecentExerciseIds] = useState<string[]>(() => 
    cards.map((c) => c.exercise.id)
  );

  // Card Selection Handlers: ONLY flip the single card the player selected!
  const handleSelectCard = (card: FlashCard) => {
    setCards((prevCards) =>
      prevCards.map((c) => ({
        ...c,
        isFlipped: c.cardId === card.cardId,
        isSelected: c.cardId === card.cardId
      }))
    );
    setSelectedCard(card);
    setTargetReps(card.exercise.defaultReps);
  };

  const handleRedrawDeck = () => {
    soundManager.playCardFlip();
    const newCards = drawThreeCards(recentExerciseIds);
    setCards(newCards);
    setSelectedCard(null);
    setRecentExerciseIds((prev) => {
      const drawnIds = newCards.map((c) => c.exercise.id);
      return [...drawnIds, ...prev].slice(0, 6);
    });
  };

  const handleStartWorkout = (customReps?: number) => {
    if (!selectedCard) return;
    if (customReps) {
      setTargetReps(customReps);
    }
    setGameState('WORKOUT');
  };

  const handleCompleteWorkout = (newSessionStats: WorkoutSessionStats) => {
    setRoundStats(newSessionStats);
    setGameState('ROUND_SUMMARY');

    // Update global user statistics
    setStats((prev) => ({
      totalReps: prev.totalReps + newSessionStats.completedReps,
      totalScore: prev.totalScore + newSessionStats.score,
      totalCalories: prev.totalCalories + newSessionStats.caloriesBurned,
      workoutsCompleted: prev.workoutsCompleted + 1,
      bestCombo: Math.max(prev.bestCombo, newSessionStats.maxCombo)
    }));
  };

  const handleCancelWorkout = () => {
    setGameState('CARD_DRAW');
  };

  const handleNextRoundFromSummary = () => {
    setRoundStats(null);
    handleRedrawDeck();
    setGameState('CARD_DRAW');
  };

  const handleCloseSummary = () => {
    setRoundStats(null);
    setGameState('CARD_DRAW');
  };

  const handleResetStats = () => {
    if (window.confirm('คุณต้องการรีเซ็ตสถิติสะสมทั้งหมดหรือไม่?')) {
      const initial: GlobalUserStats = {
        totalReps: 0,
        totalScore: 0,
        totalCalories: 0,
        workoutsCompleted: 0,
        bestCombo: 0
      };
      setStats(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Navigation Top Bar */}
      <Navbar
        onOpenGuide={() => setShowGuideModal(true)}
        onOpenStats={() => setShowStatsModal(true)}
        onNewDeck={handleRedrawDeck}
        currentScore={stats.totalScore}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative">
        
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[300px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

        {gameState === 'CARD_DRAW' && (
          <CardSelector
            cards={cards}
            selectedCard={selectedCard}
            onSelectCard={handleSelectCard}
            onStartWorkout={handleStartWorkout}
            onRedrawDeck={handleRedrawDeck}
          />
        )}

        {gameState === 'WORKOUT' && selectedCard && (
          <ARWorkoutArena
            card={selectedCard}
            targetReps={targetReps}
            onCompleteWorkout={handleCompleteWorkout}
            onCancelWorkout={handleCancelWorkout}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

      </main>

      {/* Value Proposition Strip (Bottom of card selector screen) */}
      {gameState === 'CARD_DRAW' && (
        <section className="w-full border-t border-slate-900 bg-slate-950/90 py-8 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  AR Motion Capture อัจฉริยะ
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  ตรวจจับข้อต่อร่างกายผ่านกล้องเว็บแคมแบบเรียลไทม์ ตรวจสอบความถูกต้องขององศาและท่าทางโดยอัตโนมัติ
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-pink-950/60 border border-pink-500/30 text-pink-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  เกมการ์ดสุ่มท่าไม่ซ้ำซาก
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  เปิดไพ่ 3 ใบเพิ่มความตื่นเต้น พร้อมภาพประกอบการ์ตูนเคลื่อนไหวและคำแนะนำภาษาไทยที่เข้าใจง่าย
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-yellow-950/60 border border-yellow-500/30 text-yellow-400 shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  ออกกำลังกายง่ายๆ ที่บ้าน
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  ไม่ต้องใช้อุปกรณ์เสริมใดๆ ประหยัดเวลา เหมาะกับผู้เรียนและทุกคนที่อยากขยับร่างกายให้สดชื่น
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer & Academic Attribution */}
      <footer className="w-full border-t border-slate-900/90 bg-slate-950/95 py-5 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400 font-display">NEONFIT AR</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>เกมการ์ดโมชั่นออกกำลังกาย</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            <span>พัฒนาโดย </span>
            <span className="text-slate-300 font-medium">นายโชคอนันต์ ทิพย์จันทร์</span>
            <span className="hidden sm:inline text-slate-600"> · </span>
            <span className="block sm:inline text-slate-400 text-[11px] sm:text-xs">
              นิสิตปริญญาโท สาขาพลศึกษา คณะศึกษาศาสตร์ มหาวิทยาลัยเกษตรศาสตร์
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {gameState === 'ROUND_SUMMARY' && roundStats && (
        <RoundSummaryModal
          stats={roundStats}
          onDrawNext={handleNextRoundFromSummary}
          onClose={handleCloseSummary}
        />
      )}

      <ExerciseGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

      <StatsDrawer
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        stats={stats}
        onResetStats={handleResetStats}
      />

    </div>
  );
}
