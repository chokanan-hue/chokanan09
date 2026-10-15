import { ExerciseType, PoseLandmark } from '../types/game';

// Standard MediaPipe Pose indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE: 2,
  RIGHT_EYE: 5,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

// Calculate 2D angle between three points with vertex at B
export function calculateAngle(
  pointA: PoseLandmark,
  pointB: PoseLandmark,
  pointC: PoseLandmark
): number {
  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return Math.round(angle);
}

// Calculate Euclidean distance between two landmarks
export function calculateDistance(p1: PoseLandmark, p2: PoseLandmark): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export interface MotionAnalysisResult {
  isRepCompleted: boolean;
  currentPhase: string;
  feedbackText: string;
  progressPercent: number; // 0 to 100 towards completing current rep
  primaryMetricValue: number; // e.g. knee angle degrees, or height
  metricLabel: string;
  bodyInFrame: boolean;
}

export class ExerciseMotionTracker {
  private exerciseType: ExerciseType;
  private statePhase: 'IDLE' | 'PROGRESSING' | 'PEAK' | 'RETURNING' = 'IDLE';
  private lastRepTimestamp: number = 0;
  private minRepIntervalMs: number = 450; // debounce between reps
  private subStepState: boolean = false; // for alternating exercises like high knees / punches

  constructor(exerciseType: ExerciseType) {
    this.exerciseType = exerciseType;
  }

  public setExercise(exerciseType: ExerciseType) {
    this.exerciseType = exerciseType;
    this.statePhase = 'IDLE';
    this.subStepState = false;
    this.lastRepTimestamp = 0;
  }

  public reset() {
    this.statePhase = 'IDLE';
    this.subStepState = false;
    this.lastRepTimestamp = 0;
  }

  public analyzePose(landmarks: PoseLandmark[]): MotionAnalysisResult {
    const defaultResult: MotionAnalysisResult = {
      isRepCompleted: false,
      currentPhase: 'รอเริ่มท่า',
      feedbackText: 'กรุณายืนในกรอบกล้อง',
      progressPercent: 0,
      primaryMetricValue: 0,
      metricLabel: 'ความพร้อม',
      bodyInFrame: false
    };

    if (!landmarks || landmarks.length < 29) {
      return defaultResult;
    }

    const ls = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rs = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const lh = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rh = landmarks[POSE_LANDMARKS.RIGHT_HIP];

    // Check visibility / body in frame
    const minVis = 0.45;
    const isShoulderVisible = (ls.visibility ?? 1) > minVis && (rs.visibility ?? 1) > minVis;
    const isHipVisible = (lh.visibility ?? 1) > minVis && (rh.visibility ?? 1) > minVis;

    if (!isShoulderVisible || !isHipVisible) {
      return {
        ...defaultResult,
        feedbackText: 'กรุณาถอยห่างจากกล้อง ให้เห็นลำตัวชัดเจน',
        bodyInFrame: false
      };
    }

    const now = Date.now();

    switch (this.exerciseType) {
      case 'squats':
        return this.analyzeSquat(landmarks, now);
      case 'jumping_jacks':
        return this.analyzeJumpingJacks(landmarks, now);
      case 'high_knees':
        return this.analyzeHighKnees(landmarks, now);
      case 'boxer_punches':
        return this.analyzeBoxerPunches(landmarks, now);
      case 'overhead_claps':
        return this.analyzeOverheadClaps(landmarks, now);
      case 'butt_kicks':
        return this.analyzeButtKicks(landmarks, now);
      case 'standing_crunches':
        return this.analyzeStandingCrunches(landmarks, now);
      case 'front_kicks':
        return this.analyzeFrontKicks(landmarks, now);
      case 'calf_raises':
        return this.analyzeCalfRaises(landmarks, now);
      case 'arm_circles':
        return this.analyzeArmCircles(landmarks, now);
      case 'side_reach':
        return this.analyzeSideReach(landmarks, now);
      case 'squat_pulses':
        return this.analyzeSquatPulses(landmarks, now);
      default:
        return defaultResult;
    }
  }

  // SQUATS: Hip -> Knee -> Ankle angle tracking
  private analyzeSquat(landmarks: PoseLandmark[], now: number): MotionAnalysisResult {
    const lh = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const lk = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const la = landmarks[POSE_LANDMARKS.LEFT_ANKLE];

    const rh = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const rk = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
    const ra = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    const leftKneeAngle = calculateAngle(lh, lk, la);
    const rightKneeAngle = calculateAngle(rh, rk, ra);
    const avgKneeAngle = Math.round((leftKneeAngle + rightKneeAngle) / 2);

    let isRepCompleted = false;
    let feedback = 'ย่อสะโพกลง เหมือนนั่งเก้าอี้';
    let progress = 0;

    // Standing: angle ~ 160-180
    // Deep squat: angle ~ 85-115
    if (avgKneeAngle > 155) {
      if (this.statePhase === 'PEAK' && (now - this.lastRepTimestamp > this.minRepIntervalMs)) {
        isRepCompleted = true;
        this.lastRepTimestamp = now;
        this.statePhase = 'IDLE';
        feedback = 'ยอดเยี่ยม! นับ 1 ครั้ง';
        progress = 100;
      } else {
        this.statePhase = 'IDLE';
        feedback = 'พร้อมแล้ว ย่อตัวลงช้าๆ';
        progress = 10;
      }
    } else if (avgKneeAngle <= 118) {
      // Reached good depth
      this.statePhase = 'PEAK';
      feedback = 'ดีมาก! ยืดตัวยืนขึ้น';
      progress = 90;
    } else {
      // Halfway down
      this.statePhase = 'PROGRESSING';
      const depthRatio = Math.max(0, Math.min(1, (160 - avgKneeAngle) / 45));
      progress = Math.round(depthRatio * 80);
      feedback = 'ย่อลงอีกนิดให้ถึง 90 องศา';
    }

    return {
      isRepCompleted,
      currentPhase: this.statePhase === 'PEAK' ? 'จุดย่อสุด' : this.statePhase === 'PROGRESSING' ? 'กำลังย่อ' : 'ท่ายืน',
      feedbackText: feedback,
      progressPercent: progress,
      primaryMetricValue: avgKneeAngle,
      metricLabel: 'มุมเข่า (เป้าหมาย ≤ 110°)',
      bodyInFrame: true
    };
  }

  // JUMPING JACKS: Arms above head + feet wide apart
  private analyzeJumpingJacks(landmarks: PoseLandmark[], now: number): MotionAnalysisResult {
    const ls = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rs = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const lw = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rw = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
    const lh = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rh = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const la = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const ra = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    const hipWidth = Math.max(0.08, calculateDistance(lh, rh));
    const ankleDist = calculateDistance(la, ra);
    const feetSpreadRatio = ankleDist / hipWidth;

    // In normalized coords, y=0 is top of screen, so wrist.y < shoulder.y means hands are raised
    const handsRaised = (lw.y < ls.y) && (rw.y < rs.y);
    const feetWide = feetSpreadRatio > 1.35;
    const handsDown = (lw.y > ls.y + 0.05) && (rw.y > rs.y + 0.05);
    const feetTogether = feetSpreadRatio < 1.15;

    let isRepCompleted = false;
    let feedback = 'กระโดดกางแขนและขาออกกว้างๆ';
    let progress = 0;

    if (handsRaised && feetWide) {
      this.statePhase = 'PEAK';
      feedback = 'ยอดเยี่ยม! หุบแขนและขากลับเข้าที่';
      progress = 85;
    } else if (handsDown && feetTogether) {
      if (this.statePhase === 'PEAK' && (now - this.lastRepTimestamp > this.minRepIntervalMs)) {
        isRepCompleted = true;
        this.lastRepTimestamp = now;
        this.statePhase = 'IDLE';
        feedback = 'เก่งมาก! นับ 1 ครั้ง';
        progress = 100;
      } else {
        this.statePhase = 'IDLE';
        feedback = 'พร้อมแล้ว กระโดดตบเลย!';
        progress = 15;
      }
    } else {
      this.statePhase = 'PROGRESSING';
      progress = handsRaised || feetWide ? 60 : 30;
      feedback = !handsRaised ? 'ยกแขนให้สูงขึ้นเหนือศีรษะ' : 'กางขาออกให้กว้างขึ้น';
    }

    return {
      isRepCompleted,
      currentPhase: this.statePhase === 'PEAK' ? 'กางแขนขา' : 'หุบชิด',
      feedbackText: feedback,
      progressPercent: progress,
      primaryMetricValue: Math.round(feetSpreadRatio * 100),
      metricLabel: 'ระยะกางขา/ยกแขน',
      bodyInFrame: true
    };
  }

  // HIGH KNEES: Alternate lifting knee to hip level
  private analyzeHighKnees(landmarks: PoseLandmark[], now: number): MotionAnalysisResult {
    const lh = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rh = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const lk = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const rk = landmarks[POSE_LANDMARKS.RIGHT_KNEE];

    // Vertical delta from hip to knee (in normalized coords, smaller diff = higher knee)
    const leftKneeDelta = lk.y - lh.y;
    const rightKneeDelta = rk.y - rh.y;

    const leftKneeHigh = leftKneeDelta < 0.22;
    const rightKneeHigh = rightKneeDelta < 0.22;

    let isRepCompleted = false;
    let feedback = 'ยกเข่าสูงแตะระดับเอว สลับซ้าย-ขวา';
    let progress = 20;

    if (leftKneeHigh && !this.subStepState) {
      this.subStepState = true;
      feedback = 'ดีมาก! สลับยกเข่าอีกข้าง';
      progress = 65;
    } else if (rightKneeHigh && this.subStepState) {
      if (now - this.lastRepTimestamp > this.minRepIntervalMs) {
        isRepCompleted = true;
        this.lastRepTimestamp = now;
        this.subStepState = false;
        feedback = 'สุดยอด! นับ 1 เซต';
        progress = 100;
      }
    } else if (leftKneeHigh || rightKneeHigh) {
      progress = 50;
      feedback = 'ยกเข่าให้สูงขึ้นอีกนิด!';
    }

    const minDelta = Math.min(leftKneeDelta, rightKneeDelta);
    const liftScore = Math.max(0, Math.min(100, Math.round((0.45 - minDelta) * 250)));

    return {
      isRepCompleted,
      currentPhase: this.subStepState ? 'สลับอีกข้าง' : 'ยกข้างแรก',
      feedbackText: feedback,
      progressPercent: progress,
      primaryMetricValue: liftScore,
      metricLabel: 'ความสูงเข่า',
      bodyInFrame: true
    };
  }

  // BOXER PUNCHES: Extended punch followed by retraction
  private analyzeBoxerPunches(landmarks: PoseLandmark[], now: number): MotionAnalysisResult {
    const ls = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const le = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
    const lw = landmarks[POSE_LANDMARKS.LEFT_WRIST];

    const rs = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const re = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
    const rw = landmarks[POSE_LANDMARKS.RIGHT_WRIST];

    const leftArmAngle = calculateAngle(ls, le, lw);
    const rightArmAngle = calculateAngle(rs, re, rw);

    // Punch extended: arm angle > 140
    const leftPunched = leftArmAngle > 142;
    const rightPunched = rightArmAngle > 142;

    let isRepCompleted = false;
    let feedback = 'ตั้งการ์ด ชกหมัดตรงซ้าย-ขวา';
    let progress = 20;

    if (leftPunched && !this.subStepState) {
      this.subStepState = true;
      feedback = 'หมัดซ้ายโดนใจ! ตามด้วยหมัดขวา';
      progress = 60;
    } else if (rightPunched && this.subStepState) {
      if (now - this.lastRepTimestamp > this.minRepIntervalMs) {
        isRepCompleted = true;
        this.lastRepTimestamp = now;
        this.subStepState = false;
        feedback = 'คอมโบหมัดสมบูรณ์แบบ! +1 REP';
        progress = 100;
      }
    } else if (leftPunched || rightPunched) {
      progress = 40;
      feedback = 'เหยียดหมัดไปข้างหน้าให้ชัดเจน';
    }

    const maxAngle = Math.max(leftArmAngle, rightArmAngle);

    return {
      isRepCompleted,
      currentPhase: this.subStepState ? 'หมัดขวา' : 'หมัดซ้าย',
      feedbackText: feedback,
      progressPercent: progress,
      primaryMetricValue: maxAngle,
      metricLabel: 'มุมเหยียดแขน (เป้าหมาย > 140°)',
      bodyInFrame: true
    };
  }

  // OVERHEAD ARM CLAPS
  private analyzeOverheadClaps(landmarks: PoseLandmark[], now: number): MotionAnalysisResult {
    const nose = landmarks[POSE_LANDMARKS.NOSE];
    const lw = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rw = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
    const ls = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rs = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];

    const handsOverHead = lw.y < nose.y && rw.y < nose.y;
    const handsDown = lw.y > ls.y && rw.y > rs.y;

    let isRepCompleted = false;
    let feedback = 'ยกแขนทั้งสองข้างขึ้นตรงเหนือศีรษะ';
    let progress = 20;

    if (handsOverHead) {
      this.statePhase = 'PEAK';
      feedback = 'ดีมาก! ดึงแขนลงมาระดับอก/ไหล่';
      progress = 85;
    } else if (handsDown) {
      if (this.statePhase === 'PEAK' && (now - this.lastRepTimestamp > this.minRepIntervalMs)) {
        isRepCompleted = true;
        this.lastRepTimestamp = now;
        this.statePhase = 'IDLE';
        feedback = 'ยอดเยี่ยม! นับ 1 ครั้ง';
        progress = 100;
      } else {
        this.statePhase = 'IDLE';
        feedback = 'ยกแขนขึ้นเหนือศีรษะให้สุด';
        progress = 25;
      }
    }

    return {
      isRepCompleted,
      currentPhase: this.statePhase === 'PEAK' ? 'ยกสุด' : 'ลดแขนลง',
      feedbackText: feedback,
      progressPercent: progress,
      primaryMetricValue: Math.round(Math.abs(lw.y - nose.y) * 100),
      metricLabel: 'ระดับความสูงแขน',
      bodyInFrame: true
    };
  }

  // BUTT KICKS: Heels kicked back towards glutes
  private analyzeButtKicks(landmarks: PoseLandmark[], now: number): MotionAnalysisResult {
    const lh = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rh = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const la = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const ra = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    const leftDist = calculateDistance(la, lh);
    const rightDist = calculateDistance(ra, rh);

    const leftKicked = leftDist < 0.35 || la.y < lh.y + 0.28;
    const rightKicked = rightDist < 0.35 || ra.y < rh.y + 0.28;

    let isRepCompleted = false;
    let feedback = 'ดีดส้นเท้าขึ้นแตะก้น สลับซ้าย-ขวา';
    let progress = 20;

    if (leftKicked && !this.subStepState) {
      this.subStepState = true;
      feedback = 'เยี่ยมมาก! สลับดีดส้นเท้าขวา';
      progress = 60;
    } else if (rightKicked && this.subStepState) {
      if (now - this.lastRepTimestamp > this.minRepIntervalMs) {
        isRepCompleted = true;
        this.lastRepTimestamp = now;
        this.subStepState = false;
        feedback = 'ยอดเยี่ยม! นับ 1 ครั้ง';
        progress = 100;
      }
    } else if (leftKicked || rightKicked) {
      progress = 40;
      feedback = 'ดีดส้นเท้าให้ชิดก้นอีกนิด!';
    }

    const minDistance = Math.min(leftDist, rightDist);
    const metricScore = Math.max(0, Math.min(100, Math.round((0.55 - minDistance) * 250)));

    return {
      isRepCompleted,
      currentPhase: this.subStepState ? 'ส้นขวา' : 'ส้นซ้าย',
      feedbackText: feedback,
      progressPercent: progress,
      primaryMetricValue: metricScore,
      metricLabel: 'ความใกล้ส้นเท้ากับก้น',
      bodyInFrame: true
    };
  }

  // STANDING CRUNCHES (Cross knee to opposite elbow)
  private analyzeStandingCrunches(landmarks: PoseLandmark[], now: number): MotionAnalysisResult {
    const le = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
    const re = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
    const lk = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const rk = landmarks[POSE_LANDMARKS.RIGHT_KNEE];

    const dist1 = calculateDistance(le, rk);
    const dist2 = calculateDistance(re, lk);

    const isCrunch1 = dist1 < 0.28;
    const isCrunch2 = dist2 < 0.28;

    let isRepCompleted = false;
    let feedback = 'ยกเข่าขึ้นพร้อมบิดข้อศอกตรงข้ามมาแตะ';
    let progress = 20;

    if (isCrunch1 && !this.subStepState) {
      this.subStepState = true;
      feedback = 'บิดเอวโดนใจ! สลับทำอีกข้าง';
      progress = 65;
    } else if (isCrunch2 && this.subStepState) {
      if (now - this.lastRepTimestamp > this.minRepIntervalMs) {
        isRepCompleted = true;
        this.lastRepTimestamp = now;
        this.subStepState = false;
        feedback = 'เก่งมาก! ครบ 1 เซต';
        progress = 100;
      }
    } else if (isCrunch1 || isCrunch2) {
      progress = 50;
      feedback = 'ดึงศอกและเข่าเข้าใกล้กันอีกนิด';
    }

    const closestDist = Math.min(dist1, dist2);
    const metricVal = Math.max(0, Math.min(100, Math.round((0.5 - closestDist) * 200)));

    return {
      isRepCompleted,
      currentPhase: this.subStepState ? 'สลับข้าง' : 'แตะข้างแรก',
      feedbackText: feedback,
      progressPercent: progress,
      primaryMetricValue: metricVal,
      metricLabel: 'ระยะแตะศอก-เข่า',
      bodyInFrame: true
    };
  }

  // FRONT KICKS: Leg kicked forward
  private analyzeFrontKicks(landmarks: PoseLandmark[], now: number): MotionAnalysisResult {
    const lh = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rh = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const la = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const ra = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    const leftKick = la.y < lh.y + 0.16;
    const rightKick = ra.y < rh.y + 0.16;

    let isRepCompleted = false;
    let feedback = 'เตะขาตรงไปข้างหน้าในระดับเอว';
    let progress = 20;

    if (leftKick && !this.subStepState) {
      this.subStepState = true;
      feedback = 'เตะซ้ายดีมาก! สลับเตะขวา';
      progress = 60;
    } else if (rightKick && this.subStepState) {
      if (now - this.lastRepTimestamp > this.minRepIntervalMs) {
        isRepCompleted = true;
        this.lastRepTimestamp = now;
        this.subStepState = false;
        feedback = 'คอมโบลูกเตะสวยงาม! +1 REP';
        progress = 100;
      }
    } else if (leftKick || rightKick) {
      progress = 40;
      feedback = 'เหยียดปลายเท้าเตะขึ้นสูงอีกนิด';
    }

    const highestKickY = Math.min(la.y, ra.y);
    const liftScore = Math.max(0, Math.min(100, Math.round((0.8 - highestKickY) * 180)));

    return {
      isRepCompleted,
      currentPhase: this.subStepState ? 'เตะขวา' : 'เตะซ้าย',
      feedbackText: feedback,
      progressPercent: progress,
      primaryMetricValue: liftScore,
      metricLabel: 'ความสูงลูกเตะ',
      bodyInFrame: true
    };
  }

  // CALF RAISES: Body elevation on tiptoes
  private analyzeCalfRaises(landmarks: PoseLandmark[], now: number): MotionAnalysisResult {
    const ls = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rs = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const nose = landmarks[POSE_LANDMARKS.NOSE];
    const lk = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const rk = landmarks[POSE_LANDMARKS.RIGHT_KNEE];

    const avgShoulderY = (ls.y + rs.y) / 2;
    const avgKneeY = (lk.y + rk.y) / 2;
    const heightDelta = avgKneeY - avgShoulderY;

    let isRepCompleted = false;
    let feedback = 'เขย่งปลายเท้าให้สูงที่สุด';
    let progress = 20;

    if (heightDelta > 0.44 || nose.y < 0.28) {
      this.statePhase = 'PEAK';
      feedback = 'ค้างไว้ 1 วิ แล้วค่อยๆ ลดส้นเท้าลง';
      progress = 85;
    } else {
      if (this.statePhase === 'PEAK' && (now - this.lastRepTimestamp > this.minRepIntervalMs)) {
        isRepCompleted = true;
        this.lastRepTimestamp = now;
        this.statePhase = 'IDLE';
        feedback = 'ยอดเยี่ยม! นับ 1 ครั้ง';
        progress = 100;
      } else {
        this.statePhase = 'IDLE';
        feedback = 'พร้อมแล้ว เขย่งปลายเท้าขึ้นเลย';
        progress = 20;
      }
    }

    return {
      isRepCompleted,
      currentPhase: this.statePhase === 'PEAK' ? 'จุดเขย่งสูงสุด' : 'วางส้นเท้า',
      feedbackText: feedback,
      progressPercent: progress,
      primaryMetricValue: Math.round(heightDelta * 100),
      metricLabel: 'ระดับการยืดตัว',
      bodyInFrame: true
    };
  }

  // ARM CIRCLES: Arms held horizontal
  private analyzeArmCircles(landmarks: PoseLandmark[], now: number): MotionAnalysisResult {
    const ls = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rs = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const lw = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rw = landmarks[POSE_LANDMARKS.RIGHT_WRIST];

    const leftArmHorizontal = Math.abs(lw.y - ls.y) < 0.16 && lw.x < ls.x - 0.15;
    const rightArmHorizontal = Math.abs(rw.y - rs.y) < 0.16 && rw.x > rs.x + 0.15;

    let isRepCompleted = false;
    let feedback = 'กางแขนทั้งสองข้างขนานพื้น';
    let progress = 25;

    if (leftArmHorizontal && rightArmHorizontal) {
      if (now - this.lastRepTimestamp > 1200) {
        isRepCompleted = true;
        this.lastRepTimestamp = now;
        feedback = 'ดีมาก! หมุนแขนต่อเนื่องเลย';
        progress = 100;
      } else {
        progress = Math.min(90, Math.round(((now - this.lastRepTimestamp) / 1200) * 100));
        feedback = 'รักษาระดับแขน หมุนเป็นวงกลม';
      }
    } else {
      feedback = 'ยกแขนให้สูงเสมอระดับหัวไหล่';
      progress = 30;
    }

    const armSpan = Math.round(calculateDistance(lw, rw) * 100);

    return {
      isRepCompleted,
      currentPhase: 'กำลังหมุนแขน',
      feedbackText: feedback,
      progressPercent: progress,
      primaryMetricValue: armSpan,
      metricLabel: 'ระยะกางแขน',
      bodyInFrame: true
    };
  }

  // STANDING SIDE REACH: Torso side stretch
  private analyzeSideReach(landmarks: PoseLandmark[], now: number): MotionAnalysisResult {
    const ls = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rs = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const lw = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rw = landmarks[POSE_LANDMARKS.RIGHT_WRIST];

    const leftSideReach = lw.y < ls.y && lw.x > rs.x - 0.05;
    const rightSideReach = rw.y < rs.y && rw.x < ls.x + 0.05;

    let isRepCompleted = false;
    let feedback = 'ยกแขนข้ามศีรษะ เอียงตัวยืดสีข้าง';
    let progress = 20;

    if (leftSideReach && !this.subStepState) {
      this.subStepState = true;
      feedback = 'ยืดสีข้างซ้ายดีมาก! สลับเอียงขวา';
      progress = 60;
    } else if (rightSideReach && this.subStepState) {
      if (now - this.lastRepTimestamp > this.minRepIntervalMs) {
        isRepCompleted = true;
        this.lastRepTimestamp = now;
        this.subStepState = false;
        feedback = 'ยอดเยี่ยม! ครบ 1 เซต';
        progress = 100;
      }
    } else if (leftSideReach || rightSideReach) {
      progress = 40;
      feedback = 'เอียงลำตัวด้านข้างให้รู้สึกตึงเบาๆ';
    }

    return {
      isRepCompleted,
      currentPhase: this.subStepState ? 'เอียงขวา' : 'เอียงซ้าย',
      feedbackText: feedback,
      progressPercent: progress,
      primaryMetricValue: progress,
      metricLabel: 'องศาการเอียงลำตัว',
      bodyInFrame: true
    };
  }

  // SQUAT PULSES: Pulsing in a half squat
  private analyzeSquatPulses(landmarks: PoseLandmark[], now: number): MotionAnalysisResult {
    const lh = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const lk = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const la = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rh = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const rk = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
    const ra = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    const leftKneeAngle = calculateAngle(lh, lk, la);
    const rightKneeAngle = calculateAngle(rh, rk, ra);
    const avgKneeAngle = Math.round((leftKneeAngle + rightKneeAngle) / 2);

    let isRepCompleted = false;
    let feedback = 'ย่อสะโพกครึ่งทาง แล้วเด้งจังหวะสั้นๆ';
    let progress = 30;

    if (avgKneeAngle <= 122) {
      this.statePhase = 'PEAK';
      feedback = 'ดีมาก! ดันตัวขึ้นเล็กน้อย';
      progress = 85;
    } else if (avgKneeAngle > 125 && avgKneeAngle < 150) {
      if (this.statePhase === 'PEAK' && (now - this.lastRepTimestamp > 380)) {
        isRepCompleted = true;
        this.lastRepTimestamp = now;
        this.statePhase = 'IDLE';
        feedback = 'เด้งต่อเนื่องเลย! +1 REP';
        progress = 100;
      }
    } else if (avgKneeAngle >= 155) {
      feedback = 'ย่อตัวลงครึ่งทาง ไม่ยืนตรงสุด';
      progress = 15;
    }

    return {
      isRepCompleted,
      currentPhase: 'สควอทพัลส์',
      feedbackText: feedback,
      progressPercent: progress,
      primaryMetricValue: avgKneeAngle,
      metricLabel: 'มุมเข่า (110° - 130°)',
      bodyInFrame: true
    };
  }
}

// Draw futuristic neon skeleton overlay on Canvas
export function drawNeonSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmark[],
  width: number,
  height: number,
  accentColor: 'cyan' | 'pink' | 'lime' | 'amber' | 'purple' = 'cyan'
) {
  if (!landmarks || landmarks.length < 29) return;

  // Color mapping
  const colorPalette = {
    cyan: { stroke: '#06b6d4', glow: 'rgba(6, 182, 212, 0.8)', joint: '#22d3ee', core: '#e0f2fe' },
    pink: { stroke: '#ec4899', glow: 'rgba(236, 72, 153, 0.8)', joint: '#f472b6', core: '#fdf2f8' },
    lime: { stroke: '#84cc16', glow: 'rgba(132, 204, 22, 0.8)', joint: '#a3e635', core: '#f7fee7' },
    amber: { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.8)', joint: '#fbbf24', core: '#fffbeb' },
    purple: { stroke: '#a855f7', glow: 'rgba(168, 85, 247, 0.8)', joint: '#c084fc', core: '#faf5ff' },
  }[accentColor];

  // Connections pairs
  const connections: [number, number][] = [
    // Torso box
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
    [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
    [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
    // Left arm
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
    [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
    // Right arm
    [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
    [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
    // Left leg
    [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
    [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
    // Right leg
    [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
    [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
  ];

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 1. Draw connecting laser bones
  connections.forEach(([p1Idx, p2Idx]) => {
    const p1 = landmarks[p1Idx];
    const p2 = landmarks[p2Idx];

    if ((p1.visibility ?? 1) > 0.4 && (p2.visibility ?? 1) > 0.4) {
      // Glow line
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.strokeStyle = colorPalette.glow;
      ctx.lineWidth = 8;
      ctx.shadowBlur = 15;
      ctx.shadowColor = colorPalette.stroke;
      ctx.stroke();

      // Sharp core line
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 0;
      ctx.stroke();
    }
  });

  // 2. Draw glowing neon joint nodes
  const keyNodes = [
    POSE_LANDMARKS.NOSE,
    POSE_LANDMARKS.LEFT_SHOULDER,
    POSE_LANDMARKS.RIGHT_SHOULDER,
    POSE_LANDMARKS.LEFT_ELBOW,
    POSE_LANDMARKS.RIGHT_ELBOW,
    POSE_LANDMARKS.LEFT_WRIST,
    POSE_LANDMARKS.RIGHT_WRIST,
    POSE_LANDMARKS.LEFT_HIP,
    POSE_LANDMARKS.RIGHT_HIP,
    POSE_LANDMARKS.LEFT_KNEE,
    POSE_LANDMARKS.RIGHT_KNEE,
    POSE_LANDMARKS.LEFT_ANKLE,
    POSE_LANDMARKS.RIGHT_ANKLE,
  ];

  keyNodes.forEach((nodeIdx) => {
    const node = landmarks[nodeIdx];
    if ((node.visibility ?? 1) > 0.4) {
      const cx = node.x * width;
      const cy = node.y * height;

      // Outer glow pulse
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, 2 * Math.PI);
      ctx.fillStyle = colorPalette.glow;
      ctx.shadowBlur = 12;
      ctx.shadowColor = colorPalette.stroke;
      ctx.fill();

      // Inner crisp neon circle
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
      ctx.fillStyle = colorPalette.joint;
      ctx.fill();

      // Center bright pip
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  });

  ctx.restore();
}
