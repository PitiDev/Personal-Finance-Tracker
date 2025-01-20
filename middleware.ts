import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './i18n-config'

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Explicitly handle the root URL
    if (pathname === '/') {
        return NextResponse.redirect(new URL(`/${i18n.defaultLocale}`, request.url))
    }

    // Check if pathname is missing a locale
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    if (pathnameIsMissingLocale) {
        return NextResponse.redirect(new URL(`/${i18n.defaultLocale}${pathname}`, request.url))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}