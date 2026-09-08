# Content To-Do — TBCS Durga Pujo Website

## Notes on images added so far
- The `images/` folder has your original `.CR2` (Canon RAW) files kept as-is for
  archival purposes, plus web-ready `.jpg` versions I generated from them
  (`gallery-shankha-1.jpg`, `gallery-shankha-2.jpg`, `gallery-community-anjali.jpg`,
  `gallery-kids-program.jpg`) — browsers can't display RAW files directly, so always
  convert new RAW photos the same way before referencing them in HTML.

## Logo system (two marks, deliberate split)
- **`images/logo-tree.png` — the primary org mark.** Tree + "TBCS", caption cropped off
  so it stays legible small. This is the brand mark in every page's header and footer
  and the browser-tab favicon (`images/favicon.png`), because TBCS runs more than just
  Durga Pujo.
- **`images/logo-tree-full.png`** — same mark with the "Toronto Bengali Cultural
  Society" wordmark underneath, used as the lockup in the About page's "Who We Are".
- **`images/logo-durga.png` — the Durga Pujo event mark.** Used only on the Durga Pujo
  page (`events.html`) as the emblem above the page title.
- The originals you sent are kept alongside them as `images/source-logo-durga.jpeg`,
  `source-logo-tree-light.jpeg`, and `source-logo-tree-dark.jpeg` (the dark-background
  tree variant isn't used on the site yet, but it's there if a dark layout ever needs it).
- All three were rebuilt from your originals by flood-filling the *outer* white to
  transparent, which is the fix for the old logo looking odd: the previous
  `images/logo.png` had *all* white stripped, so the page background showed through the
  inside of the mandala. Now the interior white is preserved, so the marks read
  correctly on cream, on the dark maroon footer, and on any photo.
- If you ever get vector (SVG/AI) versions, send them over and I'll regenerate all of
  these for extra crispness at large sizes.

## Confirmed real info (from the event flyer)
- **Dates**: October 10–11, 2026 (Saturday–Sunday), 8:00 AM – 11:00 PM both days
- **Venue**: Bodhi Meditation Toronto, 180 Yorkland Blvd, North York, ON M2J 1R5
- **Email**: tbcscanada@gmail.com
- This is now filled in across the homepage, Durga Pujo page, contact page, and every
  page's footer.

## Confirmed real info (from the schedule flyer, `images/schedule-2026.jpg`)
- Full hour-by-hour ritual schedule for both days (Shastir Bodhon through Bishorjon/
  Sindoor Khela) is transcribed into `events.html`'s schedule section, with the flyer
  image itself embedded below as a printable/shareable version. Homepage schedule
  teaser cards updated to reference the confirmed times too.

## Confirmed real info (from the volunteer flyer, `images/volunteer-2026.jpg`)
- Volunteer shift window (9 AM–10 PM both days), the seven role categories, and the
  dedicated sign-up address tbcscanadavolunteer@gmail.com are now live in a new
  `#volunteer` section on the Durga Pujo page (`events.html`), with the flyer image
  embedded alongside the transcribed text. The Volunteer card in About's "Join Us"
  and every page's footer "Volunteer" link point to `events.html#volunteer`.

## Confirmed real info (from tbcscanada.wixsite.com/tbcs)
- **Vision** and **Mission** statements are now the "Who We Are" section on
  `about.html`, and the mission also drives the About page intro, the homepage "Our
  Story" teaser, and the footer blurb on every page.
- The five **Objectives** from the site's "What We Do" page (Promote Religious
  Harmony, Promotion of Cultural Heritage, Cultivate Social Welfare, Community
  Engagement & Participation, Social Responsibility) replaced the three placeholder
  "Mission & Values" cards on `about.html`.
- The **Land Acknowledgement** is now a section at the bottom of `about.html`.
- Worth double-checking the wording I lifted against your own copy — a couple of the
  objective blurbs were tightened for the web, and I want them to still be exactly
  what the committee wants to say.

Everything below is still a placeholder. Search each file for `[PLACEHOLDER...]` (text)
or the dashed gold boxes labeled "Placeholder" (images) to find every spot listed here.

## Site-wide (footer of every page)
- [x] Contact email — tbcscanada@gmail.com
- [x] City — North York, ON
- [x] Org description blurb (footer + `about.html` intro) — from the real mission statement
- [x] Real social links — Facebook group and Instagram, live in every footer and on
      `contact.html`. No YouTube link exists, so that icon was removed rather than
      left pointing nowhere.
- [x] `contact.html` form now submits to `mailto:tbcscanada@gmail.com` — still opens
      the visitor's email client rather than sending silently. For real inbox
      delivery without a backend, consider wiring it to Formspree / Netlify Forms.

## index.html (Home)
- [x] Event dates, countdown target, venue, city — filled from the flyer
- [ ] Hero description paragraph could be reworded once you confirm more program details
- [ ] "Why join us" intro paragraph
- [x] About-teaser paragraph — now the real mission; still needs a photo in place of
      the dashed placeholder box beside it
- [x] Hero photo fixed on phones/tablets. Two separate problems: (1) the real bug —
      below 980px `.hero-art` collapsed to 0x0 and the photo did not render *at all*,
      because auto margins stop a grid item stretching and its only child is absolutely
      positioned, so it had no width to derive its height from; fixed with an explicit
      `width:100%`. (2) the photo was also a tall pandal shot being square-cropped, so
      it's now re-cropped onto the idol (`images/hero-durga-idol.jpg`). The uncropped
      original is still in `images/` if you want a different crop.

## about.html
- [x] Vision / mission / objectives / land acknowledgement — real copy from your Wix site
- [ ] Founding story — the *history* (who started TBCS and when) is still missing, and
      the Wix site doesn't tell it either. Worth writing down; if you do, the milestones
      timeline is worth rebuilding with real years.
- [ ] Founding member photo
- [ ] "Join Us" section (Volunteer / Sponsor / Donate cards) intro paragraph + each
      card's blurb
- [ ] Sponsor logos (5 placeholder tiles in "Our Sponsors") — add more/fewer as needed

## events.html
- [x] Dates, venue name, address (info strip + venue section)
- [x] Hour-by-hour schedule — full ritual order/timing for both days, transcribed
      from the schedule flyer, plus the flyer image itself for printing/sharing.
- [ ] Venue description, parking/accessibility notes, and whether the "Free Parking /
      Wheelchair Accessible / Family Friendly" tags are actually accurate for Bodhi
      Meditation Toronto
- [ ] Embedded Google Map (replace the placeholder map block with an `<iframe>`)
- [ ] Food/bhog details if they differ from the placeholder copy

## gallery.html
- [x] 12 of 14 tiles now have real photos: Durga Idol & Pandal, Shankha Dhwani (x2),
      Community Pushpanjali, Kids' Program (crafts), Bhog Serving, Pandal Decoration
      (idol close-up), Vocal Performance, Solo Dance Recital, Classical Dance Duet,
      Kids' Dance Performance, Evening Aarti
- [ ] 2 tiles still placeholder: Dhunuchi Naach, Visarjan — nobody's sent a photo of
      either specific moment yet. To fill one in, follow the pattern used for the
      filled-in tiles: swap the `<div class="ph-image">...</div>` for
      `<img class="gallery-photo" src="images/your-file.jpg" alt="...">`, and add
      `data-lightbox-img="images/your-file.jpg"` on the parent `.gallery-item` so the
      lightbox shows the real photo instead of the placeholder box.
- 3 photos from your last batch weren't used to avoid an overly repetitive gallery
  (a second group-dance shot similar to ones already used, a second crowd-anjali shot
  similar to the existing Community Pushpanjali photo, and a candid indoor shot near
  the vendor stalls): `IMG_6329.CR2`, `IMG_6830.JPG`, `IMG_6814.JPG`. They're still in
  `images/` if you'd like any of them added — just say which.

## Removed
- **Livestream page** — deleted entirely (page, nav/footer links, homepage feature
  card and hero button, and the Durga Pujo page's "Watch Livestream" CTA), along with
  the now-unused `.stream-frame` CSS. If a stream ever happens, it's easier to rebuild
  than to keep a page advertising something that isn't planned. Recoverable from git
  history if you change your mind.
- **"Our Journey So Far" milestones timeline** on About — every entry was an invented
  placeholder year, and the real founding history still isn't documented anywhere.
  Its `.timeline` CSS went with it.
- **YouTube social icon** — it only ever linked to the livestream page; there's no
  actual channel. Add it back if you start one.

## donate.html
- [ ] **Needs a payment processor before the "Donate Online" button can go live.**
      The button is currently disabled (greyed out, non-clickable) on purpose — do not
      just link it to a bare URL. For a Canadian not-for-profit, the usual options are:
      - **CanadaHelps** — handles tax receipts automatically, most common choice for
        Canadian charities/nonprofits
      - **PayPal Donate button** — fastest to set up, no receipting built in
      - **Stripe Payment Links** — modern, flexible, no receipting built in
      Once you've picked one and have an account, send me the donation link/embed code
      and I'll wire up the button and remove the "coming soon" badge.
- [ ] Confirm the "Not-for-Profit #1588370-9" registration number is correct and
      current (pulled from the event flyer)
- [ ] Intro paragraph, "Make a Donation" blurb, and "Where Your Donation Goes" card
      copy are all placeholder
- [ ] The E-Transfer / Sponsor / In-Person alternatives are live now (using your real
      email) — good to go as-is

## contact.html
- [x] Email filled in
- The whole right-hand column is gone at your request — phone, response time,
  venue/mailing address, map placeholder, and finally the email and social links too,
  since those already live in the footer. The page is now just the centred "Send a
  Message" card. Footer phone placeholders were removed site-wide as well, and the
  orphaned `.contact-info-*` CSS went with the column.
- [ ] **Contact form needs its Google Sheet hooked up — one step left.** The form no
      longer uses `mailto:` (that only opened the visitor's own mail client, and often
      did nothing at all, silently losing messages). It now posts submissions to a
      Google Apps Script that appends them as rows in a spreadsheet you own.
      **To finish:** follow the setup steps at the top of `contact-form.gs` — create a
      sheet, paste the script, deploy it as a web app, and send me the `/exec` URL (or
      paste it yourself into `data-endpoint=""` on the form in `contact.html`).
      Until that URL is filled in, the form falls back to opening the visitor's email
      client, so nothing regresses in the meantime. The form also carries a hidden
      honeypot field that silently drops bot submissions.

## Optional polish (not required to launch)
- [ ] Replace Playfair Display / Poppins Google Fonts if you'd prefer different
      typefaces (`css/style.css`, top `@import`)
- [x] Favicon — done, using the real TBCS logo
- [ ] Add Open Graph / social preview image tags once you have hero photography
