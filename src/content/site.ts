/**
 * Every changeable fact about the school lives here — price, contact
 * details, credential body, address. Nothing below should be hardcoded
 * into a component or page. See BRIEF.md section 8.
 */

export const site = {
  name: "Kalika Nrityalay",
  founded: {
    month: "July",
    year: 2021,
  },
  location: {
    area: "Vastral",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    // TODO(client): full street address + geo coordinates for the
    // LocalBusiness/DanceSchool JSON-LD. Must match the Google Business
    // Profile character-for-character once that's set up (section 10).
    streetAddress: "",
    postalCode: "",
    geo: { lat: null as number | null, lng: null as number | null },
  },

  // TODO(domain): placeholder until the real domain is registered.
  // Update astro.config.mjs `site` alongside this.
  domain: "https://kalikanrityalay.com",

  contact: {
    whatsapp: {
      // E.164-ish display format; used for both the tel/wa.me link and
      // on-page display.
      display: "+91 84018 19514",
      // wa.me deep links require digits only, no leading +.
      digitsOnly: "918401819514",
    },
    instagram: "https://www.instagram.com/kalika_nrityalay/",
    // TODO(client): confirm a general enquiries email if one should be
    // published; the trial form is the primary conversion path.
    email: "",
  },

  guru: {
    name: "Binni Patel",
    lineage: "Pandanallur bani",
    trainedUnder: "Ananth Menon",
    credential: "Alankar with distinction",
    credentialAwardedMonth: "June",
    credentialAwardedYear: 2021,
    // Research strongly indicates this is correct, but the client has not
    // confirmed it. Keep as a single variable so it can be corrected in
    // one place. See BRIEF.md section 6, /guru.
    credentialAwardingBody: "Bruhad Gujarat Sangeet Samiti", // TODO(client): confirm
    school: {
      name: "Mudra School of Indian Classical Dances",
      city: "Ahmedabad",
      foundedYear: 1973,
      founders: ["Shri Bhaskar Menon", "Smt. Radha Bhaskar Menon"],
      approxStudentsTrained: 16000,
      style: "Pandanallur",
    },
  },

  credibility: {
    inPersonStudentCount: 50,
    inPersonStudentsSince: 2021,
  },

  capacity: {
    minBatches: 4,
    maxBatches: 6,
    minStudentsPerBatch: 6,
    maxStudentsPerBatch: 8,
    minOnlineStudents: 25,
    maxOnlineStudents: 30,
  },

  pricing: {
    online: {
      currency: "USD",
      // TODO(client): plan is to raise toward $150 once a waitlist forms.
      // One variable, one edit.
      monthly: 110,
      quarterly: 297,
      quarterlySavingsPercent: 10,
      classesPerWeek: 2,
      trialIsFree: true,
      registrationFee: 0,
    },
    inPerson: {
      currency: "INR",
      // TODO(client): Vastral in-person monthly fee was not supplied in
      // the brief — do not invent a number. Leave null until confirmed;
      // the /fees page must render this slot as a clearly labelled TODO,
      // not a guess.
      monthly: null as number | null,
    },
  },
} as const;

export type Site = typeof site;
