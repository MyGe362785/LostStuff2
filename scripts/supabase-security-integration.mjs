import { existsSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

for (const file of ['.env', '.env.local']) {
  if (existsSync(file)) process.loadEnvFile(file)
}

const backendRequired = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY']
const accountRequired = [
  'SECURITY_STUDENT_A_EMAIL', 'SECURITY_STUDENT_A_PASSWORD',
  'SECURITY_STUDENT_B_EMAIL', 'SECURITY_STUDENT_B_PASSWORD',
  'SECURITY_STAFF_EMAIL', 'SECURITY_STAFF_PASSWORD',
  'SECURITY_ADMIN_EMAIL', 'SECURITY_ADMIN_PASSWORD',
]
const missingBackend = backendRequired.filter(name => !process.env[name])
const missingAccounts = accountRequired.filter(name => !process.env[name])
if (missingBackend.length > 0) {
  console.error('BLOCKED: Supabase security integration tests did not run.')
  console.error(`Missing backend configuration: ${missingBackend.join(', ')}`)
  process.exit(2)
}

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
const client = () => createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})

const anon = client()
const studentA = client()
const studentB = client()
const staff = client()
const admin = client()
const results = []

function ok(condition, message) {
  if (!condition) throw new Error(message)
  results.push(`PASS ${message}`)
}

function denied(response, message, allowedCodes = ['42501']) {
  const error = response.error
  if (!error) throw new Error(`${message}: request unexpectedly succeeded`)
  if (/fetch failed|network|timed out/i.test(error.message || '')) throw error
  const status = Number(error.status || error.statusCode)
  ok(allowedCodes.includes(error.code) || status === 401 || status === 403, message)
}

async function signIn(supabase, emailName, passwordName, expectedRole) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env[emailName],
    password: process.env[passwordName],
  })
  if (error) throw new Error(`Could not sign in ${expectedRole} fixture: ${error.message}`)
  const { data: profile, error: profileError } = await supabase
    .from('profiles').select('id, role').eq('id', data.user.id).single()
  if (profileError) throw profileError
  ok(profile.role === expectedRole, `${expectedRole} fixture has the expected server-side role`)
  return data.user
}

async function createFixtureItem(supabase, marker, ownerType = 'found') {
  const { data, error } = await supabase.rpc('create_item_with_contact', {
    p_type: ownerType,
    p_category: 'others',
    p_title_th: `Security fixture ${marker}`,
    p_title_en: `Security fixture ${marker}`,
    p_description_th: 'Synthetic staging-only OWASP regression fixture',
    p_description_en: 'Synthetic staging-only OWASP regression fixture',
    p_color: 'black',
    p_brand: null,
    p_distinctive_marks: marker,
    p_building_id: 'security-test',
    p_location_detail_th: 'Synthetic staging location',
    p_location_detail_en: 'Synthetic staging location',
    p_occurred_on: new Date().toISOString().slice(0, 10),
    p_occurred_time_range: 'testing',
    p_handover_point_th: 'Synthetic test desk',
    p_handover_point_en: 'Synthetic test desk',
    p_contact: 'security-test@example.invalid',
  })
  if (error) throw error
  return data
}

const marker = `owasp-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
let itemForClaims
let itemForOwnerReturn
let studentBItem
let ownStoragePath

try {
  denied(await anon.from('profiles').select('id').limit(1), 'anonymous users cannot read profiles')
  denied(await anon.from('claims').select('id').limit(1), 'anonymous users cannot read claims')
  denied(await anon.from('audit_events').select('id').limit(1), 'anonymous users cannot read audit events')
  const publicItems = await anon.from('items').select('id, status')
  if (publicItems.error) throw publicItems.error
  ok(publicItems.data.every(row => ['searching', 'pending_confirm', 'returned'].includes(row.status)), 'anonymous item reads expose only public statuses')

  if (missingAccounts.length > 0) {
    console.log(results.join('\n'))
    console.error('BLOCKED: authenticated Supabase security integration tests did not run.')
    console.error(`Missing staging-only configuration: ${missingAccounts.join(', ')}`)
    console.error('Provide synthetic test accounts; do not provide a service-role key.')
    process.exit(2)
  }

  const userA = await signIn(studentA, 'SECURITY_STUDENT_A_EMAIL', 'SECURITY_STUDENT_A_PASSWORD', 'student')
  const userB = await signIn(studentB, 'SECURITY_STUDENT_B_EMAIL', 'SECURITY_STUDENT_B_PASSWORD', 'student')
  const staffUser = await signIn(staff, 'SECURITY_STAFF_EMAIL', 'SECURITY_STAFF_PASSWORD', 'staff')
  await signIn(admin, 'SECURITY_ADMIN_EMAIL', 'SECURITY_ADMIN_PASSWORD', 'admin')

  const visibleProfiles = await studentA.from('profiles').select('id')
  if (visibleProfiles.error) throw visibleProfiles.error
  ok(visibleProfiles.data.length === 1 && visibleProfiles.data[0].id === userA.id, 'students can read only their own profile')
  denied(await studentA.from('profiles').update({ role: 'admin' }).eq('id', userA.id), 'students cannot promote themselves')

  itemForClaims = await createFixtureItem(studentA, `${marker}-claims`)
  itemForOwnerReturn = await createFixtureItem(studentA, `${marker}-return`)
  studentBItem = await createFixtureItem(studentB, `${marker}-image`)

  const hiddenPending = await studentB.from('items').select('id').eq('id', itemForClaims)
  if (hiddenPending.error) throw hiddenPending.error
  ok(hiddenPending.data.length === 0, 'Student B cannot read Student A pending item')

  const privateContact = await studentB.from('item_contacts').select('item_id').eq('item_id', itemForClaims)
  if (privateContact.error) throw privateContact.error
  ok(privateContact.data.length === 0, 'Student B cannot read Student A private contact')
  const staffContact = await staff.from('item_contacts').select('item_id').eq('item_id', itemForClaims)
  if (staffContact.error) throw staffContact.error
  ok(staffContact.data.length === 1, 'staff can read a private contact for case handling')

  denied(await staff.from('items').update({ status: 'searching' }).eq('id', itemForClaims), 'direct item status writes are denied even to staff')
  denied(await staff.from('audit_events').insert({ item_id: itemForClaims, action: 'forged' }), 'clients cannot forge audit events')

  ownStoragePath = `${userA.id}/${crypto.randomUUID()}.png`
  const imageBytes = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ownUpload = await studentA.storage.from('loststuff-images').upload(ownStoragePath, imageBytes, { contentType: 'image/png' })
  if (ownUpload.error) throw ownUpload.error
  const ownImage = await studentA.from('item_images').insert({ item_id: itemForClaims, storage_path: ownStoragePath, alt_text: marker })
  if (ownImage.error) throw ownImage.error
  denied(
    await studentB.from('item_images').insert({ item_id: studentBItem, storage_path: ownStoragePath, alt_text: marker }),
    'users cannot publish an object from another user folder',
  )
  denied(
    await studentB.storage.from('loststuff-images').upload(`${userA.id}/${crypto.randomUUID()}.png`, imageBytes, { contentType: 'image/png' }),
    'users cannot upload into another user folder',
  )

  for (const itemId of [itemForClaims, itemForOwnerReturn]) {
    const approved = await staff.rpc('update_item_status', {
      p_item_id: itemId, p_status: 'searching', p_action: 'item_approved',
      p_metadata: {}, p_expected_status: 'pending_review',
    })
    if (approved.error) throw approved.error
    ok(approved.data === true, 'staff can approve a pending item through the transactional RPC')
  }
  const closeBFixture = await staff.rpc('update_item_status', {
    p_item_id: studentBItem, p_status: 'closed', p_action: 'item_closed',
    p_metadata: {}, p_expected_status: 'pending_review',
  })
  if (closeBFixture.error) throw closeBFixture.error

  denied(
    await studentA.rpc('create_claim', { p_item_id: itemForClaims, p_proof: marker, p_preferred_contact: marker }),
    'item owners cannot claim their own items',
    ['55000'],
  )
  denied(
    await studentB.from('claims').insert({
      item_id: itemForClaims, claimant_id: userB.id, proof: marker,
      preferred_contact: marker, status: 'approved', reviewed_by: staffUser.id,
    }),
    'claimants cannot forge review fields',
  )

  const claimB = await studentB.rpc('create_claim', {
    p_item_id: itemForClaims, p_proof: marker, p_preferred_contact: marker,
  })
  if (claimB.error) throw claimB.error
  const claimStaff = await staff.rpc('create_claim', {
    p_item_id: itemForClaims, p_proof: marker, p_preferred_contact: marker,
  })
  if (claimStaff.error) throw claimStaff.error

  denied(
    await studentB.rpc('review_claim', { p_claim_id: claimB.data, p_decision: 'approved', p_note: null }),
    'students cannot review claims',
  )

  const competing = await Promise.all([
    staff.rpc('review_claim', { p_claim_id: claimB.data, p_decision: 'approved', p_note: 'synthetic test' }),
    admin.rpc('review_claim', { p_claim_id: claimStaff.data, p_decision: 'approved', p_note: 'synthetic test' }),
  ])
  ok(competing.filter(response => !response.error).length === 1, 'concurrent competing approvals produce exactly one winner')

  const claimsAfterRace = await staff.from('claims').select('id, status').eq('item_id', itemForClaims)
  if (claimsAfterRace.error) throw claimsAfterRace.error
  const approvedClaim = claimsAfterRace.data.find(row => row.status === 'approved')
  ok(Boolean(approvedClaim), 'the winning claim is held for collection')

  const completed = await staff.rpc('review_claim', {
    p_claim_id: approvedClaim.id, p_decision: 'completed', p_note: 'synthetic test complete',
  })
  if (completed.error) throw completed.error
  const finalClaims = await staff.from('claims').select('status').eq('item_id', itemForClaims)
  if (finalClaims.error) throw finalClaims.error
  ok(finalClaims.data.filter(row => row.status === 'completed').length === 1 && finalClaims.data.every(row => ['completed', 'rejected'].includes(row.status)), 'completion settles every competing claim consistently')

  const ownerReturn = await studentA.rpc('update_item_status', {
    p_item_id: itemForOwnerReturn, p_status: 'returned', p_action: 'return_confirmed',
    p_metadata: {}, p_expected_status: 'searching',
  })
  if (ownerReturn.error) throw ownerReturn.error
  ok(ownerReturn.data === true, 'an owner can confirm return of their own active item')

  const audits = await staff.from('audit_events').select('actor_id, action').in('item_id', [itemForClaims, itemForOwnerReturn])
  if (audits.error) throw audits.error
  ok(audits.data.some(row => row.actor_id === userA.id && row.action === 'return_confirmed'), 'successful status changes have a server-derived audit actor')

  console.log(results.join('\n'))
  console.log(`Security integration suite passed (${results.length} assertions).`)
} catch (error) {
  console.error(results.join('\n'))
  console.error(`FAIL ${error.message}`)
  process.exitCode = 1
} finally {
  if (ownStoragePath) {
    await studentA.from('item_images').delete().eq('storage_path', ownStoragePath)
    await studentA.storage.from('loststuff-images').remove([ownStoragePath])
  }
  await Promise.all([studentA, studentB, staff, admin].map(supabase => supabase.auth.signOut()))
}
