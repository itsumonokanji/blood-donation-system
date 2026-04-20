"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// Определяем, какие бывают темы
type Theme = 'light' | 'dark';

// Создаем сам Контекст (хранилище)
const ThemeContext = createContext({
  theme: 'light' as Theme,
  toggleTheme: () => {}, // Это функция-заглушка для переключения
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Этот эффект срабатывает один раз при загрузке сайта
  useEffect(() => {
    // Проверяем: может пользователь уже заходил и выбирал тему?
    const savedTheme = localStorage.getItem('app_theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      // Применяем тему к тегу <html>, чтобы CSS её увидел
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Сохраняем в память браузера
    localStorage.setItem('app_theme', newTheme);
    
    // Меняем атрибут на самом верху страницы
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


export const useTheme = () => useContext(ThemeContext);