import localFont from 'next/font/local'
import { Noto_Sans_KR } from 'next/font/google'

export const notoSerif = localFont({
  src: [
    {
      path: './noto-serif-kr-v13-latin_korean-regular.woff2',
      weight: '400',
    },
    {
      path: './noto-serif-kr-v20-latin_korean-500.woff2',
      weight: '500',
    },
    {
      path: './noto-serif-kr-v20-latin_korean-900.woff2',
      weight: '900',
    },
  ],
})

export const notoSans = Noto_Sans_KR({
  weight: ['400'],
  subsets: ['latin'],
})
