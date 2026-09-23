<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200">
    <div data-modal-backdrop aria-hidden="true" class="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm transition-opacity"></div>

    <div class="relative z-10 my-8 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-brand-sand bg-brand-paper shadow-warm-xl">
      <div class="flex shrink-0 items-center justify-between border-b border-brand-sand/80 bg-brand-cream/80 px-5 py-3.5">
        <div class="flex items-center gap-2.5">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-chestnut text-white">
            <HandHeart class="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-brand-espresso sm:text-base">{{ t('claimModalTitle') }}</h3>
            <p class="text-[11px] text-brand-mocha/70">{{ t('claimModalSubtitle') }}</p>
          </div>
        </div>

        <button type="button" :aria-label="t('modalClose')" @click="requestClose" class="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-sand/60 text-brand-mocha transition-colors hover:bg-brand-sand">
          <X class="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
        <div class="flex items-center gap-3 rounded-xl border border-brand-sand bg-brand-cream/60 p-3.5">
          <img :src="item.imageUrl" alt="" class="h-14 w-14 shrink-0 rounded-lg border border-brand-sand object-cover" />
          <div class="min-w-0 flex-1">
            <span class="block text-[10px] font-bold uppercase tracking-wider text-brand-latte">{{ t('claimItemSummary') }}</span>
            <h4 class="truncate text-xs font-bold text-brand-espresso sm:text-sm">{{ isTh ? item.titleTh : item.titleEn }}</h4>
            <p class="truncate text-[11px] text-brand-mocha/70">{{ isTh ? item.locationDetailTh : item.locationDetailEn }}</p>
          </div>
        </div>

        <div>
          <label for="claim-secret-details" class="mb-1 block text-xs font-bold text-brand-espresso">{{ t('claimSecretLabel') }} <span class="text-lost">*</span></label>
          <textarea id="claim-secret-details" v-model="secretDetails" rows="3" required :disabled="isSubmitting" :placeholder="t('claimSecretPlaceholder')" class="w-full rounded-xl border border-brand-sand bg-brand-cream/60 px-4 py-2.5 text-xs font-medium text-brand-espresso focus:border-brand-caramel focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 disabled:cursor-wait disabled:opacity-70"></textarea>
          <p class="mt-1 text-[11px] text-brand-latte">{{ t('claimPrivateNotice') }}</p>
        </div>

        <div>
          <label for="claimant-id" class="mb-1 block text-xs font-bold text-brand-espresso">{{ t('claimProofStudentId') }} <span class="text-lost">*</span></label>
          <input id="claimant-id" v-model="claimantId" type="text" required :disabled="isSubmitting" :placeholder="t('claimProofStudentIdPlaceholder')" class="w-full rounded-xl border border-brand-sand bg-brand-cream/60 px-4 py-2.5 text-xs font-medium text-brand-espresso focus:border-brand-caramel focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 disabled:cursor-wait disabled:opacity-70" />
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label for="claimant-name" class="mb-1 block text-xs font-bold text-brand-espresso">{{ t('claimantNameLabel') }} <span class="text-lost">*</span></label>
            <input id="claimant-name" v-model="claimantName" type="text" required :disabled="isSubmitting" :placeholder="t('claimantNamePlaceholder')" class="w-full rounded-xl border border-brand-sand bg-brand-cream/60 px-4 py-2.5 text-xs font-medium text-brand-espresso focus:border-brand-caramel focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 disabled:cursor-wait disabled:opacity-70" />
          </div>
          <div>
            <label for="claimant-contact" class="mb-1 block text-xs font-bold text-brand-espresso">{{ t('fieldContact') }} <span class="text-lost">*</span></label>
            <input id="claimant-contact" v-model="claimantContact" type="text" required :disabled="isSubmitting" :placeholder="t('claimantContactPlaceholder')" class="w-full rounded-xl border border-brand-sand bg-brand-cream/60 px-4 py-2.5 text-xs font-medium text-brand-espresso focus:border-brand-caramel focus:outline-none focus:ring-2 focus:ring-brand-caramel/20 disabled:cursor-wait disabled:opacity-70" />
          </div>
        </div>

        <div>
          <div class="mb-1 flex items-baseline justify-between gap-3">
            <label class="text-xs font-bold text-brand-espresso">{{ t('claimProofImage') }}</label>
            <span class="text-[10px] font-semibold text-brand-latte">{{ selectedEvidence.length }}/{{ MAX_EVIDENCE_IMAGES }}</span>
          </div>
          <input ref="fileInput" class="sr-only" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" multiple :disabled="isSubmitting || selectedEvidence.length >= MAX_EVIDENCE_IMAGES" @change="handleFileInput" />
          <button
            type="button"
            :disabled="isSubmitting || selectedEvidence.length >= MAX_EVIDENCE_IMAGES"
            class="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-sand bg-brand-cream/30 p-4 text-center transition-colors hover:bg-brand-cream/60 focus:outline-none focus:ring-2 focus:ring-brand-caramel/40 disabled:cursor-not-allowed disabled:opacity-60"
            :class="{ 'border-brand-caramel bg-brand-cream/80': isDragging }"
            @click="fileInput?.click()"
            @dragenter.prevent="isDragging = true"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <UploadCloud class="h-5 w-5 text-brand-chestnut" aria-hidden="true" />
            <span class="text-xs font-semibold text-brand-espresso">{{ t('claimEvidenceSelect') }}</span>
            <span class="text-[10px] text-brand-latte">{{ t('claimEvidenceHint') }}</span>
          </button>

          <p v-if="evidenceError" role="alert" class="mt-2 text-[11px] font-semibold text-red-700">{{ evidenceError }}</p>
          <div v-if="selectedEvidence.length" class="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <div v-for="evidence in selectedEvidence" :key="evidence.id" class="group relative overflow-hidden rounded-xl border border-brand-sand bg-brand-cream">
              <img :src="evidence.previewUrl" :alt="t('claimEvidencePreviewAlt')" class="h-24 w-full object-cover" />
              <span v-if="evidence.uploadedPath" class="absolute left-1.5 top-1.5 rounded-md bg-found px-1.5 py-0.5 text-[9px] font-bold text-white">{{ t('claimEvidenceReady') }}</span>
              <button type="button" :disabled="isSubmitting" :aria-label="t('claimEvidenceRemove')" @click="removeEvidence(evidence)" class="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-espresso/85 text-white opacity-100 transition-opacity hover:bg-brand-mocha focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100">
                <X class="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <p v-if="submitError" role="alert" class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800">{{ submitError }}</p>

        <div class="flex items-center justify-end gap-2.5 border-t border-brand-sand/80 pt-3">
          <button type="button" :disabled="isSubmitting" @click="requestClose" class="rounded-xl px-4 py-2 text-xs font-semibold text-brand-mocha transition-colors hover:bg-brand-sand/50 disabled:cursor-not-allowed disabled:opacity-60">{{ t('modalClose') }}</button>
          <button type="submit" :disabled="isSubmitting" class="flex items-center gap-2 rounded-xl bg-brand-chestnut px-5 py-2.5 text-xs font-bold text-white shadow-warm-sm transition-all hover:bg-brand-mocha disabled:cursor-wait disabled:opacity-70">
            <LoaderCircle v-if="isSubmitting" class="h-4 w-4 animate-spin" aria-hidden="true" />
            <ShieldCheck v-else class="h-4 w-4" aria-hidden="true" />
            <span>{{ isSubmitting ? t('claimSubmitting') : t('btnSubmitClaim') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { HandHeart, LoaderCircle, ShieldCheck, UploadCloud, X } from 'lucide-vue-next'
import { removeClaimEvidence, uploadClaimEvidence } from '../services/lostFoundRepository'

const MAX_EVIDENCE_IMAGES = 5
const MAX_FILE_BYTES = 5 * 1024 * 1024
const IMAGE_SIGNATURES = {
  jpeg: { bytes: [0xff, 0xd8, 0xff] },
  png: { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  webp: { bytes: [0x52, 0x49, 0x46, 0x46], secondBytes: [0x57, 0x45, 0x42, 0x50], secondOffset: 8 },
}

const props = defineProps({
  item: { type: Object, required: true },
  backendConfigured: { type: Boolean, default: false },
  submitClaim: { type: Function, required: true },
  currentLang: { type: String, default: 'th' },
  t: { type: Function, required: true },
})

const emit = defineEmits(['close'])
const fileInput = ref(null)
const secretDetails = ref('')
const claimantId = ref('')
const claimantName = ref('')
const claimantContact = ref('')
const selectedEvidence = ref([])
const evidenceError = ref('')
const submitError = ref('')
const isDragging = ref(false)
const isSubmitting = ref(false)
const hasSubmittedClaim = ref(false)
const isTh = computed(() => props.currentLang === 'th')

function requestClose() {
  if (!isSubmitting.value) emit('close')
}

function hasSignature(bytes, signature, offset = 0) {
  return signature.every((byte, index) => bytes[offset + index] === byte)
}

async function hasSupportedImageSignature(file) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  return hasSignature(bytes, IMAGE_SIGNATURES.jpeg.bytes)
    || hasSignature(bytes, IMAGE_SIGNATURES.png.bytes)
    || (hasSignature(bytes, IMAGE_SIGNATURES.webp.bytes) && hasSignature(bytes, IMAGE_SIGNATURES.webp.secondBytes, IMAGE_SIGNATURES.webp.secondOffset))
}

async function addFiles(files) {
  evidenceError.value = ''
  const incoming = Array.from(files || [])
  if (!incoming.length) return
  const remaining = MAX_EVIDENCE_IMAGES - selectedEvidence.value.length
  if (incoming.length > remaining) {
    evidenceError.value = props.t('claimEvidenceTooMany')
    return
  }

  const validEvidence = []
  for (const file of incoming) {
    if (file.size > MAX_FILE_BYTES) {
      evidenceError.value = props.t('claimEvidenceTooLarge')
      return
    }
    if (!(await hasSupportedImageSignature(file))) {
      evidenceError.value = props.t('claimEvidenceUnsupported')
      return
    }
    validEvidence.push({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file), uploadedPath: null })
  }
  selectedEvidence.value.push(...validEvidence)
}

async function handleFileInput(event) {
  await addFiles(event.target.files)
  event.target.value = ''
}

async function handleDrop(event) {
  isDragging.value = false
  await addFiles(event.dataTransfer.files)
}

async function removeEvidence(evidence) {
  evidenceError.value = ''
  try {
    if (evidence.uploadedPath && props.backendConfigured) await removeClaimEvidence([evidence.uploadedPath])
    URL.revokeObjectURL(evidence.previewUrl)
    selectedEvidence.value = selectedEvidence.value.filter((candidate) => candidate.id !== evidence.id)
  } catch (error) {
    evidenceError.value = error.message || props.t('claimEvidenceRemoveFailed')
  }
}

async function handleSubmit() {
  submitError.value = ''
  if (!secretDetails.value.trim() || !claimantId.value.trim() || !claimantName.value.trim() || !claimantContact.value.trim()) {
    submitError.value = props.t('claimFormIncomplete')
    return
  }

  isSubmitting.value = true
  try {
    if (props.backendConfigured) {
      for (const evidence of selectedEvidence.value) {
        if (!evidence.uploadedPath) evidence.uploadedPath = await uploadClaimEvidence(evidence.file)
      }
    }
    await props.submitClaim({
      itemId: props.item.id,
      secretDetails: secretDetails.value.trim(),
      claimantId: claimantId.value.trim(),
      claimantName: claimantName.value.trim(),
      claimantContact: claimantContact.value.trim(),
      evidencePaths: selectedEvidence.value.map((evidence) => evidence.uploadedPath).filter(Boolean),
    })
    hasSubmittedClaim.value = true
    emit('close')
  } catch (error) {
    submitError.value = error.message || props.t('claimSubmitFailed')
  } finally {
    isSubmitting.value = false
  }
}

onBeforeUnmount(() => {
  for (const evidence of selectedEvidence.value) URL.revokeObjectURL(evidence.previewUrl)
  if (!hasSubmittedClaim.value && props.backendConfigured) {
    const paths = selectedEvidence.value.map((evidence) => evidence.uploadedPath).filter(Boolean)
    if (paths.length) void removeClaimEvidence(paths)
  }
})
</script>
