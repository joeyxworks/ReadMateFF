
---

# ReadMate - Firefox Browser Extension

ReadMate is a browser extension that leverages the Azure OpenAI API to help language learners understand content and vocabulary on any webpage. The extension simplifies complex text, provides clear explanations, and offers definitions for challenging words or expressions, making language learning easier and more enjoyable.

![image](https://github.com/user-attachments/assets/8c66efb9-0ffa-430b-a962-ddab04b87d46)


## Features

- **Simplified Explanations**: Automatically generates easy-to-understand summaries of selected text to help you grasp the meaning quickly.
- **Vocabulary Breakdown**: Identifies difficult words and phrases, providing simple definitions right where you need them.
- **Contextual Clarifications**: Explains idiomatic expressions, cultural references, or slang to give deeper context and improve comprehension.
- **Customizable Output**: Choose the level of detail for explanations and definitions to match your language proficiency.
- **Multi-Language Support**: Works with content in various languages, helping you learn new languages or improve existing skills.

## How It Works

1. **Select Text on a Webpage**: Highlight the text you want to understand better.
2. **Click the Extension Icon**: Open the extension from your browser right-click menu.
3. **Get Simplified Explanations**: The extension uses the Azure OpenAI API to generate an easy-to-understand explanation and breakdown of the selected text.
4. **Review Vocabulary Definitions**: See definitions for challenging words and phrases right next to the original text.
5. **Learn in Context**: Get explanations for idiomatic or cultural references to improve comprehension and language skills.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/joeyxworks/ReadMateFF.git
   ```
2. **Load the Extension in Your Browser**:
   - In Firefox, navigate to `about:debugging` and open the `This Firefox` page.
   - Click "Load Temporary Add-on..." and select the `manifest.json` in the cloned repository folder.
3. **Start Using the Extension**:
   - Pin the extension to your toolbar for easy access.
   - Highlight any text on a webpage and click the extension icon to get simplified explanations.

## Configuration

To use the extension, you need an OpenAI API key:

1. **Get Your API Key**: Sign up for an API key from [Azure OpenAI](https://oai.azure.com/).
2. **Configure the Extension**:
   - Add your API-related information in `background.js` and `manifest.json` for authentication.

## Customization

You can customize the extension's behavior by editing the prompt configuration in the `background.js`. Adjust the output style, level of simplification, or add specific instructions to better suit your language learning needs.

## Example Usage

Here's an example of how Language Learner Assistant simplifies text:

### Original Text:
> "The economic situation has been exacerbated by geopolitical tensions, leading to widespread uncertainty in financial markets."

### Output:
- **Simplified Explanation**: The economic situation has gotten worse because of international problems, causing a lot of uncertainty in the financial markets.
- **Vocabulary Breakdown**:
  - **Exacerbated** (made worse)
  - **Geopolitical** (related to politics and geography)
  - **Uncertainty** (not knowing what will happen)

## Feedback and Contributions

Contributions are welcome! Feel free to submit issues, suggest features, or create pull requests. Your feedback helps improve the extension.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---
