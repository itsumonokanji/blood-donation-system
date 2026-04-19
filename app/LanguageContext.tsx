"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Словарь с добавленными заголовками таблиц и поиском
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
    // Новые ключи:
    searchPlaceholder: "Поиск...",
    colName: "Имя",
    colId: "ID",
    colHospital: "Больница",
    colStatus: "Статус",
    statusDone: "Завершено",
    statusPending: "В ожидании"
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
    statusPending: "Pending"
  },
  jp: { 
    title: "ライフリンク", 
    donor: "ドナー", 
    hospital: "病院", 
    admin: "管理者", 
    welcome: "ヒーローになって命を救おう",
    description: "ドナーと医療機関のための現代的なプラットフォーム。",
    donorHero: "ヒーローになって命を救おう 🩸",
    donorSub: "ドナー登録はわずか1分で完了します。",
    regTitle: "新規登録",
    alreadyInBase: "登録済みの方はこちら",
    findProfileDesc: "名前を入力してドナーカードを表示します。",
    btnReg: "登録する",
    btnFind: "プロフィール検索",
    compatibility: "互換性:",
    readyStatus: "✅ 献血準備完了",
    bloodGroup: "血液型",
    location: "場所",
    hospTitle: "病院ダッシュボード",
    hospSub: "ドナー検索リクエストを作成します。",
    newRequest: "新規リクエスト",
    history: "リクエスト履歴",
    btnPost: "リクエストを送信",
    adminTitle: "管理パネル",
    adminDonors: "全ドナー",
    adminRequests: "全リクエスト",
    tableAction: "アクション",
    btnDelete: "削除",
    btnClose: "閉じる",
    statsTotal: "合計ドナー数",
    statsActive: "有効なリクエスト",
    statsSaved: "救われた命",
    msgSuccess: "成功！",
    msgError: "サーバーエラー",
    msgDeleted: "削除されました",
    searchPlaceholder: "検索...",
    colName: "名前",
    colId: "ID",
    colHospital: "病院",
    colStatus: "ステータス",
    statusDone: "完了",
    statusPending: "保留中"
  },
  kr: { 
    title: "라이프링크", 
    donor: "기증자", 
    hospital: "병원", 
    admin: "관리자", 
    welcome: "영웅이 되어 생명을 구하세요",
    description: "기증자와 의료 기관을 위한 현대적인 플랫폼.",
    donorHero: "영웅이 되어 생명을 구하세요 🩸",
    donorSub: "기증자 등록은 단 1분이면 충분합니다.",
    regTitle: "회원가입",
    alreadyInBase: "이미 등록하셨나요?",
    findProfileDesc: "이름을 입력하여 기증자 카드를 확인하세요.",
    btnReg: "등록하기",
    btnFind: "프로필 찾기",
    compatibility: "호환성:",
    readyStatus: "✅ 헌혈 가능 상태",
    bloodGroup: "혈액형",
    location: "위치",
    hospTitle: "병원 대시보드",
    hospSub: "기증자 찾기 요청을 생성합니다.",
    newRequest: "새 요청",
    history: "요청 기록",
    btnPost: "요청 게시",
    adminTitle: "관리자 패널",
    adminDonors: "모든 기증자",
    adminRequests: "모든 요청",
    tableAction: "작업",
    btnDelete: "삭제",
    btnClose: "닫기",
    statsTotal: "총 기증자",
    statsActive: "활성 요청",
    statsSaved: "구한 생명",
    msgSuccess: "성공!",
    msgError: "서버 오류",
    msgDeleted: "삭제됨",
    searchPlaceholder: "검색...",
    colName: "이름",
    colId: "ID",
    colHospital: "병원",
    colStatus: "상태",
    statusDone: "완료",
    statusPending: "대기 중"
  }
};

type Language = 'ru' | 'en' | 'jp' | 'kr';

const LanguageContext = createContext({
  lang: 'ru' as Language,
  setLang: (l: Language) => {},
  t: translations.ru
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('ru');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);