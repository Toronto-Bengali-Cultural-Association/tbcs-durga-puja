# Content To-Do — TBCS Durga Puja Website

## Notes on images added so far
- The `images/` folder has your original `.CR2` (Canon RAW) files kept as-is for
  archival purposes, plus web-ready `.jpg` versions I generated from them
  (`gallery-shankha-1.jpg`, `gallery-shankha-2.jpg`, `gallery-community-anjali.jpg`,
  `gallery-kids-program.jpg`) — browsers can't display RAW files directly, so always
  convert new RAW photos the same way before referencing them in HTML.
- The real TBCS logo (Durga-face mandala) is live as the brand mark in every page's
  header and footer, and as the browser-tab favicon. Source: `images/logo.png`
  (background removed, transparent) and `images/favicon.png` (small version), both
  generated from `images/456426253_..._n.jpg`. If you ever get a higher-res or
  vector (SVG/AI) version of the logo, send it over and I'll regenerate these two
  for extra crispness. Note: your event flyer also shows a second "TBCS" tree-style
  logo — let me know if that one should replace/accompany the Durga-face mark anywhere.

## Confirmed real info (from the event flyer)
- **Dates**: October 10–11, 2026 (Saturday–Sunday), 8:00 AM – 11:00 PM both days
- **Venue**: Bodhi Meditation Toronto, 180 Yorkland Blvd, North York, ON M2J 1R5
- **Email**: tbcscanada@gmail.com
- This is now filled in across the homepage, Durga Puja page, contact page, and every
  page's footer.

Everything below is still a placeholder. Search each file for `[PLACEHOLDER...]` (text)
or the dashed gold boxes labeled "Placeholder" (images) to find every spot listed here.

## Site-wide (footer of every page)
- [x] Contact email — tbcscanada@gmail.com
- [x] City — North York, ON
- [ ] Contact phone number
- [ ] Org description blurb (footer, `about.html` intro)
- [ ] Real social links: Facebook, Instagram, YouTube (footer + `contact.html`)
- [x] `contact.html` form now submits to `mailto:tbcscanada@gmail.com` — still opens
      the visitor's email client rather than sending silently. For real inbox
      delivery without a backend, consider wiring it to Formspree / Netlify Forms.

## index.html (Home)
- [x] Event dates, countdown target, venue, city — filled from the flyer
- [ ] Entry / ticket info (not on the flyer — need price or "free" confirmation)
- [ ] Hero description paragraph could be reworded once you confirm more program details
- [ ] "Why join us" intro paragraph
- [ ] About-teaser photo + paragraph

## about.html
- [ ] Founding story paragraphs (2)
- [ ] Founding member photo
- [ ] Timeline: founding year, first cultural program year, venue-change year, current year copy

## events.html
- [x] Dates, venue name, address (info strip + venue section)
- [ ] Entry/ticket info
- [ ] Hour-by-hour schedule — the timeline now shows two day-blocks (Sat Oct 10,
      Sun Oct 11) with the confirmed 8 AM–11 PM window, but the specific ritual
      order/timing within each day is still marked "to be announced." Fill in once
      the committee finalizes the program.
- [ ] Venue description, parking/accessibility notes, and whether the "Free Parking /
      Wheelchair Accessible / Family Friendly" tags are actually accurate for Bodhi
      Meditation Toronto
- [ ] Embedded Google Map (replace the placeholder map block with an `<iframe>`)
- [ ] Food/bhog details if they differ from the placeholder copy

## gallery.html
- [x] 5 of 9 tiles now have real photos: Durga Idol & Pandal, Shankha Dhwani (x2),
      Community Pushpanjali, Kids' Program
- [ ] 4 tiles still placeholder: Dhunuchi Naach, Bhog Serving, Pandal Decoration,
      Visarjan. To add a real photo to any of these, follow the pattern used for
      the filled-in tiles: swap the `<div class="ph-image">...</div>` for
      `<img class="gallery-photo" src="images/your-file.jpg" alt="...">`, and add
      `data-lightbox-img="images/your-file.jpg"` on the parent `.gallery-item` so the
      lightbox shows the real photo instead of the placeholder box.

## livestream.html
- [x] Stream start date (October 10, 2026)
- [ ] Embed the real stream player (YouTube/Facebook Live embed `<iframe>`) in place
      of the `.stream-frame` placeholder once a stream key/link exists

## committee.html
- [x] Year updated to 2026
- [ ] 8 committee member names + photos (roles are pre-filled, adjust as needed)
- [ ] Sponsor logos (5 placeholder tiles) — add more/fewer as needed

## contact.html
- [x] Email and venue/mailing address filled in
- [ ] Phone number
- [ ] Embedded map

## Optional polish (not required to launch)
- [ ] Replace Playfair Display / Poppins Google Fonts if you'd prefer different
      typefaces (`css/style.css`, top `@import`)
- [x] Favicon — done, using the real TBCS logo
- [ ] Add Open Graph / social preview image tags once you have hero photography
