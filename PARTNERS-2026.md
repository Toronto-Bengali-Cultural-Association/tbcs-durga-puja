# Partners, Durga Pujo 2026

The list the site is built from. `index.html` shows **only** this list.
`donate.html` shows this list first, then every past partner below it.

Called partners rather than sponsors so vendors and stallholders can go in the
same rows. The CSS classes are still named `.sponsor-*`; renaming them would
touch a lot of markup for no visible gain, so the wording and the class names
deliberately differ.

Adding or removing a sponsor means editing the strip in **both** pages: there is
no build step and no shared template, so the markup is duplicated by design.
Re-stamp the asset hashes afterwards (see `CONTENT-TODO.md`).

## This year (6)


| Sponsor | What they do | Image |
| --- | --- | --- |
| Chayanika Dutta | Barrister, Solicitor & Notary Public, Scarborough | `images/sponsors-2026/chayanika-dutta.jpg` |
| Arun Ganguly | Realtor, Century 21 Kennect Realty | `images/sponsors-2026/arun-ganguly.jpg` |
| Indranil Ghosh | Realtor, HomeLife Platinum / Team House Finders | `images/sponsors-2026/indranil-ghosh.jpg` |
| Mistaan Catering & Sweets | Bengali sweets and catering, North York | `images/sponsors-2026/mistaan.jpg` (cropped, see below) |
| FISHCO | **Sweets sponsor** | `images/sponsors-2026/fishco.jpg` |
| The Boxed Decors (Monica Nagpal) | Festive, religious and home decor | `images/sponsors-2026/the-boxed-decors.jpg` |

## Notes

- Four of the six (Dutta, Ganguly, Ghosh, Mistaan) also appear among the past
  supporters in `images/sponsors/`, as plain business banners. The 2026 files are
  the newer "Celebrating Our Sponsors with Gratitude" artwork and are **not**
  duplicates to be deduplicated away: the two strips are deliberately showing
  different years.
- FISHCO and The Boxed Decors are new for 2026.
- FISHCO's artwork names it specifically as the **sweets sponsor**. If sponsorship
  tiers or categories are ever shown on the site, that is the one piece of
  category information the artwork actually states.
- **Mistaan is cropped to the advert itself**, dropping the decorative
  "Celebrating Our Sponsors" frame around it, on request. The other three framed
  files (Dutta, Ganguly, Ghosh) still carry their frames, so the row is not
  visually consistent; crop them the same way if that matters.
- Source files came in with Facebook's export names (`*_n.jpg`) and are
  gitignored; only the renamed, downscaled copies are committed.

## Not a sponsor

`images/musical-evening-2026.jpg` arrived in the same batch but is a cultural
programme, not a sponsor: **Indian Musical Evening**, 10 October, 8:00 PM, free
entry, with Pournima, Shubhro and Ram. It lives on the Durga Pujo page.
