import { site } from "@/content/site";
import { batches } from "@/content/schedule";
import { faqs, type FaqItem } from "@/content/faq";

/**
 * Hand-written JSON-LD — brief section 10. Only real, known facts are
 * included; fields we don't have yet (street address, geo, opening
 * hours) are omitted rather than invented. The LocalBusiness address
 * must be re-checked against the Google Business Profile character-
 * for-character once that's set up.
 */

export function localBusinessSchema() {
  const address: Record<string, string> = {
    "@type": "PostalAddress",
    addressLocality: `${site.location.area}, ${site.location.city}`,
    addressRegion: site.location.state,
    addressCountry: site.location.country,
  };
  if (site.location.streetAddress) {
    address.streetAddress = site.location.streetAddress;
  }
  if (site.location.postalCode) {
    address.postalCode = site.location.postalCode;
  }

  return {
    "@context": "https://schema.org",
    "@type": "DanceSchool",
    name: site.name,
    description: `Bharatanatyam school in ${site.location.area}, ${site.location.city}, teaching the Pandanallur tradition since ${site.founded.year}.`,
    url: site.domain,
    address,
    sameAs: [site.contact.instagram],
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
