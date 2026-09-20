<template>
  <section class="border-t border-brand-sand bg-brand-sand/55 py-12 sm:py-16" :aria-labelledby="titleId">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <header class="mx-auto max-w-3xl text-center">
        <h2 :id="titleId" class="text-balance text-2xl font-extrabold leading-tight tracking-[-0.02em] text-brand-espresso sm:text-3xl">
          {{ t('surveyTitle') }}
        </h2>
        <p class="mx-auto mt-3 max-w-4xl text-balance text-sm leading-relaxed text-brand-mocha/80 sm:text-base">
          {{ t('surveyDescription') }}
        </p>
      </header>

      <figure class="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border-[6px] border-brand-paper bg-brand-paper shadow-warm-lg">
        <img
          :src="surveyImage"
          :alt="t('surveyImageAlt')"
          class="aspect-[861/500] w-full object-cover"
          loading="lazy"
        />
      </figure>

      <div class="mt-7 flex flex-col items-center gap-2.5 text-center">
        <a
          :href="surveyUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-chestnut px-6 py-2.5 text-sm font-bold text-white shadow-warm-md transition-colors hover:bg-brand-mocha focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-brand-sand"
        >
          <span>{{ t('surveyButton') }}</span>
          <ExternalLink class="h-4 w-4" aria-hidden="true" />
        </a>
        <p class="text-xs font-medium text-brand-mocha/70">{{ t('surveyExternalNote') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ExternalLink } from 'lucide-vue-next'
import surveyImage from '../../img/googleform_image.png'

defineProps({
  currentLang: {
    type: String,
    default: 'th'
  },
  t: {
    type: Function,
    required: true
  }
})

const surveyUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSddiVTqyNb43VTCXMhvNs1TPwov3W4_fo0FvGk9yWkW1YwR2Q/viewform'
const titleId = 'satisfaction-survey-title'
</script>
