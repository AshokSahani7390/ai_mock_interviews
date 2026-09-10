<div align="center">

# 🎙️ PrepWise — AI Mock Interview Platform

**An intelligent, voice-powered mock interview simulator that helps candidates practice, prepare, and ace technical & behavioral job interviews in real time.**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Vapi AI](https://img.shields.io/badge/Vapi-Voice_AI-7C3AED?style=flat-square)](https://vapi.ai/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 📌 Overview

**PrepWise** is a full-stack web application that leverages state-of-the-art Voice AI and Large Language Models to simulate real-world hiring interviews. Users can generate customized technical or behavioral interview scenarios, interact conversationally with an AI voice interviewer in real time, and receive instant, comprehensive evaluation feedback with actionable insights.

---

## ✨ Key Features

- **🎙️ Real-Time Conversational Voice AI**: Powered by [Vapi](https://vapi.ai/) WebRTC audio streaming with ultra-low latency, speech-to-text, and conversational turn-taking.
- **🤖 Dual Vapi Assistants Architecture**:
  - **Interview Generator Assistant**: Gathers job role, candidate experience, tech stack, and generates tailored questions.
  - **Mock Interviewer Assistant**: Conducts the live voice interview dynamically, adapting follow-up questions to candidate responses.
- **⚡ Multi-Model LLM Engine**: Seamlessly switch or fallback across multiple LLM backends:
  - **Google Gemini** (`@google/genai`)
  - **Groq** (Ultra-fast Llama 3 models)
  - **OpenAI** (GPT-4o, GPT-3.5)
  - **FreeLLMAPI** (Custom self-hosted OpenAI-compatible proxy)
- **📊 Comprehensive Feedback & Analytics**:
  - Scores communication, technical accuracy, problem solving, and confidence.
  - Generates detailed strengths, improvement areas, and question-by-question breakdown.
  - Saves all interview history and transcript logs into **Google Firestore**.
- **🎨 Modern, Responsive UI**:
  - Sleek dark theme designed with Tailwind CSS, Lucide icons, and Sonner notifications.
  - Real-time animated speech visualizer and candidate avatar feedback.
  - Deterministic rendering and zero SSR hydration mismatch.
- **🔒 Secure Authentication & Data Layer**:
  - Firebase Authentication with cookie-based session management.
  - Server Actions protected with Firebase Admin SDK.

---

## 🏗️ Architecture & Workflow

```mermaid
flowchart TD
    A[User / Candidate] -->|Selects Role & Tech Stack| B[Next.js App / Client]
    B -->|Generate Session| C[Vapi Generator Assistant / Next.js API]
    C -->|Multi-Model Prompting| D[Gemini / Groq / OpenAI / FreeLLMAPI]
    D -->|Interview Questions JSON| E[Firestore Database]
    E -->|Stored Session| B
    B -->|Start Live Voice Call| F[Vapi Mock Interviewer Assistant]
    F <-->|Bidirectional Voice WebRTC| A
    F -->|Call Finished Transcript| G[Evaluation Engine]
    G -->|Detailed Feedback & Scores| E
    E -->|Analytics & History| H[User Dashboard & Feedback View]
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Voice AI & WebRTC**: [@vapi-ai/web SDK](https://vapi.ai/)
- **Database & Auth**: [Google Firebase](https://firebase.google.com/) (Firestore & Firebase Admin SDK)
- **AI / LLMs**: Google Gemini (`@google/genai`), Groq SDK, OpenAI SDK
- **Testing**: [Playwright](https://playwright.dev/) End-to-End browser automation
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ashoksahani7390/ai-mock-interviews.git
cd ai-mock-interviews
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and copy the template from `.env.example`:

```bash
cp .env.example .env.local
```

Fill in the required credentials:

```env
# Vapi AI Configuration
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_public_web_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_assistant_id
NEXT_PUBLIC_VAPI_INTERVIEWER_ID=your_vapi_interviewer_assistant_id

# Firebase Configuration (Admin SDK)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"

# LLM Providers (Configure at least one)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
# GROQ_API_KEY=your_groq_api_key
# OPENAI_API_KEY=your_openai_api_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch the application.

---

## 🧪 Testing & Verification

Run the full production build and type checks:

```bash
npm run build
```

Run Playwright E2E browser tests:

```bash
npx playwright test
```

---

## 🌐 Deployment on Vercel

1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com/).
3. Navigate to **Project Settings > Environment Variables** and add all variables from `.env.local`.
4. Click **Deploy**.

---

## 📁 Project Structure

```text
ai_mock_interviews/
├── app/
│   ├── (auth)/             # Sign-in & Sign-up authentication pages
│   ├── (root)/
│   │   ├── page.tsx        # Candidate Dashboard & Past Interviews
│   │   └── interview/      # Generation, Active Voice Call, & Feedback Pages
│   ├── api/vapi/generate/  # API endpoint for AI question synthesis
│   └── layout.tsx          # Root layout & providers
├── components/             # Reusable UI components & Voice Agent visualizer
├── constants/              # Application constants, icons, and themes
├── firebase/               # Firebase Client & Admin SDK initialization
├── lib/
│   ├── actions/            # Server actions for Auth & Firestore CRUD
│   ├── ai.ts               # Multi-model LLM abstraction layer
│   ├── utils.ts            # Formatting & deterministic helper functions
│   └── vapi.sdk.ts         # Vapi Web SDK wrapper & event handlers
├── public/                 # Static assets, logos, and company cover icons
├── types/                  # TypeScript type definitions
└── .env.example            # Environment variables template
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
