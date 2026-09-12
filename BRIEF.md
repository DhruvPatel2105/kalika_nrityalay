# Kalika Nrityalay — Website Build Brief

**For: Claude Code. Save this as `BRIEF.md` in the repo root and keep it as the source of truth.**

---

## 1. What this is

A marketing website for **Kalika Nrityalay**, a Bharatanatyam school in Vastral, Ahmedabad, India, founded July 2021. It has ~50 in-person students and currently exists only as an Instagram account.

The school is launching live online classes for children in the USA and Canada. This site is the conversion surface for that launch.

**The site has exactly one job: get a parent to book a free trial class.**

Every design and engineering decision defers to that. If something looks impressive but delays the booking, cut it.

### The person you are designing for

A 32–45 year old Indian-origin mother in Edison NJ, Naperville IL, Sugar Land TX, Brampton ON or Fremont CA. She arrived from a WhatsApp group forward or an Instagram link. She is on an iPhone, on cellular, with about 40 seconds of patience. She wants her daughter to learn classical dance and she is trying to work out, quickly, whether this teacher in India is the real thing.

She is also, frequently, trained in Bharatanatyam herself. She will notice wrong technique instantly.

### Hard capacity constraint

Binni Patel teaches alone. Her weekday evenings are full with local students. The only viable North America slots are **Saturday and Sunday evenings IST = Saturday and Sunday mornings ET/PT**. Maximum capacity is **4–6 batches of 6–8 students, so 25–30 online students total.**

This is a feature, not a limitation. The site should say so. Small batches are the premium positioning.

---

## 2. Non-negotiables

### Performance budget (mobile, 4G, mid-range Android)

| Metric | Budget |
|---|---|
| Lighthouse Performance | ≥ 92 |
| Largest Contentful Paint | < 2.0s |
| Cumulative Layout Shift | < 0.05 |
| Total JS shipped, mobile | < 60KB gzipped |
| Total page weight, home | < 800KB |

Run Lighthouse on mobile throttling before declaring any page done. If the budget is blown, cut the effect, not the content.

### Honesty constraints — these are not optional

- **Do NOT claim arangetram graduates.** The school is five years old; arangetram takes 7–10 years. There are none yet. Position on foundation training instead.
- **Do NOT use AI-generated images of dancers.** A trained parent spots a malformed hasta or a missing aramandi in under a second, and concludes the school has no real dancers. Only real photography.
- **Do NOT invent testimonials, student counts, or awards.**
- **Do NOT fabricate review scores or star ratings.** Google reviews are being set up separately; leave a slot and wire it later.

---

## 3. Stack

- **Astro 5** — static output, zero JS by default
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Vanilla TS islands** only where interaction is genuinely required. No React unless a component demands it.
- `astro:assets` for all images — AVIF + WebP with fallback, explicit width/height on everything
- **Deploy:** Netlify or Vercel, static adapter
- **Forms:** Netlify Forms or Formspree. No backend.
- **Fonts:** self-hosted woff2, `font-display: swap`, subset to Latin. Never Google Fonts CDN.

### Islands you actually need

1. Timezone converter (section 7) — the only non-trivial one
2. Mobile navigation
3. Hero parallax (~3KB, desktop only)
4. FAQ accordion (use native `<details>`; no JS at all)

That's it.

---

## 4. Design direction

### Palette

Derived from the school's existing maroon-and-gold identity. Maroon-dominant, not cream-dominant.

```
--ink            #1A1210   /* body text on light surfaces */
--oxblood        #4A0D18   /* primary surface — the brand colour */
--oxblood-deep   #2E0810   /* section depth, footers */
--gold           #C9A227   /* metallic gold, NOT yellow */
--gold-light     #E3C766   /* highlights, hairlines, hover */
--sandalwood     #EFE3D0   /* warm light surface */
--peacock        #1F4A44   /* secondary — reserved for the Ahmedabad/local path */
```

The peacock green does real work: it visually separates the local in-person track from the international online track, so the two audiences never get confused about which page they're on.

**Contrast check required.** Gold `#C9A227` on oxblood `#4A0D18` is roughly 4.7:1 — acceptable for large display type, **not** for body copy. Body text on oxblood must be `--sandalwood`. Verify every pairing against WCAG AA before shipping.

### Typography

- **Display: Marcellus.** Inscriptional Roman letterforms with a carved-stone quality that suits temple architecture. Used for headings, the wordmark, and pull quotes.
- **Body: Karla.** A grotesque with a generous x-height that stays legible at 16px on a phone. Deliberately not Inter.

Set a scale: 1.250 (major third) on mobile, 1.333 (perfect fourth) from `md` up. Body copy at 17px, line-height 1.65, max measure 68 characters.

If Gujarati or Devanagari is added later, pair with Noto Serif Gujarati.

### Layout concept — the torana

The structural device is the **torana**, the temple archway, which already appears in the school's Instagram creative. Sections are framed by arches rather than chopped into identical rounded cards.

```
┌──────────────────────────────────────┐
│   ╭────────────────────────────╮     │  Arch frames the hero.
│   │                            │     │  Photo sits INSIDE the arch,
│   │   [ Binni, in aramandi ]   │     │  gold hairline on the arch edge.
│   │                            │     │
│   │   Learn Bharatanatyam      │     │  Headline left-aligned,
│   │   from Ahmedabad.          │     │  optically inside the arch.
│   │                            │     │
│   │   [I'm in USA/Canada]      │     │  Two doors. Not one CTA —
│   │   [I'm in Ahmedabad]       │     │  two audiences, two paths.
│   ╰────────────────────────────╯     │
└──────────────────────────────────────┘
```

Alignment is left throughout for body content. Centre only the wordmark and section openers. Never justify.

Use the jaali (lattice screen) as a low-opacity SVG texture on oxblood sections — at 3–5% opacity, it should read as material, not pattern.

### The one bold moment

**The aramandi geometry overlay.** This is where the design spends its boldness. Nothing else on the site should compete with it.

Pandanallur bani is distinguished by its emphasis on linear geometry. So: over the hero photograph of Binni in aramandi, animate thin gold SVG lines that trace the geometry her posture creates — the triangle formed by her turned-out thighs, the horizontal of her shoulders, the diamond of the arms in natyarambhe.

- Pure SVG `stroke-dasharray` / `stroke-dashoffset` path animation
- Draws once on load over ~1.8s, easing out, then holds at 40% opacity
- Small caption fades in beneath: *"Pandanallur bani — geometry you can see."*
- Must be authored against the **actual final photograph**. Until it exists, ship a static SVG placeholder at the correct aspect ratio and leave a `TODO` comment.
- Respects `prefers-reduced-motion`: draw instantly, no animation.

This teaches a parent something true about the school's lineage in three seconds. That is the whole point.

### Explicitly avoid

- Cream background + high-contrast serif + terracotta accent. That combination is the current generated-page signature.
- Identical rounded cards with the same soft grey shadow under each.
- Tracked-out ALL-CAPS eyebrow labels above headings.
- `01 / 02 / 03` numbered markers, unless the content really is a sequence. The curriculum levels genuinely are — use them there and nowhere else.
- `→` appended to button text.
- Saffron-orange. It reads as generic "Indian restaurant" and clashes with the oxblood.

---

## 5. Motion and depth spec

The brief calls for a three-dimensional feeling. Deliver it with depth cues, not WebGL.

**Hero parallax.** Four layers moving at different rates on scroll and on mouse position:

```
Layer 0  temple wall texture, blurred      translateZ(-600px) scale(1.6)
Layer 1  arch frame, gold hairline         translateZ(-300px) scale(1.3)
Layer 2  Binni, cut out, sharp             translateZ(0)
Layer 3  geometry overlay + foreground     translateZ(120px) scale(0.94)
```

Use CSS `perspective` on the container and real `transform3d` on layers. Drive mouse tracking with a single `requestAnimationFrame` loop and a lerp factor of about 0.08 so it feels weighted, not twitchy. Disable entirely below 768px and under `prefers-reduced-motion` — on mobile, ship the static composed image.

**Card depth.** Class and curriculum cards get `perspective: 1000px` with a subtle `rotateX/rotateY` tilt toward the cursor, maximum 4 degrees. Pointer devices only.

**Orchestrated entrance.** One page-load sequence on the hero — arch draws, photo fades, geometry traces, headline rises. Then stop. Do not add fade-and-slide-up entrances to every section on scroll; that is the generic default and it reads as generated.

**If WebGL is demanded later**, the escape hatch is a lazy-loaded Three.js island, `client:media="(min-width: 1024px)"`, dynamically imported after LCP, with the static hero as fallback. Document it; do not build it now.

---

## 6. Sitemap and content

Six pages. Real copy below — use it, don't rewrite it into marketing filler.

### `/` Home

**Hero**
> # Learn Bharatanatyam from Ahmedabad.
> Live weekend classes for children in the USA and Canada, taught by a Master's-qualified guru in the Pandanallur tradition.
>
> `[Book a free trial class]` `[I'm in Ahmedabad — see local classes]`

**The credibility band** — immediately under the hero, because this is the question she is actually asking:

> **Alankar, with distinction** — the Master's-equivalent certification in Bharatanatyam
> **Pandanallur bani** — trained under Guru Ananth Menon
> **Mudra School, est. 1973** — one of Gujarat's oldest classical dance institutions
> **50 students** learning in Vastral, Ahmedabad since 2021

**Why a teacher in India**
Three points, in the torana frame, not cards:
1. *Small batches.* Six to eight students. Binni teaches every class herself — there are no assistant teachers and no recorded-video "courses."
2. *A real lineage.* Pandanallur is the tradition Kalakshetra itself was derived from. Most North American schools teach Kalakshetra style; this is the older root.
3. *Saturday and Sunday mornings, your time.* No weeknight scramble after school.

**Schedule preview** — the timezone converter (section 7)

**The honest section.** Give this a real heading and real prominence:
> ### What we don't offer yet
> Kalika Nrityalay opened in July 2021. Bharatanatyam arangetram takes seven to ten years of training, so we have no arangetram graduates — and we won't pretend otherwise. What we do is build the foundation correctly: adavus, aramandi, hasta, and the theory underneath them, taught the way Binni was taught. If your daughter starts here at seven, she will be ready when the time comes.

This section will outperform every other on the page. Trust it.

**Trial CTA**

### `/guru` — Binni Patel

The lineage story, in full. Trained at Mudra School of Indian Classical Dances, Ahmedabad, founded 1973 by Gurus Shri Bhaskar Menon and Smt. Radha Bhaskar Menon, which teaches Bharatanatyam in the Pandanallur style and has trained roughly 16,000 students. Her direct guru was **Ananth Menon**. She completed **Alankar with distinction in June 2021** and opened Kalika Nrityalay the following month.

Include a plain-English credential explainer, because "Alankar" means nothing to a parent in New Jersey:

> **What is Alankar?**
> Indian classical dance uses a graded examination system. Students progress through Prarambhik, Praveshika, Madhyama, and Visharad — which is equivalent to a bachelor's degree and typically takes seven years — before reaching Alankar, the post-graduate or Master's-equivalent level. Binni holds Alankar with distinction.

> ⚠️ **TODO (client to confirm):** the exact awarding body. Research strongly indicates **Bruhad Gujarat Sangeet Samiti**, the Gujarat state examination board Mudra's students sit exams with. Put the name in `src/content/site.ts` as a single variable so it can be corrected in one place. Do not hardcode it in copy.

### `/classes` — Online for USA & Canada

Batch structure, what a class looks like, what's needed at home (a 2m × 2m clear floor, a laptop or tablet, no mirror required). Zoom, with sessions recorded so a missed class can be caught up.

**Safeguarding block** — most India-based competitors omit this, and diaspora parents look for it:
> Classes are recorded. A parent is welcome in the room at any time. Binni communicates with parents, never directly with students under 18.

### `/curriculum`

The graded path — this content genuinely is a sequence, so numbered markers are appropriate here and only here. Year one: aramandi, the first adavus, the hastas, basic theory.

### `/fees`

**Launch pricing — $110/month**, two group classes per week, batches of six to eight.
**Quarterly: $297** (pay for three months, save 10%).
First trial class free. No registration fee.

> ⚠️ Put price in `src/content/site.ts`. It will change — the plan is to raise toward $150 once a waitlist forms. One variable, one edit.

Separate, visually distinct (peacock) block for Vastral in-person pricing in ₹.

### `/trial` — the conversion page

Single-purpose. No navigation distractions. Form fields, parent-only:

- Parent's name *(required)*
- Email *(required)*
- WhatsApp number with country code *(required)*
- Child's age *(required — a number, not a birthdate)*
- City and country *(required, drives timezone)*
- Any previous dance training? *(optional, free text)*
- Preferred slot *(pre-filled from the timezone converter)*

**Collect no personal information about the child beyond age.** Not their name, not their photo, not their school. This keeps you well clear of COPPA's verifiable-parental-consent machinery and PIPEDA exposure, and it is the right thing to do regardless. *(Background reasoning, not legal advice — the client should have counsel review before launch.)*

On submit: a real confirmation page explaining that Binni will reply on WhatsApp within 24 hours, plus a WhatsApp deep link as a parallel path. Many parents will skip the form entirely and just message.

---

## 7. The timezone converter — build this well

This is the single most useful feature on the site and no competitor does it properly.

- Detect the visitor's zone with `Intl.DateTimeFormat().resolvedOptions().timeZone`
- Render every class slot in **their** local time, with the IST equivalent shown quietly beneath
- A manual override select for anyone on a VPN or planning for a relative
- Show the day explicitly — a Sunday evening IST class is Sunday morning ET, and parents get this wrong constantly
- Must render server-side with IST as the default so there is **no layout shift** when the client script upgrades it

Example output:

> **Batch A — Beginners, ages 6–9**
> Saturdays, 9:00–10:00 AM Eastern *(Saturday 6:30 PM IST)*
> Sundays, 9:00–10:00 AM Eastern *(Sunday 6:30 PM IST)*
> 3 seats remaining

Slot data lives in `src/content/schedule.ts` as IST times. Convert at render. Never store local times.

---

## 8. Content system — photos arrive in ~2 weeks

The client is shooting real photography in two weeks. **Build the entire site now against a config layer so the photos drop in without touching a single component.**

```
src/content/
  site.ts        # name, contact, WhatsApp, price, credential body name
  schedule.ts    # batches, IST times, seats
  faq.ts
  images.ts      # every image slot: path, alt text, aspect ratio, focal point
```

Until real photos exist, render a labelled placeholder at the exact final aspect ratio showing the slot name and required dimensions — `hero-binni-aramandi · 4:5 · 1200×1500`. Never ship a stock photo or an AI-generated dancer, not even temporarily. A visible placeholder is honest; a fake dancer is not.

Write real alt text for every slot now, in `images.ts`.

---

## 9. WhatsApp preview — treat as a primary asset

Acquisition runs through WhatsApp group forwards. The link preview will be seen more often than the homepage.

- Custom `og:image` at 1200×630 for every page
- The home OG image must contain **Binni's real face**, the school name, and "Live classes for USA & Canada" — legible at thumbnail size
- `og:title` under 60 characters, `og:description` under 110 — WhatsApp truncates aggressively
- Test the actual rendering in WhatsApp before launch, not just a validator

---

## 10. SEO and schema

JSON-LD, hand-written:

- `LocalBusiness` / `DanceSchool` for the Vastral location — name, address, geo, hours, `sameAs` the Instagram. **Must match the Google Business Profile exactly**, character for character.
- `Person` for Binni Patel with `alumniOf` Mudra School and `hasCredential`
- `Course` for each batch with `courseMode: "online"`
- `FAQPage` on the FAQ

Title tags target both intents: Ahmedabad local searches and "online bharatanatyam classes for kids" from North America. Do not stuff both into one tag — split by page.

Ship `sitemap.xml`, `robots.txt`, and canonical tags.

---

## 11. Acceptance criteria

- [ ] Lighthouse mobile ≥ 92 performance, 100 accessibility, 100 SEO on every page
- [ ] Total JS on `/` under 60KB gzipped
- [ ] Every interactive element reachable by keyboard with a visible focus ring
- [ ] All motion disabled under `prefers-reduced-motion`
- [ ] Every text/background pairing passes WCAG AA
- [ ] Renders correctly at 320px width
- [ ] Zero layout shift when the timezone island hydrates
- [ ] No image without explicit dimensions and real alt text
- [ ] Every changeable fact lives in `src/content/` — price, schedule, credential body, contact
- [ ] WhatsApp link preview verified on a real device

---

## 12. Build order

1. Astro scaffold, tokens, type scale, content config layer
2. Static hero with placeholder, arch component, full responsive layout
3. All six pages with real copy and placeholder images
4. Timezone converter with SSR fallback
5. Forms, confirmation page, WhatsApp deep links
6. Schema, OG images, sitemap
7. Parallax and geometry overlay — **last**, and only if the performance budget still has room
8. Lighthouse pass, then drop in real photography

---

## Appendix — photo shot list

Give this to whoever is shooting. Vertical, natural light, plain wall, phone in portrait mode is fine.

**Essential**
1. **Binni in full aramandi, full body, front on.** The hero. Sharp, even light, plenty of space around her, shot against a plain wall so she can be cut out cleanly. Correct aramandi is non-negotiable — this image carries the entire site's credibility.
2. Binni's face, three-quarter, warm, looking at camera. Not performing. For the OG image and the guru page.
3. Hands only, a single clean hasta, close crop.
4. Feet in the first adavu position, close crop, salangai visible.
5. Binni teaching — mid-correction, looking at a student, caught rather than posed.

**Strong to have**
6. Wide shot of the Vastral studio with students in a row, all in aramandi.
7. Three or four students mid-adavu, from behind, faces not identifiable — sidesteps every consent problem while showing a real class.
8. Detail shots: salangai on the floor, the diya, the studio doorway.

**Consent:** written permission from every family whose child is identifiable. Prefer shot 7's framing where possible.

**Do not shoot:** anything static and posed in costume against a backdrop. That reads as a school photograph. You want the work, not the recital.
