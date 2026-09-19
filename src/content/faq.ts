/**
 * Every answer here restates a fact already stated elsewhere in
 * BRIEF.md (section 6) — nothing is invented. `page` controls which
 * page's FAQAccordion + FAQPage JSON-LD an item appears in.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  page: "classes" | "fees" | "trial";
}

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
];
