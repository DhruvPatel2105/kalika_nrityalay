import { site } from "@/content/site";
import { batches } from "@/content/schedule";
import { faqs, type FaqItem } from "@/content/faq";
import { absoluteUrl } from "@/lib/url";

/**
 * Hand-written JSON-LD — brief section 10. Only real, known facts are
 * included; fields we don't have yet (street address, geo, opening
 * hours) are omitted rather than invented. The LocalBusiness address
 * must be re-checked against the Google Business Profile character-
 * for-character once that's set up.
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December",
];

const logoUrl = `${site.domain}/logo/mark-oxblood.png`;

const organization = {
  "@type": "Organization",
  name: site.name,
  url: site.domain,
  logo: { "@type": "ImageObject", url: logoUrl },
};

export function localBusinessSchema() {
  const loc = site.location;
  const address: Record<string, string> = {
    "@type": "PostalAddress",
    // Locality is the city; the neighbourhood belongs with the street,
    // which is how Google Business Profile structures Indian addresses.
    streetAddress: [loc.streetAddress, loc.area].filter(Boolean).join(", "),
    addressLocality: loc.city,
    addressRegion: loc.state,
    addressCountry: "IN",
  };
  if (loc.postalCode) address.postalCode = loc.postalCode;

  const month = String(MONTHS.indexOf(site.founded.month) + 1).padStart(2, "0");

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "DanceSchool",
    "@id": `${site.domain}/#school`,
    name: site.name,
    description: `Bharatanatyam school in ${loc.area}, ${loc.city}, teaching the Pandanallur tradition since ${site.founded.year}. In-person classes at the studio and live online classes for families in the USA and Canada.`,
    url: site.domain,
    telephone: site.contact.whatsapp.display,
    logo: logoUrl,
    image: `${site.domain}/og/default.png`,
    address,
    areaServed: { "@type": "City", name: loc.city },
    founder: { "@type": "Person", name: site.guru.name },
    foundingDate: `${site.founded.year}-${month}`,
    sameAs: [site.contact.instagram],
  };
  if (loc.geo.lat !== null && loc.geo.lng !== null) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: loc.geo.lat,
      longitude: loc.geo.lng,
    };
  }
  if (loc.mapsUrl) schema.hasMap = loc.mapsUrl;
  return schema;
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(opts: {
  type?: "Article" | "BlogPosting";
  headline: string;
  description: string;
  path: string;
  datePublished: Date;
  dateModified?: Date;
  author: string;
  image?: string;
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "Article",
    headline: opts.headline,
    description: opts.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    author:
      opts.author === site.name
        ? organization
        : { "@type": "Person", name: opts.author },
    publisher: organization,
    image: absoluteUrl(opts.image ?? "/og/default.png"),
    inLanguage: "en",
  };
}

export function personSchema() {
  const g = site.guru;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: g.name,
    jobTitle: "Bharatanatyam Guru",
    alumniOf: {
      "@type": "EducationalOrganization",
      name: g.school.name,
      foundingDate: String(g.school.foundedYear),
      address: {
        "@type": "PostalAddress",
        addressLocality: g.school.city,
      },
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: g.credential,
      dateCreated: `${g.credentialAwardedYear}-${g.credentialAwardedMonth === "June" ? "06" : "07"}`,
      recognizedBy: {
        "@type": "Organization",
        name: g.credentialAwardingBody,
      },
    },
    worksFor: {
      "@type": "DanceSchool",
      name: site.name,
    },
  };
}

export function coursesSchema() {
  return batches.map((batch) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${batch.name} — ${site.name}`,
    description: `Live online Bharatanatyam class for ages ${batch.ageRange.min}-${batch.ageRange.max}, taught by ${site.guru.name} in the Pandanallur tradition.`,
    provider: {
      "@type": "DanceSchool",
      name: site.name,
      sameAs: site.domain,
    },
    courseMode: "online",
  }));
}

export function faqPageSchema(page: FaqItem["page"]) {
  const items = faqs.filter((faq) => faq.page === page);
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
