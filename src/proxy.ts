import { NextResponse, type NextRequest } from 'next/server'

/**
 * Client preview guard, active only when PREVIEW_PASSWORD is set (e.g. when sharing through a tunnel).
 * - Every page asks for a password (any username).
 * - Requests not coming to localhost cannot reach the admin panel or the API (images stay reachable).
 */
export function proxy(request: NextRequest) {
  const password = process.env.PREVIEW_PASSWORD
  if (!password) return NextResponse.next()

  const { pathname } = request.nextUrl
  const host = request.headers.get('host') ?? ''
  const isLocal = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)

  if (!isLocal && (pathname.startsWith('/admin') || (pathname.startsWith('/api') && !pathname.startsWith('/api/media/file/')))) {
    return new NextResponse('Not found', { status: 404 })
  }

  // Public image files skip the password: the image optimizer fetches them without the visitor's credentials.
  if (isLocal || /^\/(api\/media\/file|placeholders|brand)\//.test(pathname)) return NextResponse.next()

  const auth = request.headers.get('authorization') ?? ''
  const [scheme, encoded] = auth.split(' ')
  if (scheme === 'Basic' && encoded) {
    const supplied = atob(encoded).split(':').slice(1).join(':')
    if (supplied === password) return NextResponse.next()
  }
  return new NextResponse('This preview is password protected.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="BharatX Group preview", charset="UTF-8"' },
  })
}

export const config = {
  // Everything except Next.js build assets and the favicon.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
