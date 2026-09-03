<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
    <!-- Backdrop Overlay -->
    <div 
      class="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm transition-opacity" 
      @click="$emit('close')"
    ></div>

    <!-- Modal Panel -->
    <div class="relative w-full max-w-4xl rounded-2xl bg-brand-paper shadow-warm-xl border border-brand-sand overflow-hidden z-10 my-6 flex flex-col max-h-[92vh]">
      
      <!-- Header -->
      <div class="px-5 py-4 bg-brand-cream/90 border-b border-brand-sand flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-brand-chestnut flex items-center justify-center text-white shadow-warm-sm">
            <Award class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-base text-brand-espresso">
                {{ t('evalTitle') }}
              </h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-cream text-brand-chestnut border border-brand-sand">
                Proposal Section 7
              </span>
            </div>
            <p class="text-xs text-brand-mocha/70 mt-0.5">
              {{ t('evalSubtitle') }}
            </p>
          </div>
        </div>

        <button 
          @click="$emit('close')"
          class="w-8 h-8 rounded-lg bg-brand-sand/60 hover:bg-brand-sand text-brand-mocha flex items-center justify-center transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="px-5 bg-brand-sand/30 border-b border-brand-sand/60 flex items-center gap-4 text-xs font-bold">
        <button
          @click="activeTab = 'benchmark'"
          class="py-3 border-b-2 flex items-center gap-1.5 transition-colors"
          :class="activeTab === 'benchmark' ? 'border-brand-chestnut text-brand-chestnut' : 'border-transparent text-brand-mocha/70 hover:text-brand-espresso'"
        >
          <Zap class="w-4 h-4" />
          <span>{{ t('evalTabBenchmark') }}</span>
        </button>

        <button
          @click="activeTab = 'survey'"
          class="py-3 border-b-2 flex items-center gap-1.5 transition-colors"
          :class="activeTab === 'survey' ? 'border-brand-chestnut text-brand-chestnut' : 'border-transparent text-brand-mocha/70 hover:text-brand-espresso'"
        >
          <Smile class="w-4 h-4" />
          <span>{{ t('evalTabSurvey') }}</span>
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
        
        <!-- TAB 1: MATCHING BENCHMARK -->
        <div v-if="activeTab === 'benchmark'" class="space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-brand-cream/40 border border-brand-sand">
            <div>
              <h4 class="font-bold text-sm text-brand-espresso">
                {{ isTh ? 'ชุดข้อมูลทดสอบ Ground Truth (10 กรณีศึกษา)' : 'Ground Truth Benchmark Dataset (10 Test Cases)' }}
              </h4>
              <p class="text-xs text-brand-mocha/70 mt-0.5">
                {{ isTh ? 'ทดสอบ 5 คู่ตรงจริง (True Matches) และ 5 คู่ตรงข้าม (True Non-Matches) ตามเกณฑ์ Proposal 4 & 7.2' : 'Evaluates 5 positive match pairs and 5 negative pairs across 5 factors.' }}
              </p>
            </div>
            <button
              @click="handleRunBenchmark"
              class="px-4 py-2 rounded-xl bg-brand-chestnut hover:bg-brand-mocha text-white text-xs font-bold transition-all shadow-warm-sm flex items-center gap-1.5 shrink-0 self-start sm:self-center"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>{{ t('btnRunBenchmark') }}</span>
            </button>
          </div>

          <!-- KPI Metric Cards -->
          <div v-if="benchmarkResults" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3.5 rounded-xl bg-brand-paper border border-brand-sand text-center shadow-warm-sm">
              <span class="text-[11px] font-bold text-brand-mocha/70 block uppercase tracking-wider mb-1">
                {{ t('evalMetricAccuracy') }}
              </span>
              <span class="text-2xl font-extrabold text-found">
                {{ benchmarkResults.accuracy }}%
              </span>
              <span class="text-[10px] text-brand-latte block mt-0.5">({{ benchmarkResults.truePositives + benchmarkResults.trueNegatives }}/{{ benchmarkResults.total }} ถูกต้อง)</span>
            </div>

            <div class="p-3.5 rounded-xl bg-brand-paper border border-brand-sand text-center shadow-warm-sm">
              <span class="text-[11px] font-bold text-brand-mocha/70 block uppercase tracking-wider mb-1">
                {{ t('evalMetricPrecision') }}
              </span>
              <span class="text-2xl font-extrabold text-brand-espresso">
                {{ benchmarkResults.precision }}%
              </span>
              <span class="text-[10px] text-brand-latte block mt-0.5">(TP / TP+FP)</span>
            </div>

            <div class="p-3.5 rounded-xl bg-brand-paper border border-brand-sand text-center shadow-warm-sm">
              <span class="text-[11px] font-bold text-brand-mocha/70 block uppercase tracking-wider mb-1">
                {{ t('evalMetricRecall') }}
              </span>
              <span class="text-2xl font-extrabold text-brand-espresso">
                {{ benchmarkResults.recall }}%
              </span>
              <span class="text-[10px] text-brand-latte block mt-0.5">(TP / TP+FN)</span>
            </div>

            <div class="p-3.5 rounded-xl bg-brand-paper border border-brand-sand text-center shadow-warm-sm">
              <span class="text-[11px] font-bold text-brand-mocha/70 block uppercase tracking-wider mb-1">
                {{ t('evalMetricAvgScore') }}
              </span>
              <span class="text-2xl font-extrabold text-brand-caramel">
                {{ benchmarkResults.avgMatchedScore }}%
              </span>
              <span class="text-[10px] text-brand-latte block mt-0.5">(คะแนนเฉลี่ยคู่ที่ถูกต้อง)</span>
            </div>
          </div>

          <!-- Confusion Matrix Summary -->
          <div v-if="benchmarkResults" class="p-4 rounded-xl bg-brand-cream/30 border border-brand-sand">
            <h5 class="font-bold text-xs text-brand-espresso mb-2.5">
              ตาราง Confusion Matrix (การจำแนกผลการจับคู่):
            </h5>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div class="p-2 rounded-lg bg-green-50 border border-green-200 text-green-900">
                <span class="font-bold block">True Positive (TP): {{ benchmarkResults.truePositives }}</span>
                <span class="text-[10px] text-green-700">คู่ตรงจริง และระบบจับคู่สำเร็จ</span>
              </div>
              <div class="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                <span class="font-bold block">True Negative (TN): {{ benchmarkResults.trueNegatives }}</span>
                <span class="text-[10px] text-blue-700">คนละสิ่งของ และระบบไม่จับคู่</span>
              </div>
              <div class="p-2 rounded-lg bg-red-50 border border-red-200 text-red-900">
                <span class="font-bold block">False Positive (FP): {{ benchmarkResults.falsePositives }}</span>
                <span class="text-[10px] text-red-700">คนละสิ่งของ แต่ระบบจับคู่ผิด</span>
              </div>
              <div class="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                <span class="font-bold block">False Negative (FN): {{ benchmarkResults.falseNegatives }}</span>
                <span class="text-[10px] text-amber-700">คู่ตรงจริง แต่ระบบตรวจไม่พบ</span>
              </div>
            </div>
          </div>

          <!-- Detailed Test Cases Table -->
          <div v-if="benchmarkResults" class="rounded-xl border border-brand-sand overflow-hidden bg-brand-paper shadow-warm-sm">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead class="bg-brand-cream/80 text-brand-mocha border-b border-brand-sand font-bold">
                  <tr>
                    <th class="py-2.5 px-3">กรณีทดสอบ (Case)</th>
                    <th class="py-2.5 px-3">Ground Truth</th>
                    <th class="py-2.5 px-3">คะแนนระบบ (Score)</th>
                    <th class="py-2.5 px-3">การแจกแจงคะแนน 5 ปัจจัย (หมวด/สี/ที่/วัน/คำ)</th>
                    <th class="py-2.5 px-3">ผลลัพธ์</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-brand-sand/60">
                  <tr v-for="res in benchmarkResults.detailedResults" :key="res.id" class="hover:bg-brand-cream/20">
                    <td class="py-2.5 px-3 font-semibold text-brand-espresso max-w-xs">
                      <div>{{ res.caseTitleTh }}</div>
                      <div class="text-[10px] text-brand-latte mt-0.5 line-clamp-1">{{ res.expectedReasonTh }}</div>
                    </td>
                    <td class="py-2.5 px-3 whitespace-nowrap">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="res.expectedMatch ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'">
                        {{ res.expectedMatch ? 'ตรงกัน (Match)' : 'ไม่ตรง (Non-Match)' }}
                      </span>
                    </td>
                    <td class="py-2.5 px-3 whitespace-nowrap font-bold text-brand-espresso">
                      {{ res.score }}%
                    </td>
                    <td class="py-2.5 px-3 font-mono text-[11px] text-brand-mocha whitespace-nowrap">
                      <span title="หมวดหมู่ 30%">C:{{ res.breakdown.categoryScore }}</span> |
                      <span title="สี 20%">Clr:{{ res.breakdown.colorScore }}</span> |
                      <span title="สถานที่ 20%">Loc:{{ res.breakdown.locationScore }}</span> |
                      <span title="วันที่ 15%">D:{{ res.breakdown.dateScore }}</span> |
                      <span title="คีย์เวิร์ด/ยี่ห้อ 15%">Txt:{{ res.breakdown.textScore }}</span>
                    </td>
                    <td class="py-2.5 px-3 whitespace-nowrap">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="res.isCorrect ? 'bg-found-light text-found-dark border border-found-border' : 'bg-red-100 text-red-800 border border-red-300'">
                        {{ res.isCorrect ? '✓ ถูกต้อง' : '✗ ผิดพลาด' }} ({{ res.outcome }})
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 2: USER SATISFACTION SURVEY -->
        <div v-else-if="activeTab === 'survey'" class="space-y-5">
          <div class="p-4 rounded-xl bg-brand-cream/40 border border-brand-sand space-y-1">
            <h4 class="font-bold text-sm text-brand-espresso">
              {{ isTh ? 'แบบประเมินความพึงพอใจของผู้ใช้งานระบบ (ตามข้อกำหนด Proposal 7.3)' : 'User Satisfaction Evaluation (Proposal 7.3)' }}
            </h4>
            <p class="text-xs text-brand-mocha/80 leading-relaxed">
              {{ isTh ? 'ประเมิน 4 มิติตามมาตรฐาน ISO 9241-210: ด้านความง่ายในการใช้งาน, ความชัดเจนของข้อมูล, ความรวดเร็ว, และประโยชน์ของระบบ' : 'Evaluates Ease of use, Clarity of info, Speed, and Usefulness.' }}
            </p>
          </div>

          <!-- Survey Form Questions -->
          <div class="space-y-4">
            <div 
              v-for="(q, idx) in surveyQuestions" 
              :key="q.id"
              class="p-4 rounded-xl bg-brand-paper border border-brand-sand shadow-warm-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div class="max-w-md">
                <span class="text-[10px] font-bold text-brand-latte uppercase tracking-wider block">ข้อที่ {{ idx + 1 }} • {{ q.categoryTh }}</span>
                <h5 class="font-bold text-xs sm:text-sm text-brand-espresso mt-0.5">{{ isTh ? q.questionTh : q.questionEn }}</h5>
                <p class="text-[11px] text-brand-mocha/70 mt-0.5">{{ isTh ? q.descTh : q.descEn }}</p>
              </div>

              <!-- 5-Star Rating Buttons -->
              <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  v-for="score in 5"
                  :key="score"
                  @click="q.rating = score"
                  type="button"
                  class="w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-all border"
                  :class="q.rating >= score ? 'bg-amber-400 text-white border-amber-500 shadow-warm-sm' : 'bg-brand-cream/60 hover:bg-brand-sand text-brand-latte border-brand-sand'"
                >
                  ★
                </button>
                <span class="text-xs font-bold text-brand-espresso ml-2 w-7 text-right">{{ q.rating }}/5</span>
              </div>
            </div>
          </div>

          <!-- Overall Survey Result Summary -->
          <div class="p-4 rounded-xl bg-gradient-to-r from-brand-cream/60 to-brand-sand/40 border border-brand-sand flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-brand-mocha block">คะแนนความพึงพอใจเฉลี่ยโดยรวม (Overall Average Score):</span>
              <span class="text-2xl font-extrabold text-brand-chestnut">{{ surveyAverage }} / 5.00</span>
              <span class="text-xs font-semibold text-found ml-2">({{ surveyAverageText }})</span>
            </div>
            <button
              @click="submitSurveyFeedback"
              class="px-4 py-2 rounded-xl bg-brand-chestnut hover:bg-brand-mocha text-white text-xs font-bold shadow-warm-sm transition-all"
            >
              บันทึกผลการประเมิน
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { X, Award, Zap, Smile, RotateCcw } from 'lucide-vue-next'
import { runMatchingBenchmark } from '../data/benchmarkDataset'
import { calculatePairScore } from '../utils/matchingEngine'

const props = defineProps({
  currentLang: {
    type: String,
    default: 'th'
  },
  t: {
    type: Function,
    required: true
  }
})

defineEmits(['close'])

const isTh = computed(() => props.currentLang === 'th')
const activeTab = ref('benchmark')
const benchmarkResults = ref(null)

onMounted(() => {
  handleRunBenchmark()
})

function handleRunBenchmark() {
  benchmarkResults.value = runMatchingBenchmark(calculatePairScore, 60)
}

const surveyQuestions = ref([
  {
    id: 'sq-1',
    categoryTh: 'ด้านความง่ายในการใช้งาน (Ease of Use)',
    questionTh: 'ระบบมีการจัดวางหน้าจอ ขั้นตอนการแจ้งข้อมูล และค้นหาได้อย่างสะดวก เข้าใจง่าย',
    questionEn: 'The system has an intuitive layout, streamlined reporting, and easy navigation.',
    descTh: 'ประเมินความสะดวกในการบันทึกข้อมูลและค้นหาย้อนหลัง',
    descEn: 'Evaluate convenience of entering data and searching',
    rating: 5
  },
  {
    id: 'sq-2',
    categoryTh: 'ด้านความชัดเจนของข้อมูล (Clarity of Information)',
    questionTh: 'ข้อมูลรายละเอียดสิ่งของ สี ยี่ห้อ จุดสังเกต และสถานที่ มีความครบถ้วนชัดเจน',
    questionEn: 'Item details, color, brand, distinctive marks, and locations are clear and comprehensive.',
    descTh: 'ประเมินการแสดงผลข้อมูล 5 มิติในการระบุตัวตนสิ่งของ',
    descEn: 'Evaluate the 5-factor presentation for identification',
    rating: 5
  },
  {
    id: 'sq-3',
    categoryTh: 'ด้านความรวดเร็ว (Speed of Processing & Alerts)',
    questionTh: 'ระบบประมวลผลจับคู่สิ่งของที่ตรงกันได้แบบทันที (Real-time) และแจ้งเตือนรวดเร็ว',
    questionEn: 'The matching engine computes compatible items in real-time and alerts swiftly.',
    descTh: 'ประเมินความฉับไวในการส่งการแจ้งเตือนภายในระบบและอีเมล',
    descEn: 'Evaluate responsiveness of in-app and email alerts',
    rating: 4
  },
  {
    id: 'sq-4',
    categoryTh: 'ด้านประโยชน์ของระบบ (Usefulness & Value)',
    questionTh: 'ระบบช่วยลดปัญหาการตามหาของหายในมหาวิทยาลัย และเพิ่มโอกาสการได้รับของคืนอย่างมีนัยสำคัญ',
    questionEn: 'The platform significantly reduces coordination friction and enhances item recovery rates.',
    descTh: 'ประเมินคุณค่าในการนำไปใช้งานจริงในมหาวิทยาลัย',
    descEn: 'Evaluate practical campus impact and return effectiveness',
    rating: 5
  }
])

const surveyAverage = computed(() => {
  const sum = surveyQuestions.value.reduce((acc, q) => acc + q.rating, 0)
  return (sum / surveyQuestions.value.length).toFixed(2)
})

const surveyAverageText = computed(() => {
  const avg = parseFloat(surveyAverage.value)
  if (avg >= 4.5) return 'ระดับความพึงพอใจมากที่สุด (Highest)'
  if (avg >= 3.5) return 'ระดับความพึงพอใจมาก (High)'
  if (avg >= 2.5) return 'ระดับความพึงพอใจปานกลาง (Moderate)'
  return 'ควรปรับปรุง (Needs Improvement)'
})

function submitSurveyFeedback() {
  alert(isTh.value ? 'บันทึกผลการประเมินความพึงพอใจเรียบร้อยแล้ว' : 'User satisfaction feedback saved successfully')
}
</script>
