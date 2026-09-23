<template>
  <Teleport to="body">
    <Transition name="tour-fade">
      <div v-if="isVisible" class="fixed inset-0 z-[90] pointer-events-none" aria-live="polite">
        <div
          class="tour-spotlight fixed rounded-xl border-2 border-brand-caramel transition-[top,left,width,height] duration-300 ease-out motion-reduce:transition-none"
          :style="spotlightStyle"
          aria-hidden="true"
        ></div>

        <section
          ref="popover"
          role="dialog"
          aria-modal="false"
          :aria-label="t('tourDialogLabel')"
          class="pointer-events-none fixed grid w-[min(460px,calc(100vw-24px))] grid-cols-[72px_minmax(0,1fr)] items-end gap-2 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-3"
          :style="popoverStyle"
        >
          <Transition name="tour-character" mode="out-in">
            <img
              :key="currentStep.image"
              :src="currentStep.image"
              alt=""
              class="tour-character-image pointer-events-none w-full self-end object-contain object-bottom"
              draggable="false"
              aria-hidden="true"
            />
          </Transition>

          <div
            ref="messageCard"
            class="pointer-events-auto relative rounded-xl bg-brand-paper p-4 shadow-warm-xl"
          >
            <span
              class="absolute h-4 w-4 rotate-45 bg-brand-paper"
              :style="arrowStyle"
              aria-hidden="true"
            ></span>

            <div class="mb-2 flex items-center justify-between gap-2">
              <span class="text-[11px] font-bold text-brand-chestnut">
                {{ t('tourProgress').replace('{current}', stepIndex + 1).replace('{total}', steps.length) }}
              </span>
              <button
                type="button"
                class="rounded-lg px-2 py-1 text-[11px] font-semibold text-brand-mocha transition-colors hover:bg-brand-cream hover:text-brand-espresso"
                @click="finish('skipped')"
              >
                {{ t('tourSkip') }}
              </button>
            </div>

            <h2 class="text-base font-extrabold leading-snug text-brand-espresso">
              {{ currentStep.title }}
            </h2>
            <p class="mt-1.5 text-xs leading-relaxed text-brand-mocha">
              {{ currentStep.description }}
            </p>

            <div class="mt-4 flex items-center justify-between gap-2 border-t border-brand-sand pt-3">
              <div class="flex gap-1.5" :aria-label="t('tourProgressLabel')">
                <span
                  v-for="(_, index) in steps"
                  :key="index"
                  class="h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none"
                  :class="index === stepIndex ? 'w-5 bg-brand-chestnut' : 'w-1.5 bg-brand-tan'"
                  aria-hidden="true"
                ></span>
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  v-if="stepIndex > 0"
                  type="button"
                  class="inline-flex min-h-9 items-center rounded-lg px-2.5 text-xs font-bold text-brand-mocha transition-colors hover:bg-brand-cream hover:text-brand-espresso"
                  @click="previousStep"
                >
                  {{ t('tourBack') }}
                </button>
                <button
                  ref="nextButton"
                  type="button"
                  class="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-brand-chestnut px-3.5 text-xs font-bold text-white shadow-warm-sm transition-colors hover:bg-brand-mocha"
                  @click="nextStep"
                >
                  <span>{{ isLastStep ? t('tourFinish') : t('tourNext') }}</span>
                  <ArrowRight v-if="!isLastStep" class="h-3.5 w-3.5" aria-hidden="true" />
                  <Check v-else class="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ArrowRight, Check } from 'lucide-vue-next'
import ghibliOne from '../../img/ghibli-tour.webp'
import ghibliTwo from '../../img/ghibli2-tour.webp'
import ghibliThree from '../../img/ghibli3-tour.webp'

const props = defineProps({
  t: { type: Function, required: true },
  currentLang: { type: String, default: 'th' },
})

const emit = defineEmits(['close'])

const STORAGE_KEY = 'foundit-first-visit-tour-v1'
const isVisible = ref(false)
const stepIndex = ref(0)
const placement = ref('bottom')
const popover = ref(null)
const messageCard = ref(null)
const nextButton = ref(null)
const spotlightStyle = ref({ opacity: 0 })
const popoverStyle = ref({ left: '12px', top: '12px', opacity: 0 })
const arrowOffset = ref(30)
let showTimer
let positionTimer

const steps = computed(() => [
  {
    target: 'search',
    image: ghibliOne,
    title: props.t('tourSearchTitle'),
    description: props.t('tourSearchDescription'),
  },
  {
    target: 'report-lost',
    image: ghibliTwo,
    title: props.t('tourLostTitle'),
    description: props.t('tourLostDescription'),
  },
  {
    target: 'report-found',
    image: ghibliThree,
    title: props.t('tourFoundTitle'),
    description: props.t('tourFoundDescription'),
  },
  {
    target: 'my-posts',
    image: ghibliOne,
    title: props.t('tourReportsTitle'),
    description: props.t('tourReportsDescription'),
  },
])

const currentStep = computed(() => steps.value[stepIndex.value])
const isLastStep = computed(() => stepIndex.value === steps.value.length - 1)
const arrowStyle = computed(() => ({
  left: `${arrowOffset.value}px`,
  ...(placement.value === 'bottom'
    ? { top: '-8px', bottom: 'auto' }
    : { bottom: '-8px', top: 'auto' }),
}))

function getVisibleTarget() {
  return [...document.querySelectorAll(`[data-tour="${currentStep.value.target}"]`)].find((element) => {
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== 'hidden'
  })
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

async function positionTour({ allowScroll = false } = {}) {
  if (!isVisible.value) return
  const target = getVisibleTarget()
  if (!target) return

  let rect = target.getBoundingClientRect()
  const outsideViewport = rect.bottom < 72 || rect.top > window.innerHeight - 72
  if (allowScroll && outsideViewport) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    await new Promise((resolve) => { positionTimer = window.setTimeout(resolve, 380) })
    rect = target.getBoundingClientRect()
  }

  const padding = 7
  spotlightStyle.value = {
    left: `${Math.max(4, rect.left - padding)}px`,
    top: `${Math.max(4, rect.top - padding)}px`,
    width: `${Math.min(window.innerWidth - 8, rect.width + padding * 2)}px`,
    height: `${Math.min(window.innerHeight - 8, rect.height + padding * 2)}px`,
    opacity: 1,
  }

  await nextTick()
  const compositionRect = popover.value?.getBoundingClientRect()
  const cardRect = messageCard.value?.getBoundingClientRect()
  const compositionWidth = compositionRect?.width || Math.min(460, window.innerWidth - 24)
  const compositionHeight = compositionRect?.height || 220
  const gap = 16
  const roomBelow = window.innerHeight - rect.bottom - gap
  const roomAbove = rect.top - gap
  placement.value = roomBelow >= compositionHeight || roomBelow >= roomAbove ? 'bottom' : 'top'

  const top = placement.value === 'bottom'
    ? rect.bottom + gap
    : rect.top - compositionHeight - gap
  const left = clamp(rect.left + (rect.width - compositionWidth) / 2, 12, window.innerWidth - compositionWidth - 12)

  popoverStyle.value = {
    left: `${left}px`,
    top: `${clamp(top, 12, window.innerHeight - compositionHeight - 12)}px`,
    opacity: 1,
  }
  await nextTick()
  const positionedCardRect = messageCard.value?.getBoundingClientRect() || cardRect
  const arrowLeft = rect.left + rect.width / 2 - (positionedCardRect?.left || left) - 8
  arrowOffset.value = clamp(arrowLeft, 24, (positionedCardRect?.width || compositionWidth) - 40)
}

async function showStep() {
  popoverStyle.value = { ...popoverStyle.value, opacity: 0 }
  await nextTick()
  await positionTour({ allowScroll: true })
  await nextTick()
  nextButton.value?.focus({ preventScroll: true })
}

function nextStep() {
  if (isLastStep.value) {
    finish('completed')
    return
  }
  stepIndex.value += 1
}

function previousStep() {
  if (stepIndex.value > 0) stepIndex.value -= 1
}

function finish(status) {
  try {
    localStorage.setItem(STORAGE_KEY, status)
  } catch {
    // The tour still closes when storage is unavailable.
  }
  isVisible.value = false
  emit('close', status)
}

function handleKeydown(event) {
  if (!isVisible.value) return
  if (event.key === 'ArrowRight') nextStep()
  if (event.key === 'ArrowLeft') previousStep()
}

function handleViewportChange() {
  window.requestAnimationFrame(() => positionTour())
}

watch(stepIndex, showStep)
watch(() => props.currentLang, () => nextTick(() => positionTour()))

onMounted(() => {
  let hasSeenTour = false
  try {
    hasSeenTour = Boolean(localStorage.getItem(STORAGE_KEY))
  } catch {
    hasSeenTour = false
  }

  const shouldReplayTour = new URLSearchParams(window.location.search).get('tour') === '1'
  if (!hasSeenTour || shouldReplayTour) {
    showTimer = window.setTimeout(async () => {
      isVisible.value = true
      await showStep()
    }, 700)
  }

  window.addEventListener('resize', handleViewportChange)
  window.addEventListener('scroll', handleViewportChange, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.clearTimeout(showTimer)
  window.clearTimeout(positionTimer)
  window.removeEventListener('resize', handleViewportChange)
  window.removeEventListener('scroll', handleViewportChange)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.tour-spotlight {
  box-shadow: 0 0 0 9999px rgb(45 32 22 / 0.52);
}

.tour-character-image {
  max-height: 132px;
  mix-blend-mode: screen;
  filter: drop-shadow(0 12px 18px rgb(45 32 22 / 0.28));
}

@media (min-width: 640px) {
  .tour-character-image {
    max-height: 188px;
  }
}

.tour-fade-enter-active,
.tour-fade-leave-active {
  transition: opacity 220ms ease-out;
}

.tour-fade-enter-from,
.tour-fade-leave-to {
  opacity: 0;
}

.tour-character-enter-active,
.tour-character-leave-active {
  transition: opacity 180ms ease-out, transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

.tour-character-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tour-character-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .tour-fade-enter-active,
  .tour-fade-leave-active,
  .tour-character-enter-active,
  .tour-character-leave-active {
    transition: none;
  }
}
</style>
