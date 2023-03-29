import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from 'src/utils/jwt'

const authRoutes = ['/api/auth/login', '/api/auth/register', '/api/is-email-available']
const protectedRoutes = ['/api', '/home', '/papers', '/groups']

export async function middleware(request: NextRequest) {
  if (authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    console.log('middleware auth route', request.nextUrl.pathname)
    return
  }

  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    console.log('middleware protected route', request.nextUrl.pathname)
    //? Get token from cookies
    const token = request.cookies.get('token')?.value
    //? If token is not present, redirect to login page
    if (!token) {
      return NextResponse.redirect(new URL('/login?prompt=true', request.url))
    }

    //? Verify token and get user id
    const { userId, exp } = await verifyJWT(token)

    //? If token is expired, redirect to login page
    if (exp * 1000 < Date.now()) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    //? Set user id to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('user-id', userId)

    //? Return next response with new request headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    return response
  }
}
