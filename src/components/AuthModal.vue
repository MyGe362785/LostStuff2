<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button
      type="button"
      class="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm"
      :aria-label="copy.close"
      @click="emit('close')"
    ></button>

    <section
      class="relative w-full max-w-md rounded-2xl border border-brand-sand bg-brand-paper p-6 shadow-warm-xl sm:p-7"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <button
        type="button"
        class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-brand-mocha transition-colors hover:bg-brand-cream hover:text-brand-espresso"
        :aria-label="copy.close"
        @click="emit('close')"
      >
        <X class="h-5 w-5" aria-hidden="true" />
      </button>

      <div class="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-chestnut text-white">
        <LogIn class="h-5 w-5" aria-hidden="true" />
      </div>

      <h2 id="auth-title" class="pr-10 text-xl font-extrabold text-brand-espresso sm:text-2xl">
        {{ copy.title }}
      </h2>
      <p class="mt-2 text-sm leading-6 text-brand-mocha">
        {{ copy.description }}
      </p>

      <div class="mt-5 flex items-center gap-3 rounded-xl bg-brand-cream px-4 py-3">
        <AtSign class="h-5 w-5 shrink-0 text-brand-caramel" aria-hidden="true" />
        <div>
          <p class="text-[11px] font-semibold text-brand-mocha">{{ copy.accountLabel }}</p>
          <p class="text-sm font-extrabold text-brand-espresso">@kkumail.com {{ copy.only }}</p>
        </div>
      </div>

      <div class="mt-5 flex items-start gap-3 rounded-xl border border-brand-sand bg-white px-4 py-3.5">
        <input
          id="privacy-consent"
          v-model="acceptedPrivacy"
          type="checkbox"
          class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-chestnut"
        />
        <label for="privacy-consent" class="text-xs leading-5 text-brand-mocha">
          {{ copy.consentPrefix }}
          <a
            href="/privacy"
            class="font-bold text-brand-chestnut underline decoration-brand-caramel/60 underline-offset-4 transition-colors hover:text-brand-mocha"
            @click.prevent="emit('open-privacy')"
          >
            {{ copy.privacyLink }}
          </a>
        </label>
      </div>

      <button
        type="button"
        :disabled="loading || !acceptedPrivacy"
        class="mt-4 flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-brand-sand bg-white px-4 text-sm font-bold text-brand-espresso transition-colors hover:bg-brand-cream disabled:cursor-not-allowed disabled:bg-brand-cream/60 disabled:text-brand-latte disabled:opacity-70"
        @click="signInWithGoogle"
      >
        <svg class="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        {{ loading ? copy.redirecting : copy.continue }}
      </button>

      <p v-if="!acceptedPrivacy" class="mt-2 text-center text-[11px] text-brand-mocha/75">
        {{ copy.acceptHint }}
      </p>
      <p v-if="error" class="mt-3 text-xs font-medium text-lost" role="alert">{{ error }}</p>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { AtSign, LogIn, X } from 'lucide-vue-next'
import { supabase } from '../lib/supabase'

const props = defineProps({ currentLang: { type: String, default: 'th' } })
const emit = defineEmits(['close', 'open-privacy'])
const isTh = computed(() => props.currentLang === 'th')
const loading = ref(false)
const error = ref('')
const acceptedPrivacy = ref(false)

const copy = computed(() => isTh.value ? {
  close: 'ปิดหน้าต่างเข้าสู่ระบบ',
  title: 'เข้าสู่ระบบ Foundit-KKU',
  description: 'ใช้บัญชี Google Workspace ของมหาวิทยาลัย ระบบจะสร้างบัญชีให้อัตโนมัติเมื่อเข้าสู่ระบบครั้งแรก',
  accountLabel: 'บัญชีที่อนุญาต',
  only: 'เท่านั้น',
  consentPrefix: 'ฉันได้อ่านและยอมรับ',
  privacyLink: 'นโยบายความเป็นส่วนตัว',
  continue: 'เข้าสู่ระบบด้วย Google',
  redirecting: 'กำลังไปที่ Google…',
  acceptHint: 'โปรดยอมรับนโยบายความเป็นส่วนตัวก่อนเข้าสู่ระบบ',
} : {
  close: 'Close sign-in dialog',
  title: 'Sign in to Foundit-KKU',
  description: 'Use your university Google Workspace account. Your account is created automatically on first sign-in.',
  accountLabel: 'Permitted account',
  only: 'only',
  consentPrefix: 'I have read and accept the',
  privacyLink: 'Privacy Policy',
  continue: 'Continue with Google',
  redirecting: 'Redirecting to Google…',
  acceptHint: 'Accept the Privacy Policy before signing in.',
})

// hd only preselects KKU accounts in Google's chooser; the Internal OAuth app,
// the Before User Created hook and RLS are what actually enforce @kkumail.com.
async function signInWithGoogle() {
  if (!acceptedPrivacy.value || loading.value) return
  loading.value = true
  error.value = ''
  try {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
        queryParams: { hd: 'kkumail.com', prompt: 'select_account' },
      },
    })
    if (!authError) return
  } catch {
    // A thrown SDK or network failure gets the same retry message as a returned error.
  }
  loading.value = false
  error.value = isTh.value
    ? 'เปิดหน้าเข้าสู่ระบบของ Google ไม่สำเร็จ โปรดลองอีกครั้ง'
    : 'Could not open Google sign-in. Please try again.'
}
</script>
