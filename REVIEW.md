# Good Hours review

Draft catalog, October 2026. `draft: true` in settings. No cart. No invented reviews, ratings, customer counts, press logos, awards, or test results.

## Pages

| URL | What it is |
|---|---|
| `/` | Home |
| `/products/` | Products grouped by need, then bundles, accessories, coming soon |
| `/products/recovery-light/` | Recovery Light |
| `/products/percussion-mini/` | Percussion Mini |
| `/products/heated-eye-mask/` | Heated Eye Mask |
| `/bundles/recovery-kit/` | Recovery Kit |
| `/bundles/wind-down-kit/` | Wind-down Kit |
| `/accessories/` | Accessory grid |
| `/compare/` | Spec tables vs typical premium and typical budget |
| `/how-it-works/` | Red light, warmth, percussion |
| `/routines/` | Four routines |
| `/about/` | Why the brand exists |
| `/journal/` | Journal index |
| `/journal/how-to-use-a-handheld-red-light-device/` | How to use a handheld red light device |
| `/journal/massage-gun-101/` | Massage gun 101 |
| `/journal/a-20-minute-wind-down-for-desk-workers/` | 20-minute desk wind-down |
| `/support/` | FAQ groups, manuals note, warranty note |
| `/contact/` | Support email, no form |
| `/shipping/` | Shipping draft |
| `/returns/` | Returns draft |
| `/warranty/` | Warranty draft |
| `/safety/` | Safety draft |
| `/privacy/` | Privacy draft |
| `/terms/` | Terms draft |
| `/404/` | Missing page |

The Back Belt is a coming-soon card on `/products/` only. It has no product page.

## TBD by owner

### Content

- Recovery Light weight and size.
- Recovery Light graphite color name (swatch is on the page, not for sale).
- Recovery Light airline battery note.
- Percussion Mini noise, charge port, in-the-box list, and max time per spot (working note: 2 minutes).
- Heated Eye Mask color name (working note: Black), every number spec, spec chips, in-the-box list, charge steps, and control details.
- Back Belt color, in-the-box list, and weight. No price is shown.
- Extra Massage Heads: what is in the spare set.
- Compare tables: premium and budget columns, and the "checked on" date (working note: October 2026). Recovery Light price in the compare table is marked TBD even though the product page shows $249.
- Journal and how-it-works pages repeat the open 2-minute percussion note.

### Design

- Logo mark. Draft mode shows a TBD tag on the half-sun. It is a placeholder drawing, not a finished mark.
- Every photo. Shot notes are on the placeholders (and under the one stand-in graphic). See the shot list below.
- The Recovery Light front image is a generated stand-in (charcoal field, simple device shape), not a photograph. Replace the file `src/assets/images/recovery-light-front.png`.

### Business

- Domain is `goodhoursrecovery.com` in settings. It is not confirmed. Canonical links use that value. It is not typed into page components.
- Support email `support@goodhoursrecovery.com` is a working address, not confirmed.
- Response time: 1 business day.
- Working prices: Recovery Light $249 (range was 249 to 299), Percussion Mini $199 (199 to 229), Heated Eye Mask $119 (99 to 129), Recovery Kit $399, Wind-down Kit $329.
- Accessory prices: Desk Stand $29, Travel Case $25, Extra Massage Heads $19, Spare Goggles $12. These are working numbers.
- Trust strip: free US shipping, 1 to 2 business days, 30-day returns, 1-year warranty.
- Every buy link is empty, so every button says Coming soon.
- Back Belt has no price.

### Legal

- Shipping, returns, warranty, safety, privacy, and terms are drafts. The policy banner says "DRAFT: needs review." while draft mode is on.
- Warranty length, return window, who pays return shipping, refund timing, exclusions, and what happens after the year.
- Privacy: future checkout data, analytics, how long email is kept, and who would receive a shipping address.
- Terms: live checkout price, liability limit, which US state law applies, and a real review date.
- The footer uses the legal name. Policy pages say Good Hours, not the legal name, because the brief keeps the legal name in the footer only. A lawyer may want the legal name in the policies.

## Photo shot list

Recovery Light

- Device front on dark stone, soft evening light (a stand-in graphic is in this slot today)
- Man 40s on sofa, device on forearm, red glow, warm lamp
- Device in hand over walnut desk
- Device on dock, bedside table

Percussion Mini

- Massage gun on dark stone, warm lamp, hand nearby for scale
- Man 40s on a sofa, device on the calf, evening lamp
- Head attachment on walnut, evening light
- Open case on a hotel desk, carry-on in the background

Heated Eye Mask

- Mask on linen, warm lamp, bedside table
- Woman 40s on a sofa, mask on, warm lamp, evening
- Mask tucked in a carry-on, hotel room, evening light

Back Belt

- Belt laid flat on dark stone, red glow, evening lamp
- Man 50s at a home desk, belt at the lower back, warm lamp

Kits

- Recovery Light and Percussion Mini together on walnut, warm lamp, red glow
- Both devices in an open carry-on, hotel room, evening
- Recovery Light and eye mask on a bedside table, warm lamp, evening
- Both wind-down pieces in a carry-on, hotel room, evening light

Accessories

- Stand on a walnut desk, evening lamp, Recovery Light upright, red glow
- Open case in a hotel room, both devices inside, warm lamp
- Five heads lined up on dark stone, evening light, hand for scale
- Goggles on linen beside the Recovery Light, warm lamp

Home and journal

- Three devices on walnut, warm lamp, red glow, evening
- Device in hand over walnut desk, warm lamp, red glow, evening (journal)
- Massage gun on dark stone, warm lamp, hand nearby for scale (journal)
- Sofa, warm lamp, red glow from a handheld light, eye mask on the cushion, evening

## Decisions made while building

- Astro 7.3.8, the current stable release, with `output: 'static'` and `trailingSlash: 'always'`. Node 22.
- Astro cannot serve two different dynamic routes that share the same URL shape, so `src/pages/[page].astro` renders both the marketing pages and the policies. The template adds the draft banner only on policies.
- Compare rows live in `src/content/compare.yaml` so they can be edited. The brief's content model did not name that file.
- `responseTime` was added to settings for the contact page. FAQ file also has `manuals` and `warrantyNote` for the support page.
- Accessories have `alt` and `shot` next to `image`, because every image needs both.
- Coming-soon Back Belt has no price field filled in. The card says "Price later" and "Coming soon".
- Image paths from the editor (`/src/assets/images/...`) are turned into paths Astro's `image()` helper can load. A missing file falls back to the placeholder.
- `robots.txt` is generated from the draft flag at build time, so it is not a stale file in `public/`.
- "You save $X" is calculated from product prices minus the kit price. It is not stored.
- Header links: Red Light, Massage, and Sleep go to the first active product in that category. Bundles goes to `/products/#bundles`.
- The legal name appears only in the footer.
- No founder name, no origin story with dates, no reviews.
- Sveltia CMS is pinned to 0.241.0 from the CDN. Backend repo `goodhours/site` is a placeholder. Local mode does not connect to GitHub.
- The editor was opened in Chrome, pointed at this folder, and used to save Percussion Mini. That save rewrote empty image fields as `image: ''`. The build still passes. The tagline was put back to the brief's line after that test.
- Home routine cards and the routines page are edited separately. Keep them in step by hand.
- A buy link, when one exists, labels the button "Buy".
