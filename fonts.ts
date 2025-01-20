import { Noto_Sans_Lao } from 'next/font/google'

export const notoSansLao = Noto_Sans_Lao({
    weight: ['400', '700'],
    subsets: ['lao'],
    display: 'swap',
    variable: '--font-noto-sans-lao',
})