// Simple smoke test for local backend (DEV_AUTH=true mode)
const base = 'http://localhost:4000'

let cookieJar = ''

async function req(path, opts = {}) {
  opts.headers = opts.headers || {}
  if (cookieJar) opts.headers.Cookie = cookieJar
  const res = await fetch(base + path, opts)
  const text = await res.text()
  let body
  try { body = JSON.parse(text) } catch(e) { body = text }
  const sc = res.headers.get('set-cookie')
  if (sc) {
    // prefer server cookie value
    cookieJar = sc.split(';')[0]
  }
  return { status: res.status, body, headers: Object.fromEntries(res.headers.entries()) }
}

async function run() {
  console.log('1) Checking /api/health')
  console.log(await req('/api/health'))

  const email = `test+${Date.now()}@example.com`
  const password = 'Password123!'

  console.log('\n2) Registering user (POST /api/auth/register)')
  let r = await req('/api/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password, name: 'Smoke Tester' }), credentials: 'include' })
  console.log(r)

  console.log('\n3) Check /api/auth/me (should be logged in)')
  r = await req('/api/auth/me')
  console.log(r)

  console.log('\n4) Logout (POST /api/auth/logout)')
  r = await req('/api/auth/logout', { method: 'POST' })
  console.log(r)

  console.log('\n5) Check /api/auth/me (should NOT be logged in)')
  r = await req('/api/auth/me')
  console.log(r)

  console.log('\n6) Login with credentials (POST /api/auth/login)')
  r = await req('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }), credentials: 'include' })
  console.log(r)

  console.log('\n7) Final /api/auth/me (should be logged in again)')
  r = await req('/api/auth/me')
  console.log(r)

  console.log('\nSmoke tests complete')
}

run().catch(e => { console.error('Smoke test error:', e); process.exitCode = 2 })
