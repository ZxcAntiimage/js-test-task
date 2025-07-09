import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import i18next from "i18next";

// --- Инициализация i18next ---
i18next.init({
  lng: localStorage.getItem("tg-ext-ui-lang") || "ru",
  resources: {
    ru: {
      translation: {
        summary: "Резюме",
        history: "История",
        settings: "Настройки",
        replies: "Варианты ответов",
        translate: "Перевести",
        language: "Язык",
        interfaceLanguage: "Язык интерфейса",
        save: "Сохранить",
        selectLang: "Выберите язык",
        ru: "Русский",
        en: "Английский",
        de: "Немецкий",
        el: "Греческий",
        emptyHistory: "История пуста.",
        delete: "Удалить",
        show: "Показать расширение",
        hide: "Скрыть окно",
        noSummary: "Нет данных для резюме. Откройте чат Telegram.",
        noReplies: "Нет вариантов ответа.",
        apiKey: "OpenAI API-ключ",
        enterApiKey: "Введите OpenAI API-ключ",
        saveKey: "Сохранить ключ",
        usage: "Использование",
        clearHistory: "Очистить историю",
        copy: "Копировать",
        generateSummary: "Сгенерировать резюме",
        generateReplies: "Сгенерировать ответы",
        summaryHelp: "Откройте чат Telegram и нажмите 'Сгенерировать резюме'",
        clearHistoryConfirm: "Вы уверены, что хотите очистить историю?",
        aiTest: "AI тест",
        runAiTest: "Проверить AI"
      },
    },
    en: {
      translation: {
        summary: "Resume",
        history: "History",
        settings: "Settings",
        replies: "Resume Styles",
        translate: "Translate",
        language: "Language",
        interfaceLanguage: "Interface language",
        save: "Save",
        selectLang: "Select language",
        ru: "Russian",
        en: "English",
        de: "German",
        el: "Greek",
        emptyHistory: "History is empty.",
        delete: "Delete",
        show: "Show extension",
        hide: "Hide window",
        noSummary: "No resume data. Open a Telegram chat.",
        noReplies: "No resume styles.",
        apiKey: "OpenAI API key",
        enterApiKey: "Enter OpenAI API key",
        saveKey: "Save key",
        usage: "Usage",
        clearHistory: "Clear history",
        copy: "Copy",
        generateSummary: "Generate resume",
        generateReplies: "Generate styles",
        summaryHelp: "Open a Telegram chat and click 'Generate resume'",
        clearHistoryConfirm: "Are you sure you want to clear history?",
        aiTest: "AI Test",
        runAiTest: "Run AI Test"
      },
    },
    de: {
      translation: {
        summary: "Lebenslauf",
        history: "Verlauf",
        settings: "Einstellungen",
        replies: "Lebenslauf-Stile",
        translate: "Übersetzen",
        language: "Sprache",
        interfaceLanguage: "Oberflächensprache",
        save: "Speichern",
        selectLang: "Sprache wählen",
        ru: "Russisch",
        en: "Englisch",
        de: "Deutsch",
        el: "Griechisch",
        emptyHistory: "Verlauf ist leer.",
        delete: "Löschen",
        show: "Erweiterung anzeigen",
        hide: "Fenster ausblenden",
        noSummary: "Keine Lebenslaufdaten. Öffnen Sie einen Telegram-Chat.",
        noReplies: "Keine Lebenslauf-Stile.",
        apiKey: "OpenAI API-Schlüssel",
        enterApiKey: "OpenAI API-Schlüssel eingeben",
        saveKey: "Schlüssel speichern",
        usage: "Nutzung",
        clearHistory: "Verlauf löschen",
        copy: "Kopieren",
        generateSummary: "Lebenslauf generieren",
        generateReplies: "Stile generieren",
        summaryHelp: "Öffnen Sie einen Telegram-Chat und klicken Sie auf 'Lebenslauf generieren'",
        clearHistoryConfirm: "Sind Sie sicher, dass Sie den Verlauf löschen möchten?",
        aiTest: "KI-Test",
        runAiTest: "KI testen"
      },
    },
    el: {
      translation: {
        summary: "Βιογραφικό",
        history: "Ιστορικό",
        settings: "Ρυθμίσεις",
        replies: "Στυλ βιογραφικού",
        translate: "Μετάφραση",
        language: "Γλώσσα",
        interfaceLanguage: "Γλώσσα διεπαφής",
        save: "Αποθήκευση",
        selectLang: "Επιλέξτε γλώσσα",
        ru: "Ρωσικά",
        en: "Αγγλικά",
        de: "Γερμανικά",
        el: "Ελληνικά",
        emptyHistory: "Το ιστορικό είναι κενό.",
        delete: "Διαγραφή",
        show: "Εμφάνιση επέκτασης",
        hide: "Απόκρυψη παραθύρου",
        noSummary: "Δεν υπάρχουν δεδομένα βιογραφικού. Ανοίξτε μια συνομιλία Telegram.",
        noReplies: "Δεν υπάρχουν στυλ βιογραφικού.",
        apiKey: "Κλειδί OpenAI API",
        enterApiKey: "Εισαγάγετε το κλειδί OpenAI API",
        saveKey: "Αποθήκευση κλειδιού",
        usage: "Χρήση",
        clearHistory: "Εκκαθάριση ιστορικού",
        copy: "Αντιγραφή",
        generateSummary: "Δημιουργία βιογραφικού",
        generateReplies: "Δημιουργία στυλ",
        summaryHelp: "Ανοίξτε μια συνομιλία Telegram και κάντε κλικ στο 'Δημιουργία βιογραφικού'",
        clearHistoryConfirm: "Είστε βέβαιοι ότι θέλετε να διαγράψετε το ιστορικό;",
        aiTest: "Δοκιμή AI",
        runAiTest: "Εκτέλεση δοκιμής AI"
      },
    },
  },
});

// --- Стили и анимации ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const fadeInOut = keyframes`
  0% { opacity: 0; transform: scale(0.98); }
  100% { opacity: 1; transform: scale(1); }
`;
const AnimatedContainer = styled.div`
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #6366f1;
  position: fixed;
  min-height: 80px;
  user-select: none;
  box-sizing: border-box;
  transition: box-shadow 0.2s;
  ${(props) =>
    props.isDragging &&
    css`
      box-shadow: 0 0 0 2px #6366f1;
      cursor: move;
    `}
  top: ${(props) => props.top || 20}px;
  right: ${(props) => props.right || 20}px;
  z-index: 10000;
  animation: ${fadeInOut} 0.35s cubic-bezier(0.4,0,0.2,1);
`;
const ShowButton = styled.button`
  position: fixed;
  top: ${(props) => props.top || 20}px;
  right: ${(props) => props.right || 20}px;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  &:hover { background: #8b5cf6; }
`;
const HideButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #6366f1;
  font-size: 18px;
  cursor: pointer;
  z-index: 2;
  transition: color 0.2s;
  &:hover { color: #8b5cf6; }
`;
const Loader = styled.div`
  border: 4px solid #e5e7eb;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: ${fadeIn} 1s linear infinite;
  margin: 24px auto;
`;
const SummaryTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #111827;
  font-size: 16px;
  font-weight: 600;
`;
const Text = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
`;
const ErrorText = styled(Text)`
  color: #ef4444;
`;
const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;
const Tab = styled.button`
  background: ${props => props.active ? '#6366f1' : '#f3f4f6'};
  color: ${props => props.active ? '#fff' : '#6366f1'};
  border: none;
  border-radius: 8px 8px 0 0;
  padding: 7px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
`;
const HistoryList = styled.div`
  max-height: 320px;
  overflow-y: auto;
`;
const HistoryItem = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 12px 14px 10px 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const HistoryTitle = styled.div`
  font-weight: 600;
  color: #6366f1;
  font-size: 15px;
`;
const HistoryDate = styled.div`
  color: #9ca3af;
  font-size: 12px;
`;
const HistoryPreview = styled.div`
  color: #6b7280;
  font-size: 13px;
  margin: 2px 0 0 0;
`;
const HistoryDelete = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  color: #ef4444;
  font-size: 14px;
  cursor: pointer;
  margin-top: 2px;
`;
const RepliesBlock = styled.div`
  margin-top: 18px;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 12px 14px;
`;
const RepliesTitle = styled.div`
  font-weight: 600;
  color: #6366f1;
  font-size: 15px;
  margin-bottom: 8px;
`;
const ReplyItem = styled.div`
  background: #fff;
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 7px;
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const CopyBtn = styled.button`
  background: none;
  border: none;
  color: #6366f1;
  font-size: 15px;
  cursor: pointer;
  margin-left: 8px;
  &:hover { color: #8b5cf6; }
`;
const TranslateBtn = styled.button`
  background: #e0e7ff;
  color: #6366f1;
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 8px;
  margin-bottom: 6px;
  transition: background 0.2s;
  &:hover { background: #c7d2fe; }
`;
const LangSelect = styled.select`
  margin-left: 8px;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 13px;
`;
const SettingsBlock = styled.div`
  padding: 12px 0 0 0;
`;
const SettingsLabel = styled.label`
  font-size: 15px;
  color: #6366f1;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
`;
const SettingsButton = styled.button`
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.2s;
  &:hover { background: #8b5cf6; }
`;

const OPENROUTER_FREE_MODELS = [
  { value: 'openchat/openchat-3.5-0106', label: 'OpenChat 3.5 (free)' },
  { value: 'huggingfaceh4/zephyr-7b-beta', label: 'Zephyr 7B (free)' },
  { value: 'mistralai/mistral-7b-instruct', label: 'Mistral 7B (free)' },
];

// --- Вспомогательные функции ---
function getTelegramMessages(limit = 40) {
  // Всегда возвращаем фиктивные сообщения, чтобы резюме генерировалось по кнопке
  return [
    "Это тестовое сообщение для генерации резюме."
  ];
}
// --- Мок-функция генерации "реального" AI-резюме ---
function fetchSummaryOpenAI(messages, apiKey, model) {
  // Много разных вариантов для каждой секции
  const professions = [
    "Строитель", "Дизайнер", "Аналитик", "Менеджер", "Разработчик", "Тестировщик", "Инженер", "Маркетолог", "Программист", "Учитель", "Врач", "Повар", "Бариста", "Продавец", "Логист", "Юрист", "Экономист", "Архитектор", "Копирайтер", "Редактор", "Бухгалтер", "Администратор", "Оператор", "Менеджер по продажам", "Продуктолог", "Проджект-менеджер"
  ];
  const skillsArr = [
    "Лидерство, коммуникация, ответственность",
    "Работа с инструментами, командная работа",
    "Креативность, аналитика, стрессоустойчивость",
    "Тайм-менеджмент, критическое мышление",
    "Ведение переговоров, наставничество",
    "Аналитика, автоматизация процессов",
    "Кросс-функциональное взаимодействие",
    "Управление проектами, Agile",
    "Мультиязычность, презентации",
    "Креативное мышление, дизайн",
    "Продажи, коммуникация",
    "Финансовый анализ, отчётность",
    "Внимательность, аккуратность",
    "Работа с современными технологиями",
    "UX/UI, Figma, Photoshop"
  ];
  const achievementsArr = [
    "Реализация крупных проектов, повышение эффективности",
    "Признание коллег, награды",
    "Внедрение инноваций",
    "Эффективное решение сложных задач",
    "Обучение новых сотрудников",
    "Оптимизация бизнес-процессов",
    "Успешные кейсы внедрения",
    "Руководство командами",
    "Участие в зарубежных проектах",
    "Разработка уникальных решений",
    "Рост продаж на 50%",
    "Снижение издержек",
    "Победа в хакатоне",
    "Публикации в профильных изданиях",
    "Победитель конкурса профессионального мастерства"
  ];
  const experienceArr = [
    "5+ лет в отрасли",
    "7+ лет работы по специальности",
    "10+ лет профессионального опыта",
    "3 года в международных компаниях",
    "6 лет в стартапах и крупных корпорациях",
    "8 лет в управлении проектами",
    "4 года в сфере IT",
    "9 лет в образовательных учреждениях",
    "2 года в сфере продаж",
    "6 лет в строительстве и ремонте",
    "5 лет в дизайне и креативе",
    "7 лет в аналитике данных",
    "4 года в автоматизации тестирования",
    "3 года в маркетинге и рекламе"
  ];
  const educationArr = [
    "Высшее профильное образование",
    "Магистр технических наук",
    "Бакалавр экономики",
    "Диплом специалиста по управлению",
    "Курсы повышения квалификации",
    "Сертификат международного образца",
    "ВШЭ, Бизнес-информатика",
    "МГУ, Прикладная математика",
    "СПбГУ, Информационные технологии",
    "МГТУ им. Баумана, Программная инженерия"
  ];
  const templates = [
    // Классика
    (prof, skills, exp, ach, edu) => `<div style='font-size:22px;font-weight:700;color:#6366f1;'>${prof}</div><div style='color:#6b7280;'>Опыт: ${exp}</div><div style='margin:10px 0;'><b>Навыки:</b> ${skills}</div><div><b>Достижения:</b> ${ach}</div><div><b>Образование:</b> ${edu}</div>`,
    // Список
    (prof, skills, exp, ach, edu) => `<div style='font-size:20px;font-weight:700;color:#374151;'>${prof}</div><ul style='margin:8px 0 0 18px;'><li><b>Навыки:</b> ${skills}</li><li><b>Опыт:</b> ${exp}</li><li><b>Достижения:</b> ${ach}</li><li><b>Образование:</b> ${edu}</li></ul>`,
    // Минимализм
    (prof, skills, exp, ach, edu) => `<div style='font-size:21px;font-weight:700;color:#6366f1;'>${prof}</div><div style='color:#6b7280;'>Навыки: ${skills}</div><div style='margin:10px 0;'><b>Опыт:</b> ${exp}</div><div><b>Достижения:</b> ${ach}</div><div><b>Образование:</b> ${edu}</div>`,
    // Градиент
    (prof, skills, exp, ach, edu) => `<div style='background:linear-gradient(90deg,#6366f1 0,#a5b4fc 100%);color:#fff;border-radius:14px;padding:18px 20px;'><div style='font-size:19px;font-weight:700;'>${prof}</div><div style='margin:8px 0 0 0;'><b>Навыки:</b> ${skills}</div><div><b>Опыт:</b> ${exp}</div><div><b>Достижения:</b> ${ach}</div><div><b>Образование:</b> ${edu}</div></div>`,
    // Карточка с тегами
    (prof, skills, exp, ach, edu) => `<div style='background:#fff;border-radius:14px;box-shadow:0 2px 12px rgba(99,102,241,0.10);padding:18px 20px;'><div style='font-size:18px;font-weight:700;color:#6366f1;'>${prof}</div><div style='margin:8px 0 0 0;'><span style='background:#a5b4fc;color:#fff;border-radius:8px;padding:2px 10px;font-size:13px;margin-right:6px;'>Навыки</span> ${skills}</div><div><span style='background:#6366f1;color:#fff;border-radius:8px;padding:2px 10px;font-size:13px;margin-right:6px;'>Опыт</span> ${exp}</div><div><span style='background:#818cf8;color:#fff;border-radius:8px;padding:2px 10px;font-size:13px;margin-right:6px;'>Достижения</span> ${ach}</div><div><span style='background:#6366f1;color:#fff;border-radius:8px;padding:2px 10px;font-size:13px;margin-right:6px;'>Образование</span> ${edu}</div></div>`
  ];
  // Рандомно выбираем для каждой секции
  const prof = professions[Math.floor(Math.random() * professions.length)];
  const skills = skillsArr[Math.floor(Math.random() * skillsArr.length)];
  const exp = experienceArr[Math.floor(Math.random() * experienceArr.length)];
  const ach = achievementsArr[Math.floor(Math.random() * achievementsArr.length)];
  const edu = educationArr[Math.floor(Math.random() * educationArr.length)];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return new Promise((resolve) => {
    setTimeout(() => resolve(template(prof, skills, exp, ach, edu)), 500);
  });
}

// --- Мок-функция генерации 3 вариантов AI-резюме ---
function fetchRepliesOpenAI(messages, apiKey, model) {
  // Много разных вариантов для каждой секции
  const professions = [
    "Строитель", "Дизайнер", "Аналитик", "Менеджер", "Разработчик", "Тестировщик", "Инженер", "Маркетолог", "Программист", "Учитель", "Врач", "Повар", "Бариста", "Продавец", "Логист", "Юрист", "Экономист", "Архитектор", "Копирайтер", "Редактор", "Бухгалтер", "Администратор", "Оператор", "Менеджер по продажам", "Продуктолог", "Проджект-менеджер"
  ];
  const skillsArr = [
    "Лидерство, коммуникация, ответственность",
    "Работа с инструментами, командная работа",
    "Креативность, аналитика, стрессоустойчивость",
    "Тайм-менеджмент, критическое мышление",
    "Ведение переговоров, наставничество",
    "Аналитика, автоматизация процессов",
    "Кросс-функциональное взаимодействие",
    "Управление проектами, Agile",
    "Мультиязычность, презентации",
    "Креативное мышление, дизайн",
    "Продажи, коммуникация",
    "Финансовый анализ, отчётность",
    "Внимательность, аккуратность",
    "Работа с современными технологиями",
    "UX/UI, Figma, Photoshop"
  ];
  const achievementsArr = [
    "Реализация крупных проектов, повышение эффективности",
    "Признание коллег, награды",
    "Внедрение инноваций",
    "Эффективное решение сложных задач",
    "Обучение новых сотрудников",
    "Оптимизация бизнес-процессов",
    "Успешные кейсы внедрения",
    "Руководство командами",
    "Участие в зарубежных проектах",
    "Разработка уникальных решений",
    "Рост продаж на 50%",
    "Снижение издержек",
    "Победа в хакатоне",
    "Публикации в профильных изданиях",
    "Победитель конкурса профессионального мастерства"
  ];
  const experienceArr = [
    "5+ лет в отрасли",
    "7+ лет работы по специальности",
    "10+ лет профессионального опыта",
    "3 года в международных компаниях",
    "6 лет в стартапах и крупных корпорациях",
    "8 лет в управлении проектами",
    "4 года в сфере IT",
    "9 лет в образовательных учреждениях",
    "2 года в сфере продаж",
    "6 лет в строительстве и ремонте",
    "5 лет в дизайне и креативе",
    "7 лет в аналитике данных",
    "4 года в автоматизации тестирования",
    "3 года в маркетинге и рекламе"
  ];
  const educationArr = [
    "Высшее профильное образование",
    "Магистр технических наук",
    "Бакалавр экономики",
    "Диплом специалиста по управлению",
    "Курсы повышения квалификации",
    "Сертификат международного образца",
    "ВШЭ, Бизнес-информатика",
    "МГУ, Прикладная математика",
    "СПбГУ, Информационные технологии",
    "МГТУ им. Баумана, Программная инженерия"
  ];
  const templates = [
    // Градиентная карточка с иконкой
    (prof, skills, exp, ach, edu) => `<div style='background:linear-gradient(90deg,#6366f1 0,#a5b4fc 100%);color:#fff;border-radius:14px;padding:18px 20px;box-shadow:0 4px 24px rgba(99,102,241,0.13);animation:fadeInCard 0.7s;'><div style='font-size:19px;font-weight:700;display:flex;align-items:center;gap:8px;'><span>👷‍♂️</span>${prof}</div><div style='margin:8px 0 0 0;'><b>Навыки:</b> ${skills}</div><div><b>Опыт:</b> ${exp}</div><div><b>Достижения:</b> ${ach}</div><div><b>Образование:</b> ${edu}</div></div>`,
    // Табличное резюме
    (prof, skills, exp, ach, edu) => `<div style='background:#fff;border-radius:14px;box-shadow:0 2px 12px rgba(99,102,241,0.10);padding:18px 20px;animation:fadeInCard 0.7s;'><div style='font-size:18px;font-weight:700;color:#6366f1;display:flex;align-items:center;gap:8px;'><span>📋</span>Табличное резюме: ${prof}</div><table style='width:100%;font-size:15px;margin-top:10px;'><tr><td><b>Навыки</b></td><td>${skills}</td></tr><tr><td><b>Опыт</b></td><td>${exp}</td></tr><tr><td><b>Достижения</b></td><td>${ach}</td></tr><tr><td><b>Образование</b></td><td>${edu}</td></tr></table></div>`,
    // Минималистичная карточка с разделителями
    (prof, skills, exp, ach, edu) => `<div style='background:#f3f4f6;border-radius:14px;padding:16px 18px;animation:fadeInCard 0.7s;'><div style='font-size:17px;font-weight:600;color:#374151;display:flex;align-items:center;gap:8px;'><span>📄</span>${prof}</div><hr style='border:none;border-top:1.5px solid #e5e7eb;margin:8px 0;'/><div><b>Навыки:</b> ${skills}</div><div><b>Опыт:</b> ${exp}</div><div><b>Достижения:</b> ${ach}</div><div><b>Образование:</b> ${edu}</div></div>`
  ];
  // Для каждого варианта — рандомные секции и шаблон
  const variants = Array.from({length: 3}).map((_, idx) => {
    const prof = professions[Math.floor(Math.random() * professions.length)];
    const skills = skillsArr[Math.floor(Math.random() * skillsArr.length)];
    const exp = experienceArr[Math.floor(Math.random() * experienceArr.length)];
    const ach = achievementsArr[Math.floor(Math.random() * achievementsArr.length)];
    const edu = educationArr[Math.floor(Math.random() * educationArr.length)];
    const template = templates[idx]; // гарантируем разные стили
    return template(prof, skills, exp, ach, edu);
  });
  return new Promise((resolve) => {
    setTimeout(() => resolve(variants), 500);
  });
}
function fetchTranslation(text, toLang, apiKey, model) {
  const prompt = `Переведи на ${toLang === 'en' ? 'английский' : 'русский'} язык:\n\n${text}`;
  return new Promise((resolve, reject) => {
    if (!window.chrome?.runtime?.sendMessage) {
      reject(new Error("chrome.runtime.sendMessage недоступен"));
      return;
    }
    window.chrome.runtime.sendMessage(
      {
        action: "openai_summary",
        apiKey,
        body: {
          model,
          messages: [
            { role: "system", content: "Ты — переводчик, переводишь текст на указанный язык." },
            { role: "user", content: prompt }
          ],
          max_tokens: 256,
          temperature: 0.2,
        }
      },
      (response) => {
        if (response?.success) {
          let text = response.data.choices?.[0]?.message?.content?.trim() || '';
          resolve(text);
        } else {
          reject(new Error(response?.error || "Ошибка перевода"));
        }
      }
    );
  });
}
function saveSummaryToHistory({ chatTitle, summary }) {
  const history = JSON.parse(localStorage.getItem('tg-ext-history') || '[]');
  const date = new Date().toISOString();
  history.unshift({ id: date + Math.random(), chatTitle, summary, date });
  localStorage.setItem('tg-ext-history', JSON.stringify(history.slice(0, 50)));
}
function loadSummaryHistory() {
  return JSON.parse(localStorage.getItem('tg-ext-history') || '[]');
}
function deleteSummaryFromHistory(id) {
  const history = JSON.parse(localStorage.getItem('tg-ext-history') || '[]');
  localStorage.setItem('tg-ext-history', JSON.stringify(history.filter(x => x.id !== id)));
}
function getSavedPosition() {
  try {
    const pos = JSON.parse(localStorage.getItem("tg-ext-pos"));
    if (pos && typeof pos.top === "number" && typeof pos.right === "number") return pos;
  } catch {}
  return { top: 20, right: 20 };
}
function savePosition(pos) {
  localStorage.setItem("tg-ext-pos", JSON.stringify(pos));
}
function getSavedVisibility() {
  try {
    return localStorage.getItem("tg-ext-visible") !== "false";
  } catch {}
  return true;
}
function saveVisibility(visible) {
  localStorage.setItem("tg-ext-visible", visible ? "true" : "false");
}
function detectLang(text) {
  if (!text) return 'ru';
  const cyrillic = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
  const latin = (text.match(/[a-zA-Z]/g) || []).length;
  if (latin > cyrillic * 1.5) return 'en';
  return 'ru';
}

// --- Анимации ---
const fadeInSummary = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const SmartSummaryBlock = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
  padding: 22px 24px 18px 24px;
  margin-top: 18px;
  animation: ${fadeInSummary} 0.5s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
`;
const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 10px;
  gap: 8px;
`;
const MainIdea = styled.div`
  font-size: 15px;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const KeyPoints = styled.ul`
  margin: 0 0 12px 0;
  padding-left: 22px;
  color: #4b5563;
  font-size: 14px;
  list-style: disc inside;
`;
const Recommendation = styled.div`
  background: #f3f4f6;
  border-radius: 8px;
  padding: 10px 14px;
  color: #2563eb;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 7px;
`;

// --- Анимации для карточек ---
const fadeInCard = keyframes`
  from { opacity: 0; transform: scale(0.97) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;
const gradientBorder = css`
  background: #fff;
  border-radius: 16px;
  position: relative;
  z-index: 1;
  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0;
    border-radius: 16px;
    padding: 2px;
    background: linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`;
const CardBlock = styled.div`
  ${gradientBorder}
  box-shadow: 0 4px 24px rgba(99,102,241,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
  padding: 24px 22px 18px 22px;
  margin: 0 auto;
  margin-bottom: 18px;
  max-width: 480px;
  animation: ${fadeInCard} 0.6s cubic-bezier(0.4,0,0.2,1);
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 8px 32px rgba(99,102,241,0.18); }
`;
const CardHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 10px;
  gap: 10px;
`;
const CardSection = styled.div`
  margin-bottom: 8px;
  font-size: 15px;
  color: #23272f;
`;
const CardList = styled.ul`
  margin: 0 0 10px 0;
  padding-left: 20px;
  color: #4b5563;
  font-size: 14px;
  list-style: disc inside;
`;
const CardTag = styled.span`
  display: inline-block;
  background: linear-gradient(90deg,#6366f1 0,#a5b4fc 100%);
  color: #fff;
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 13px;
  margin-right: 6px;
  margin-bottom: 4px;
`;
const CardIcon = styled.span`
  font-size: 22px;
  margin-right: 6px;
`;

// --- Мок-функция генерации "полноценного" резюме ---
function mockSummaryFromText(text) {
  // Примитивный "анализ" текста для мока
  const names = [
    "Иван Иванов", "Мария Смирнова", "Алексей Петров", "Екатерина Кузнецова", "Дмитрий Соколов"
  ];
  const positions = [
    "Frontend-разработчик", "Менеджер проектов", "Дизайнер UI/UX", "Аналитик данных", "Тестировщик ПО"
  ];
  const skills = [
    "JavaScript, React, CSS", "Управление проектами, Agile, Scrum", "Figma, Photoshop, Illustrator", "SQL, Python, Power BI", "Автоматизация тестирования, Selenium"
  ];
  const educations = [
    "МГУ, Прикладная математика", "СПбГУ, Информационные технологии", "МГТУ им. Баумана, Программная инженерия", "ВШЭ, Бизнес-информатика"
  ];
  const achievements = [
    "Успешно реализовал 10+ крупных проектов", "Повысила эффективность команды на 30%", "Разработал дизайн для 5 мобильных приложений", "Оптимизировал процессы тестирования на 40%"
  ];
  const contacts = [
    "email@example.com | +7 999 123-45-67", "user@mail.ru | +7 921 555-66-77", "test@gmail.com | +7 495 111-22-33"
  ];
  const recommendations = [
    "Рекомендую как ответственного и инициативного сотрудника.",
    "Показал(а) себя как отличный командный игрок.",
    "Обладает высоким уровнем профессионализма."
  ];
  const templates = [
    // Шаблон 1
    ({fio, contact, position, goal, exp, skill, edu, ach, rec}) => `
      <div class="cv-block">
        <div class="cv-header">
          <div class="cv-fio">${fio}</div>
          <div class="cv-contact">${contact}</div>
        </div>
        <div class="cv-section"><b>Цель:</b> ${goal}</div>
        <div class="cv-section"><b>Опыт работы:</b> ${exp}</div>
        <div class="cv-section"><b>Навыки:</b> ${skill}</div>
        <div class="cv-section"><b>Образование:</b> ${edu}</div>
        <div class="cv-section"><b>Достижения:</b> ${ach}</div>
        <div class="cv-section"><b>Рекомендации:</b> ${rec}</div>
      </div>
    `,
    // Шаблон 2
    ({fio, contact, position, goal, exp, skill, edu, ach, rec}) => `
      <div class="cv-block">
        <div class="cv-fio" style="font-size:20px;font-weight:700;color:#6366f1;">${fio}</div>
        <div class="cv-contact" style="color:#6b7280;">${contact}</div>
        <div class="cv-row">
          <div class="cv-col">
            <div class="cv-section"><b>Должность:</b> ${position}</div>
            <div class="cv-section"><b>Навыки:</b> ${skill}</div>
            <div class="cv-section"><b>Образование:</b> ${edu}</div>
          </div>
          <div class="cv-col">
            <div class="cv-section"><b>Опыт:</b> ${exp}</div>
            <div class="cv-section"><b>Достижения:</b> ${ach}</div>
            <div class="cv-section"><b>Рекомендации:</b> ${rec}</div>
          </div>
        </div>
        <div class="cv-section"><b>Цель:</b> ${goal}</div>
      </div>
    `,
    // Шаблон 3 (минималистичный)
    ({fio, contact, position, goal, exp, skill, edu, ach, rec}) => `
      <div class="cv-block cv-minimal">
        <div class="cv-fio">${fio}</div>
        <div class="cv-contact">${contact}</div>
        <div class="cv-section">${position} | ${edu}</div>
        <div class="cv-section"><b>Навыки:</b> ${skill}</div>
        <div class="cv-section"><b>Опыт:</b> ${exp}</div>
        <div class="cv-section"><b>Достижения:</b> ${ach}</div>
      </div>
    `
  ];
  // "Анализируем" текст пользователя для генерации цели и опыта
  const goal = text.trim() ? `Получить позицию, связанную с: ${text.slice(0, 40)}${text.length > 40 ? '...' : ''}` : "Развитие в профессиональной сфере";
  const exp = text.trim() ? `Опыт в: ${text.slice(0, 50)}${text.length > 50 ? '...' : ''}` : "Опыт работы в различных проектах";
  // Случайные данные
  const fio = names[Math.floor(Math.random() * names.length)];
  const contact = contacts[Math.floor(Math.random() * contacts.length)];
  const position = positions[Math.floor(Math.random() * positions.length)];
  const skill = skills[Math.floor(Math.random() * skills.length)];
  const edu = educations[Math.floor(Math.random() * educations.length)];
  const ach = achievements[Math.floor(Math.random() * achievements.length)];
  const rec = recommendations[Math.floor(Math.random() * recommendations.length)];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(template({fio, contact, position, goal, exp, skill, edu, ach, rec}));
    }, 700);
  });
}

 // --- Мок-функция перевода резюме ---
function mockTranslateResume(html, lang) {
  // Моки перевода для разных языков
  if (lang === 'en') {
    return html.replace(/Навыки/g, 'Skills')
      .replace(/Опыт/g, 'Experience')
      .replace(/Достижения/g, 'Achievements')
      .replace(/Образование/g, 'Education')
      .replace(/Табличное резюме/g, 'Table Resume')
      .replace(/Резюме/g, 'Resume')
      .replace(/Профессионал/g, 'Professional')
      .replace(/лет/g, 'years');
  }
  if (lang === 'de') {
    return html.replace(/Навыки/g, 'Fähigkeiten')
      .replace(/Опыт/g, 'Erfahrung')
      .replace(/Достижения/g, 'Erfolge')
      .replace(/Образование/g, 'Ausbildung')
      .replace(/Табличное резюме/g, 'Tabellarischer Lebenslauf')
      .replace(/Резюме/g, 'Lebenslauf')
      .replace(/Профессионал/g, 'Fachkraft')
      .replace(/лет/g, 'Jahre');
  }
  if (lang === 'el') {
    return html.replace(/Навыки/g, 'Δεξιότητες')
      .replace(/Опыт/g, 'Εμπειρία')
      .replace(/Достижения/g, 'Επιτεύγματα')
      .replace(/Образование/g, 'Εκπαίδευση')
      .replace(/Табличное резюме/g, 'Βιογραφικό σε πίνακα')
      .replace(/Резюме/g, 'Βιογραφικό')
      .replace(/Профессионал/g, 'Επαγγελματίας')
      .replace(/лет/g, 'χρόνια');
  }
  return html;
}

// --- Стили для резюме ---
const CVBlock = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
  padding: 28px 30px 22px 30px;
  margin-top: 18px;
  animation: ${fadeInSummary} 0.5s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', 'Arial', sans-serif;
  font-size: 15px;
  color: #23272f;
  border-left: 5px solid #6366f1;
`;
const CVHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 12px;
`;
const CVFio = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #6366f1;
`;
const CVContact = styled.div`
  font-size: 14px;
  color: #6b7280;
`;
const CVSection = styled.div`
  margin-bottom: 8px;
  & b { color: #6366f1; }
`;
const CVRow = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 8px;
`;
const CVCol = styled.div`
  flex: 1;
`;

// --- Основной компонент ---
export const Summary = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("tg-ext-openai-key") || "");
  const [openRouterKey, setOpenRouterKey] = useState(() => localStorage.getItem("tg-ext-openrouter-key") || "");
  const [visible, setVisible] = useState(getSavedVisibility());
  const [position, setPosition] = useState(getSavedPosition());
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ top: 0, right: 0 });
  const [tab, setTab] = useState('summary');
  const [uiLang, setUiLang] = useState(i18next.language);
  const [history, setHistory] = useState(loadSummaryHistory());
  const [suggestedReplies, setSuggestedReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [repliesError, setRepliesError] = useState("");
  const [lang, setLang] = useState('ru');
  const [translating, setTranslating] = useState(false);
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [settingsApiKey, setSettingsApiKey] = useState(() => localStorage.getItem("tg-ext-openai-key") || "");
  const [settingsOpenRouterKey, setSettingsOpenRouterKey] = useState(() => localStorage.getItem("tg-ext-openrouter-key") || "");
  const [model, setModel] = useState(() => localStorage.getItem('tg-ext-model') || 'openchat/openchat-3.5-0106');
  const [inputText, setInputText] = useState("");
  const [cvHtml, setCvHtml] = useState("");
  const [styleVariants, setStyleVariants] = useState([]);
  const [translateLang, setTranslateLang] = useState(i18next.language);
  const [translatedHtml, setTranslatedHtml] = useState("");

  // --- Получение ключей ---
  useEffect(() => {
    const syncKey = () => {
      const key = localStorage.getItem("tg-ext-openai-key") || "";
      setApiKey(key);
      setSettingsApiKey(key);
      const orKey = localStorage.getItem("tg-ext-openrouter-key") || "";
      setOpenRouterKey(orKey);
      setSettingsOpenRouterKey(orKey);
    };
    window.addEventListener('storage', syncKey);
    return () => window.removeEventListener('storage', syncKey);
  }, []);

  // --- Drag-n-drop ---
  const onMouseDown = (e) => {
    if (e.target.closest("button")) return;
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX,
      y: e.clientY,
    };
    dragStartPos.current = { ...position };
    document.body.style.userSelect = "none";
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    const dx = dragOffset.current.x - e.clientX;
    const dy = dragOffset.current.y - e.clientY;
    let newTop = dragStartPos.current.top - dy;
    let newRight = dragStartPos.current.right + dx;
    const minTop = 0;
    const maxTop = window.innerHeight - 120;
    const minRight = 0;
    const maxRight = window.innerWidth - 340;
    newTop = Math.max(minTop, Math.min(maxTop, newTop));
    newRight = Math.max(minRight, Math.min(maxRight, newRight));
    setPosition({ top: newTop, right: newRight });
  };
  const onMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = "";
  };
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);
  useEffect(() => { savePosition(position); }, [position]);
  useEffect(() => { saveVisibility(visible); }, [visible]);
  useEffect(() => {
    localStorage.setItem('tg-ext-model', model);
  }, [model]);

  // --- Смена языка интерфейса ---
  useEffect(() => {
    i18next.changeLanguage(uiLang);
    setTranslateLang(uiLang);
    localStorage.setItem('tg-ext-ui-lang', uiLang);
  }, [uiLang]);

  // --- Автоматическое обновление при смене чата (URL) ---
  useEffect(() => {
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setSummary("");
        setError("");
        setSuggestedReplies([]);
        generateSummary();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // --- Выбор ключа для запроса ---
  function getActiveKey() {
    // Если выбрана OpenRouter модель, используем OpenRouter ключ
    if (model && !model.startsWith('gpt-')) {
      return openRouterKey;
    }
    // Иначе OpenAI ключ
    return apiKey;
  }

  // --- Генерация резюме ---
  async function generateSummary() {
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const messages = getTelegramMessages();
      if (!messages.length) throw new Error(i18next.t('noSummary'));
      let usedModel = model;
      let usedApiKey = getActiveKey();
      if (usedApiKey.startsWith('sk-') || usedApiKey.startsWith('sk-proj-')) {
        usedModel = 'gpt-3.5-turbo';
      }
      const result = await fetchSummaryOpenAI(messages, usedApiKey, usedModel);
      setSummary(result || i18next.t('noSummary'));
      saveSummaryToHistory({ chatTitle: document.title, summary: result });
      setHistory(loadSummaryHistory());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // --- Генерация вариантов ответов ---
  async function generateSuggestedReplies() {
    setRepliesLoading(true);
    setRepliesError("");
    try {
      const messages = getTelegramMessages();
      if (!messages.length) throw new Error(i18next.t('noReplies'));
      let usedModel = model;
      let usedApiKey = getActiveKey();
      if (usedApiKey.startsWith('sk-') || usedApiKey.startsWith('sk-proj-')) {
        usedModel = 'gpt-3.5-turbo';
      }
      const replies = await fetchRepliesOpenAI(messages, usedApiKey, usedModel);
      setSuggestedReplies(replies);
    } catch (err) {
      setRepliesError(err.message);
    } finally {
      setRepliesLoading(false);
    }
  }

  // --- Перевод резюме с автоопределением языка ---
  async function translateSummary(toLang) {
    setTranslating(true);
    setTranslatedSummary("");
    try {
      let fromLang = detectLang(summary);
      let usedModel = model;
      let usedApiKey = getActiveKey();
      if (usedApiKey.startsWith('sk-') || usedApiKey.startsWith('sk-proj-')) {
        usedModel = 'gpt-3.5-turbo';
      }
      if (fromLang === toLang) {
        setTranslatedSummary(summary);
      } else {
        const translated = await fetchTranslation(summary, toLang, usedApiKey, usedModel);
        setTranslatedSummary(translated);
      }
    } catch (err) {
      setTranslatedSummary(summary);
    } finally {
      setTranslating(false);
    }
  }

  // --- Очистка истории ---
  const handleClearHistory = () => {
    if (confirm(i18next.t('clearHistoryConfirm'))) {
      localStorage.removeItem('tg-ext-history');
      setHistory([]);
      setSummary("");
      setError("");
    }
  };

  // --- Удаление записи из истории ---
  const handleDeleteSummary = (id) => {
    deleteSummaryFromHistory(id);
    setHistory(loadSummaryHistory());
  };

  // --- Генерация резюме и вариантов при монтировании ---
  const generateAll = () => {
    setLoading(true);
    setError("");
    Promise.all([
      fetchSummaryOpenAI([], "", ""),
      fetchRepliesOpenAI([], "", "")
    ]).then(([main, variants]) => {
      setCvHtml(main);
      setStyleVariants(variants);
    }).catch(() => setError("Ошибка генерации резюме"))
      .finally(() => setLoading(false));
  };

  // --- Перевод резюме ---
  const handleTranslate = () => {
    setTranslating(true);
    setTimeout(() => {
      if (translateLang === 'ru') {
        setTranslatedHtml(cvHtml);
      } else {
        setTranslatedHtml(mockTranslateResume(cvHtml, translateLang));
      }
      setTranslating(false);
    }, 400);
  };

  useEffect(() => {
    generateAll();
  }, []);

  // --- UI ---
  if (!visible) {
    return <ShowButton onClick={() => setVisible(true)} title={i18next.t('show')}>+</ShowButton>;
  }
  // Названия стилей для вариантов (разные шаблоны)
  const styleNames = [
    "Градиентная карточка",
    "Табличное резюме",
    "Минимализм"
  ];
  return (
    <AnimatedContainer isDragging={isDragging} onMouseDown={onMouseDown} top={position.top} right={position.right}>
      <HideButton onClick={() => setVisible(false)} title={i18next.t('hide')}>×</HideButton>
      <Tabs>
        <Tab active={tab === 'summary'} onClick={() => setTab('summary')}>{i18next.t('summary')}</Tab>
        <Tab active={tab === 'history'} onClick={() => setTab('history')}>{i18next.t('history')}</Tab>
        <Tab active={tab === 'settings'} onClick={() => setTab('settings')}>{i18next.t('settings')}</Tab>
      </Tabs>
      {/* Глобальный селектор языка */}
      <div style={{margin:'8px 0 0 0',display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:14}}>{i18next.t('interfaceLanguage')}:</span>
        <LangSelect value={uiLang} onChange={e => setUiLang(e.target.value)}>
          <option value="ru">{i18next.t('ru')}</option>
          <option value="en">{i18next.t('en')}</option>
          <option value="de">{i18next.t('de')}</option>
          <option value="el">{i18next.t('el')}</option>
        </LangSelect>
      </div>
      {tab === 'summary' && (
        <>
          <SummaryTitle>{i18next.t('summary')}</SummaryTitle>
          <SettingsButton onClick={generateAll} disabled={loading} style={{marginBottom: 16}}>
            {i18next.t('generateSummary')}
          </SettingsButton>
          {loading ? <Loader /> : error ? <ErrorText>{error}</ErrorText> : (
            <>
              {translatedHtml ? (
                <CVBlock dangerouslySetInnerHTML={{__html: translatedHtml}} />
              ) : (
                cvHtml && <CVBlock dangerouslySetInnerHTML={{__html: cvHtml}} />
              )}
            </>
          )}
          <div style={{marginTop: 12, display:'flex',alignItems:'center',gap:8}}>
            <LangSelect value={translateLang} onChange={e => setTranslateLang(e.target.value)}>
              <option value="ru">{i18next.t('ru')}</option>
              <option value="en">{i18next.t('en')}</option>
              <option value="de">{i18next.t('de')}</option>
              <option value="el">{i18next.t('el')}</option>
            </LangSelect>
            <TranslateBtn onClick={handleTranslate} disabled={translating || loading}>
              {i18next.t('translate')}
            </TranslateBtn>
            {translating && <Loader style={{width:22,height:22}} />}
          </div>
          <div style={{fontSize:12, color:'#9ca3af', marginTop:4}}>{i18next.t('summaryHelp')}</div>
          {/* Варианты стилей резюме только во вкладке Резюме */}
          <div style={{marginTop:24}}>
            <RepliesTitle>{i18next.t('replies')}</RepliesTitle>
            <div style={{display:'flex',flexDirection:'column',gap:18,marginTop:8}}>
              {styleVariants.map((variant, idx) => (
                <div key={idx} style={{maxWidth:520,margin:'0 auto',animation:'fadeInCard 0.7s',boxShadow:'0 2px 12px rgba(99,102,241,0.10)',borderRadius:14,overflow:'hidden',background:'#fff',padding:0,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                  <div style={{fontWeight:600,fontSize:16,padding:'12px 0 12px 18px'}}>{styleNames[idx] || `${i18next.t('style')} ${idx+1}`}</div>
                  <SettingsButton style={{margin:'0 18px 0 0',padding:'7px 18px',fontSize:14}} onClick={() => { setCvHtml(variant); setTranslatedHtml(""); }}>
                    {i18next.t('showThisStyle')}
                  </SettingsButton>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {tab === 'history' && (
        <>
          <SummaryTitle>{i18next.t('history')}</SummaryTitle>
          <HistoryList>
            {history.length === 0 && <Text>{i18next.t('emptyHistory')}</Text>}
            {history.map(item => (
              <HistoryItem key={item.id}>
                <HistoryTitle>{item.chatTitle}</HistoryTitle>
                <HistoryDate>{new Date(item.date).toLocaleDateString()}</HistoryDate>
                <HistoryPreview>{item.summary || i18next.t('noSummary')}</HistoryPreview>
                <HistoryDelete onClick={() => handleDeleteSummary(item.id)}>{i18next.t('delete')}</HistoryDelete>
              </HistoryItem>
            ))}
          </HistoryList>
          <SettingsButton onClick={handleClearHistory}>{i18next.t('clearHistory')}</SettingsButton>
        </>
      )}
      {tab === 'settings' && (
        <SettingsBlock>
          <SettingsLabel>{i18next.t('apiKey')}</SettingsLabel>
          <input
            type="text"
            value={settingsApiKey}
            onChange={e => setSettingsApiKey(e.target.value)}
            placeholder={i18next.t('enterApiKey')}
            style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e5e7eb',fontSize:'15px',marginBottom:'10px'}}
          />
          <SettingsButton onClick={() => {
            localStorage.setItem("tg-ext-openai-key", settingsApiKey);
            setApiKey(settingsApiKey);
            setSettingsApiKey(settingsApiKey);
            alert(i18next.t('save'));
          }}>{i18next.t('saveKey')}</SettingsButton>
          <SettingsLabel>{i18next.t('openRouterKey')}</SettingsLabel>
          <input
            type="text"
            value={settingsOpenRouterKey}
            onChange={e => setSettingsOpenRouterKey(e.target.value)}
            placeholder={i18next.t('enterOpenRouterKey')}
            style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e5e7eb',fontSize:'15px',marginBottom:'10px'}}
          />
          <SettingsButton onClick={() => {
            localStorage.setItem("tg-ext-openrouter-key", settingsOpenRouterKey);
            setOpenRouterKey(settingsOpenRouterKey);
            setSettingsOpenRouterKey(settingsOpenRouterKey);
            alert(i18next.t('openRouterKeySaved'));
          }}>{i18next.t('saveOpenRouterKey')}</SettingsButton>
          <SettingsLabel>{i18next.t('model')}:</SettingsLabel>
          <LangSelect value={model} onChange={e => setModel(e.target.value)}>
            {OPENROUTER_FREE_MODELS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </LangSelect>
          <SettingsLabel>{i18next.t('interfaceLanguage')}</SettingsLabel>
          <LangSelect value={uiLang} onChange={e => setUiLang(e.target.value)}>
            <option value="ru">{i18next.t('ru')}</option>
            <option value="en">{i18next.t('en')}</option>
            <option value="de">{i18next.t('de')}</option>
            <option value="el">{i18next.t('el')}</option>
          </LangSelect>
        </SettingsBlock>
      )}
    </AnimatedContainer>
  );
};
