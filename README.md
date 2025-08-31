# 🍳 Simmer — Social Cooking (Frontend-Only Demo)

An Instagram-style recipe app where cooks share posts (full recipes with ingredients/steps) and short-lived stories. Built with React + Vite and a warm red → orange → yellow palette. For this portfolio build, Simmer runs entirely in the browser—no backend or database. A lightweight fakeApi persists data in localStorage, supports file uploads (compressed to data-URLs), demo user switching, and seed reset so reviewers can click around instantly.

## 🔗 Demo Video
[Watch HERE](https://youtu.be/yKCmcgpAQ0U)

## 🧰 Languages / Tools

Frontend: React (Vite), JavaScript, HTML, CSS
Auth (optional): Clerk (publishable key only; demo fallback included)
Storage: localStorage via src/lib/fakeApi.js (seed data, posts, stories, comments, likes, saves)
Assets: SVG logo, NBA avatars (JPG)

## ✨ Key Features

- 🖼 Feed + Stories — Stories rail with viewer; feed cards open into a rich recipe modal.
- ✍️ Create posts — Add images by URL or upload files (auto-resized & stored as data-URLs).
- 📚 Recipe fields — Title, tags, cook time, servings, difficulty, ingredients, steps.
- 💬 Comments (scrollable) — Comments pane that doesn’t push layout; compact stats row shows ♥ likes • 💬 comments • 🔖 saved.
- 📖 Saved & Latest — Switch between latest feed and your saved collection.
- ⭐ Suggested recipes — Curated list on the right; click to open like a normal post.
- 🧑‍🍳 Demo auth — Pick a demo user (NBA avatars) or use Clerk if configured.
- 🧼 Demo controls — Floating button to reset seed data and switch users.
- 📱 Responsive — Clean layout on desktop and mobile.

## 🧩 Technical Highlights

Frontend-only “data layer”
- src/lib/fakeApi.js simulates a backend (users, posts, stories, comments, likes/saves).
- All data persisted to localStorage and can be reset via the floating Demo button.

Image handling with zero backend
- File uploads read with FileReader, resized on a hidden canvas (~1280px), stored as data-URLs.
- Also supports direct image URLs (comma or newline separated).

Stories that append
- Creating a new story for the same user merges into the active story (24h expiry), instead of duplicating.

Polished UX details
- Compact stats row (♥ • 💬 • 🔖) on cards and modal.
- Scrollable comments container inside the post modal (doesn’t blow up layout).
- Carousel arrows are centered and constrained to the image area.
- Orange tag chips on feed cards and in the modal for consistent visual language.
- “Your story” tile uses the user avatar with a branded + badge.


## 📸 Screenshots
