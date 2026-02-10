<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Mzalendo Lens

**Bridging the Gap Between Complex Legislation and Citizen Understanding**

Mzalendo Lens leverages the **Gemini 3 Flash Preview** model to bridge the gap between complex legislation and citizen understanding. The integration is central to the app's three core pillars:

## 🎯 Core Features

### 1. **Multimodal Reasoning**
Using Gemini 3's advanced vision and document processing, the app allows users to upload raw PDF bills or smartphone photos of printed gazettes. The model performs OCR and semantic analysis simultaneously, extracting high-intent legal clauses from low-quality scans.

### 2. **Pedagogical Synthesis**
Instead of generic summarization, we utilize System Instructions to shape Gemini 3 into a "Kenyan Civic Educator." The model performs complex reasoning to translate legalese into culturally relevant metaphors (e.g., M-Pesa transaction impacts) and "Gen-Z" terminology, making the data accessible to the youth.

### 3. **Dynamic Game Generation**
The model uses Structured Outputs (JSON) to generate a "Duolingo-style" progressive challenge. Gemini 3 reasons through the text to create a three-tier difficulty ramp: moving from basic fact-finding (Easy) to practical financial calculations (Medium) and finally strategic long-term impact analysis (Hard). This ensures that "gaming" isn't just fun, but a validated measure of civic comprehension.

---

## 🚀 Quick Start for Judges

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Gemini API Key** (get one from [Google AI Studio](https://aistudio.google.com/apikey))

### Installation Steps

1. **Clone or download this repository**
   ```bash
   cd New-Mzalendo-Lens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install React, Vite, TypeScript, and the Google Gemini SDK.

3. **Set up your API key**
   
   Create a `.env.local` file in the project root:
   ```bash
   touch .env.local
   ```
   
   Add your Gemini API key to the file:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```
   
   **Important:** Replace `your_gemini_api_key_here` with your actual API key from [Google AI Studio](https://aistudio.google.com/apikey).

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   The app will be available at `http://localhost:5173/`
   
   You should see the Mzalendo Lens interface ready to analyze bills!

### Testing the App

1. **Upload a PDF or image** of a bill/gazette, or **paste text** directly
2. Click **"DECODE BILL"** to analyze
3. Review the **Executive Summary** and **Impact Cards**
4. Complete the **interactive quiz** to test your understanding
5. View your **final score** and detailed summary

---

## 🛠️ Tech Stack

- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Google Gemini 3 Flash Preview** - Multimodal AI reasoning
- **Structured JSON Outputs** - Reliable data parsing

---

## 📁 Project Structure

```
New-Mzalendo-Lens/
├── App.tsx                 # Main application component
├── components/
│   └── Layout.tsx          # Layout wrapper
├── services/
│   └── geminiService.ts    # Gemini 3 API integration
├── types.ts                # TypeScript type definitions
├── vite.config.ts          # Vite configuration
├── .env.local              # Environment variables (create this)
└── package.json            # Dependencies and scripts
```

---

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

---

## 🐛 Troubleshooting

### "API key not valid" Error

- Make sure your `.env.local` file uses `VITE_API_KEY` (not `API_KEY`)
- Restart the dev server after creating/updating `.env.local`
- Verify your API key is correct and active in [Google AI Studio](https://aistudio.google.com/apikey)

### Port Already in Use

If port 5173 is busy, Vite will automatically try the next available port. Check the terminal output for the actual URL.

### Dependencies Not Installing

- Make sure you have Node.js v18+ installed: `node --version`
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

---

## 📝 Notes for Judges

This project demonstrates:

- **Advanced Gemini 3 Integration**: Multimodal document processing with vision capabilities
- **Structured Outputs**: Reliable JSON schema-based responses for game generation
- **System Instructions**: Custom prompt engineering for culturally relevant output
- **Progressive Difficulty**: AI-generated quiz questions with increasing complexity
- **Modern React Patterns**: TypeScript, hooks, and component composition

The app is designed to make complex legislation accessible to young Kenyans through gamification and culturally-aware language translation.

---

## 🔗 Links

- **View in AI Studio**: https://ai.studio/apps/drive/1348za70RduYm0vT4XOlUvyMochHSUz0x
- **Get Gemini API Key**: https://aistudio.google.com/apikey

---

Built with ❤️ for the Gemini 3 Hackathon
