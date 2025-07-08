chrome.action.onClicked.addListener((tab) => {
  if (tab.url && tab.url.includes("web.telegram.org")) {
    chrome.tabs.sendMessage(tab.id, { action: "toggle" });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openai_summary") {
    (async () => {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${request.apiKey}`,
          },
          body: JSON.stringify(request.body),
        });
        const data = await response.json();
        sendResponse({ success: true, data });
      } catch (e) {
        sendResponse({ success: false, error: e.message });
      }
    })();
    return true; // Важно для асинхронного ответа!
  }
});
