<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button aria-label="Close sign-in dialog" class="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm" @click="$emit('close')"></button>
    <section role="dialog" aria-modal="true" aria-labelledby="auth-title" class="relative w-full max-w-md rounded-2xl bg-brand-paper p-6 shadow-warm-xl border border-brand-sand">
      <button class="absolute right-4 top-4 text-brand-mocha hover:text-brand-espresso" aria-label="Close" @click="$emit('close')"><X class="w-5 h-5" /></button>
      <div class="w-11 h-11 rounded-xl bg-brand-chestnut text-white flex items-center justify-center mb-4"><LogIn class="w-5 h-5" /></div>
      <h2 id="auth-title" class="text-xl font-extrabold text-brand-espresso">{{ isTh ? 'เข้าสู่ระบบ LostStuff2' : 'Sign in to LostStuff2' }}</h2>
      <p class="mt-2 text-sm text-brand-mocha/75">{{ isTh ? 'ใช้บัญชี Google ของมหาวิทยาลัย (@kkumail.com) เข้าใช้งานครั้งแรกระบบจะสร้างบัญชีให้อัตโนมัติ ไม่ต้องสมัครสมาชิก' : 'Use your university Google account (@kkumail.com). Your account is created automatically on first sign-in, no registration needed.' }}</p>
      <button type="button" :disabled="loading" class="mt-5 w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl bg-white hover:bg-brand-cream border border-brand-sand disabled:opacity-60 text-brand-espresso text-sm font-bold" @click="signInWithGoogle">
        <svg class="w-4 h-4" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        {{ loading ? (isTh ? 'กำลังไปที่ Google…' : 'Redirecting to Google…') : (isTh ? 'เข้าสู่ระบบด้วย Google' : 'Continue with Google') }}
      </button>
      <p v-if="error" class="mt-3 text-xs text-lost">{{ error }}</p>
    </section>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { LogIn, X } from 'lucide-vue-next'
import { supabase } from '../lib/supabase'
const props = defineProps({ currentLang: { type: String, default: 'th' } })
defineEmits(['close'])
const isTh = computed(() => props.currentLang === 'th')
const loading = ref(false), error = ref('')
// hd only preselects KKU accounts in Google's chooser; the Internal OAuth app,
// the Before User Created hook and RLS are what actually enforce @kkumail.com.
async function signInWithGoogle() {
  loading.value = true; error.value = ''
  try {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
        queryParams: { hd: 'kkumail.com', prompt: 'select_account' },
      },
    })
    // On success the browser is already leaving for Google, so keep the button busy.
    if (!authError) return
  } catch {
    // A thrown SDK or network failure gets the same retry message as a returned error.
  }
  loading.value = false
  error.value = isTh.value ? 'เปิดหน้าเข้าสู่ระบบของ Google ไม่สำเร็จ โปรดลองอีกครั้ง' : 'Could not open Google sign-in. Please try again.'
}
</script>
