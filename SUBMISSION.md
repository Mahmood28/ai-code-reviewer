# Smart Code Reviewer — Submission

## 🔗 Public Links

| Resource | Link |
|---|---|
| **GitHub Repository** | https://github.com/Mahmood28/ai-code-reviewer |
| **Live Demo (Vercel)** | *(add after deploying — see steps below)* |

---

## 📦 Public Dataset

No external dataset required. The RAG knowledge base is a hand-crafted
`conventions.md` file covering language-agnostic coding standards (security,
naming, error handling, API design, performance, React, Python). It lives in:

```
backend/src/knowledge/conventions.md
```

---

## 📝 100-Word Summary

**Smart Code Reviewer** is an agentic AI assistant that reviews code for
readability, structure, maintainability, security, and bugs before it reaches
human review. Paste any snippet (Python, JS, TS, Go, etc.) and receive
structured inline findings with severity labels, per-dimension scores, fix
suggestions, and ranked action items — all grounded in project-specific coding
conventions via a RAG layer (LangChain MemoryVectorStore + OpenAI embeddings).
A conversational follow-up chat with persistent message history lets developers
iterate — asking "how do I fix the SQL injection?" and getting contextual,
markdown-formatted answers. Built with React + TypeScript, Node.js/Express,
LangChain LCEL chains, OpenAI GPT-4o-mini, and deployed on Vercel.

---

## 🚀 Vercel Deployment Steps

> **One-time setup — takes ~2 minutes.**

### 1. Push latest code to GitHub

```bash
cd smart-code-reviewer
rm -rf .git && git init && git branch -M main
git add -A
git commit -m "feat: initial TypeScript project — React + Node.js + LangChain + RAG"
git remote add origin "https://<YOUR_TOKEN>@github.com/Mahmood28/ai-code-reviewer.git"
git push -u origin main --force
```

### 2. Import to Vercel

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"** → select `Mahmood28/ai-code-reviewer`
3. Vercel will auto-detect the `vercel.json` config

### 3. Set Environment Variables

In the Vercel project settings → **Environment Variables**, add:

| Name | Value |
|---|---|
| `OPENAI_API_KEY` | `sk-...` (your OpenAI key) |
| `FRONTEND_URL` | `https://<your-vercel-domain>.vercel.app` |

### 4. Deploy

Click **Deploy**. Vercel will:
- Build the React frontend (`vite build`)
- Serve the Node.js/Express backend as a serverless function
- Route `/api/*` → backend, everything else → frontend

Once deployed, update the **Live Demo** link at the top of this file.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                  React Frontend                  │
│  CodeEditor · ReviewPanel · ChatBox · ScoreBar  │
└──────────────────┬──────────────────────────────┘
                   │ /api/review  /api/chat
┌──────────────────▼──────────────────────────────┐
│           Node.js / Express Backend              │
│                                                  │
│  ┌─────────────────┐   ┌──────────────────────┐ │
│  │  reviewChain.ts │   │  followUpChain.ts    │ │
│  │  LangChain LCEL │   │  LangChain + History │ │
│  └────────┬────────┘   └──────────────────────┘ │
│           │ RAG retrieval                        │
│  ┌────────▼────────────────────────────────────┐ │
│  │  MemoryVectorStore (OpenAI embeddings)      │ │
│  │  knowledge base: conventions.md            │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```
