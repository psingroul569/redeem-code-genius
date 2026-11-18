# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Tapzo landing page

Ads-only install page for the Tapzo Android app, served at **`/tapzo`**.

- **File:** `public/tapzo.html`. It's a standalone static page (inline CSS + JS, no React), so it loads none of the main site's AdSense, Monetag, GTM or GetTracked scripts. Cloudflare Pages serves it at `/tapzo`; `/tapzo/` and `/tapzo.html` redirect there. In `npm run dev`, open `/tapzo.html`.
- **Images** go in `public/tapzo/`:
  - `icon.webp` (done; the app icon)
  - `google-play-badge.png` (done; the official badge)
  - `shot-1.webp` … `shot-5.webp`: app creatives in the swipe row (480×600, 4:5, under 80 KB each). Add or remove `<figure>` lines in the page to change the set. Don't use creatives showing other games, their currencies, or third-party brand logos.
- **Tracking IDs:** at the top of the first `<script>` in `public/tapzo.html`:
  - `GOOGLE_ADS_ID`: Google Ads tag ID (`AW-…`)
  - `INSTALL_CLICK_LABEL`: conversion label of the install-click conversion action
  - `GA4_ID`: optional; set to `''` to turn off GA4 events (`page_view`, `cta_visible`, `install_click`)
- **Coin numbers** shown on the page: `CONFIG` object at the top of the last `<script>`.
- **Support email:** replace `support@YOURDOMAIN` in the footer (TODO).
- **`?ag=` parameter:** the ad group tag. It's lowercased, reduced to `[a-z0-9_-]`, capped at 40 chars, and sent to Play as `utm_content` (default `none`). `gclid` / `gbraid` / `wbraid` from the landing URL are forwarded too. Everything goes inside the URL-encoded `referrer` parameter of the Play Store link.
- **Example ad URLs:**
  - `https://freefireredeemcodetoday.com/tapzo?ag=shorts_ci`
  - `https://freefireredeemcodetoday.com/tapzo?ag=shorts_lal`
  - `https://freefireredeemcodetoday.com/tapzo?ag=feed_discover_ci`
- **Deploy:** `npm run build`, then `npx wrangler pages deploy dist --project-name freefireredeemcodetoday --branch main`.
