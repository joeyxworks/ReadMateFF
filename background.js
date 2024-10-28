// background.js
// Create a context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explainText",
    title: "Explain with AI",
    contexts: ["selection"]
  });
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "explainText") {
    // Send a message to the content script with the selected text
    chrome.tabs.sendMessage(tab.id, { action: "explainText", text: info.selectionText });
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getExplanation") {
    // Send a signal to start a new explanation
    chrome.tabs.sendMessage(sender.tab.id, { action: "startNewExplanation" });

    // Send incremental updates to the content script
    const sendUpdate = (content) => {
      chrome.tabs.sendMessage(sender.tab.id, { action: "streamExplanation", content });
    };

    getExplanation(request.text, sendUpdate).then((fullExplanation) => {
      // Optionally, send the final full explanation
      chrome.tabs.sendMessage(sender.tab.id, { action: "displayExplanation", explanation: fullExplanation });
    }).catch((error) => {
      // Handle errors and send error message back to content script
      chrome.tabs.sendMessage(sender.tab.id, { action: "displayError", error: error.message });
    });
    return true; // Keeps the message channel open for sendResponse
  }
});


async function getExplanation(text, sendUpdate) {
  const apiKey = "<AZURE_OAI_API_KEY>"; // Replace with your actual API key
  const endpoint = "https://<AZURE_OAP_API_ENDPOINT>.openai.azure.com/openai/deployments/<DEPLOYMENT_NAME>/chat/completions?api-version=<MODEL_VERSION>";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: `Given the text below, explain it in simple language suitable for a language learner. The explanation should be clear, concise, and easy to understand. Focus on simplifying complex words, expressions, and phrases while maintaining the original meaning. Additionally, provide short definitions for any challenging vocabulary in parentheses.
            Text: [Insert captured text from the website here]
            Output Requirements:
            **Simplified Explanation**: Provide a brief, simple explanation of the text (2-3 sentences).
            **Vocabulary Breakdown** (if needed): List and define any difficult words or phrases encountered in the text, using plain language. Present the definitions and examples in parentheses immediately after the challenging word.
            **Contextual Information** (if applicable): If the text contains cultural or idiomatic references, provide a basic explanation to give context.` },
          { role: "user", content: `Please explain the following text "${text}"` }
        ],
        max_tokens: 750,
        temperature: 0.7,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    // Process the streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    let accumulatedText = '';

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine === '' || trimmedLine === 'data: [DONE]') {
            continue;
          }

          if (trimmedLine.startsWith('data: ')) {
            const dataStr = trimmedLine.replace('data: ', '');
            try {
              const data = JSON.parse(dataStr);
              const content = data.choices[0].delta.content;
              if (content) {
                accumulatedText += content;
                // Send the incremental update to the content script
                sendUpdate(content);
              }
            } catch (err) {
              console.error('Error parsing JSON:', err);
            }
          }
        }
      }
    }

    return accumulatedText;
  } catch (error) {
    console.error('Error in getExplanation:', error);
    throw error;
  }
}
