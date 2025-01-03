import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicRoutes: RegExp[] = [/^\/login$/, /^\/login\/[^\/]+$/];
const protectedAdminRoutes: RegExp[] = [/^\/admin$/, /^\/users\/[^\/]+\/edit$/];

// Your JWT secret as a Uint8Array
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get('loggedIn');
  const sessionCookie = req.cookies.get('session');

  const isPublicRoute = publicRoutes.some((regex) =>
    regex.test(req.nextUrl.pathname),
  );

  try {
    // Verify the JWT using jose
    if (sessionCookie && sessionCookie?.value) {
      const { payload } = await jwtVerify(
        sessionCookie?.value || '',
        JWT_SECRET,
      );

      // Check if the user is an ADMIN
      if (
        isLoggedIn &&
        req.nextUrl.pathname === '/' &&
        payload.role === 'ADMIN'
      ) {
        console.log('Redirecting to /admin');
        return NextResponse.redirect(new URL('/admin', req.url));
      }

      // Redirect non-admin users trying to access protected admin routes
      if (
        protectedAdminRoutes.some((regex) =>
          regex.test(req.nextUrl.pathname),
        ) &&
        payload.role !== 'ADMIN' &&
        payload.role !== 'MANAGER'
      ) {
        console.log(
          'Non-admin user trying to access admin route, redirecting to /',
        );
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isPublicRoute) {
    console.log(
      `Public route and isLoggedIn: ${isLoggedIn}, path: ${req.nextUrl.pathname}`,
    );
    // If token exists and the user is trying to access login page, redirect to home
    if (isLoggedIn) {
      console.log('Redirecting to /');
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    // If token does not exist and the user is trying to access a protected page, redirect to login
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Allow access to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', // Exclude static paths and images
  ],
};
