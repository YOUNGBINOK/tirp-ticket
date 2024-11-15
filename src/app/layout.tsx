import Navbar from '@/app/components/layout/Navbar';
import Sidebar from '@/app/components/layout/Sidebar';
import '@/app/globals.css'; // Tailwind나 글로벌 CSS 파일을 여기에 추가
import {Metadata} from 'next';
import {Inter} from 'next/font/google';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home Page',
};
const inter = Inter({subsets: ['latin']});

function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="flex">
          <div className="w-1/6 hidden sm:block">
            <Sidebar />
          </div>
          <main className="w-5/6">{children}</main>
        </div>

        {/* <Suspense>
          <Providers></Providers>
          <Toaster />
        </Suspense> */}
      </body>
    </html>
  );
}

export default RootLayout;
