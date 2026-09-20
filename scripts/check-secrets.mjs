import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const listed = spawnSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
if (listed.status !== 0) {
  console.error('Secret scan failed: could not enumerate tracked files.')
  process.exit(1)
}

const patterns = [
  { label: 'Supabase secret key', expression: new RegExp('sb_' + 'secret_[A-Za-z0-9_-]{16,}', 'g') },
  { label: 'assigned service-role key', expression: new RegExp('SUPABASE_' + 'SERVICE_ROLE_KEY\\s*=\\s*[^\\s#]+', 'gi') },
  { label: 'private key', expression: new RegExp('BEGIN ' + '(?:RSA |EC |OPENSSH )?PRIVATE KEY', 'g') },
  { label: 'AWS access key', expression: new RegExp('AKIA' + '[A-Z0-9]{16}', 'g') },
]

const findings = []
for (const file of listed.stdout.split('\0').filter(Boolean)) {
  if (file === 'scripts/check-secrets.mjs') continue
  if (/\.(?:png|jpe?g|gif|webp|ico|woff2?)$/i.test(file)) continue
  let contents
  try {
    contents = readFileSync(file, 'utf8')
  } catch {
    continue
  }
  for (const pattern of patterns) {
    if (pattern.expression.test(contents)) findings.push(`${file}: ${pattern.label}`)
    pattern.expression.lastIndex = 0
  }
}

const trackedEnv = listed.stdout.split('\0').filter(file => /^\.env(?:\.|$)/.test(file) && file !== '.env.example')
for (const file of trackedEnv) findings.push(`${file}: tracked environment file`)

if (findings.length > 0) {
  console.error(`Secret scan failed:\n- ${findings.join('\n- ')}`)
  process.exit(1)
}
console.log('Secret scan passed: no tracked high-confidence secrets found.')
