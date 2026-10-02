# NUMESCON 2026 — Coming Soon

A modern, responsive coming-soon landing page for **NUMESCON 2026**, the academic fest of **North Bengal Medical College and Hospital (NBMCH)**.

The page features a dark, futuristic visual style, an animated medical-inspired orbit graphic, and a live countdown to the event.

> **Event dates are tentative:** December 1–2, 2026.

## Features

- Responsive layout for desktop and mobile screens
- Hero section introducing NUMESCON 2026
- Animated orbit illustration with a medical motif
- Live countdown to December 1, 2026
- Event date and institutional branding
- Lightweight implementation using Next.js and CSS

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- React
- TypeScript
- CSS
- Google Fonts: DM Mono, Manrope, and Space Grotesk

## Getting Started

### Prerequisites

Install a current version of [Node.js](https://nodejs.org/) and npm.

### 1. Install dependencies

If you already have the Next.js project, open a terminal in its root directory and run:

```bash
npm install
```

### 2. Add the page files

Replace or create the following files using the provided implementation:

```text
app/
├── globals.css
└── page.tsx
```

Make sure `app/layout.tsx` imports the global stylesheet:

```tsx
import "./globals.css";
```

If you are starting a new project, you can create one with:

```bash
npx create-next-app@latest numescon-2026
cd numescon-2026
```

Choose the App Router and TypeScript options when prompted. Then add the page files.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Create a production build

```bash
npm run build
npm start
```

## Updating the Event Date

The countdown target is currently set to **December 1, 2026**, at midnight Indian Standard Time.

In `app/page.tsx`, find the countdown target:

```tsx
const targetDate = new Date("2026-12-01T00:00:00+05:30");
```

Change this value if the event schedule is revised. Also update the displayed date text in the page so the countdown and event information remain consistent.

## Customization

- **Event title and copy:** Edit the text in `app/page.tsx`.
- **Colors, typography, spacing, and animations:** Edit `app/globals.css`.
- **Institutional details:** Verify the official college name, logo, and event information before publishing.
- **Contact details:** Add or update the official event contact information as it becomes available.

## Project Structure

```text
numescon-2026/
├── app/
│   ├── globals.css       # Global styles, layout, and animations
│   ├── layout.tsx        # Root layout and stylesheet import
│   └── page.tsx          # Coming-soon landing page and countdown
├── public/               # Static assets, if needed
├── package.json
└── README.md
```

## Before Publishing

- Confirm the final event dates and update the countdown if needed.
- Check all event and institutional details for accuracy.
- Test the page on mobile and desktop screen sizes.
- Run `npm run build` to check for production build errors.
- Deploy the project to your preferred hosting platform, such as [Vercel](https://vercel.com/).

## Event

**NUMESCON 2026**  
North Bengal Medical College and Hospital  
Sushrutanagar, Siliguri, West Bengal, India

---

Made for the upcoming NUMESCON 2026 academic fest.
