# Quiz Funnel Skill — Spec

## Overview
A skill that interviews the user (via AskUserQuestion) to gather everything needed, then generates a complete quiz funnel. The skill acts like a strategist — it doesn't just take orders, it makes suggestions based on the topic.

---

## What Changes Between Funnels (Skill Must Ask)

### 1. Topic & Audience
- What is this quiz funnel about? (niche/topic)
- Who is the target audience?
- What's the lead magnet hook? (why would someone take the quiz?)
- What's the headline and subheadline for the landing page?

### 2. Branding
- Logo (text, icon, or image?)
- Brand name
- Primary accent color (currently blue-600)
- Social proof line (e.g., "Read by 2,000,000+ early adopters")
- Star rating / review count

### 3. Quiz Questions (the core variable)
- How many questions? (current: 10 steps, ~8 questions)
- What questions to ask? (skill should SUGGEST based on niche, user approves/edits)
- For each question:
  - Type: single-select, multi-select, text-input, url-input, email, info
  - Options (for select types)
  - Branching logic (if answer X, skip to step Y)
- Email capture placement: start (current) or end?
- Should "name" be collected? (current: yes, step 1)

### 4. Scoring / Result System
- Does the quiz produce a score? (current: yes — "AI Readiness Score")
- How many result categories? (current: 3 — Explorer, Catalyst, Architect)
- For each category:
  - Name, label, color scheme
  - Description copy
  - Tags shown to user
  - Recommendation text
- Scoring weights per question/answer (current: hardcoded in completion-step.tsx)

### 5. Offer / CTA
- Is there an offer at the end? (product, service, community, call booking)
- Offer URL (current: Skool link)
- Price point (current: $99/mo)
- What's included? (bullet list for pricing card)
- CTA button copy (current: "View my learning plan")
- Countdown timer? (current: 15 min)
- Persuasive copy sections — skill should generate based on niche using write-landing-page patterns

### 6. Downsell / No-Offer Path
- What happens if they decline the offer?
- Downsell modal copy
- Is there a free alternative? (current: 5-day email course)
  - If yes: course name, lesson titles, lesson descriptions
  - Phone mockup content for the downsell page
- Downsell FAQs
- Enrolled confirmation copy

### 7. Testimonials
- How many? (current: 6)
- For each: quote, name, role
- Or should skill generate placeholder testimonials based on niche?

### 8. FAQs
- Main offer FAQs (current: 6)
- Downsell FAQs (current: 5)
- Skill should suggest FAQs based on niche, user approves/edits

### 9. Email Integration
- Which provider? (current: ConvertKit/Kit v4 API)
- API key env var name
- What fields to store per subscriber? (maps to FormData fields)
- Any tags to apply based on answers?
- Form ID or sequence to subscribe to?

### 10. Phone Mockup Content (Landing Page)
- What goes in the phone mockup on the email step? (current: newsletter preview)
- Brand logos floating around it
- This is highly niche-specific

---

## What Stays The Same (Skill Encodes As Architecture)

### Component Library (reuse as-is)
- `quiz-container.tsx` — orchestration, navigation, animations, localStorage persistence
- `single-select-step.tsx` — generic, takes question + options
- `multi-select-step.tsx` — generic, takes question + options
- `text-input-step.tsx` — generic, takes question + placeholder
- `progress-bar.tsx` — generic, takes current/total
- `email-step.tsx` — TEMPLATE (content changes, structure stays)
- `completion-step.tsx` — TEMPLATE (content changes, structure stays)
- `dev-tools-step.tsx` — NICHE-SPECIFIC (only exists in AI funnel, might not exist in others)

### UI Components (shadcn, reuse as-is)
- `button.tsx`, `input.tsx`, `progress.tsx`, `card.tsx`, `checkbox.tsx`

### Architecture Patterns
- Config-driven: All quiz content lives in `quiz-config.ts`
- Each step has a `getNextStep()` function for branching
- `FormData` interface tracks all answers (fields change per funnel)
- localStorage persistence with `STORAGE_KEY`
- Session ID generation on first visit
- Framer Motion slide animations between steps
- Step history array for back navigation

### API Routes (structure stays, fields change)
- `/api/subscribe` — creates subscriber on email capture
- `/api/subscribe-final` — updates subscriber with all quiz answers on completion
- `/api/onboarding/log` — logs each answer server-side as it happens
- Mock mode when API key is placeholder

### Analytics (reuse as-is)
- `trackSurveyStart`, `trackSurveyAnswer`, `trackStepView`, `trackBackClick`, `trackSurveyComplete`
- Currently console.log — can be swapped for real analytics

### Project Setup
- Next.js + Tailwind + shadcn/ui + Framer Motion + Zod
- TypeScript throughout
- `.env.local` for API keys

---

## Interview Flow (How the Skill Runs)

The skill uses AskUserQuestion in sequence — NOT all at once. Each question builds on prior answers.

### Phase 1: Discovery (3-4 questions)
1. "What's this quiz funnel for? Give me the niche, topic, and who it's targeting."
2. "What's the hook? Why would someone take this quiz? What do they get out of it?"
3. "What's the end goal — are you selling something, booking calls, or just building a list?"
4. "Do you have specific brand colors/logo, or should I use defaults?"

### Phase 2: Quiz Design (2-3 questions)
5. Skill SUGGESTS 8-10 questions based on the niche. Asks: "Here are my suggested quiz questions and flow. Edit, add, remove, or approve."
6. "Any questions where the answer should skip to a different path? (e.g., if they pick X, jump to a specialist step)"
7. "Should email be captured at the start (before quiz) or end (after quiz)?"

### Phase 3: Results & Offer (2-3 questions)
8. Skill SUGGESTS scoring categories and result types. Asks for approval/edits.
9. "What's your offer? Give me: name, price, URL, what's included."
10. "What happens if they say no? Do you have a downsell (free course, lead magnet, etc.)?"

### Phase 4: Content & Social Proof (1-2 questions)
11. "Give me your testimonials (or should I generate placeholders?)"
12. "Any specific FAQs you want included?"

### Phase 5: Integration (1 question)
13. "Which email provider are you using, and do you have the API key ready?"

### Phase 6: Generation
Skill generates the entire funnel — config, components, routes, styling — using cinematic-design for the visual layer.

---

## Skills That Chain With This
- `cinematic-design` — for visual design of all pages
- `write-landing-page` — for persuasive copy on completion/offer page
- `write-email-sequence` — for planning the downsell email course
- `write-email` — for writing individual emails in the sequence
