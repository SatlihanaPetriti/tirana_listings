# Tirana Listings — React + Vite + Tailwind CSS

A full-featured property listings app for Tirana, Albania.

## Stack

- **React 18** + **React Router v6** — SPA with `/ ` and `/listings/:id` and `/compare`
- **Vite 5** — build tool & dev server
- **Tailwind CSS 3** — utility-first styling
- **Fetch API** — all HTTP calls (no axios)
- **localStorage** — favorites persist across sessions

## Quick Start

```bash
# 1. Install
npm install

# 2. Set your API URL (default: http://localhost:8000)
# Edit .env:
VITE_API_BASE=http://localhost:8000

# 3. Run
npm run dev
# → http://localhost:5173
```

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `ListingsPage` | Browse + filter all listings |
| `/listings/:id` | `DetailPage` | Full listing detail |
| `/compare` | `ComparePage` | Side-by-side table of favorites |

## Features (FE-1 → FE-5)

### FE-1 — Setup & Routing
- React Router with `/`, `/listings/:id`, `/compare`
- Global favorites state via Context + localStorage
- API base from `.env` → `VITE_API_BASE`

### FE-2 — Listings Page
- Filter sidebar: price dual-slider, sqm range, beds, baths, furnished toggle, amenities, sort
- Card grid: photo placeholder, price, address, beds/baths/sqm badge
- Overpriced / Fair / Underpriced chip (vs ML estimate)
- Pagination
- Loading skeleton cards
- Empty state

### FE-3 — Detail Page
- Hero section: address, price, label chip
- Key facts bar: beds · baths · sqm · floor · furnishing · elevator · terrace
- Albanian description text
- ML Estimate box with range bar visualization
- Comps section: 5 similar listings with similarity reason badges
- GPS coordinates + Google Maps link

### FE-4 — Favorites + Compare (Bonus)
- Heart icon on each card → saves to localStorage
- `/compare` page: side-by-side table with best-value highlighting
- Comparison summary stats

### FE-5 — Market Insights Widget (Bonus)
- Avg €/sqm panel on listings page
- Top 3 neighborhoods ranked by listing count

## Project Structure

```
src/
├── api.js                       # Fetch calls, formatters, ML estimate
├── App.jsx                      # Router + providers
├── index.css                    # Tailwind + custom styles
├── main.jsx
├── context/
│   └── FavoritesContext.jsx     # Global favorites (localStorage)
├── components/
│   ├── Navbar.jsx
│   ├── FilterSidebar.jsx        # All filter controls
│   ├── ListingCard.jsx          # Card with heart + pricing chip
│   ├── SkeletonCard.jsx         # Loading skeleton
│   ├── Pagination.jsx
│   └── MarketInsightsWidget.jsx # Avg €/sqm + top neighborhoods
└── pages/
    ├── ListingsPage.jsx
    ├── DetailPage.jsx
    └── ComparePage.jsx
```
