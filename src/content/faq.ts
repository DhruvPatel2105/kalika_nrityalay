/**
 * Every answer here restates a fact already stated elsewhere in
 * BRIEF.md (section 6) or site.ts — nothing is invented. `page`
 * controls which page's FAQAccordion + FAQPage JSON-LD an item
 * appears in.
 */
import { site } from "@/content/site";
import { fullAddress } from "@/lib/address";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  page: "classes" | "fees" | "trial" | "local";
}

const inPersonFee = site.pricing.inPerson.monthly;

export const faqs: FaqItem[] = [
  {
    id: "what-we-need-at-home",
    question: "What do we need at home for class?",
    answer:
      "A clear floor space of about 2m by 2m, and a laptop or tablet. A mirror is not required.",
    page: "classes",
  },
  {
    id: "platform",
    question: "What platform do you use for class?",
    answer:
      "Zoom. Sessions are recorded, so a missed class can be caught up.",
    page: "classes",
  },
  {
    id: "missed-class",
    question: "What happens if we miss a class?",
    answer:
      "Every class is recorded, so your daughter can catch up in her own time.",
    page: "classes",
  },
  {
    id: "safeguarding",
    question: "Is my child ever online alone with the teacher?",
    answer:
      "A parent is welcome in the room at any time. Binni communicates with parents, never directly with students under 18.",
    page: "classes",
  },
  {
    id: "registration-fee",
    question: "Is there a registration fee?",
    answer: "No registration fee, and the first two classes are free.",
    page: "fees",
  },
  {
    id: "quarterly-savings",
    question: "Is there a discount for paying quarterly?",
    answer:
      "Yes — paying for three months at once saves 10% compared to paying monthly.",
    page: "fees",
  },
  {
    id: "child-info-collected",
    question: "What information do you need about my child?",
    answer:
      "Just her age. We don't collect her name, photo, or school on the form — only a parent's contact details.",
    page: "trial",
  },
  {
    id: "trial-response-time",
    question: "How soon will I hear back after I request classes?",
    answer:
      "Binni replies on WhatsApp within 24 hours. If you'd rather skip the form, you can message her directly.",
    page: "trial",
  },
  {
    id: "local-where",
    question: "Where is the studio?",
    answer: `${site.name} is at ${fullAddress}.`,
    page: "local",
  },
  {
    id: "local-when",
    question: "When are the in-person classes?",
    answer: `Studio classes run on ${site.location.inPersonSchedule}. Message us on WhatsApp for current batch timings and which batch suits your child's age.`,
    page: "local",
  },
  {
    id: "local-fees",
    question: "How much are in-person classes?",
    answer:
      inPersonFee !== null
        ? `In-person classes are ₹${inPersonFee} a month.`
        : "Studio fees are confirmed directly — message us on WhatsApp for the current rate.",
    page: "local",
  },
  {
    id: "local-teacher",
    question: "Who teaches the classes?",
    answer: `${site.guru.name} teaches every class herself. She trained at the ${site.guru.school.name} under ${site.guru.trainedUnder} and holds ${site.guru.credential}.`,
    page: "local",
  },
  {
    id: "local-online",
    question: "Do you also teach online?",
    answer: `Yes — live online classes for families in the USA and Canada, on Saturday and Sunday mornings their time. The first ${site.pricing.online.freeClasses} classes are free.`,
    page: "local",
  },
];
