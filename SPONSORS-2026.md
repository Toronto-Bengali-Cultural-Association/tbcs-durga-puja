# Sponsors, Durga Pujo 2026

The list the site is built from. `index.html` shows **only** this list.
`donate.html` shows this list first, then every past supporter below it.

Adding or removing a sponsor means editing the strip in **both** pages: there is
no build step and no shared template, so the markup is duplicated by design.
Re-stamp the asset hashes afterwards (see `CONTENT-TODO.md`).

## This year (6)

| Sponsor | What they do | Image |
| --- | --- | --- |
| Chayanika Dutta | Barrister, Solicitor & Notary Public, Scarborough | `images/sponsors-2026/chayanika-dutta.jpg` |
| Arun Ganguly | Realtor, Century 21 Kennect Realty | `images/sponsors-2026/arun-ganguly.jpg` |
| Indranil Ghosh | Realtor, HomeLife Platinum / Team House Finders | `images/sponsors-2026/indranil-ghosh.jpg` |
| Mistaan Catering & Sweets | Bengali sweets and catering, North York | `images/sponsors-2026/mistaan.jpg` |
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
- Source files came in with Facebook's export names (`*_n.jpg`) and are
  gitignored; only the renamed, downscaled copies are committed.

## Not a sponsor

`images/musical-evening-2026.jpg` arrived in the same batch but is a cultural
programme, not a sponsor: **Indian Musical Evening**, 10 October, 8:00 PM, free
entry, with Pournima, Shubhro and Ram. It lives on the Durga Pujo page.
