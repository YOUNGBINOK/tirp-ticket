'use client';

import {ThemeProvider} from '@/app/components/ui/theme-provider';
import {AppProgressBar as ProgressBar} from 'next-nprogress-bar';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

export type ThemeProps = {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
  toggleTheme: () => void;
};

// Create a context for theme
export const ThemeContext = createContext<ThemeProps | null>(null);

const Providers = ({children}: {children: React.ReactNode}) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false); // 마운트 상태 추가

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme); // 로컬 스토리지 업데이트
    setTheme(newTheme); // 상태 업데이트
  };

  const getCurrentTheme = () => {
    const themeLocalStorage = localStorage.getItem('theme');
    if (themeLocalStorage) {
      setTheme(themeLocalStorage); // 로컬 스토리지에서 테마 가져오기
    } else {
      setTheme('light'); // 기본 테마 설정
    }
  };

  useEffect(() => {
    getCurrentTheme();
    setMounted(true); // 컴포넌트가 마운트되면 true로 설정
  }, []);

  if (!mounted) return null; // 마운트되기 전에는 아무것도 렌더링하지 않음

  return (
    <ThemeContext.Provider value={{theme, setTheme: toggleTheme, toggleTheme}}>
      <ThemeProvider
        attribute="class"
        defaultTheme={'light'}
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <ProgressBar
          height="4px"
          color="#fffd00"
          options={{showSpinner: false}}
          shallowRouting
        />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default Providers;
