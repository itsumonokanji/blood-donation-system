"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  ru: {
    title: "LifeLink",
    donor: "Донорам",
    hospital: "Больницам",
    admin: "Админ",
    welcome: "Стань героем — спаси жизнь",
    description: "Современная платформа для доноров и медицинских учреждений.",
    donorHero: "Стань героем — спаси жизнь 🩸",
    donorSub: "Регистрация в базе доноров занимает всего 1 минуту.",
    regTitle: "Регистрация",
    alreadyInBase: "Уже в базе?",
    findProfileDesc: "Введите имя, чтобы увидеть карточку донора.",
    btnReg: "Зарегистрироваться",
    btnFind: "Найти профиль",
    compatibility: "Ваша совместимость:",
    readyStatus: "✅ Готов к донации",
    bloodGroup: "Группа крови",
    location: "Город",
    hospTitle: "Кабинет учреждения",
    hospSub: "Создавайте запросы на поиск доноров.",
    newRequest: "Новая заявка",
    history: "История запросов",
    btnPost: "Опубликовать запрос",
    adminTitle: "Панель управления",
    adminDonors: "Все доноры",
    adminRequests: "Все запросы",
    tableAction: "Действие",
    btnDelete: "Удалить",
    btnClose: "Закрыть",
    statsTotal: "Всего доноров",
    statsActive: "Нужна кровь (заявки)",
    statsSaved: "Спасенные жизни",
    msgSuccess: "Успешно!",
    msgError: "Ошибка сервера",
    msgDeleted: "Удалено",
    searchPlaceholder: "Поиск...",
    colName: "Имя",
    colId: "ID",
    colHospital: "Больница",
    colStatus: "Статус",
    statusDone: "Завершено",
    statusPending: "В ожидании",
    howItWorks: "Как работает LifeLink?",
    step1Title: "Регистрация",
    step1Desc: "Станьте частью сообщества доноров",
    step2Title: "Запрос",
    step2Desc: "Больницы публикуют заявки на кровь",
    step3Title: "Уведомление",
    step3Desc: "Система находит подходящих доноров",
    step4Title: "Донация",
    step4Desc: "Вы приходите и спасаете жизнь",
    stepsSubtitle: "Всего четыре простых шага до спасения жизни",
    btnBecomeDonor: "Стать донором",
    institution: "Учреждение",
    selectHospital: "Выберите из списка",
    statusClosed: "Закрыто",
    statusActive: "Активно",
    // Справочник клиник Бишкека (RU)
    hospitalsList: {
      h1: "Национальный госпиталь",
      h2: "Центр охраны материнства и детства",
      h3: "Национальный центр кардиологии",
      h4: "Республиканская инфекционная больница",
      h5: "Городская клиническая больница №1",
      p1: "Клиника Bonum",
      p2: "Медицинский центр Элдик",
      p3: "Клиника Авиценна",
      p4: "Клиника NeoMed",
      p5: "Клиника Medi",
      p6: "Юрфа",
      p7: "Малыш",
      p8: "Кафмедцентр",
      p9: "Клиника Громовой",
      p10: "Медцентр КГМА"
    },
    addresses: {
      h1: "ул. Тоголок Молдо, 1/7", h2: "ул. Тоголок Молдо, 1", h3: "ул. Тоголок Молдо, 3", h4: "ул. Льва Толстого, 70", h5: "ул. Фучика, 3",
      p1: "ул. Токтогула, 125", p2: "ул. Байтик Баатыра, 8", p3: "ул. Джунусалиева, 83", p4: "ул. Орозбекова, 46", p5: "ул. Сухэ-Батора, 3",
      p6: "ул. Киевская, 120", p7: "ул. Ахунбаева, 131", p8: "ул. Байтик Баатыра, 3/1", p9: "ул. Логвиненко, 10", p10: "ул. Тыныстанова, 1"
    }
  },
  en: {
    title: "LifeLink",
    donor: "Donors",
    hospital: "Hospitals",
    admin: "Admin",
    welcome: "Become a Hero — Save a Life",
    description: "Modern platform for blood donors and medical institutions.",
    donorHero: "Become a Hero — Save a Life 🩸",
    donorSub: "Registration in the donor database takes only 1 minute.",
    regTitle: "Registration",
    alreadyInBase: "Already registered?",
    findProfileDesc: "Enter your name to see your donor card.",
    btnReg: "Register Now",
    btnFind: "Find Profile",
    compatibility: "Your compatibility:",
    readyStatus: "✅ Ready to donate",
    bloodGroup: "Blood Group",
    location: "Location",
    hospTitle: "Hospital Dashboard",
    hospSub: "Create requests to find donors.",
    newRequest: "New Request",
    history: "Request History",
    btnPost: "Post Request",
    adminTitle: "Admin Panel",
    adminDonors: "All Donors",
    adminRequests: "All Requests",
    tableAction: "Action",
    btnDelete: "Delete",
    btnClose: "Close",
    statsTotal: "Total Donors",
    statsActive: "Active Requests",
    statsSaved: "Lives Saved",
    msgSuccess: "Success!",
    msgError: "Server error",
    msgDeleted: "Deleted",
    searchPlaceholder: "Search...",
    colName: "Name",
    colId: "ID",
    colHospital: "Hospital",
    colStatus: "Status",
    statusDone: "Done",
    statusPending: "Pending",
    howItWorks: "How LifeLink Works?",
    step1Title: "Registration",
    step1Desc: "Join our donor community",
    step2Title: "Request",
    step2Desc: "Hospitals post blood requests",
    step3Title: "Matching",
    step3Desc: "System finds suitable donors",
    step4Title: "Help",
    step4Desc: "You arrive and save a life",
    stepsSubtitle: "Just four simple steps to save a life",
    btnBecomeDonor: "Become a Donor",
    institution: "Institution",
    selectHospital: "Select from the list",
    statusClosed: "Closed",
    statusActive: "Active",
    // Справочник клиник Бишкека (EN)
    hospitalsList: {
      h1: "National Hospital",
      h2: "Mother and Child Care Center",
      h3: "National Cardiology Center",
      h4: "Infectious Diseases Hospital",
      h5: "City Clinical Hospital №1",
      p1: "Bonum Clinic",
      p2: "Eldik Medical Center",
      p3: "Avicenna Clinic",
      p4: "NeoMed Clinic",
      p5: "Medi Hospital",
      p6: "Yurfa Clinic",
      p7: "Malysh Clinic",
      p8: "Kafmedcenter",
      p9: "Gromovoy Clinic",
      p10: "KSMA Medical Center"
    },
    addresses: {
      h1: "1/7 Togolok Moldo St.", h2: "1 Togolok Moldo St.", h3: "3 Togolok Moldo St.", h4: "70 Lev Tolstoy St.", h5: "3 Fuchik St.",
      p1: "125 Toktogul St.", p2: "8 Baitik Baatyr St.", p3: "83 Dzhunusalieva St.", p4: "46 Orozbekov St.", p5: "3 Sukhe-Bator St.",
      p6: "120 Kievskaya St.", p7: "131 Ahunbaev St.", p8: "3/1 Baitik Baatyr St.", p9: "10 Logvinenko St.", p10: "1 Tynystanova St."
    }
  },
  jp: {
    // ... твой код JP без изменений, но добавь пустые объекты для совместимости или скопируй из EN
    hospitalsList: {}, addresses: {}
  },
  kr: {
    // ... твой код KR без изменений, но добавь пустые объекты для совместимости или скопируй из EN
    hospitalsList: {}, addresses: {}
  }
};

type Language = keyof typeof translations; 

const LanguageContext = createContext({
  lang: 'ru' as Language,
  setLang: (l: Language) => { },
  t: (translations.ru as any) // Добавил any, чтобы TS не ругался на новые поля
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('ru');

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem('app_lang') as Language;
      if (savedLang && translations[savedLang]) {
        setLang(savedLang);
      }
    }
  }, []);

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t: t as any }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);