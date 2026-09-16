<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button aria-label="Close sign-in dialog" class="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm" @click="$emit('close')"></button>
    <section role="dialog" aria-modal="true" aria-labelledby="auth-title" class="relative w-full max-w-md rounded-2xl bg-brand-paper p-6 shadow-warm-xl border border-brand-sand">
      <button class="absolute right-4 top-4 text-brand-mocha hover:text-brand-espresso" aria-label="Close" @click="$emit('close')"><X class="w-5 h-5" /></button>
      <div class="w-11 h-11 rounded-xl bg-brand-chestnut text-white flex items-center justify-center mb-4"><Mail class="w-5 h-5" /></div>
      <h2 id="auth-title" class="text-xl font-extrabold text-brand-espresso">{{ isTh ? 'เข้าสู่ระบบ LostStuff2' : 'Sign in to LostStuff2' }}</h2>
      <p class="mt-2 text-sm text-brand-mocha/75">{{ isTh ? 'ใช้ได้เฉพาะอีเมล @kkumail.com แล้วเราจะส่งลิงก์เข้าสู่ระบบที่ปลอดภัยให้คุณ' : 'Use your @kkumail.com email and we will send you a secure sign-in link.' }}</p>
      <form class="mt-5 space-y-3" @submit.prevent="submit">
        <label class="block text-xs font-bold text-brand-espresso" for="auth-email">Email</label>
        <input id="auth-email" v-model.trim="email" type="email" required autocomplete="email" placeholder="student@kkumail.com" class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-sm focus:outline-none focus:border-brand-caramel" />
        <p v-if="error" class="text-xs text-lost">{{ error }}</p>
        <button :disabled="loading" class="w-full py-2.5 rounded-xl bg-brand-chestnut hover:bg-brand-mocha disabled:opacity-60 text-white text-sm font-bold">{{ loading ? (isTh ? 'กำลังส่ง…' : 'Sending…') : (isTh ? 'ส่งลิงก์เข้าสู่ระบบ' : 'Email me a sign-in link') }}</button>
      </form>
      <p v-if="sent" class="mt-4 rounded-xl bg-found-light border border-found-border p-3 text-xs text-found-dark">{{ isTh ? 'ส่งลิงก์แล้ว โปรดตรวจสอบอีเมลของคุณ' : 'Link sent. Please check your inbox.' }}</p>
    </section>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { Mail, X } from 'lucide-vue-next'
import { supabase } from '../lib/supabase'
const props = defineProps({ currentLang: { type: String, default: 'th' } })
defineEmits(['close'])
const isTh = computed(() => props.currentLang === 'th')
const email = ref(''), loading = ref(false), sent = ref(false), error = ref('')
const allowedEmailPattern = /^[^\s@]+@kkumail\.com$/i
async function submit() {
  if (!allowedEmailPattern.test(email.value)) {
    error.value = isTh.value ? 'โปรดใช้อีเมล @kkumail.com เท่านั้น' : 'Please use an @kkumail.com email address.'
    return
  }
  loading.value = true; error.value = ''
  const { error: authError } = await supabase.auth.signInWithOtp({ email: email.value, options: { emailRedirectTo: `${window.location.origin}/` } })
  loading.value = false
  if (authError) { error.value = authError.message; return }
  sent.value = true
}
</script>
