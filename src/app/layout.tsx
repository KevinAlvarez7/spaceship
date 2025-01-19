// src/app/layout.tsx
import './globals.css'
import { Albert_Sans, Crimson_Pro, JetBrains_Mono } from 'next/font/google'
import staticFavicon from '@/favicon/favicon-static.png'
import animatedFavicon from '@/favicon/favicon-animated.png'

const albertSans = Albert_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-albert-sans',
})

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-crimson-pro',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:," />  {/* Reset default favicon */}
        
        {/* Animated PNG with high priority */}
        <link 
          rel="icon" 
          type="image/png" 
          href={animatedFavicon.src}
          sizes="32x32"
        />
        
        {/* Static fallback with lower priority */}
        <link 
          rel="alternate icon" 
          type="image/png" 
          href={staticFavicon.src}
          sizes="32x32"
        />
      </head>
      <body className={`${albertSans.variable} ${crimsonPro.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
