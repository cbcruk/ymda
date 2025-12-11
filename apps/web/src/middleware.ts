import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization')

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1] ?? 'username:password'
    const [username, password] = atob(authValue).split(':')

    if (
      username === process.env.USERNAME &&
      password === process.env.PASSWORD
    ) {
      return NextResponse.next()
    }
  }

  return new Response('인증이 필요합니다.', {
    status: 401,
    headers: {
      'WWW-authenticate': 'Basic realm="Secure Area"',
    },
  })
}
