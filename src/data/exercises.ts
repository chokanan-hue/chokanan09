import { ExerciseInfo, ExerciseType, FlashCard } from '../types/game';

import jumpingJacksImg from '../assets/images/exercise_jumping_jacks_1792051819601.jpg';
import squatsImg from '../assets/images/exercise_squats_1792051822069.jpg';
import highKneesImg from '../assets/images/exercise_high_knees_1792051822857.jpg';
import boxerPunchesImg from '../assets/images/exercise_boxer_punches_1792051821606.jpg';
import buttKicksImg from '../assets/images/exercise_butt_kicks_1792053388071.jpg';
import standingCrunchesImg from '../assets/images/exercise_standing_crunches_1792053389135.jpg';
import frontKicksImg from '../assets/images/exercise_front_kicks_1792053388424.jpg';

export const EXERCISE_DATABASE: Record<ExerciseType, ExerciseInfo> = {
  jumping_jacks: {
    id: 'jumping_jacks',
    titleTh: 'กระโดดตบ (Jumping Jacks)',
    titleEn: 'Jumping Jacks',
    categoryTh: 'คาร์ดิโอ & เผาผลาญไขมัน',
    descriptionTh: 'ท่าออกกำลังกายคลาสสิกที่ช่วยกระตุ้นการเต้นของหัวใจ เสริมสร้างความแข็งแรงของกล้ามเนื้อทั่วร่างกาย ทั้งแขน ขา และลำตัว',
    instructionsTh: [
      'เริ่มต้นด้วยการยืนตรง เท้าชิด แขนแนบข้างลำตัว',
      'กระโดดพร้อมแยกเท้าออกกว้างกว่าช่วงไหล่ และยกแขนทั้งสองข้างขึ้นเหนือศีรษะ',
      'กระโดดอีกครั้งเพื่อหุบขากลับมาชิดกัน และลดแขนลงข้างลำตัวในท่าเริ่มต้น',
      'ควบคุมจังหวะการหายใจให้สม่ำเสมอและกระโดดลงด้วยปลายเท้าเบาๆ'
    ],
    tipsTh: 'กางแขนและขาให้สุดจังหวะ กล้องจะตรวจจับเมื่อข้อมือยกสูงกว่าไหล่และเท้าแยกกว้าง',
    targetMusclesTh: 'น่อง, ต้นขา, ไหล่, แกนกลางลำตัว',
    imageSrc: jumpingJacksImg,
    difficulty: 'ง่าย (Easy)',
    defaultReps: 10,
    caloriesPerRep: 0.25,
    accentColor: 'cyan',
    metricGuide: 'ยกมือเหนือศีรษะ + กางขาออกกว้าง'
  },
  squats: {
    id: 'squats',
    titleTh: 'สควอท (Bodyweight Squats)',
    titleEn: 'Squats',
    categoryTh: 'กระชับต้นขา & สะโพก',
    descriptionTh: 'สุดยอดท่าบริหารท่อนล่าง ช่วยเสริมสร้างกล้ามเนื้อต้นขาด้านหน้า สะโพก และก้น พร้อมเสริมความมั่นคงของข้อต่อเข่า',
    instructionsTh: [
      'ยืนตรง แยกเท้ากว้างประมาณช่วงไหล่ ปลายเท้าชี้เฉียงออกเล็กน้อย',
      'ยืดอก หลังตรง ยื่นแขนไปด้านหน้าเพื่อช่วยทรงตัว',
      'งอเข่าและดันสะโพกไปด้านหลัง ย่อตัวลงเหมือนกำลังนั่งเก้าอี้ จนต้นขาขนานกับพื้น',
      'ออกแรงดันส้นเท้า เหยียดขากลับขึ้นสู่ท่ายืนตรง โดยไม่ล็อคเข่า'
    ],
    tipsTh: 'ระวังอย่าให้เข่าเลยปลายเท้า และรักษาแนวกระดูกสันหลังให้ตรง กล้องจะตรวจจับมุมการย่อของสะโพกและเข่า',
    targetMusclesTh: 'ต้นขาด้านหน้า (Quads), ก้น (Glutes), แฮมสตริง',
    imageSrc: squatsImg,
    difficulty: 'ปานกลาง (Medium)',
    defaultReps: 8,
    caloriesPerRep: 0.35,
    accentColor: 'lime',
    metricGuide: 'ย่อสะโพกลงให้ต้นขาขนานพื้น แล้วยืนขึ้นสุด'
  },
  high_knees: {
    id: 'high_knees',
    titleTh: 'ยกเข่าสูง (High Knees)',
    titleEn: 'High Knees',
    categoryTh: 'คาร์ดิโอ & หน้าท้องล่าง',
    descriptionTh: 'ท่าวิ่งยกเข่าขึ้นสูง ช่วยกระตุ้นระบบไหลเวียนโลหิต ฝึกความคล่องตัว และกระชับกล้ามเนื้อหน้าท้องส่วนล่างอย่างยอดเยี่ยม',
    instructionsTh: [
      'ยืนตัวตรง แยกเท้าเล็กน้อย แขนตั้งงอ 90 องศาข้างลำตัว',
      'ยกเข่าขวาขึ้นสูงระดับสะโพก พร้อมแกว่งแขนซ้ายไปข้างหน้า',
      'วางเท้าขวาลงพร้อมสลับยกเข่าซ้ายขึ้นสูงทันทีในจังหวะต่อเนื่อง',
      'เกร็งหน้าท้อง ลำตัวตรง ไม่เอนตัวไปด้านหลังขณะยกเข่า'
    ],
    tipsTh: 'พยายามยกเข่าให้สูงแตะระดับเอว/สะโพก กล้องจะตรวจจับเมื่อเข่าลอยสูงขึ้นในแต่ละข้าง',
    targetMusclesTh: 'กล้ามเนื้อสะโพก (Hip Flexors), หน้าท้องล่าง, น่อง',
    imageSrc: highKneesImg,
    difficulty: 'ปานกลาง (Medium)',
    defaultReps: 12,
    caloriesPerRep: 0.22,
    accentColor: 'amber',
    metricGuide: 'ยกเข่าสูงถึงระดับสะโพก สลับซ้าย-ขวา'
  },
  boxer_punches: {
    id: 'boxer_punches',
    titleTh: 'ชกมวยหมัดตรง (Shadow Boxer Punches)',
    titleEn: 'Boxer Punches',
    categoryTh: 'กระชับต้นแขน & เบิร์นไขมัน',
    descriptionTh: 'ท่าต่อยมวยแบบคาร์ดิโอ ช่วยบริหารหัวไหล่ หลังส่วนบน และต้นแขน พร้อมฝึกจังหวะการเคลื่อนไหวที่ฉับไวสนุกสนาน',
    instructionsTh: [
      'ยืนตั้งการ์ดมวย เท้าข้างหนึ่งนำหน้าเล็กน้อย กำหมัดระดับคาง',
      'ชกหมัดซ้ายตรงไปข้างหน้า เหยียดแขนเกือบสุดพร้อมบิดข้อมือคว่ำลงเล็กน้อย',
      'ดึงหมัดซ้ายกลับมาป้องกันคาง พร้อมชกหมัดขวาตรงออกไปข้างหน้า',
      'ถ่ายน้ำหนักจากสะโพกเพื่อเพิ่มพลังและความคล่องแคล่วในการชก'
    ],
    tipsTh: 'ชกเหยียดแขนออกไปด้านหน้าให้ชัดเจน กล้องจะนับจังหวะหมัดที่ยื่นออกแล้วดึงกลับ',
    targetMusclesTh: 'ไหล่, ต้นแขนด้านหลัง (Triceps), กล้ามเนื้อหลังส่วนบน',
    imageSrc: boxerPunchesImg,
    difficulty: 'ง่าย (Easy)',
    defaultReps: 14,
    caloriesPerRep: 0.18,
    accentColor: 'pink',
    metricGuide: 'ชกหมัดตรงสลับซ้าย-ขวาอย่างชัดเจน'
  },
  overhead_claps: {
    id: 'overhead_claps',
    titleTh: 'ยกแขนเหนือศีรษะ (Overhead Arm Reach)',
    titleEn: 'Overhead Arm Reach',
    categoryTh: 'ยืดเหยียด & เสริมความแข็งแรงไหล่',
    descriptionTh: 'ท่าบริหารข้อต่อหัวไหล่และหลังส่วนบน ช่วยลดอาการตึงจากออฟฟิศซินโดรมและบริหารกล้ามเนื้อช่วงอกและสะบัก',
    instructionsTh: [
      'ยืนตรงหรือนั่งหลังตรง เท้าชิด ลำตัวสง่างาม',
      'ยกแขนทั้งสองข้างขึ้นตรงเหนือศีรษะจนมือชิดหรือแตะกัน',
      'ดึงข้อศอกและแขนลงมาระดับอกในลักษณะกางศอกออกกว้าง',
      'ทำซ้ำด้วยจังหวะที่นุ่มนวลและควบคุมกล้ามเนื้อสะบัก'
    ],
    tipsTh: 'เหยียดแขนตรงเหนือศีรษะให้สุด แล้วลดแขนลงมาระดับไหล่/อก',
    targetMusclesTh: 'หัวไหล่ (Deltoids), กล้ามเนื้อสะบัก (Trapezius)',
    imageSrc: jumpingJacksImg,
    difficulty: 'ง่าย (Easy)',
    defaultReps: 10,
    caloriesPerRep: 0.15,
    accentColor: 'purple',
    metricGuide: 'ยกแขนทั้งสองข้างขึ้นเหนือศีรษะ แล้วลดลงมาเสมอไหล่'
  },
  butt_kicks: {
    id: 'butt_kicks',
    titleTh: 'วิ่งเตะส้นเท้าแตะก้น (Butt Kicks)',
    titleEn: 'Butt Kicks',
    categoryTh: 'คาร์ดิโอ & ต้นขาด้านหลัง',
    descriptionTh: 'ท่าวิ่งเหยาะอยู่กับที่แล้วดีดส้นเท้าขึ้นมาแตะบริเวณก้น ช่วยยืดกล้ามเนื้อหน้าขาและบริหารแฮมสตริงอย่างมีประสิทธิภาพ',
    instructionsTh: [
      'ยืนตรง แยกเท้าเท่าช่วงสะโพก งอข้อศอก 90 องศา',
      'วิ่งเหยาะอยู่กับที่ พับเข่าดีดส้นเท้าขวาขึ้นแตะก้นหรือใกล้เคียงก้น',
      'วางเท้าขวาลงแล้วสลับดีดส้นเท้าซ้ายขึ้นอย่างต่อเนื่องและมีจังหวะ',
      'ลำตัวตรง เอนตัวไปข้างหน้าเล็กน้อย ไม่แอ่นหลัง'
    ],
    tipsTh: 'พับเข่าดึงส้นเท้าขึ้นมาให้สูง กล้องจะตรวจจับจังหวะการงอเข่าขึ้นด้านหลังสลับสองข้าง',
    targetMusclesTh: 'แฮมสตริง (Hamstrings), หน้าขา (Quads), น่อง',
    imageSrc: buttKicksImg,
    difficulty: 'ง่าย (Easy)',
    defaultReps: 12,
    caloriesPerRep: 0.22,
    accentColor: 'lime',
    metricGuide: 'พับเข่าดีดส้นเท้าขึ้นแตะก้น สลับซ้าย-ขวา'
  },
  standing_crunches: {
    id: 'standing_crunches',
    titleTh: 'แทงเข่าแตะศอกตรงข้าม (Cross Knee-to-Elbow)',
    titleEn: 'Cross Knee-to-Elbow',
    categoryTh: 'กระชับเอว & แกนกลางลำตัว',
    descriptionTh: 'ท่าบริหารหน้าท้องและกล้ามเนื้อเอวด้านข้างในท่ายืน โดยไม่ต้องนอนราบกับพื้น ปลอดภัยต่อหลังและช่วยฝึกการทรงตัว',
    instructionsTh: [
      'ยืนตรง แยกเท้าเท่าช่วงไหล่ วางปลายนิ้วแตะเบาๆ ที่หลังศีรษะ กางข้อศอกออกกว้าง',
      'ยกเข่าขวาเฉียงขึ้นมาที่หน้าอก พร้อมบิดลำตัวนำข้อศอกซ้ายไปแตะหรือใกล้เข่าขวา',
      'ลดขาลงสู่ท่ายืนตรง แล้วสลับยกเข่าซ้ายแตะข้อศอกขวา',
      'เกร็งหน้าท้องและหายใจออกขณะบิดแตะ'
    ],
    tipsTh: 'บิดลำตัวจากช่วงเอวเพื่อให้ศอกและเข่าเข้าใกล้กันมากที่สุด กล้องจะตรวจจับการเข้าใกล้กันของศอกและเข่าตรงข้าม',
    targetMusclesTh: 'กล้ามเนื้อเอวด้านข้าง (Obliques), หน้าท้อง, กล้ามเนื้อสะโพก',
    imageSrc: standingCrunchesImg,
    difficulty: 'ปานกลาง (Medium)',
    defaultReps: 10,
    caloriesPerRep: 0.28,
    accentColor: 'cyan',
    metricGuide: 'ยกเข่าขึ้นพร้อมบิดข้อศอกตรงข้ามลงมาแตะ'
  },
  front_kicks: {
    id: 'front_kicks',
    titleTh: 'เตะขาตรงไปข้างหน้า (Front Kicks)',
    titleEn: 'Front Kicks',
    categoryTh: 'กระชับสะโพก & ฝึกการทรงตัว',
    descriptionTh: 'ท่าเตะตรงสไตล์ศิลปะการต่อสู้ ช่วยฝึกกล้ามเนื้อสะโพก หน้าขา และแกนกลางลำตัว พร้อมเพิ่มความยืดหยุ่นของขา',
    instructionsTh: [
      'ยืนตั้งการ์ด เท้าแยกกว้างระดับไหล่ กำหมัดระดับอก',
      'ยกเข่าขวาขึ้นระดับเอว แล้วเหยียดปลายเท้าเตะตรงออกไปข้างหน้าในระดับสะโพกหรือเอว',
      'ดึงขากลับลงมาวางที่เดิม แล้วสลับยกเข่าซ้ายเตะตรงไปข้างหน้า',
      'ทรงตัวบนเท้าหลักให้มั่นคงและเกร็งหน้าท้องขณะเตะ'
    ],
    tipsTh: 'เหยียดขาเตะไปข้างหน้าอย่างชัดเจน กล้องจะนับจังหวะเท้าที่เหยียดยกขึ้นและดึงกลับ',
    targetMusclesTh: 'กล้ามเนื้อหน้าขา, ข้อต่อสะโพก, กล้ามเนื้อแกนกลาง',
    imageSrc: frontKicksImg,
    difficulty: 'ปานกลาง (Medium)',
    defaultReps: 10,
    caloriesPerRep: 0.24,
    accentColor: 'amber',
    metricGuide: 'ยกเข่าแล้วเตะเหยียดขาตรงไปข้างหน้า'
  },
  calf_raises: {
    id: 'calf_raises',
    titleTh: 'เขย่งปลายเท้ากระชับน่อง (Standing Calf Raises)',
    titleEn: 'Calf Raises',
    categoryTh: 'กระชับเรียวน่อง & ข้อเท้า',
    descriptionTh: 'ท่าบริหารกล้ามเนื้อน่องและข้อเท้าให้แข็งแรง ป้องกันการสะดุดล้มและช่วยให้ขาดูเพรียวกระชับ ทำได้ง่ายมากในพื้นที่แคบ',
    instructionsTh: [
      'ยืนตรง แยกเท้าเท่าช่วงสะโพก ลำตัวตั้งตรง มองตรงไปข้างหน้า',
      'ออกแรงดันปลายเท้า เขย่งส้นเท้าทั้งสองข้างให้ลอยสูงขึ้นจากพื้นให้มากที่สุด',
      'ค้างไว้ที่จุดสูงสุดประมาณ 1 วินาที รู้สึกถึงการเกร็งที่กล้ามเนื้อน่อง',
      'ค่อยๆ ลดส้นเท้าลงช้าๆ เกือบแตะพื้น แล้วเขย่งขึ้นซ้ำทันที'
    ],
    tipsTh: 'เขย่งตัวขึ้นให้ลำตัวสูงขึ้นชัดเจน กล้องจะตรวจจับการยกลอยขึ้นของแนวไหล่และศีรษะ',
    targetMusclesTh: 'กล้ามเนื้อน่อง (Gastrocnemius & Soleus), ข้อเท้า',
    imageSrc: highKneesImg,
    difficulty: 'ง่าย (Easy)',
    defaultReps: 12,
    caloriesPerRep: 0.15,
    accentColor: 'lime',
    metricGuide: 'เขย่งปลายเท้าขึ้นสูงสุด แล้วลดลงช้าๆ'
  },
  arm_circles: {
    id: 'arm_circles',
    titleTh: 'หมุนแขนบริหารหัวไหล่ (Arm Circles)',
    titleEn: 'Arm Circles',
    categoryTh: 'กระชับต้นแขน & คลายกล้ามเนื้อไหล่',
    descriptionTh: 'ท่าคาร์ดิโอท่อนบนที่ไม่ใช้อุปกรณ์ กางแขนขนานพื้นแล้ววาดวงกลม ช่วยกระชับต้นแขนและบรรเทาอาการเมื่อยล้าสะบัก',
    instructionsTh: [
      'ยืนตัวตรง แยกเท้าเท่าช่วงไหล่ กางแขนทั้งสองข้างออกด้านข้างให้ขนานกับพื้น',
      'คว่ำฝ่ามือลง หมุนแขนทั้งสองข้างเป็นวงกลมขนาดเล็กไปข้างหน้าอย่างต่อเนื่อง',
      'รักษาแนวแขนให้อยู่ระดับเดียวกับหัวไหล่ ไม่ให้แขนตก',
      'เมื่อครบเซตสามารถสลับหมุนย้อนกลับไปด้านหลังได้'
    ],
    tipsTh: 'รักษาระดับแขนให้อยู่ระดับหัวไหล่เสมอ กล้องจะตรวจจับว่าแขนยังคงกางขนานกับพื้นอย่างต่อเนื่อง',
    targetMusclesTh: 'หัวไหล่ (Deltoids), กล้ามเนื้อหลังส่วนบน, ต้นแขน',
    imageSrc: boxerPunchesImg,
    difficulty: 'ง่าย (Easy)',
    defaultReps: 12,
    caloriesPerRep: 0.16,
    accentColor: 'pink',
    metricGuide: 'กางแขนขนานพื้น หมุนเป็นวงกลมอย่างต่อเนื่อง'
  },
  side_reach: {
    id: 'side_reach',
    titleTh: 'เอียงตัวยืดสีข้าง (Standing Side Reach)',
    titleEn: 'Standing Side Reach',
    categoryTh: 'ยืดเหยียด & เสริมความยืดหยุ่นลำตัว',
    descriptionTh: 'ท่ายืดกล้ามเนื้อด้านข้างลำตัวและกระดูกสันหลัง ช่วยเพิ่มความยืดหยุ่น ลดความตึงตัวของหลังและเอวได้อย่างยอดเยี่ยม',
    instructionsTh: [
      'ยืนตรง แยกเท้ากว้างกว่าช่วงไหล่เล็กน้อย มือข้างหนึ่งวางที่สะโพก',
      'ยกแขนอีกข้างขึ้นสูงเหนือศีรษะ แล้วค่อยๆ เอียงลำตัวไปด้านตรงข้าม',
      'รู้สึกถึงการยืดเหยียดเบาๆ ที่สีข้าง ดึงลำตัวกลับมาตรง',
      'สลับยกแขนอีกข้างแล้วเอียงตัวไปอีกด้าน'
    ],
    tipsTh: 'ยกแขนข้ามศีรษะและเอียงตัวด้านข้างให้ชัดเจน กล้องจะตรวจจับมุมเอียงของลำตัวและแขนที่ข้ามผ่านศีรษะ',
    targetMusclesTh: 'กล้ามเนื้อด้านข้างลำตัว (Obliques), กล้ามเนื้อสะบักหลัง (Lats)',
    imageSrc: standingCrunchesImg,
    difficulty: 'ง่าย (Easy)',
    defaultReps: 10,
    caloriesPerRep: 0.18,
    accentColor: 'purple',
    metricGuide: 'ยกแขนข้ามศีรษะ เอียงลำตัวสลับซ้าย-ขวา'
  },
  squat_pulses: {
    id: 'squat_pulses',
    titleTh: 'สควอทจังหวะสั้น (Half Squat Pulses)',
    titleEn: 'Squat Pulses',
    categoryTh: 'กระชับต้นขาเข้มข้น & ก้น',
    descriptionTh: 'ท่าสควอทในระยะครึ่งทางแล้วขยับขึ้นลงเป็นจังหวะสั้นๆ ช่วยกระตุ้นเส้นใยกล้ามเนื้อต้นขาและก้นให้ตื่นตัวและเผาผลาญเร็วขึ้น',
    instructionsTh: [
      'ยืนแยกเท้ากว้างเท่าช่วงไหล่ ประสานมือไว้ที่ระดับอก',
      'ย่อตัวลงสู่ท่าฮาล์ฟสควอท (ต้นขาทำมุมประมาณ 100-110 องศา)',
      'ขยับตัวขึ้นลงเบาๆ เพียง 2-3 นิ้ว โดยไม่ต้องยืดตัวขึ้นจนสุด',
      'รักษาแรงตึงที่กล้ามเนื้อต้นขาตลอดเวลา หายใจเข้าออกสม่ำเสมอ'
    ],
    tipsTh: 'ค้างตัวในท่ากึ่งย่อแล้วเด้งขึ้นลงเบาๆ กล้องจะตรวจจับจังหวะการยุบตัวและดันตัวขึ้นซ้ำๆ',
    targetMusclesTh: 'ต้นขาด้านหน้า (Quads), ก้น (Glutes), แกนกลางลำตัว',
    imageSrc: squatsImg,
    difficulty: 'ปานกลาง (Medium)',
    defaultReps: 10,
    caloriesPerRep: 0.32,
    accentColor: 'lime',
    metricGuide: 'ย่อตัวครึ่งทางแล้วเด้งขึ้นลงจังหวะสั้นๆ'
  }
};

export const EXERCISE_LIST = Object.values(EXERCISE_DATABASE);

// Intelligent 3-card draw with exclusion of recently drawn exercises to guarantee variety across rounds
export function drawThreeCards(excludeExerciseIds: string[] = []): FlashCard[] {
  // Filter out recently drawn exercises if possible to avoid immediate repeats
  let pool = EXERCISE_LIST.filter((ex) => !excludeExerciseIds.includes(ex.id));
  
  // If pool has fewer than 3 remaining, replenish with all exercises
  if (pool.length < 3) {
    pool = [...EXERCISE_LIST];
  }

  // Shuffle pool with Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selectedExercises = shuffled.slice(0, 3);
  const bonuses = [1.0, 1.2, 1.5];

  return selectedExercises.map((exercise, index) => {
    const bonus = bonuses[index % bonuses.length];
    return {
      cardId: `card-${Date.now()}-${index}`,
      exercise,
      isFlipped: false,
      isSelected: false,
      bonusMultiplier: bonus
    };
  });
}
