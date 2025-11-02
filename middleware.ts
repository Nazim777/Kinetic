// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   // Check for auth token or cookie
//   const user = localStorage.getItem('user'); // you can change this to whatever you store

//   // Define all protected routes
//   const protectedPaths = [
//     '/dashboard',
//     '/workspace',
//     '/dashboard/settings',
//     '/dashboard/subscriptions',
//   ];

//   const isProtected = protectedPaths.some((path) =>
//     request.nextUrl.pathname.startsWith(path)
//   );

//   // If user not found and trying to access protected page — redirect
//   if (isProtected && !user) {
//     const loginUrl = new URL('/', request.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Otherwise continue
//   return NextResponse.next();
// }

// // Apply middleware only to relevant paths
// export const config = {
//   matcher: ['/dashboard/:path*', '/workspace/:path*'],
// };


import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')?.value;

  const protectedPaths = ['/dashboard', '/workspace', '/dashboard/settings', '/dashboard/subscriptions'];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/workspace/:path*'],
};
