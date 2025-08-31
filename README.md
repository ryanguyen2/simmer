# 🍳 Simmer — Social Cooking (Frontend-Only Demo)

An Instagram-style recipe app where cooks share posts (full recipes with ingredients/steps) and short-lived stories. Built with React + Vite and a warm red → orange → yellow palette. For this portfolio build, Simmer runs entirely in the browser—no backend or database. A lightweight fakeApi persists data in localStorage, supports file uploads (compressed to data-URLs), demo user switching, and seed reset so reviewers can click around instantly.

## 🔗 Demo Video
[Watch HERE](https://youtu.be/yKCmcgpAQ0U)

Live demo (optional): https://your-deploy-url

Login is a demo flow — go to /login, click Continue to demo, and pick an NBA avatar.

## 🧰 Languages / Tools

Frontend: React (Vite), JavaScript, HTML, CSS
Auth (optional): Clerk (publishable key only; demo fallback included)
Storage: localStorage via src/lib/fakeApi.js (seed data, posts, stories, comments, likes, saves)
Assets: SVG logo, NBA avatars (JPG)

## ✨ Key Features

- **🖼 Feed + Stories — Stories rail with viewer; feed cards open into a rich recipe modal.
- **✍️ Create posts — Add images by URL or upload files (auto-resized & stored as data-URLs).
- **📚 Recipe fields — Title, tags, cook time, servings, difficulty, ingredients, steps.
- **💬 Comments (scrollable) — Comments pane that doesn’t push layout; compact stats row shows ♥ likes • 💬 comments • 🔖 saved.
- **📖 Saved & Latest — Switch between latest feed and your saved collection.
- **⭐ Suggested recipes — Curated list on the right; click to open like a normal post.
- **🧑‍🍳 Demo auth — Pick a demo user (NBA avatars) or use Clerk if configured.
- **🧼 Demo controls — Floating button to reset seed data and switch users.
- **📱 Responsive — Clean layout on desktop and mobile.



## 📸 Screenshots
