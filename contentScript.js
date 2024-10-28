// contentScript.js

let accumulatedContent = '';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "explainText") {
    const selectedText = request.text;

    // Display a loading indicator
    showLoadingIndicator();

    // Send a message to the background script to get the explanation
    chrome.runtime.sendMessage({ action: "getExplanation", text: selectedText });
  } else if (request.action === "startNewExplanation") {
    console.log('Starting a new explanation.');
    // Append a separator before starting a new explanation
    accumulatedContent += '\n\n<hr>\n\n'; // Two line breaks for separation
    updateExplanationPopup(''); // Trigger a re-render
  } else if (request.action === "streamExplanation") {
    removeLoadingIndicator();
    // Update the explanation incrementally
    updateExplanationPopup(request.content);
  } else if (request.action === "displayExplanation") {
    // Optionally handle the final explanation
    // removeLoadingIndicator();
    // showExplanationPopup(request.explanation);
  } else if (request.action === "displayError") {
    removeLoadingIndicator();
    showErrorPopup(request.error);
  }
});


function showLoadingIndicator() {
  // Create a loading indicator element
  const loadingIndicator = document.createElement("div");
  loadingIndicator.id = "ai-loading-indicator";
  loadingIndicator.style = `
    position: fixed;
    top: 10px;
    right: 10px;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #ccc;
    z-index: 9999;
  `;
  loadingIndicator.textContent = "Loading explanation...";
  document.body.appendChild(loadingIndicator);
}

function removeLoadingIndicator() {
  const loadingIndicator = document.getElementById("ai-loading-indicator");
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

function showExplanationPopup(explanation) {
  try {
    // Use `marked` function directly
    // if (typeof window.marked !== 'function') {
    //   throw new Error("marked is not loaded yet. Please ensure it is properly loaded.");
    // }

    const formattedExplanation = marked.parse(explanation);
    console.log("Formatted explanation:", formattedExplanation);

    // Create a popup element
    const popup = document.createElement("div");
    popup.id = "ai-explanation-popup";
    popup.style = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 400px;
      background-color: #fff;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      overflow-y: auto;
      max-height: 60%;
      font-family: "Segoe UI", 'Arial', sans-serif;
    `;
    popup.innerHTML = `
      <div style="font-weight: bold; font-size: 16px; margin-bottom: 15px;">AI Explanation:</div>
      <div class="ai-content">${formattedExplanation}</div>
      <button id="ai-popup-close" style="
        margin-top: 15px;
        padding: 10px 15px;
        background-color: #007BFF;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      ">Close</button>
    `;
    document.body.appendChild(popup);

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
  .ai-content h1, .ai-content h2, .ai-content h3 {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .ai-content p {
    margin-bottom: 10px;
    line-height: 1.5;
  }
  .ai-content ul {
    list-style-type: disc;
    margin-left: 20px;
    margin-bottom: 10px;
  }
  .ai-content li {
    margin-bottom: 5px;
  }
  .ai-content strong {
    font-weight: bold;
  }
  .ai-content em {
    font-style: italic;
  }
`;
    document.head.appendChild(style);


    // Add event listener to close the popup
    document.getElementById("ai-popup-close").addEventListener("click", () => {
      popup.remove();
    });
  } catch (e) {
    console.error("Error using marked.js:", e);
  }
}

function showErrorPopup(errorMessage) {
  // Create a popup element
  const popup = document.createElement("div");
  popup.id = "ai-error-popup";
  popup.style = `
    position: fixed;
    top: 10px;
    right: 10px;
    max-width: 300px;
    background-color: #fff;
    padding: 15px;
    border: 1px solid #f00;
    z-index: 9999;
    overflow: auto;
    max-height: 50%;
    color: #f00;
  `;
  popup.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 10px;">Error:</div>
    <div>${errorMessage}</div>
    <button id="ai-error-close" style="margin-top: 10px;">Close</button>
  `;
  document.body.appendChild(popup);

  // Add event listener to close the popup
  document.getElementById("ai-error-close").addEventListener("click", () => {
    popup.remove();
  });
}

function updateExplanationPopup(newContent) {
  accumulatedContent += newContent;

  // Convert Markdown to HTML using Marked.js and sanitize it
  const htmlContent = marked.parse(accumulatedContent);

  // If the popup doesn't exist, create it
  let popup = document.getElementById("ai-explanation-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "ai-explanation-popup";
    popup.style = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 600px;
      background-color: #fff;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      overflow-y: auto;
      max-height: 60%;
      font-family: "Segoe UI", 'Arial', sans-serif;
      resize: both; /* Allow the user to resize the popup */
      min-width: 200px; /* Optional: Set minimum width */
      min-height: 100px; /* Optional: Set minimum height */
    `;
    popup.innerHTML = `
      <div style="font-weight: bold; font-size: 16px; margin-bottom: 15px;">AI Explanation:</div>
      <div class="ai-content" style="font-family: 'Segoe UI', Arial, sans-serif;">${htmlContent}</div>
      <button id="ai-popup-close" style="
        margin-top: 15px;
        padding: 10px 15px;
        background-color: #007BFF;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      ">Close</button>
    `;
    document.body.appendChild(popup);

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
    .ai-content h1, .ai-content h2, .ai-content h3 {
        font-weight: 600; /* Slightly lighter bold */
        margin-bottom: 6px; /* Smaller spacing for a compact look */
    }
    .ai-content p {
        margin-bottom: 6px; /* Reduced spacing between paragraphs */
        line-height: 1.4; /* A bit more spacing between lines for better readability */
        font-size: 16px; /* Generally readable size */
    }
    .ai-content ul {
        list-style-type: none; /* Removing bullets for a cleaner appearance */
        margin-left: 16px; /* Smaller indentation to keep it tidy */
        margin-bottom: 6px;
        padding-left: 16px; /* To ensure the list items are nicely indented */
    }
    .ai-content li {
        margin-bottom: 6px; /* Reduced space between list items */
        line-height: 1.4;
    }
    .ai-content strong {
        font-weight: 600; /* Consistent weight to make emphasis less harsh */
    }
    .ai-content em {
        font-style: italic; /* Keep italics as they help differentiate emphasis */
    }
    .ai-content {
        font-family: Arial, sans-serif; /* Similar to a clean system font like used in chat interfaces */
        color: #333; /* A soft black for better readability */
    }
    `;

    document.head.appendChild(style);



    // Add custom styles (if not already added)
    if (!document.getElementById('ai-popup-styles')) {
      const style = document.createElement('style');
      style.id = 'ai-popup-styles';
      style.textContent = `
        /* Your custom styles here */
      `;
      document.head.appendChild(style);
    }

    // Add event listener to close the popup
    document.getElementById("ai-popup-close").addEventListener("click", () => {
      popup.remove();
      accumulatedContent = '';
    });
  } else {
    // Update the content
    const contentDiv = popup.querySelector('.ai-content');
    contentDiv.innerHTML = htmlContent;
  }
}
