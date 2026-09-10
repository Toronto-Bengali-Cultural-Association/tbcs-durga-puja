# Content To-Do — TBCS Durga Pujo Website

## Status: no placeholders left on the site
Every `[PLACEHOLDER]` marker and dashed placeholder box is gone. What remains below is
either already done (kept as a record of where things came from) or a judgement call
only the committee can make.

### Worth confirming before you promote the site widely
- **The venue tags "Free Parking", "Wheelchair Accessible", "Family Friendly"** on the
  Durga Pujo page are still unverified. These are promises to visitors, and getting
  step-free access or parking wrong can strand someone on the day. Confirm with Bodhi
  Meditation, or say the word and I will remove them.
- **Sponsorship tiers** under Become a Sponsor describe the benefits but not what each
  tier costs or includes. Send me the details and I will list them.
- **The sponsor row is past supporters**, honestly labelled as such. Prune it once the
  2026 list is settled.

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
  image itself was later removed, since it reads "PUJA" and clashed with the renamed
  copy; the text schedule carries the same information and is searchable.

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

## Sponsor row
The banners do not auto-scroll, by choice. They are browsed with the arrows, by
dragging, or by swiping, and clicking one opens it full size. This also sidesteps
`prefers-reduced-motion`: an auto-scrolling row is exactly the motion that setting
suppresses, so anyone with it enabled saw a frozen row while everyone else saw it
drift — the same row now behaves identically for everybody.

## Asset cache-busting (read before editing css/style.css or js/main.js)
Every page loads `css/style.css?v=<hash>` and `js/main.js?v=<hash>`, where the hash is
the file's md5. GitHub Pages caches HTML for 10 minutes, so without this a visitor can
end up with yesterday's HTML and today's JavaScript — which is what made the sponsor
row sit still and its arrows do nothing: the new script looked for markup the cached
page did not have, gave up, and left the buttons dead. Versioned URLs mean stale HTML
keeps asking for the assets it was built against, so the page stays self-consistent.

**After changing either file, re-stamp the pages:**
```
python3 - <<'EOF'
import hashlib, re, glob
sig = lambda p: hashlib.md5(open(p,'rb').read()).hexdigest()[:8]
css, js = sig('css/style.css'), sig('js/main.js')
for f in glob.glob("*.html"):
    s = open(f).read()
    s = re.sub(r'href="css/style\.css(\?v=[0-9a-f]+)?"', f'href="css/style.css?v={css}"', s)
    s = re.sub(r'src="js/main\.js(\?v=[0-9a-f]+)?"', f'src="js/main.js?v={js}"', s)
    open(f, "w").write(s)
EOF
```

## House style
No em dashes in visitor-facing copy. They read as machine-written, so sentences are
split or re-punctuated instead. This covers page text, headings, meta descriptions
(which show in search results) and the strings the contact form prints. En dashes in
date ranges like Oct 10-11 are fine.

## Site-wide (footer of every page)
- [x] Contact email — tbcscanada@gmail.com
- [x] City — North York, ON
- [x] Org description blurb (footer + `about.html` intro) — from the real mission statement
- [x] Real social links — Facebook group, Instagram, and the YouTube channel, live in
      every page's footer.
- [x] `contact.html` form posts to the Google Apps Script web app, which emails the
      committee. Field names must match what the script reads (`fullName`, `email`,
      `subject`, `message`) — `e.parameter` is case-sensitive.

## index.html (Home)
- [x] Event dates, countdown target, venue, city — filled from the flyer
- [x] All homepage copy is real; the Our Story teaser has a photo of the pandal idol.
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

## events.html (Durga Pujo page)
- [x] Dates, venue name, address (info strip + venue section)
- [x] Hour-by-hour schedule — full ritual order/timing for both days, transcribed
      from the schedule flyer, plus the flyer image itself for printing/sharing.
- [x] Embedded Google Map — real Maps embed pinned on the venue, using the keyless
      `?output=embed` form so there's no API key to manage. "Get Directions" now opens
      Maps routing instead of pointing at the contact page.
- [x] Venue description — replaced with just the address, since the map now answers
      "where is it". Worth adding a sentence only if you have facts the map can't show:
      which entrance to use, transit directions, where to actually park.
- [ ] **Verify the "Free Parking / Wheelchair Accessible / Family Friendly" tags.**
      These are promises to visitors and nobody has confirmed them. Getting parking or
      step-free access wrong is the kind of thing that strands someone on the day.
- [x] Sponsors section moved here from About (`events.html#sponsors`); the donate page's
      "sponsors page" link follows it.
- [ ] Food/bhog details if they differ from the placeholder copy

## gallery.html
- [x] 15 of 17 tiles now have real photos (three added from the newest RAW batch:
      a second pandal idol, a child sounding the shankha, and the TBCS stage backdrop): Durga Idol & Pandal, Shankha Dhwani (x2),
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

## donate.html — now the "Get Involved" page
- [x] Restructured: Donate first (e-transfer / sponsor / in-person as the main routes,
      with online card payments marked coming soon), then Where Your Donation Goes,
      Become a Sponsor, the sponsor banner slideshow, and Become a Volunteer.
      The "Questions? / Contact Us" section was removed.
- [x] 32 sponsor banners in `images/sponsors/`, pulled from **both** decks. The PPTX
      gave 21; the PDF held 13 more (one later dropped) that the PPTX did not have, so the
      two exports are largely different sponsor sets — only 4 banners appear in both.
      In each case the artwork was taken from images that appear on a single
      slide/page (the ones repeated across every page are the orange frame, drums,
      seal and tier ribbon), so no cropping was needed. Source decks are gitignored.
- These are **previous** years' supporters, not confirmed 2026 ones, so the section
  is headed "In Good Company" and says so — presenting them as current sponsors would
  misrepresent businesses that have not signed on for 2026, and several banners carry
  2024/2025 dates. Re-word once this year's list is settled.
- The Durga Pujo page's placeholder sponsor tiles were removed; this row replaces them.
- Duplicates left as-is on purpose: a few businesses appear twice with different
  artwork from the two decks. Confirmed fine to keep both.
- Dropped: the "Durga Puja 2024 / Bhajans by Mala Gandhi" event poster (a poster, not
  a sponsor ad) and the duplicate Arun Ganguly banner, keeping the version without the
  large green rebate band. 32 banners remain.
- [ ] **Sponsorship tiers.** The deck has Gold / Silver / Bronze but nothing says what
      each includes or costs — tell me and I'll list them under Become a Sponsor.
- [ ] Some banners are from past years (one reads "Durga Puja 2025"). Confirm which
      sponsors are current for 2026 and I'll drop the rest.
- [ ] The Durga Pujo page still has `#sponsors` with 5 dashed placeholder tiles. Now
      that real banners exist here, that section is redundant — say the word and I'll
      remove it or point it at this page.
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
- [x] **Contact form is live**, posting to the Apps Script web app at the `/exec` URL
      in `data-endpoint` on the form. The visitor gets a confirmation message.
- [ ] **Switch the script to email instead of the sheet.** `contact-form.gs` now holds
      an email version — paste it over your Code.gs, then Deploy -> Manage deployments
      -> pencil -> Version: **New version** -> Deploy. Saving alone does nothing; the
      web app keeps running the old code until a new version is published. The `/exec`
      URL is unchanged, so the website needs no edit.
      It also fixes two things in the current script: the honeypot is now checked
      server-side (bots posting straight to `/exec` skip the browser check), and it
      uses `getSheetByName` rather than `getActiveSheet`, which follows whichever tab
      is selected and can start writing to the wrong one.
- [ ] Delete the leftover test rows in the sheet (they say TEST or VERIFY).

## Optional polish (not required to launch)
- [ ] Replace Playfair Display / Poppins Google Fonts if you'd prefer different
      typefaces (`css/style.css`, top `@import`)
- [x] Favicon — done, using the real TBCS logo
- [ ] Add Open Graph / social preview image tags once you have hero photography
