import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import '../styles/tailwind.css';
import HomeRouteTransition from '@/app/components/HomeRouteTransition';
import SmoothScroll from '@/app/components/SmoothScroll';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#04040A',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'MotionGrace | High-End Animation Studio for Ads, UI & Product Videos',
  description:
    'Motion Grace creates cinematic CGI product visuals and digital twins for cosmetic and beauty brands — replacing traditional photoshoots with infinite assets.',
  icons: {
    icon: [
      { url: '/motion_grace_logo.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [{ url: '/motion_grace_logo.png', type: 'image/png' }],
    shortcut: '/motion_grace_logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable} dark`} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <SmoothScroll />
        {children}
        <HomeRouteTransition />
      </body>
    </html>
  );
}
