# ContentHindsight

> **"Your content strategy remembers."**

ContentHindsight is a production-grade AI Content Strategy Agent with persistent long-term memory powered by **Hindsight** and high-speed reasoning powered by **Groq**.

Unlike generic AI generators that suffer from conversational amnesia, ContentHindsight retains historical content performance, brand voice guardrails, audience feedback, and verified content gaps across sessions—compounding strategic intelligence with every interaction.

---

## 1. Project Overview & The Core Loop

Traditional AI content tools provide generic advice: they propose repetitive listicles, hallucinate unaligned topics, and repeat past mistakes.

ContentHindsight closes the loop between **Performance History**, **Hindsight Memory**, and **Strategic Generation**:

```
    CONTENT HISTORY
          +
    PERFORMANCE METRICS
          +
    BRAND VOICE
          +
    AUDIENCE PREFERENCES
          +
    CONTENT GAPS
          +
    HINDSIGHT MEMORY (RECALL)
          ↓
    GROQ AI STRATEGIST
          ↓
    PERSONALIZED 7-DAY PLAN
          ↓
    NEW LEARNINGS EXTRACTED
          ↓
    HINDSIGHT MEMORY (RETAIN)
          ↓
    BETTER FUTURE STRATEGY
```

---

## 2. Why Memory Matters: The Before vs. After Demonstration

### Without Memory (Generic AI):
- Gives standard, bland social media advice (e.g. *"The Future of AI is Unstoppable"*, *"Top 10 AI Tools This Weekend"*).
- Ignores that developer audiences reject broad hype essays (-65% engagement drop).
- Fails to prioritize under-covered content gaps.

### With Hindsight Memory:
- **Recalls brand voice:** Strictly technical, direct, code-first, and zero fluff.
- **Recalls audience resonance:** Senior developers save & bookmark architecture breakdowns and implementation tutorials 3.8x more than conceptual essays.
- **Recalls content gaps:** Identifies that Persistent Agent Memory and Multi-Agent Latency Benchmarking are under-covered.
- **Adapts to new feedback:** When told *"Our audience responds especially well to architecture breakdowns"*, Hindsight retains this belief and prioritizes system topology teardowns in all future plans.

---

## 3. Key Features

- **AI Strategist Workspace (`/strategist`):**
  - Interactive strategy formulation with visible step-by-step recall: *"Recalling brand memory..."* → *"Analyzing content history..."* → *"Synthesizing strategy..."*.
  - Visible **Memory Recalled** panel displaying activated beliefs, relevance scores, and confidence levels.
  - Sequenced **7-Day Content Execution Roadmap** with explicit memory influence tags for every single post.
  - Integrated **Teach Agent New Learning** panel (retention loop).
- **Memory Center (`/memory`):**
  - Full visibility into everything ContentHindsight knows.
  - Categorized memory banks: *Brand Voice*, *Audience Preferences*, *Successful Patterns*, *Underperforming Anti-Patterns*, *Content Gaps*, and *Learned Insights*.
  - Live search, category filtering, manual retention, memory deletion, and baseline reset.
- **Memory Evolution Component:**
  - Interactive side-by-side visual comparison showing generic AI output vs. Hindsight-guided output.
- **Content Library (`/content`):**
  - Comprehensive historical archive of published assets across LinkedIn, Technical Blog, X, and YouTube.
  - Drill-down modal with full engagement breakdown (views, likes, comments, shares, saves).
  - Explicit **"WHAT THE AGENT LEARNED"** analysis with 1-click **Retain into Hindsight** action.
- **Executive Dashboard (`/dashboard`):**
  - Live KPI cards: Total content analyzed, average engagement, content gaps identified, memories stored.
  - Interactive Recharts visualization: Content performance over time and topic engagement scores.
  - Urgent content gaps to target and active brand voice rules.

---

## 4. Tech Stack

- **Frontend:**
  - React 18 + Vite + TypeScript
  - Tailwind CSS (Curated dark mode SaaS aesthetic inspired by Linear and Vercel)
  - Recharts (Performance over time & topic score charts)
  - Lucide React (Icons)
- **Backend:**
  - Node.js + Express + TypeScript
  - Modular service architecture (`services/hindsight/`, `services/groq/`, `services/content/`, `services/strategy/`)
  - Clean REST controllers with standard envelope (`{ success: true, data: {} }`)
- **AI Engine:**
  - **Groq SDK** (`llama-3.3-70b-versatile`) with structured JSON schema output
  - Built-in intelligent reasoning engine fallback
- **Memory Engine:**
  - **Hindsight** integration (`retain`, `recall`, `reflect`)
  - Built-in persistent file/embedded semantic engine (`backend/data/memories.json`) ensuring resilience without hard external service crashes

---

## 5. System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)              │
│  [AI Strategist]  [Memory Center]  [Content Library]   │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (/api/*)
┌───────────────────────────▼────────────────────────────┐
│               Backend (Express + TypeScript)           │
│                                                        │
│  ┌──────────────────┐            ┌──────────────────┐  │
│  │ Strategy Service │            │ Content Service  │  │
│  └────────┬─────────┘            └──────────────────┘  │
│           │                                            │
│      ┌────┴────────────────────────┐                   │
│      │                             │                   │
│  ┌───▼────────────────┐    ┌───────▼────────────────┐  │
│  │ Hindsight Service  │    │      Groq Service      │  │
│  │  - Recall          │    │  - llama-3.3-70b       │  │
│  │  - Retain          │    │  - Contextual Prompt   │  │
│  │  - Persistent Bank │    │  - Reasoning Engine    │  │
│  └────────────────────┘    └────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 6. Project Structure

```
ContentHindsight/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── contentController.ts
│   │   │   ├── dashboardController.ts
│   │   │   ├── memoryController.ts
│   │   │   └── strategyController.ts
│   │   ├── data/
│   │   │   ├── seedContent.ts
│   │   │   └── seedMemories.ts
│   │   ├── routes/
│   │   │   ├── contentRoutes.ts
│   │   │   ├── dashboardRoutes.ts
│   │   │   ├── memoryRoutes.ts
│   │   │   ├── strategyRoutes.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── content/
│   │   │   ├── groq/
│   │   │   │   ├── groqService.ts
│   │   │   │   └── prompts.ts
│   │   │   ├── hindsight/
│   │   │   │   ├── hindsightService.ts
│   │   │   │   └── hindsightTypes.ts
│   │   │   └── strategy/
│   │   │       └── strategyService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppShell.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── strategy/
│   │   │       ├── MemoryEvolution.tsx
│   │   │       ├── MemoryUsedPanel.tsx
│   │   │       └── SevenDayPlanView.tsx
│   │   ├── pages/
│   │   │   ├── AIStrategistPage.tsx
│   │   │   ├── ContentLibraryPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── MemoryCenterPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── .env.example
├── package.json
└── README.md
```

---

## 7. Installation & Quick Start

### Prerequisites
- Node.js v18+ (tested on Node v22)
- npm v9+

### 1. Clone & Setup
```bash
cd ContentHindsight

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
Create a `.env` in `backend/`:
```env
PORT=3001
NODE_ENV=development

# Optional: Add Groq API Key for live cloud generation
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile

# Optional: Add Hindsight API credentials
HINDSIGHT_API_KEY=
HINDSIGHT_API_URL=https://api.hindsight.vectorize.io/v1
HINDSIGHT_BANK_ID=content-hindsight-prod
```
*(Note: If API keys are omitted, the built-in resilient Hindsight memory store and intelligent strategy reasoning engine activate automatically with zero setup friction!)*

### 3. Run Backend & Frontend

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
# Running on http://localhost:3001
```

**Terminal 2 (Frontend UI):**
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 8. Hackathon Primary Demo Story Walkthrough

Follow this step-by-step walkthrough to reproduce the core demonstration:

1. **Step 1: Open the Dashboard**
   - View historical metrics, topic performance charts, urgent content gaps, and memory activity.
2. **Step 2: Navigate to AI Strategist**
   - Click **AI Strategist** in the sidebar.
3. **Step 3: Initial Request**
   - Click the preset button: *"Demo Step 1: Developer AI Agents"* or enter:
     > *"I want to plan next week's LinkedIn content for developers interested in AI agents."*
4. **Step 4 & 5: Visible Memory Recall**
   - Notice the status: *"Recalling brand memory from Hindsight..."*
   - UI presents the **Hindsight Memory Used** panel with green verified indicators:
     - *Technical tutorials drive 3.8x saves*
     - *Audience prefers practical implementation & code*
     - *AI infrastructure is an under-covered gap*
     - *Brand voice is technical and direct*
5. **Step 6: Strategy Generation**
   - Groq synthesizes a personalized strategy, complete with Strategic Direction, Content Pillars, Recommended Topics, and a 7-Day Plan.
6. **Step 7: Provide New Feedback**
   - In the **Teach Agent New Learning** panel, click the preset or enter:
     > *"Our audience responds especially well to architecture breakdowns."*
7. **Step 8 & 9: Retain in Hindsight**
   - Click **"Retain & Regenerate Strategy"** or **"Store in Hindsight"**.
   - Notice the prominent badge: **"Memory updated"**.
8. **Step 10 & 11: Subsequent Strategy Call**
   - The agent incorporates the new rule: Day 1 shifts into an *Architecture Deep-Dive*, prioritizing system diagrams and finite state machine comparisons over generic tutorials.
9. **Step 12: Verify in Memory Center**
   - Open **Memory Center** (`/memory`) to view the newly retained belief under **Audience Preferences** with recall metrics.

---

## 9. Future Roadmap

1. **PostgreSQL + pgvector Integration:** Plug-and-play connector for enterprise vector clusters.
2. **Automated Social Webhooks:** Automatic feedback ingestion from LinkedIn and YouTube post performance APIs.
3. **Multi-Agent Memory Consensus:** Multiple specialized strategists (Visual, Copywriting, Distribution) reading from a shared Hindsight memory bank.
