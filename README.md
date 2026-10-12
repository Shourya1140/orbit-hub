# Orbit Hub — Starter Build 0.1.0

A dark, tablet-friendly, offline-friendly starter app for study, fitness, productivity and personal growth. Chess and anime features are intentionally excluded.

## Included
- Dashboard with basic progress stats
- Six Class 11 subject sections: Physics, Chemistry, Mathematics, English, Computer Science and PAT
- Chapter lists and starter study-guide frameworks
- Chapter completion tracking
- Fitness workout log and safe beginner guidance
- Productivity task list and Pomodoro focus timer
- Personal habits and reflection journal
- English/Hindi interface toggle
- Local browser storage
- JSON export and restore
- PWA manifest and service worker for offline shell caching

## Run locally
For service-worker/offline features, use a local web server. If Python is installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser. For tablet installation, host the files on HTTPS or use a supported local development setup, then choose **Add to Home screen** / **Install app** in your browser.

Opening `index.html` directly may still show the app, but service-worker offline caching generally requires HTTPS or localhost.

## Important content note
The chapter content in this starter is a generic study framework, not a fully written or verified textbook-aligned notes library. Confirm the current 2026–27 school syllabus and textbook. More detailed notes, question banks and answer keys need to be added and checked chapter by chapter.

## Data and privacy
Progress is saved in localStorage in the current browser profile. Clearing browser data can remove it; use Settings & Backup to export a JSON backup. No account or server is required for local features.

## Limits
Online multiplayer, cloud sync, AI-powered features and reliable background push notifications are not included; these generally require external services. The focus timer runs while the app is open and may pause if the browser suspends the page.
