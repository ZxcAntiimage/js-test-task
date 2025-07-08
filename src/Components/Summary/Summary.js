import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import i18next from 'i18next';

// --- Инициализация i18next ---
i18next.init({
  lng: localStorage.getItem('tg-ext-ui-lang') || 'ru',
  resources: {
    ru: {
      translation: {
        summary: 'Резюме',
        history: 'История',
        settings: 'Настройки',
        replies: 'Варианты ответов',
        translate: 'Перевести',
        language: 'Язык',
        interfaceLanguage: 'Язык интерфейса',
        save: 'Сохранить',
        selectLang: 'Выберите язык',
        ru: 'Русский',
        en: 'Английский',
        emptyHistory: 'История пуста.',
        delete: 'Удалить',
        show: 'Показать расширение',
        hide: 'Скрыть окно',
        noSummary: 'Нет данных для резюме. Откройте чат Telegram.',
        noReplies: 'Нет вариантов ответа.',
        apiKey: 'OpenAI API-ключ',
        enterApiKey: 'Введите OpenAI API-ключ',
        saveKey: 'Сохранить ключ',
        getKey: 'Получить ключ',
        usage: 'Использование',
      }
    },
    en: {
      translation: {
        summary: 'Summary',
        history: 'History',
        settings: 'Settings',
        replies: 'Suggested Replies',
        translate: 'Translate',
        language: 'Language',
        interfaceLanguage: 'Interface language',
        save: 'Save',
        selectLang: 'Select language',
        ru: 'Russian',
        en: 'English',
        emptyHistory: 'History is empty.',
        delete: 'Delete',
        show: 'Show extension',
        hide: 'Hide window',
        noSummary: 'No summary data. Open a Telegram chat.',
        noReplies: 'No suggested replies.',
        apiKey: 'OpenAI API key',
        enterApiKey: 'Enter OpenAI API key',
        saveKey: 'Save key',
        getKey: 'Get key',
        usage: 'Usage',
      }
    }
  }
});

// --- Автоопределение языка текста (простая эвристика) ---
function detectLang(text) {
  if (!text) return 'ru';
  // Если больше 30% латиницы — считаем английским
  const en = (text.match(/[a-zA-Z]/g) || []).length;
  const ru = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
  if (en > ru && en > 10) return 'en';
  return 'ru';
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 20000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.25s;
`;
const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 32px 28px 24px 28px;
  min-width: 320px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.3s;
`;
const ModalTitle = styled.h2`
  margin: 0 0 18px 0;
  font-size: 20px;
  color: #6366f1;
  font-weight: 700;
`;
const ModalInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 15px;
  margin-bottom: 12px;
`;
const ModalButton = styled.button`
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.2s;
  &:hover { background: #8b5cf6; }
`;
const ModalHelp = styled.div`
  color: #6366f1;
  font-size: 13px;
  margin-top: 8px;
  text-align: center;
`;

const Container = styled.div`
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #6366f1;
  position: relative;
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
`;

const AnimatedContainer = styled(Container)`
  transition: top 0.18s, right 0.18s, box-shadow 0.18s;
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

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Loader = styled.div`
  border: 4px solid #e5e7eb;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: ${spin} 1s linear infinite;
  margin: 24px auto;
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
  &:hover {
    color: #8b5cf6;
  }
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
  &:hover {
    background: #8b5cf6;
  }
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
const SettingsSelect = styled.select`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 15px;
  margin-bottom: 12px;
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

// --- Утилита для парсинга сообщений Telegram Web ---
function getTelegramMessages(limit = 40) {
  let messages = [];
  const nodes1 = document.querySelectorAll('[data-testid="message-text"]:not([data-testid="message-meta"])');
  if (nodes1.length) {
    messages = Array.from(nodes1).slice(-limit).map(el => el.textContent.trim()).filter(Boolean);
  }
  if (!messages.length) {
    const nodes2 = document.querySelectorAll('.im_message_text, .text-content');
    if (nodes2.length) {
      messages = Array.from(nodes2).slice(-limit).map(el => el.textContent.trim()).filter(Boolean);
    }
  }
  if (!messages.length) {
    const nodes3 = document.querySelectorAll('div[role="listitem"] div[dir="auto"]');
    if (nodes3.length) {
      messages = Array.from(nodes3).slice(-limit).map(el => el.textContent.trim()).filter(Boolean);
    }
  }
  // Логируем всегда для отладки
  console.log("[TG-EXT] Parsed messages:", messages);
  return messages;
}

// --- OpenAI API ---
function fetchSummary(messages, apiKey) {
  const prompt = `Сделай краткое резюме этого чата на русском языке:\n\n${messages.join("\n")}`;
  console.log("[TG-EXT] Prompt:", prompt);
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
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Ты — помощник, делаешь краткие резюме чатов." },
            { role: "user", content: prompt }
          ],
          max_tokens: 256,
          temperature: 0.4,
        }
      },
      (response) => {
        console.log("[TG-EXT] OpenAI response:", response);
        if (response?.success) {
          const content = response.data.choices?.[0]?.message?.content?.trim();
          if (!content) {
            // Проверяем на разные ошибки
            const errorCode = response.data?.error?.code;
            if (errorCode === 'unsupported_country_region_territory') {
              console.error('[TG-EXT] OpenAI: unsupported_country_region_territory', response.data);
              resolve('__UNSUPPORTED_REGION__');
            } else if (errorCode === 'insufficient_quota') {
              console.error('[TG-EXT] OpenAI: insufficient_quota', response.data);
              resolve('__INSUFFICIENT_QUOTA__');
            } else if (errorCode === 'billing_not_active' || errorCode === 'payment_method_required') {
              console.error('[TG-EXT] OpenAI: billing_not_active/payment_method_required', response.data);
              resolve('__BILLING_NOT_ACTIVE__');
            } else {
              console.warn("[TG-EXT] OpenAI ответ пустой!", response.data);
              resolve(null);
            }
          } else {
            resolve(content);
          }
        } else {
          reject(new Error(response?.error || "Ошибка запроса"));
        }
      }
    );
  });
}

function fetchSuggestedReplies(messages, apiKey) {
  const prompt = `На основе этого чата предложи 3 коротких варианта ответа (на русском языке):\n\n${messages.join("\n")}`;
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
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Ты — помощник, предлагаешь короткие варианты ответов на сообщения чата." },
            { role: "user", content: prompt }
          ],
          max_tokens: 120,
          temperature: 0.7,
        }
      },
      (response) => {
        if (response?.success) {
          // Ожидаем список через \n или нумерацию
          let text = response.data.choices?.[0]?.message?.content?.trim() || '';
          let replies = text.split(/\n|\r/).map(s => s.replace(/^\d+\.|^- /, '').trim()).filter(Boolean);
          // Если всё в одной строке через ;
          if (replies.length === 1 && replies[0].includes(';')) {
            replies = replies[0].split(';').map(s => s.trim()).filter(Boolean);
          }
          resolve(replies);
        } else {
          reject(new Error(response?.error || "Ошибка генерации вариантов ответа"));
        }
      }
    );
  });
}

function fetchTranslation(text, apiKey, toLang) {
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
          model: "gpt-3.5-turbo",
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

// --- Drag-n-drop и позиция ---
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

// --- Состояние видимости ---
function getSavedVisibility() {
  try {
    return localStorage.getItem("tg-ext-visible") !== "false";
  } catch {}
  return true;
}
function saveVisibility(visible) {
  localStorage.setItem("tg-ext-visible", visible ? "true" : "false");
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

export const Summary = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [visible, setVisible] = useState(getSavedVisibility());
  const [position, setPosition] = useState(getSavedPosition());
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ top: 0, right: 0 });
  const lastChatId = useRef("");
  const lock = useRef(false);
  const [tab, setTab] = useState('summary');
  const [uiLang, setUiLang] = useState(i18next.language);
  const [history, setHistory] = useState(loadSummaryHistory());
  const [suggestedReplies, setSuggestedReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [repliesError, setRepliesError] = useState("");
  const [lang, setLang] = useState('ru');
  const [translating, setTranslating] = useState(false);
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [translatedReplies, setTranslatedReplies] = useState([]);
  const [settingsApiKey, setSettingsApiKey] = useState("");

  // --- Получение API ключа ---
  useEffect(() => {
    const key = localStorage.getItem("tg-ext-openai-key") || "";
    setApiKey(key);
    setShowApiKeyModal(!key);
  }, []);

  // --- Подгружаем ключ в настройки при открытии вкладки ---
  useEffect(() => {
    if (tab === 'settings') {
      setSettingsApiKey(localStorage.getItem("tg-ext-openai-key") || "");
    }
  }, [tab]);

  // --- Сохранение позиции и видимости ---
  useEffect(() => {
    savePosition(position);
  }, [position]);
  useEffect(() => {
    saveVisibility(visible);
  }, [visible]);

  // --- Сохраняем активную вкладку и позицию между сессиями ---
  useEffect(() => {
    localStorage.setItem('tg-ext-tab', tab);
  }, [tab]);
  useEffect(() => {
    const savedTab = localStorage.getItem('tg-ext-tab');
    if (savedTab) setTab(savedTab);
  }, []);

  // --- Смена языка интерфейса ---
  useEffect(() => {
    i18next.changeLanguage(uiLang);
    localStorage.setItem('tg-ext-ui-lang', uiLang);
  }, [uiLang]);

  // --- Drag-n-drop с ограничением по границам экрана ---
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
    // Ограничения по экрану
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
    // eslint-disable-next-line
  }, [isDragging]);

  // --- Генерация резюме ---
  const generateSummary = async () => {
    setLoading(true);
    setError("");
    setSummary("");
    lock.current = true;
    try {
      if (!apiKey) {
        setError("Укажите OpenAI API ключ (см. инструкцию в README)");
        setLoading(false);
        lock.current = false;
        return;
      }
      const messages = getTelegramMessages(40);
      if (!messages.length) {
        setError("Не удалось найти сообщения чата. Откройте чат Telegram Web, напишите несколько сообщений и обновите страницу. Если не помогает — пришлите HTML сообщения для доработки.");
        setLoading(false);
        lock.current = false;
        return;
      }
      // Для идентификации чата можно использовать заголовок чата
      const chatTitle = document.querySelector('[data-testid="chat-info-title"]')?.textContent || document.title;
      lastChatId.current = chatTitle;
      const summaryText = await fetchSummary(messages, apiKey);
      if (summaryText === '__UNSUPPORTED_REGION__') {
        setError("OpenAI API не поддерживается в вашей стране или регионе. Попробуйте использовать VPN или другой API-ключ.");
        setLoading(false);
        lock.current = false;
        return;
      }
      if (summaryText === '__INSUFFICIENT_QUOTA__') {
        setError("У вашего OpenAI API-ключа закончилась квота или средства. Проверьте свой тариф и платежные данные на https://platform.openai.com/account/usage.");
        setLoading(false);
        lock.current = false;
        return;
      }
      if (summaryText === '__BILLING_NOT_ACTIVE__') {
        setError("Для использования OpenAI API необходимо добавить платёжную карту и активировать биллинг: https://platform.openai.com/account/billing/overview");
        setLoading(false);
        lock.current = false;
        return;
      }
      if (!summaryText) {
        setError("OpenAI не вернул текст. Проверьте консоль для отладки. Возможно, слишком мало сообщений или они не читаются парсером.");
        setLoading(false);
        lock.current = false;
        return;
      }
      setSummary(summaryText);
    } catch (e) {
      setError(e.message || "Ошибка генерации резюме");
    } finally {
      setLoading(false);
      lock.current = false;
    }
  };

  // --- Автообновление при смене чата ---
  useEffect(() => {
    let prevChat = "";
    let prevUrl = location.href;
    const interval = setInterval(() => {
      const chatTitle = document.querySelector('[data-testid="chat-info-title"]')?.textContent || document.title;
      if (chatTitle !== prevChat || location.href !== prevUrl) {
        prevChat = chatTitle;
        prevUrl = location.href;
        if (!lock.current && visible) generateSummary();
      }
    }, 1200);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [apiKey, visible]);

  // --- Первичная генерация ---
  useEffect(() => {
    if (visible && apiKey) generateSummary();
    // eslint-disable-next-line
  }, [apiKey, visible]);

  // --- Сохранять резюме в историю ---
  useEffect(() => {
    if (summary && !loading && !error) {
      const chatTitle = document.querySelector('[data-testid="chat-info-title"]')?.textContent || document.title;
      saveSummaryToHistory({ chatTitle, summary });
      setHistory(loadSummaryHistory());
    }
    // eslint-disable-next-line
  }, [summary]);

  // --- Генерация вариантов ответов после резюме ---
  useEffect(() => {
    if (summary && !loading && !error && apiKey) {
      setRepliesLoading(true);
      setRepliesError("");
      setSuggestedReplies([]);
      const messages = getTelegramMessages(40);
      fetchSuggestedReplies(messages, apiKey)
        .then(replies => setSuggestedReplies(replies))
        .catch(e => setRepliesError(e.message || "Ошибка генерации вариантов ответа"))
        .finally(() => setRepliesLoading(false));
    }
    // eslint-disable-next-line
  }, [summary]);

  // --- UI вкладок ---
  if (!visible)
    return (
      <ShowButton
        top={position.top}
        right={position.right}
        onClick={() => setVisible(true)}
        title={i18next.t('show')}
        style={{ transition: 'top 0.18s, right 0.18s' }}
      >
        ▶
      </ShowButton>
    );

  // --- UI для модального окна ---
  if (showApiKeyModal) {
    return (
      <ModalOverlay>
        <Modal>
          <ModalTitle>{i18next.t('enterApiKey')}</ModalTitle>
          <ModalInput
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            autoFocus
          />
          <ModalButton
            onClick={() => {
              if (apiKey && apiKey.startsWith("sk-")) {
                localStorage.setItem("tg-ext-openai-key", apiKey);
                setShowApiKeyModal(false);
              }
            }}
            disabled={!apiKey || !apiKey.startsWith("sk-")}
          >{i18next.t('saveKey')}</ModalButton>
          <ModalHelp>
            {i18next.t('getKey')}: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">{i18next.t('getKey')}</a>
          </ModalHelp>
        </Modal>
      </ModalOverlay>
    );
  }

  return (
    <AnimatedContainer
      style={{ top: position.top, right: position.right, position: "fixed", zIndex: 10001, minWidth: 320, maxWidth: 420, boxShadow: "0 10px 25px rgba(0,0,0,0.13)" }}
      isDragging={isDragging}
      onMouseDown={onMouseDown}
    >
      <HideButton onClick={() => setVisible(false)} title={i18next.t('hide')}>✕</HideButton>
      <Tabs>
        <Tab active={tab === 'summary'} onClick={() => setTab('summary')}>{i18next.t('summary')}</Tab>
        <Tab active={tab === 'history'} onClick={() => setTab('history')}>{i18next.t('history')}</Tab>
        <Tab active={tab === 'settings'} onClick={() => setTab('settings')}>{i18next.t('settings')}</Tab>
      </Tabs>
      {tab === 'summary' && (
        <>
          <SummaryTitle>{i18next.t('summary')}
            <LangSelect value={lang} onChange={e => setLang(e.target.value)}>
              <option value="ru">{i18next.t('ru')}</option>
              <option value="en">{i18next.t('en')}</option>
            </LangSelect>
            <TranslateBtn
              onClick={async () => {
                setTranslating(true);
                setTranslatedSummary("");
                try {
                  // Автоопределение языка
                  const toLang = lang === 'auto' ? (detectLang(summary) === 'ru' ? 'en' : 'ru') : lang;
                  const text = await fetchTranslation(summary, apiKey, toLang);
                  setTranslatedSummary(text);
                } catch (e) {
                  setTranslatedSummary("Ошибка перевода: " + e.message);
                }
                setTranslating(false);
              }}
              disabled={!summary || translating}
            >{i18next.t('translate')}</TranslateBtn>
          </SummaryTitle>
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorText>{error}</ErrorText>
          ) : summary ? (
            <>
              <Text>{translatedSummary || summary}</Text>
              <RepliesBlock>
                <RepliesTitle>
                  {i18next.t('replies')}
                  <TranslateBtn
                    onClick={async () => {
                      setTranslating(true);
                      setTranslatedReplies([]);
                      try {
                        const joined = suggestedReplies.join('\n');
                        const text = await fetchTranslation(joined, apiKey, lang === 'ru' ? 'en' : 'ru');
                        setTranslatedReplies(text.split(/\n|\r/).map(s => s.trim()).filter(Boolean));
                      } catch (e) {
                        setTranslatedReplies(["Ошибка перевода: " + e.message]);
                      }
                      setTranslating(false);
                    }}
                    disabled={!suggestedReplies.length || translating}
                  >{i18next.t('translate')}</TranslateBtn>
                </RepliesTitle>
                {repliesLoading ? (
                  <Loader style={{ width: 22, height: 22, margin: '12px auto' }} />
                ) : repliesError ? (
                  <ErrorText>{repliesError}</ErrorText>
                ) : (translatedReplies.length ? translatedReplies : suggestedReplies).length ? (
                  (translatedReplies.length ? translatedReplies : suggestedReplies).map((reply, idx) => (
                    <ReplyItem key={idx}>
                      <span>{reply}</span>
                      <CopyBtn title={i18next.t('copy')} onClick={() => {navigator.clipboard.writeText(reply)}}>📋</CopyBtn>
                    </ReplyItem>
                  ))
                ) : (
                  <Text style={{ color: '#9ca3af' }}>{i18next.t('noReplies')}</Text>
                )}
              </RepliesBlock>
            </>
          ) : (
            <Text style={{ color: "#9ca3af" }}>{i18next.t('noSummary')}</Text>
          )}
          {!apiKey && (
            <div style={{ marginTop: 16 }}>
              <input
                type="password"
                placeholder={i18next.t('enterApiKey')}
                value={apiKey}
                onChange={e => {
                  setApiKey(e.target.value);
                  localStorage.setItem("tg-ext-openai-key", e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                  marginBottom: 8,
                }}
              />
              <Text style={{ color: "#6366f1" }}>
                {i18next.t('enterApiKeyInfo')} <br />
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">{i18next.t('getKey')}</a>
              </Text>
            </div>
          )}
        </>
      )}
      {tab === 'history' && (
        <HistoryList>
          {history.length === 0 && <Text style={{ color: '#9ca3af' }}>{i18next.t('emptyHistory')}</Text>}
          {history.map(item => (
            <HistoryItem key={item.id}>
              <HistoryTitle>{item.chatTitle || 'Чат'}</HistoryTitle>
              <HistoryDate>{new Date(item.date).toLocaleString()}</HistoryDate>
              <HistoryPreview>{item.summary.slice(0, 120)}{item.summary.length > 120 ? '…' : ''}</HistoryPreview>
              <HistoryDelete onClick={() => { deleteSummaryFromHistory(item.id); setHistory(loadSummaryHistory()); }}>{i18next.t('delete')}</HistoryDelete>
            </HistoryItem>
          ))}
        </HistoryList>
      )}
      {tab === 'settings' && (
        <SettingsBlock>
          <SettingsLabel>{i18next.t('interfaceLanguage')}</SettingsLabel>
          <SettingsSelect value={uiLang} onChange={e => setUiLang(e.target.value)}>
            <option value="ru">{i18next.t('ru')}</option>
            <option value="en">{i18next.t('en')}</option>
          </SettingsSelect>
          <SettingsLabel style={{marginTop:16}}>{i18next.t('apiKey')}</SettingsLabel>
          <ModalInput
            type="password"
            placeholder="sk-..."
            value={settingsApiKey}
            onChange={e => setSettingsApiKey(e.target.value)}
            style={{marginBottom:8}}
          />
          <SettingsButton
            onClick={() => {
              if (settingsApiKey && settingsApiKey.startsWith("sk-")) {
                localStorage.setItem("tg-ext-openai-key", settingsApiKey);
                setApiKey(settingsApiKey);
              }
            }}
            disabled={!settingsApiKey || !settingsApiKey.startsWith("sk-")}
          >{i18next.t('saveKey')}</SettingsButton>
          <SettingsButton style={{marginLeft:8}} onClick={() => setTab('summary')}>{i18next.t('save')}</SettingsButton>
        </SettingsBlock>
      )}
    </AnimatedContainer>
  );
};
