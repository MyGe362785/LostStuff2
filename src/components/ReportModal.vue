<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
    <!-- Backdrop Overlay -->
    <div 
      class="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm transition-opacity" 
      @click="$emit('close')"
    ></div>

    <!-- Modal Dialog Panel -->
    <div 
      class="relative w-full max-w-2xl rounded-2xl bg-brand-paper shadow-warm-xl border border-brand-sand overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
    >
      <!-- Modal Header -->
      <div class="px-5 py-3.5 bg-brand-cream/80 border-b border-brand-sand/80 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2.5">
          <div 
            class="w-7 h-7 rounded-lg flex items-center justify-center text-white"
            :class="reportType === 'lost' ? 'bg-lost' : 'bg-brand-chestnut'"
          >
            <AlertCircle v-if="reportType === 'lost'" class="w-3.5 h-3.5" />
            <Plus v-else class="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 class="font-bold text-sm sm:text-base text-brand-espresso">
              {{ reportType === 'lost' ? t('navReportLost') : t('navReportFound') }}
            </h3>
            <p class="text-[11px] text-brand-mocha/70">
              {{ isTh ? 'กรอกข้อมูล 5 มิติ เพื่อให้ระบบคำนวณจับคู่ได้อย่างแม่นยำ' : 'Fill 5-factor details for accurate auto-matching' }}
            </p>
          </div>
        </div>

        <button 
          @click="$emit('close')"
          class="w-7 h-7 rounded-lg bg-brand-sand/60 hover:bg-brand-sand text-brand-mocha flex items-center justify-center transition-colors"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Step Indicator Header -->
      <div class="px-6 py-3 bg-brand-sand/30 border-b border-brand-sand/50 flex items-center justify-between text-xs font-bold text-brand-mocha">
        <div 
          class="flex items-center gap-1.5"
          :class="currentStep >= 1 ? 'text-brand-chestnut' : 'text-brand-latte'"
        >
          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" :class="currentStep >= 1 ? 'bg-brand-chestnut text-white' : 'bg-brand-tan/50 text-brand-latte'">1</span>
          <span>{{ t('step1') }}</span>
        </div>

        <div class="w-8 h-0.5 bg-brand-sand"></div>

        <div 
          class="flex items-center gap-1.5"
          :class="currentStep >= 2 ? 'text-brand-chestnut' : 'text-brand-latte'"
        >
          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" :class="currentStep >= 2 ? 'bg-brand-chestnut text-white' : 'bg-brand-tan/50 text-brand-latte'">2</span>
          <span>{{ t('step2') }}</span>
        </div>

        <div class="w-8 h-0.5 bg-brand-sand"></div>

        <div 
          class="flex items-center gap-1.5"
          :class="currentStep >= 3 ? 'text-brand-chestnut' : 'text-brand-latte'"
        >
          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" :class="currentStep >= 3 ? 'bg-brand-chestnut text-white' : 'bg-brand-tan/50 text-brand-latte'">3</span>
          <span>{{ t('step3') }}</span>
        </div>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
        
        <!-- STEP 1: Item Information (Category, Title, Color, Brand, Distinctive Marks) -->
        <div v-if="currentStep === 1" class="space-y-4 animate-in fade-in duration-150">
          
          <!-- Category Selector -->
          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1.5">
              {{ t('fieldCategory') }} <span class="text-lost">*</span>
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button 
                type="button"
                v-for="cat in itemCategories" 
                :key="cat.id"
                @click="formData.category = cat.id"
                class="p-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all text-left"
                :class="formData.category === cat.id ? 'bg-brand-chestnut text-white border-brand-chestnut shadow-warm-sm' : 'bg-brand-paper hover:bg-brand-cream border-brand-sand text-brand-espresso'"
              >
                <component :is="getCategoryIcon(cat.icon)" class="w-4 h-4 shrink-0" />
                <span class="truncate">{{ isTh ? cat.nameTh : cat.nameEn }}</span>
              </button>
            </div>
          </div>

          <!-- Item Name -->
          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1.5">
              {{ t('fieldName') }} <span class="text-lost">*</span>
            </label>
            <input 
              v-model="formData.title"
              type="text" 
              required
              :placeholder="t('fieldNamePlaceholder')"
              class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
            />
          </div>

          <!-- Color & Brand Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
            <!-- Color Selector (Dropdown) -->
            <div>
              <label class="block text-xs font-bold text-brand-espresso mb-1.5">
                {{ t('fieldColor') }} <span class="text-lost">*</span>
              </label>
              
              <div class="relative">
                <select 
                  v-model="formData.color"
                  @change="onColorChange"
                  required
                  class="w-full pl-9 pr-8 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-semibold text-brand-espresso focus:outline-none focus:border-brand-caramel cursor-pointer appearance-none"
                >
                  <option 
                    v-for="c in colorOptions" 
                    :key="c.id" 
                    :value="c.id"
                  >
                    {{ isTh ? c.nameTh : c.nameEn }} ({{ isTh ? c.nameEn : c.nameTh }})
                  </option>
                </select>

                <!-- Color Swatch Indicator Dot -->
                <span 
                  class="w-3.5 h-3.5 rounded-full border border-black/15 shadow-xs absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                  :style="{ backgroundColor: currentColorHex }"
                ></span>

                <!-- Dropdown Arrow -->
                <ChevronDown class="w-3.5 h-3.5 text-brand-latte absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <!-- Fine-tune / Specific Shade (Optional) -->
              <input 
                v-model="formData.colorCustom"
                type="text" 
                :placeholder="isTh ? 'ระบุเฉดสีหรือลวดลายเฉพาะ (ถ้ามี)' : 'Specific shade / pattern (optional)'"
                class="w-full px-3 py-1.5 mt-1.5 rounded-xl bg-brand-cream/40 border border-brand-sand/80 text-[11px] font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
              />
            </div>

            <!-- Brand / Maker -->
            <div>
              <label class="block text-xs font-bold text-brand-espresso mb-1.5">
                {{ t('fieldBrand') }}
              </label>
              <input 
                v-model="formData.brand"
                type="text" 
                :placeholder="t('fieldBrandPlaceholder')"
                class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
              />
            </div>
          </div>

          <!-- Distinctive Marks (จุดสังเกตเฉพาะ - Proposal 3.2) -->
          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1.5">
              {{ t('fieldDistinctiveMarks') }}
            </label>
            <input 
              v-model="formData.distinctiveMarks"
              type="text" 
              :placeholder="t('fieldDistinctiveMarksPlaceholder')"
              class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1.5">
              {{ t('fieldDescription') }}
            </label>
            <textarea 
              v-model="formData.description"
              rows="2"
              :placeholder="t('fieldDescPlaceholder')"
              class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
            ></textarea>
          </div>

          <!-- Image Upload / Camera / Presets -->
          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1.5">
              {{ t('fieldImage') }}
            </label>

            <!-- Drag-and-Drop / File Upload Zone -->
            <div 
              @click="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              class="border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
              :class="isDragging ? 'border-brand-caramel bg-brand-cream/80' : 'border-brand-sand/90 hover:border-brand-tan bg-brand-cream/30 hover:bg-brand-cream/60'"
            >
              <input 
                ref="fileInputRef"
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleFileChange"
              />

              <!-- While a picked photo is being resized -->
              <p v-if="imageProcessing" class="py-4 text-xs font-bold text-brand-mocha">
                {{ t('imagePreparing') }}
              </p>

              <!-- If image is already selected/uploaded -->
              <div v-else-if="formData.imageUrl" class="relative group/preview w-full flex items-center justify-center">
                <div class="w-36 h-24 rounded-xl overflow-hidden border border-brand-sand shadow-warm-sm relative">
                  <img :src="formData.imageUrl" alt="Preview" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    @click.stop="removeImage"
                    class="absolute top-1 right-1 w-6 h-6 rounded-full bg-brand-espresso/80 text-white flex items-center justify-center text-xs hover:bg-lost transition-colors"
                    title="Remove image"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </div>
              </div>

              <!-- Upload Prompt when no image -->
              <div v-else class="flex flex-col items-center py-1">
                <div class="w-10 h-10 rounded-xl bg-brand-sand/60 text-brand-chestnut flex items-center justify-center mb-1.5">
                  <Camera class="w-5 h-5" />
                </div>
                <p class="text-xs font-bold text-brand-espresso">
                  {{ isTh ? 'คลิกถ่ายภาพ / อัปโหลดรูปภาพ' : 'Click to take photo / upload' }}
                </p>
                <p class="text-[11px] text-brand-latte">
                  {{ t('imageUploadHint') }}
                </p>
              </div>
            </div>

            <p v-if="imageError" class="mt-1.5 text-[11px] font-semibold text-lost-dark" role="alert">
              {{ imageError }}
            </p>

            <!-- Presets: demo mode only, since the backend saves uploaded files alone -->
            <div v-if="!backendConfigured" class="mt-2.5 space-y-1.5">
              <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span class="text-[10px] text-brand-latte font-semibold shrink-0">{{ isTh ? 'หรือเลือกภาพตัวอย่าง:' : 'Sample presets:' }}</span>
                <button
                  type="button"
                  v-for="sample in sampleImages"
                  :key="sample.name"
                  @click="useSampleImage(sample.url)"
                  class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-brand-paper hover:bg-brand-cream text-brand-mocha shrink-0 border border-brand-sand/80 shadow-warm-sm transition-all"
                >
                  {{ sample.name }}
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- STEP 2: Location & Date -->
        <div v-if="currentStep === 2" class="space-y-4 animate-in fade-in duration-150">
          
          <!-- Campus Building Selector -->
          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1.5">
              {{ t('fieldBuilding') }} <span class="text-lost">*</span>
            </label>
            <select 
              v-model="formData.buildingId"
              required
              class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-semibold text-brand-espresso focus:outline-none focus:border-brand-caramel cursor-pointer"
            >
              <option value="">{{ isTh ? '-- เลือกอาคารในมหาวิทยาลัย --' : '-- Select Campus Building --' }}</option>
              <option 
                v-for="bld in campusBuildings" 
                :key="bld.id" 
                :value="bld.id"
              >
                {{ isTh ? bld.nameTh : bld.nameEn }} ({{ bld.zone }})
              </option>
            </select>
          </div>

          <!-- Floor & Area Description -->
          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1.5">
              {{ t('fieldFloor') }} <span class="text-lost">*</span>
            </label>
            <input 
              v-model="formData.locationDetail"
              type="text" 
              required
              :placeholder="t('fieldFloorPlaceholder')"
              class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
            />
          </div>

          <!-- Date & Approximate Time -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-brand-espresso mb-1.5">
                {{ t('fieldDate') }} <span class="text-lost">*</span>
              </label>
              <input 
                v-model="formData.date"
                type="date" 
                required
                class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-brand-espresso mb-1.5">
                {{ t('fieldTimeRange') }}
              </label>
              <select 
                v-model="formData.timeRange"
                class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
              >
                <option value="morning">{{ t('fieldTimeMorning') }}</option>
                <option value="afternoon">{{ t('fieldTimeAfternoon') }}</option>
                <option value="evening">{{ t('fieldTimeEvening') }}</option>
              </select>
            </div>
          </div>

        </div>

        <!-- STEP 3: Contact & Handover Point -->
        <div v-if="currentStep === 3" class="space-y-4 animate-in fade-in duration-150">
          
          <!-- Reporter Name -->
          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1.5">
              {{ t('fieldReporterName') }} <span class="text-lost">*</span>
            </label>
            <input 
              v-model="formData.reporterName"
              type="text" 
              required
              placeholder="เช่น ธนภัทร (นิสิตคณะวิศวะ)"
              class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
            />
          </div>

          <!-- Contact Channel -->
          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1.5">
              {{ t('fieldContact') }} <span class="text-lost">*</span>
            </label>
            <input 
              v-model="formData.reporterContact"
              type="text" 
              required
              placeholder="เช่น LINE ID: thanapat_eng / Tel: 081-xxx-xxxx"
              class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
            />
          </div>

          <!-- Safe Handover Drop-off Point Recommendation -->
          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1.5">
              {{ t('fieldHandoverPoint') }}
            </label>
            <input 
              v-model="formData.handoverPoint"
              type="text" 
              :placeholder="isTh ? 'เช่น เคาน์เตอร์ยืม-คืน หอสมุดกลาง ชั้น 1' : 'e.g. Circulation Desk, Central Library 1st Floor'"
              class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
            />
            <p class="text-[11px] text-brand-latte mt-1">
              {{ isTh ? '💡 แนะนำให้เลือกจุดฝากของทางการของมหาวิทยาลัยเพื่อความปลอดภัย' : '💡 Recommended to use official campus security/library desks' }}
            </p>
          </div>

        </div>

      </form>

      <!-- Modal Footer Steps Navigation -->
      <div class="px-5 py-4 bg-brand-cream/90 border-t border-brand-sand/80 flex items-center justify-between shrink-0">
        <button 
          type="button"
          v-if="currentStep > 1"
          @click="currentStep--"
          class="px-4 py-2 rounded-xl text-xs font-semibold text-brand-mocha hover:bg-brand-sand/50 transition-colors"
        >
          {{ t('btnBack') }}
        </button>
        <div v-else></div>

        <div class="flex items-center gap-2">
          <button 
            type="button"
            v-if="currentStep < 3"
            @click="handleNextStep"
            class="px-5 py-2.5 rounded-xl bg-brand-chestnut hover:bg-brand-mocha text-white text-xs font-bold shadow-warm-sm transition-all"
          >
            {{ t('btnNext') }}
          </button>

          <button 
            type="button"
            v-else
            @click="handleSubmit"
            :disabled="submitting || imageProcessing"
            class="px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-warm-md transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-wait"
            :class="reportType === 'lost' ? 'bg-lost hover:bg-lost-dark' : 'bg-brand-chestnut hover:bg-brand-mocha'"
          >
            <Sparkles class="w-4 h-4" />
            <span v-if="submitting">{{ t('reportSubmitting') }}</span>
            <span v-else>{{ reportType === 'lost' ? t('btnSubmitLost') : t('btnSubmitFound') }}</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  X, Plus, AlertCircle, Sparkles, Camera, ChevronDown,
  Laptop, CreditCard, BookOpen, Watch, Key, HelpCircle 
} from 'lucide-vue-next'
import { itemCategories, campusBuildings } from '../data/campusLocations'
import { colorOptions, getColorHex } from '../data/colors'
import { ImageUploadError, prepareImageForUpload } from '../utils/imageUpload'

const props = defineProps({
  reportType: {
    type: String,
    default: 'lost' // 'lost' | 'found'
  },
  currentLang: {
    type: String,
    default: 'th'
  },
  t: {
    type: Function,
    required: true
  },
  backendConfigured: { type: Boolean, default: false },
  // The parent is saving the report; blocks double submits.
  submitting: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'submit-report'])

const currentStep = ref(1)
const fileInputRef = ref(null)
const isDragging = ref(false)
const selectedImageFile = ref(null)
const imageProcessing = ref(false)
const imageError = ref('')
const isTh = computed(() => props.currentLang === 'th')

const IMAGE_ERROR_KEYS = {
  not_image: 'imageErrorNotImage',
  unsupported: 'imageErrorUnsupported',
  too_large: 'imageErrorTooLarge',
}

function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

function handleFileChange(e) {
  const file = e.target.files?.[0]
  if (file) {
    processFile(file)
  }
}

function handleFileDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    processFile(file)
  }
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => resolve(event.target?.result || '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

// Bumped on every pick, so a slow resize of an earlier photo cannot overwrite a newer one.
let latestPick = 0

// Resize and check the photo as soon as it is picked, so problems show up
// here instead of after the report has been created.
async function processFile(file) {
  const pick = ++latestPick
  imageError.value = ''
  imageProcessing.value = true
  try {
    const prepared = await prepareImageForUpload(file)
    const dataUrl = await readAsDataUrl(prepared)
    if (pick !== latestPick) return
    formData.value.imageUrl = dataUrl
    selectedImageFile.value = prepared
  } catch (error) {
    if (pick !== latestPick) return
    removeImage()
    const key = error instanceof ImageUploadError ? IMAGE_ERROR_KEYS[error.code] : 'imageErrorUnsupported'
    imageError.value = props.t(key)
  } finally {
    if (pick === latestPick) imageProcessing.value = false
  }
}

function removeImage() {
  formData.value.imageUrl = ''
  selectedImageFile.value = null
  // Let the same file be picked again after removing it.
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function useSampleImage(url) {
  latestPick++ // drop any photo still being resized
  imageProcessing.value = false
  removeImage()
  imageError.value = ''
  formData.value.imageUrl = url
}

const currentColorHex = computed(() => {
  return getColorHex(formData.value.color)
})

function onColorChange() {
  const chosen = colorOptions.find(c => c.id === formData.value.color)
  if (chosen) {
    formData.value.colorCustom = isTh.value ? chosen.nameTh : chosen.nameEn
  }
}

const sampleImages = [
  { name: 'iPad / Tablet', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80' },
  { name: 'Cardholder', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80' },
  { name: 'AirPods', url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80' },
  { name: 'Keys', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80' },
  { name: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80' },
  { name: 'Umbrella', url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80' }
]

const today = new Date().toISOString().split('T')[0]

const formData = ref({
  category: 'electronics',
  title: '',
  color: 'red',
  colorCustom: 'สีแดง',
  brand: '',
  distinctiveMarks: '',
  description: '',
  // The demo shows a sample photo; the real backend only saves what the user uploads.
  imageUrl: props.backendConfigured ? '' : 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
  buildingId: 'bld_library',
  locationDetail: '',
  date: today,
  timeRange: 'afternoon',
  reporterName: '',
  reporterContact: '',
  handoverPoint: 'เคาน์เตอร์บริการยืม-คืน ชั้น 1 สำนักหอสมุดกลาง'
})

function getCategoryIcon(iconName) {
  const iconMap = { Laptop, CreditCard, BookOpen, Watch, Key, HelpCircle }
  return iconMap[iconName] || HelpCircle
}

function handleNextStep() {
  if (currentStep.value === 1) {
    if (!formData.value.title.trim()) {
      alert(isTh.value ? 'กรุณาระบุชื่อสิ่งของ' : 'Please enter item name')
      return
    }
  } else if (currentStep.value === 2) {
    if (!formData.value.buildingId || !formData.value.locationDetail.trim()) {
      alert(isTh.value ? 'กรุณาระบุสถานที่และบริเวณที่เกิดเหตุ' : 'Please specify location details')
      return
    }
  }
  currentStep.value++
}

function handleSubmit() {
  if (props.submitting || imageProcessing.value) return
  if (!formData.value.reporterName.trim() || !formData.value.reporterContact.trim()) {
    alert(isTh.value ? 'กรุณาระบุข้อมูลติดต่อ' : 'Please enter contact information')
    return
  }

  const bld = campusBuildings.find(b => b.id === formData.value.buildingId)
  const bldName = bld ? (isTh.value ? bld.nameTh : bld.nameEn) : ''

  const chosenColor = colorOptions.find(c => c.id === formData.value.color)
  const defaultTh = chosenColor ? chosenColor.nameTh : formData.value.color
  const defaultEn = chosenColor ? chosenColor.nameEn : formData.value.color
  const customColor = formData.value.colorCustom?.trim()
  const finalColorTh = customColor || defaultTh
  const finalColorEn = customColor || defaultEn

  const newItem = {
    id: `item-${Date.now().toString().slice(-4)}`,
    type: props.reportType,
    // When submitted by user, it goes to 'pending_review' or 'searching'
    status: 'pending_review',
    titleTh: formData.value.title,
    titleEn: formData.value.title,
    category: formData.value.category,
    color: formData.value.color,
    colorNameTh: finalColorTh,
    colorNameEn: finalColorEn,
    brand: formData.value.brand || '',
    distinctiveMarks: formData.value.distinctiveMarks || '',
    buildingId: formData.value.buildingId,
    locationDetailTh: `${bldName} ${formData.value.locationDetail}`,
    locationDetailEn: `${bldName} ${formData.value.locationDetail}`,
    date: formData.value.date,
    timeRange: formData.value.timeRange,
    timeDetailTh: `แจ้งเมื่อ ${formData.value.date}`,
    timeDetailEn: `Reported on ${formData.value.date}`,
    descriptionTh: formData.value.description || formData.value.title,
    descriptionEn: formData.value.description || formData.value.title,
    imageUrl: formData.value.imageUrl || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    reporterName: formData.value.reporterName,
    reporterContact: formData.value.reporterContact,
    handoverPointTh: formData.value.handoverPoint || (bld ? bld.handoverPointTh : 'ศูนย์ประสานงานของหายกลาง'),
    handoverPointEn: formData.value.handoverPoint || (bld ? bld.handoverPointEn : 'Central Lost & Found Office'),
    createdAt: new Date().toISOString(),
    isMyPost: true,
    imageFile: selectedImageFile.value
  }

  emit('submit-report', newItem)
}
</script>
