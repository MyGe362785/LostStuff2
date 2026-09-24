import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const CLAIM_EVIDENCE_BUCKET = 'claim-evidence'
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function imageTypeFromBytes(bytes: Uint8Array): { extension: string, mimeType: string } | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { extension: 'jpg', mimeType: 'image/jpeg' }
  }
  if (bytes.length >= 8 && bytes.slice(0, 8).every((byte, index) => byte === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index])) {
    return { extension: 'png', mimeType: 'image/png' }
  }
  if (
    bytes.length >= 12
    && new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF'
    && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP'
  ) {
    return { extension: 'webp', mimeType: 'image/webp' }
  }
  return null
}

function response(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return response({ error: 'Method not allowed' }, 405)

  const authorization = request.headers.get('Authorization')
  if (!authorization) return response({ error: 'Authentication is required' }, 401)

  const url = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !anonKey || !serviceRoleKey) return response({ error: 'Function is not configured' }, 500)

  const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } })
  const { data: { user }, error: userError } = await userClient.auth.getUser()
  if (userError || !user) return response({ error: 'Authentication is required' }, 401)

  const { data: approvedUser, error: approvalError } = await userClient.rpc('is_kkumail_user')
  if (approvalError || !approvedUser) return response({ error: 'An approved university account is required' }, 403)

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) return response({ error: 'Select an image file first' }, 400)
  if (file.size === 0 || file.size > MAX_FILE_BYTES) return response({ error: 'Each image must be 5 MB or smaller' }, 400)

  const bytes = new Uint8Array(await file.arrayBuffer())
  const imageType = imageTypeFromBytes(bytes)
  if (!imageType) return response({ error: 'Only JPEG, PNG, and WebP image files are accepted' }, 400)

  const adminClient = createClient(url, serviceRoleKey)
  const path = `${user.id}/${crypto.randomUUID()}.${imageType.extension}`
  const { error: uploadError } = await adminClient.storage
    .from(CLAIM_EVIDENCE_BUCKET)
    .upload(path, bytes, { contentType: imageType.mimeType, upsert: false })

  if (uploadError) return response({ error: 'Could not store the evidence image' }, 500)
  return response({ path }, 201)
})
