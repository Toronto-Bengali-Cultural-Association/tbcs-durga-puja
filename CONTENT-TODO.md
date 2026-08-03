# Content To-Do — TBCS Durga Puja Website

## Notes on images added so far
- The `images/` folder has your original `.CR2` (Canon RAW) files kept as-is for
  archival purposes, plus web-ready `.jpg` versions I generated from them
  (`gallery-shankha-1.jpg`, `gallery-shankha-2.jpg`, `gallery-community-anjali.jpg`) —
  browsers can't display RAW files directly, so always convert new RAW photos the
  same way before referencing them in HTML.
- The real TBCS logo (Durga-face mandala) is now live as the brand mark in every
  page's header and footer, and as the browser-tab favicon. Source: `images/logo.png`
  (background removed, transparent) and `images/favicon.png` (small version), both
  generated from `images/456426253_..._n.jpg`. If you ever get a higher-res or
  vector (SVG/AI) version of the logo, send it over and I'll regenerate these two
  for extra crispness.

Everything below is a placeholder. Search each file for `[PLACEHOLDER...]` (text)
or the dashed gold boxes labeled "Placeholder" (images) to find every spot listed here.

## Site-wide (appears in the footer of every page)
- [ ] Org description blurb (footer, `about.html` intro)
- [ ] Contact email (footer + `contact.html`)
- [ ] Contact phone (footer + `contact.html`)
- [ ] City/mailing line (footer + `contact.html`)
- [ ] Real social links: Facebook, Instagram, YouTube (footer + `contact.html`)
- [ ] Replace `contact.html` form's `mailto:PLACEHOLDER@example.com` with a real
      address, or better, wire the form to a service like Formspree / Netlify
      Forms so submissions land in an inbox instead of opening the visitor's
      email client.

## index.html (Home)
- [ ] Event date badge + countdown target (`data-countdown="YYYY-MM-DDTHH:mm:ss"` in the hero)
- [ ] Hero description paragraph
- [ ] Info strip: Dates / Venue / Entry values
- [ ] "Why join us" intro paragraph
- [ ] About-teaser photo + paragraph
- [ ] Schedule teaser year in the CTA heading

## about.html
- [ ] Founding story paragraphs (2)
- [ ] Founding member photo
- [ ] Timeline: founding year, first cultural program year, venue-change year, current year copy

## events.html
- [ ] Dates, venue name, address, entry/ticket info (info strip)
- [ ] Full 5-day schedule: actual dates + finalized program details per day
- [ ] Venue description, parking/accessibility notes
- [ ] Embedded Google Map (replace the placeholder map block with an `<iframe>`)
- [ ] Food/bhog details if they differ from the placeholder copy

## gallery.html
- [x] Durga Idol & Pandal, Shankha Dhwani (x2), Community Pushpanjali — real photos added
- [ ] 5 tiles still placeholder: Dhunuchi Naach, Bhog Serving, Pandal Decoration, Kids'
      Program, Visarjan. To add a real photo to any of these, follow the pattern used for
      the filled-in tiles: swap the `<div class="ph-image">...</div>` for
      `<img class="gallery-photo" src="images/your-file.jpg" alt="...">`, and add
      `data-lightbox-img="images/your-file.jpg"` on the parent `.gallery-item` so the
      lightbox shows the real photo instead of the placeholder box.
- [ ] Verify/replace the auto-written captions on the 4 photos already added (in
      `data-lightbox-caption`) if you want more specific wording

## livestream.html
- [ ] Embed the real stream player (YouTube/Facebook Live embed `<iframe>`) in place
      of the `.stream-frame` placeholder once a stream key/link exists
- [ ] Stream date/time in the status badge

## committee.html
- [ ] 8 committee member names + photos (roles are pre-filled, adjust as needed)
- [ ] Sponsor logos (5 placeholder tiles) — add more/fewer as needed

## contact.html
- [ ] Email, phone, address in the info list
- [ ] Confirm/replace the `mailto:` form target (see site-wide note above)
- [ ] Embedded map

## Optional polish (not required to launch)
- [ ] Replace Playfair Display / Poppins Google Fonts if you'd prefer different
      typefaces (`css/style.css`, top `@import`)
- [x] Favicon — done, using the real TBCS logo
- [ ] Add Open Graph / social preview image tags once you have hero photography
