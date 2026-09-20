const PLACEHOLDER = /^(?:your[-_]|replace[-_]|example|changeme|test$)/i

function decodeJwtPayload(token) {
  try {
    const encoded = token.split('.')[1]
    if (!encoded) return null
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
  } catch {
    return null
  }
}

export function validateSupabaseEnv(env, { production = true } = {}) {
  const urlValue = env.VITE_SUPABASE_URL?.trim()
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  const errors = []

  if (!urlValue) {
    errors.push('VITE_SUPABASE_URL is required')
  } else {
    try {
      const url = new URL(urlValue)
      if (production && url.protocol !== 'https:') errors.push('VITE_SUPABASE_URL must use HTTPS in production')
      if (url.username || url.password) errors.push('VITE_SUPABASE_URL must not contain credentials')
    } catch {
      errors.push('VITE_SUPABASE_URL must be a valid URL')
    }
  }

  if (!key) {
    errors.push('VITE_SUPABASE_PUBLISHABLE_KEY is required')
  } else if (PLACEHOLDER.test(key) || key.length < 24) {
    errors.push('VITE_SUPABASE_PUBLISHABLE_KEY still looks like a placeholder')
  } else if (/^(?:sb_secret_|service_role)/i.test(key)) {
    errors.push('A secret or service-role key must never be bundled into the frontend')
  } else if (key.startsWith('sb_publishable_')) {
    // Current Supabase publishable-key format.
  } else {
    const payload = decodeJwtPayload(key)
    if (!payload || payload.role !== 'anon') {
      errors.push('VITE_SUPABASE_PUBLISHABLE_KEY must be a publishable key or legacy anon JWT')
    }
  }

  return errors
}

export function assertSupabaseEnv(env, options) {
  const errors = validateSupabaseEnv(env, options)
  if (errors.length > 0) {
    throw new Error(`Invalid production Supabase configuration:\n- ${errors.join('\n- ')}`)
  }
}
