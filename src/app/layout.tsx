import Navbar from '@/app/components/layout/Navbar';
import Providers from '@/app/components/layout/Provider';
import Sidebar from '@/app/components/layout/Sidebar';
import {Toaster} from '@/app/components/ui/toaster';
import '@/app/globals.css'; // Tailwind나 글로벌 CSS 파일을 여기에 추가
import {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {Suspense} from 'react';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home Page',
};
const inter = Inter({subsets: ['latin']});

function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navbar와 Sidebar는 고정 */}
        <Navbar />
        <Sidebar />

        <Suspense>
          <Providers>{children}</Providers>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}

export default RootLayout;
