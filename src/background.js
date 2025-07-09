// Background service worker for the extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ summaries: [], openaiKey: '' });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getOpenAIKey") {
    chrome.storage.sync.get(['openaiKey'], (result) => {
      sendResponse({ key: result.openaiKey });
    });
    return true; // Required for async response
  }

  if (request.action === "openai_summary") {
    const apiKey = request.apiKey;
    const body = request.body;
    let url = "https://api.openai.com/v1/chat/completions";
    let headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };
    // Если ключ OpenRouter (начинается с 'or-'), используем другой endpoint и заголовки
    if (apiKey && apiKey.startsWith('or-')) {
      url = "https://openrouter.ai/api/v1/chat/completions";
      headers["HTTP-Referer"] = "https://web.telegram.org";
      headers["X-Title"] = "Telegram Summary Extension";
    }
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          sendResponse({ success: false, error: data.error.message });
        } else {
          sendResponse({ success: true, data });
        }
      })
      .catch(err => {
        sendResponse({ success: false, error: err.message });
      });
    return true;
  }
});