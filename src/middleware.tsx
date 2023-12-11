import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/user',
};

export function middleware(request: NextRequest) {
//   const isAuthenticated = sessionStorage.getItem('userId')!;
    const cookie = request.cookies.get('authenticated')?.value;
    console.log('cookie:',cookie);
    if (cookie === undefined || cookie === "false") {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
};