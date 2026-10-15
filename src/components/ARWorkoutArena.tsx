import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FlashCard, WorkoutSessionStats, PoseLandmark } from '../types/game';
import { ExerciseMotionTracker, drawNeonSkeleton, MotionAnalysisResult } from '../utils/motionDetector';
import { soundManager } from '../utils/audio';
import { 
  Camera, 
  CameraOff, 
  Flame, 
  X, 
  RefreshCw, 
  Info, 
  Volume2, 
  VolumeX, 
  Zap, 
  Play,
  Award
} from 'lucide-react';

interface ARWorkoutArenaProps {
  card: FlashCard;
  targetReps: number;
  onCompleteWorkout: (stats: WorkoutSessionStats) => void;
  onCancelWorkout: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ARWorkoutArena: React.FC<ARWorkoutArenaProps> = ({
  card,
  targetReps,
  onCompleteWorkout,
  onCancelWorkout,
  isMuted,
  onToggleMute
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trackerRef = useRef<ExerciseMotionTracker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const poseInstanceRef = useRef<any>(null);

  // Game tracking state
  const [currentReps, setCurrentReps] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('กำลังเปิดกล้องและเริ่มระบบ AI...');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [primaryMetric, setPrimaryMetric] = useState<{ label: string; value: number }>({
    label: 'การเคลื่อนไหว',
    value: 0
  });

  // Camera & System state
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAiLoaded, setIsAiLoaded] = useState<boolean>(false);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(true);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(3);
  const [showGuideSidePanel, setShowGuideSidePanel] = useState<boolean>(true);
  const [repPopup, setRepPopup] = useState<string | null>(null);
  const [simulationMode, setSimulationMode] = useState<boolean>(false);

  const startTimeRef = useRef<number>(Date.now());

  // Setup tracker instance
  useEffect(() => {
    trackerRef.current = new ExerciseMotionTracker(card.exercise.id);
    return () => {
      trackerRef.current = null;
    };
  }, [card.exercise.id]);

  // Handle countdown before game starts
  useEffect(() => {
    if (!isCountingDown) return;
    
    soundManager.playCountdown(false);
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          soundManager.playCountdown(true);
          setIsCountingDown(false);
          startTimeRef.current = Date.now();
          setFeedbackText('เริ่มออกกำลังกายได้เลย!');
          return 0;
        }
        soundManager.playCountdown(false);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountingDown]);

  // Process counted rep
  const handleRepCompleted = useCallback(() => {
    setCurrentReps((prevReps) => {
      const nextReps = prevReps + 1;
      const currentCombo = combo + 1;
      setCombo(currentCombo);
      setMaxCombo((m) => Math.max(m, currentCombo));

      // Calculate score with combo and bonus multiplier
      const basePoints = 100;
      const comboBonus = Math.min(currentCombo * 10, 50);
      const earned = Math.round((basePoints + comboBonus) * card.bonusMultiplier);
      setScore((s) => s + earned);

      // Play audio
      soundManager.playRepCount(currentCombo);
      if (currentCombo % 5 === 0) {
        soundManager.playComboUp();
      }

      // Visual feedback popup
      setRepPopup(`+1 REP! 🔥 COMBO x${currentCombo}`);
      setTimeout(() => setRepPopup(null), 900);

      // Check for completion
      if (nextReps >= targetReps) {
        const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        const totalCalories = Math.round(card.exercise.caloriesPerRep * nextReps * 10) / 10;
        const accuracy = Math.min(100, Math.round(85 + Math.random() * 15));
        const stars = currentCombo >= targetReps ? 3 : nextReps >= targetReps ? 2 : 1;

        soundManager.playVictory();

        setTimeout(() => {
          onCompleteWorkout({
            exerciseId: card.exercise.id,
            completedReps: nextReps,
            targetReps,
            score: score + earned,
            combo: currentCombo,
            maxCombo: Math.max(maxCombo, currentCombo),
            caloriesBurned: totalCalories,
            accuracy,
            durationSeconds: duration,
            stars
          });
        }, 600);
      }

      return nextReps;
    });
  }, [combo, card, targetReps, maxCombo, score, onCompleteWorkout]);

  // Manual trigger for simulator or test
  const triggerManualRep = () => {
    handleRepCompleted();
  };

  // Keyboard shortcut: Spacebar triggers rep in test mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isCountingDown) {
        e.preventDefault();
        triggerManualRep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCountingDown, handleRepCompleted]);

  // MediaPipe Pose Initialization and Camera Loop
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isActive = true;

    async function initCameraAndPose() {
      try {
        setFeedbackText('กำลังขอสิทธิ์ใช้งานกล้องเว็บแคม...');

        // 1. Get user camera stream
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });

        if (!isActive) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraActive(true);
        }

        // 2. Initialize MediaPipe Pose if available in window
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const MPPose = (window as any).Pose;

        if (MPPose) {
          setFeedbackText('กำลังโหลดโมเดล AI MediaPipe Pose...');
          const pose = new MPPose({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
          });

          pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pose.onResults((results: any) => {
            if (!isActive) return;

            const canvas = canvasRef.current;
            const video = videoRef.current;
            if (!canvas || !video) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Sync canvas dimensions
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
              canvas.width = video.videoWidth || 640;
              canvas.height = video.videoHeight || 480;
            }

            // Draw mirrored camera frame
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Dark futuristic tint overlay for neon glow pop
            ctx.fillStyle = 'rgba(10, 15, 29, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // If landmarks detected, mirror and analyze
            if (results.poseLandmarks && results.poseLandmarks.length > 0) {
              // Create mirrored landmarks for display match
              const mirroredLandmarks: PoseLandmark[] = results.poseLandmarks.map((lm: PoseLandmark) => ({
                ...lm,
                x: 1 - lm.x // mirror horizontally
              }));

              // Draw neon AR skeleton overlay
              drawNeonSkeleton(ctx, mirroredLandmarks, canvas.width, canvas.height, card.exercise.accentColor);

              // Analyze motion with tracker
              if (trackerRef.current && !isCountingDown) {
                const analysis: MotionAnalysisResult = trackerRef.current.analyzePose(results.poseLandmarks);
                
                setFeedbackText(analysis.feedbackText);
                setProgressPercent(analysis.progressPercent);
                setPrimaryMetric({
                  label: analysis.metricLabel,
                  value: analysis.primaryMetricValue
                });

                if (analysis.isRepCompleted) {
                  handleRepCompleted();
                }
              }
            } else {
              setFeedbackText('กรุณายืนให้กล้องมองเห็นทั้งตัว');
            }

            ctx.restore();
          });

          poseInstanceRef.current = pose;
          setIsAiLoaded(true);

          // Continuous Frame Pipeline
          const sendFrame = async () => {
            if (!isActive) return;
            if (videoRef.current && videoRef.current.readyState >= 2 && poseInstanceRef.current) {
              try {
                await poseInstanceRef.current.send({ image: videoRef.current });
              } catch {
                // Ignore transient frame drop
              }
            }
            animationFrameRef.current = requestAnimationFrame(sendFrame);
          };

          animationFrameRef.current = requestAnimationFrame(sendFrame);
        } else {
          // If MediaPipe Pose script didn't load from CDN, activate simulation mode
          setSimulationMode(true);
          setFeedbackText('กำลังเชื่อมต่อการตรวจจับ หรือใช้โหมดฝึกซ้อม');
        }

      } catch (err: unknown) {
        console.warn('Camera access issue:', err);
        setCameraError('ไม่สามารถเข้าถึงกล้องเว็บแคมได้ คุณสามารถใช้งานโหมดจำลองท่าทางเพื่อทดสอบได้');
        setSimulationMode(true);
      }
    }

    initCameraAndPose();

    return () => {
      isActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (poseInstanceRef.current) {
        try {
          poseInstanceRef.current.close();
        } catch {
          //
        }
      }
    };
  }, [card.exercise.accentColor, isCountingDown, handleRepCompleted]);

  // Color mappings
  const colorMap = {
    cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500', border: 'border-cyan-400', shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.4)]' },
    pink: { text: 'text-pink-400', bg: 'bg-pink-500', border: 'border-pink-500', shadow: 'shadow-[0_0_20px_rgba(236,72,153,0.4)]' },
    lime: { text: 'text-lime-400', bg: 'bg-lime-500', border: 'border-lime-400', shadow: 'shadow-[0_0_20px_rgba(132,204,22,0.4)]' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-400', shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-400', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]' },
  }[card.exercise.accentColor];

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-slate-950 flex flex-col p-3 sm:p-6 overflow-hidden">
      
      {/* Hidden processing video */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="hidden"
      />

      {/* Top HUD Bar */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 mb-3 z-30">
        
        {/* Left: Active Exercise Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancelWorkout}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="ออกจากการออกกำลังกาย"
          >
            <X className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">ภารกิจปัจจุบัน</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border border-slate-700 bg-slate-900 ${colorMap.text}`}>
                {card.exercise.categoryTh}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-display text-white">
              {card.exercise.titleTh}
            </h2>
          </div>
        </div>

        {/* Center: Live Rep Progress Bar */}
        <div className="hidden md:flex flex-col items-center flex-1 max-w-md mx-4">
          <div className="w-full flex justify-between text-xs text-slate-400 mb-1">
            <span>ความคืบหน้า</span>
            <span className="font-bold text-white font-display">
              {currentReps} / {targetReps} ครั้ง
            </span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-800 overflow-hidden p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${colorMap.bg}`}
              style={{ width: `${Math.min(100, (currentReps / targetReps) * 100)}%` }}
            />
          </div>
        </div>

        {/* Right: Controls & Score */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">คะแนนรอบนี้</span>
            <span className="text-base font-bold text-yellow-300 font-display">
              {score.toLocaleString()} PTS
            </span>
          </div>

          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={() => setShowGuideSidePanel(!showGuideSidePanel)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              showGuideSidePanel 
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="ดูคำแนะนำท่าทาง"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Arena Layout */}
      <div className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
        
        {/* Main Camera & AR Viewport (Span 3 cols on large screen) */}
        <div className={`${showGuideSidePanel ? 'lg:col-span-3' : 'lg:col-span-4'} relative w-full h-[520px] sm:h-[580px] lg:h-[640px] rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800/80 shadow-2xl flex items-center justify-center`}>
          
          {/* Real-time AR Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
          />

          {/* Camera Permission / Error Fallback Overlay */}
          {cameraError && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
              <CameraOff className="w-16 h-16 text-rose-400 mb-4 animate-pulse" />
              <h3 className="text-xl font-bold font-display text-white mb-2">
                ตรวจไม่พบสัญญาณกล้องเว็บแคม
              </h3>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                {cameraError} คุณยังคงสามารถทดสอบระบบนับรอบและการออกกำลังกายได้ทันทีด้วยโหมดจำลองด้านล่าง
              </p>
              <button
                onClick={triggerManualRep}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold font-display text-sm flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>จำลองการทำซ้ำ 1 ครั้ง (+1 REP)</span>
              </button>
            </div>
          )}

          {/* Countdown Overlay (3, 2, 1, GO) */}
          {isCountingDown && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
              <span className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-2">
                เตรียมพร้อมใน
              </span>
              <div className="w-32 h-32 rounded-full border-4 border-cyan-400/80 flex items-center justify-center bg-cyan-950/40 shadow-[0_0_40px_rgba(6,182,212,0.5)] animate-bounce">
                <span className="text-6xl font-black font-display text-white">
                  {countdownSeconds > 0 ? countdownSeconds : 'GO!'}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                ยืนถอยหลังให้กล้องมองเห็นศีรษะและสะโพก
              </p>
            </div>
          )}

          {/* Repetition Popup Effect */}
          {repPopup && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-bounce">
              <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-yellow-300 text-slate-950 font-black font-display text-2xl tracking-wider shadow-[0_0_35px_rgba(6,182,212,0.8)] border-2 border-white">
                {repPopup}
              </div>
            </div>
          )}

          {/* AR Target Frame Guide Overlay */}
          <div className="absolute inset-6 border border-cyan-500/20 rounded-xl pointer-events-none flex flex-col justify-between p-4">
            <div className="flex justify-between items-start">
              {/* Top Left Corner */}
              <div className="w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
              {/* Top Right Corner */}
              <div className="w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
            </div>
            <div className="flex justify-between items-end">
              {/* Bottom Left Corner */}
              <div className="w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
              {/* Bottom Right Corner */}
              <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
            </div>
          </div>

          {/* HUD Top-Left: Live Rep Counter Card */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">
              จำนวนครั้งที่ทำได้
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-4xl sm:text-5xl font-black font-display text-white ${colorMap.text}`}>
                {currentReps}
              </span>
              <span className="text-lg font-bold text-slate-500">
                / {targetReps}
              </span>
            </div>
            {combo > 1 && (
              <div className="flex items-center gap-1 mt-1 text-xs font-bold text-amber-400 animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>COMBO x{combo}</span>
              </div>
            )}
          </div>

          {/* HUD Top-Right: Metric Gauge */}
          <div className="absolute top-4 right-4 z-20 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-2xl p-3 text-right shadow-xl">
            <span className="text-[11px] text-slate-400 block">
              {primaryMetric.label}
            </span>
            <span className="text-xl font-bold font-mono text-cyan-300">
              {primaryMetric.value}
            </span>
          </div>

          {/* HUD Bottom: Real-Time Posture Feedback Pill */}
          <div className="absolute bottom-4 inset-x-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
            <div className="w-full sm:w-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-5 py-3 shadow-lg flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${progressPercent > 50 ? colorMap.bg : 'bg-slate-600'} transition-colors`} />
              <div className="text-left">
                <span className="text-[11px] text-slate-400 block font-medium">คำแนะนำท่วงท่าแบบเรียลไทม์</span>
                <span className="text-sm font-bold text-white">
                  {feedbackText}
                </span>
              </div>
            </div>

            {/* Quick Practice Rep Simulator Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={triggerManualRep}
                className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                title="กดเพื่อจำลองการทำซ้ำ 1 ครั้ง หรือกด Spacebar"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>จำลอง +1 ครั้ง (Spacebar)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Collapsible Exercise Guide Sidebar (Span 1 col) */}
        {showGuideSidePanel && (
          <div className="lg:col-span-1 bg-slate-900/95 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between overflow-y-auto max-h-[640px] shadow-xl">
            
            <div className="space-y-4">
              
              {/* Exercise Cartoon Reference */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={card.exercise.imageSrc}
                  alt={card.exercise.titleTh}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-cyan-400 border border-cyan-500/30">
                  ภาพการ์ตูนตัวอย่างท่า
                </div>
              </div>

              {/* Instructions List */}
              <div className="space-y-2 text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  วิธีปฏิบัติที่ถูกต้อง
                </h4>
                <ol className="space-y-2 text-xs text-slate-300">
                  {card.exercise.instructionsTh.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-left">
                <span className="text-[11px] font-semibold text-yellow-400 block mb-1">
                  💡 เคล็ดลับการตรวจจับ
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {card.exercise.tipsTh}
                </p>
              </div>

              {/* Target Muscles */}
              <div className="text-left text-xs text-slate-400">
                <span className="text-slate-500">กล้ามเนื้อที่ได้:</span>{' '}
                <span className="text-slate-300 font-medium">{card.exercise.targetMusclesTh}</span>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">แคลอรี่ประมาณการ:</span>
              <span className="font-bold text-amber-400 font-mono">
                ~{Math.round(card.exercise.caloriesPerRep * currentReps * 10) / 10} kcal
              </span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
