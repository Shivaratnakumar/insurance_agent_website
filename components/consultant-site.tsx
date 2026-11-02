"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight, ShieldCheck, HeartPulse, Users, BriefcaseBusiness, MessageCircle,
  Phone, CheckCircle2, Menu, X, Languages, ClipboardList, BookOpen, ChevronDown
} from "lucide-react";

type Lang = "en" | "kn";

const copy = {
  en: {
    nav: ["Home", "Why health cover", "About", "FAQs", "Contact"],
    eyebrow: "PERSONAL HEALTH INSURANCE GUIDANCE",
    heroTitle: "Your health matters. Your family's peace of mind matters too.",
    heroText: "Understand health insurance options with clear, personal guidance—so you can make an informed decision for the people who matter most.",
    primary: "Request a consultation",
    secondary: "Chat on WhatsApp",
    trust: "Friendly guidance • Clear explanations • No-pressure conversation",
    sectionTag: "START WITH THE RIGHT QUESTIONS",
    whyTitle: "Health insurance should be understood, not rushed.",
    whyText: "A policy is more than a premium. Take time to understand what is covered, what is not, and whether the cover fits your needs.",
    cards: [
      ["For your family", "Explore options for you, your spouse and children. Check eligibility, inclusions and conditions."],
      ["For your parents", "Review age-related eligibility, waiting periods, medical disclosures and policy limits."],
      ["For working professionals", "Understand how an individual policy may complement employer-provided health cover."]
    ],
    checklistTitle: "Before choosing a policy, check these 5 things",
    checklist: [
      "Sum insured and room-rent limits, if any",
      "Waiting periods and pre-existing disease rules",
      "Co-payment, deductibles and sub-limits",
      "Network hospitals and claim process",
      "Exclusions, renewal terms and applicable conditions"
    ],
    aboutTag: "YOUR CONSULTANT",
    aboutTitle: "A person you can speak to—not just a form to fill.",
    aboutText: "I'm Shivaratnakumar Patil, a health insurance consultant. I help individuals and families understand available health insurance options, compare important policy features and ask the right questions before applying.",
    aboutNote: "My role is to explain options transparently. The insurer's policy wording, underwriting decision and final schedule determine the actual coverage.",
    ctaTitle: "Not sure what cover may suit your family?",
    ctaText: "Share a few details and start a no-obligation conversation. We'll first understand your needs and then discuss suitable options, subject to eligibility and insurer terms.",
    formTitle: "Request a call back",
    name: "Your name",
    phone: "Mobile number",
    audience: "Who are you looking to cover?",
    audienceOptions: ["Myself", "My family", "My parents", "Myself + family + parents"],
    message: "Anything you'd like me to know? (optional)",
    submit: "Send enquiry on WhatsApp",
    formHint: "Your enquiry opens WhatsApp with a pre-filled message. You can review it before sending.",
    faqTitle: "Common questions",
    faqs: [
      ["Does health insurance cover every hospital expense?", "No. Coverage depends on the policy wording, exclusions, waiting periods, limits, admissibility and claim conditions. Read the policy documents carefully."],
      ["Can I rely only on my employer's health insurance?", "Employer cover can be useful, but its terms and continuation depend on the employer's group policy. Consider reviewing your personal protection needs as well."],
      ["Are pre-existing diseases covered immediately?", "Not necessarily. Waiting periods and disclosures apply as specified in the policy. Declare medical history accurately when applying."],
      ["Can you guarantee a claim will be paid?", "No consultant can guarantee claim approval. Claims are assessed by the insurer according to policy terms, disclosures and submitted documents."]
    ],
    contactTitle: "Let's talk about your health cover.",
    contactText: "Call or WhatsApp for a personal discussion.",
    footerDisclaimer: "This website is an independent consultant's information and enquiry page, not the official TATA AIG website. Product names, benefits, premiums and eligibility are subject to current insurer-approved materials, policy wording, underwriting and applicable terms. No coverage or claim outcome is guaranteed.",
    footer: "Health insurance information and consultation",
    role: "Health Insurance Consultant",
    brand: "Health Insurance",
    badge: "ENGLISH",
  },
  kn: {
    nav: ["ಮುಖಪುಟ", "ಆರೋಗ್ಯ ವಿಮೆ ಏಕೆ?", "ನನ್ನ ಬಗ್ಗೆ", "ಪ್ರಶ್ನೆಗಳು", "ಸಂಪರ್ಕ"],
    eyebrow: "ಆರೋಗ್ಯ ವಿಮೆ ಕುರಿತು ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ",
    heroTitle: "ನಿಮ್ಮ ಆರೋಗ್ಯ ಮುಖ್ಯ. ನಿಮ್ಮ ಕುಟುಂಬದ ನೆಮ್ಮದಿಯೂ ಅಷ್ಟೇ ಮುಖ್ಯ.",
    heroText: "ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಸೂಕ್ತವಾದ ಆರೋಗ್ಯ ವಿಮೆಯ ಆಯ್ಕೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸರಳ ಮತ್ತು ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.",
    primary: "ಸಲಹೆಗಾಗಿ ಸಂಪರ್ಕಿಸಿ",
    secondary: "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಚಾಟ್ ಮಾಡಿ",
    trust: "ಸ್ನೇಹಪೂರ್ಣ ಮಾರ್ಗದರ್ಶನ • ಸ್ಪಷ್ಟ ಮಾಹಿತಿ • ಯಾವುದೇ ಒತ್ತಡವಿಲ್ಲದ ಮಾತುಕತೆ",
    sectionTag: "ಸರಿಯಾದ ಪ್ರಶ್ನೆಗಳಿಂದ ಪ್ರಾರಂಭಿಸಿ",
    whyTitle: "ಆರೋಗ್ಯ ವಿಮೆಯನ್ನು ಆತುರದಲ್ಲಿ ಅಲ್ಲ, ಅರ್ಥಮಾಡಿಕೊಂಡು ಆಯ್ಕೆಮಾಡಿ.",
    whyText: "ವಿಮಾ ಪಾಲಿಸಿ ಎಂದರೆ ಕೇವಲ ಪ್ರೀಮಿಯಂ ಅಲ್ಲ. ಯಾವುದು ಕವರ್ ಆಗುತ್ತದೆ, ಯಾವುದು ಆಗುವುದಿಲ್ಲ ಮತ್ತು ಅದು ನಿಮ್ಮ ಅಗತ್ಯಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆಯೇ ಎಂಬುದನ್ನು ತಿಳಿದುಕೊಳ್ಳಿ.",
    cards: [
      ["ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕಾಗಿ", "ನೀವು, ನಿಮ್ಮ ಜೀವನ ಸಂಗಾತಿ ಮತ್ತು ಮಕ್ಕಳಿಗಾಗಿ ಲಭ್ಯವಿರುವ ಆಯ್ಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ."],
      ["ನಿಮ್ಮ ಪೋಷಕರಿಗಾಗಿ", "ವಯೋಮಿತಿ, ಕಾಯುವ ಅವಧಿ, ವೈದ್ಯಕೀಯ ಮಾಹಿತಿಯ ಬಹಿರಂಗಪಡಿಸುವಿಕೆ ಮತ್ತು ಪಾಲಿಸಿ ಮಿತಿಗಳನ್ನು ತಿಳಿದುಕೊಳ್ಳಿ."],
      ["ಉದ್ಯೋಗಿಗಳಿಗಾಗಿ", "ಕಂಪನಿಯ ಆರೋಗ್ಯ ವಿಮೆಗೆ ಪೂರಕವಾಗಿ ವೈಯಕ್ತಿಕ ಪಾಲಿಸಿ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು ಎಂದು ತಿಳಿಯಿರಿ."]
    ],
    checklistTitle: "ಪಾಲಿಸಿ ಆಯ್ಕೆಮಾಡುವ ಮೊದಲು ಈ 5 ವಿಷಯಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
    checklist: [
      "ವಿಮಾ ಮೊತ್ತ ಮತ್ತು ರೂಮ್-ರೆಂಟ್ ಮಿತಿಗಳು",
      "ಕಾಯುವ ಅವಧಿ ಮತ್ತು ಪೂರ್ವ ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಕಾಯಿಲೆಗಳ ನಿಯಮಗಳು",
      "ಸಹಪಾವತಿ, ಡಿಡಕ್ಟಿಬಲ್ ಮತ್ತು ಉಪಮಿತಿಗಳು",
      "ನೆಟ್‌ವರ್ಕ್ ಆಸ್ಪತ್ರೆಗಳು ಮತ್ತು ಕ್ಲೇಮ್ ಪ್ರಕ್ರಿಯೆ",
      "ವಿನಾಯಿತಿಗಳು, ನವೀಕರಣ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು"
    ],
    aboutTag: "ನಿಮ್ಮ ಸಲಹೆಗಾರ",
    aboutTitle: "ನಿಮ್ಮೊಂದಿಗೆ ಮಾತನಾಡುವ ವ್ಯಕ್ತಿ—ಕೇವಲ ಅರ್ಜಿ ನಮೂನೆ ಅಲ್ಲ.",
    aboutText: "ನಾನು ಶಿವರತ್ನಕುಮಾರ್ ಪಾಟೀಲ್, ಆರೋಗ್ಯ ವಿಮೆ ಸಲಹೆಗಾರ. ಲಭ್ಯವಿರುವ ಆರೋಗ್ಯ ವಿಮೆ ಆಯ್ಕೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು, ಪಾಲಿಸಿಯ ಮುಖ್ಯ ಅಂಶಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಸರಿಯಾದ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಲು ವ್ಯಕ್ತಿಗಳು ಹಾಗೂ ಕುಟುಂಬಗಳಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
    aboutNote: "ನನ್ನ ಉದ್ದೇಶ ಆಯ್ಕೆಗಳನ್ನು ಪಾರದರ್ಶಕವಾಗಿ ವಿವರಿಸುವುದು. ನಿಜವಾದ ಕವರೇಜ್ ಅನ್ನು ವಿಮಾ ಕಂಪನಿಯ ಪಾಲಿಸಿ ಪದಗಳು, ಅಂಡರ್‌ರೈಟಿಂಗ್ ನಿರ್ಧಾರ ಮತ್ತು ಅಂತಿಮ ಪಾಲಿಸಿ ವೇಳಾಪಟ್ಟಿ ನಿರ್ಧರಿಸುತ್ತವೆ.",
    ctaTitle: "ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಯಾವ ಕವರ್ ಸೂಕ್ತವೆಂದು ತಿಳಿದಿಲ್ಲವೇ?",
    ctaText: "ಕೆಲವು ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಂಡು ಯಾವುದೇ ಬದ್ಧತೆಯಿಲ್ಲದ ಮಾತುಕತೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ. ಮೊದಲು ನಿಮ್ಮ ಅಗತ್ಯಗಳನ್ನು ತಿಳಿದುಕೊಂಡು, ಅರ್ಹತೆ ಮತ್ತು ವಿಮಾ ಕಂಪನಿಯ ಷರತ್ತುಗಳಿಗೆ ಒಳಪಟ್ಟು ಆಯ್ಕೆಗಳನ್ನು ಚರ್ಚಿಸೋಣ.",
    formTitle: "ಮರಳಿ ಕರೆಗಾಗಿ ವಿನಂತಿಸಿ",
    name: "ನಿಮ್ಮ ಹೆಸರು",
    phone: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    audience: "ಯಾರಿಗಾಗಿ ವಿಮೆ ಬೇಕಾಗಿದೆ?",
    audienceOptions: ["ನನಗಾಗಿ", "ನನ್ನ ಕುಟುಂಬಕ್ಕಾಗಿ", "ನನ್ನ ಪೋಷಕರಿಗಾಗಿ", "ನಾನು + ಕುಟುಂಬ + ಪೋಷಕರು"],
    message: "ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ (ಐಚ್ಛಿಕ)",
    submit: "ವಾಟ್ಸಾಪ್ ಮೂಲಕ ವಿಚಾರಣೆ ಕಳುಹಿಸಿ",
    formHint: "ಪೂರ್ವಭರಿತ ಸಂದೇಶದೊಂದಿಗೆ ವಾಟ್ಸಾಪ್ ತೆರೆಯುತ್ತದೆ. ಕಳುಹಿಸುವ ಮೊದಲು ಪರಿಶೀಲಿಸಬಹುದು.",
    faqTitle: "ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು",
    faqs: [
      ["ಆರೋಗ್ಯ ವಿಮೆ ಎಲ್ಲಾ ಆಸ್ಪತ್ರೆ ವೆಚ್ಚಗಳನ್ನು ಕವರ್ ಮಾಡುತ್ತದೆಯೇ?", "ಇಲ್ಲ. ಕವರೇಜ್ ಪಾಲಿಸಿ ನಿಯಮಗಳು, ವಿನಾಯಿತಿಗಳು, ಕಾಯುವ ಅವಧಿ, ಮಿತಿಗಳು ಮತ್ತು ಕ್ಲೇಮ್ ಷರತ್ತುಗಳ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿರುತ್ತದೆ."],
      ["ಕಂಪನಿಯ ಆರೋಗ್ಯ ವಿಮೆಯನ್ನೇ ನಂಬಬಹುದೇ?", "ಕಂಪನಿಯ ವಿಮೆ ಉಪಯುಕ್ತವಾಗಬಹುದು. ಆದರೆ ಅದರ ಷರತ್ತುಗಳು ಮತ್ತು ಮುಂದುವರಿಕೆ ಉದ್ಯೋಗದಾತರ ಗ್ರೂಪ್ ಪಾಲಿಸಿಯ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿರುತ್ತದೆ. ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಅಗತ್ಯಗಳನ್ನೂ ಪರಿಶೀಲಿಸಿ."],
      ["ಈಗಾಗಲೇ ಇರುವ ಕಾಯಿಲೆಗಳಿಗೆ ತಕ್ಷಣ ಕವರೇಜ್ ಸಿಗುತ್ತದೆಯೇ?", "ಅಗತ್ಯವಿಲ್ಲ. ಪಾಲಿಸಿಯಲ್ಲಿ ಸೂಚಿಸಿರುವ ಕಾಯುವ ಅವಧಿ ಮತ್ತು ವೈದ್ಯಕೀಯ ಮಾಹಿತಿಯ ಬಹಿರಂಗಪಡಿಸುವಿಕೆ ನಿಯಮಗಳು ಅನ್ವಯಿಸುತ್ತವೆ."],
      ["ಕ್ಲೇಮ್ ಖಂಡಿತವಾಗಿ ಪಾವತಿಯಾಗುತ್ತದೆ ಎಂದು ನೀವು ಖಾತರಿ ನೀಡಬಹುದೇ?", "ಯಾವುದೇ ಸಲಹೆಗಾರರು ಕ್ಲೇಮ್ ಅನುಮೋದನೆಗೆ ಖಾತರಿ ನೀಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ಪಾಲಿಸಿ ಷರತ್ತುಗಳು ಮತ್ತು ದಾಖಲೆಗಳ ಆಧಾರದ ಮೇಲೆ ವಿಮಾ ಕಂಪನಿ ಕ್ಲೇಮ್ ಪರಿಶೀಲಿಸುತ್ತದೆ."]
    ],
    contactTitle: "ನಿಮ್ಮ ಆರೋಗ್ಯ ವಿಮೆಯ ಬಗ್ಗೆ ಮಾತನಾಡೋಣ.",
    contactText: "ವೈಯಕ್ತಿಕ ಚರ್ಚೆಗಾಗಿ ಕರೆ ಮಾಡಿ ಅಥವಾ ವಾಟ್ಸಾಪ್ ಮಾಡಿ.",
    footerDisclaimer: "ಈ ವೆಬ್‌ಸೈಟ್ ಸ್ವತಂತ್ರ ಸಲಹೆಗಾರರ ಮಾಹಿತಿ ಮತ್ತು ವಿಚಾರಣೆ ಪುಟವಾಗಿದ್ದು, ಅಧಿಕೃತ TATA AIG ವೆಬ್‌ಸೈಟ್ ಅಲ್ಲ. ಉತ್ಪನ್ನಗಳು, ಪ್ರಯೋಜನಗಳು, ಪ್ರೀಮಿಯಂ ಮತ್ತು ಅರ್ಹತೆಗಳು ಪ್ರಸ್ತುತ ಅನುಮೋದಿತ ಮಾಹಿತಿಗಳು, ಪಾಲಿಸಿ ನಿಯಮಗಳು ಮತ್ತು ವಿಮಾ ಕಂಪನಿಯ ನಿರ್ಧಾರಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತವೆ. ಯಾವುದೇ ಕವರೇಜ್ ಅಥವಾ ಕ್ಲೇಮ್ ಫಲಿತಾಂಶಕ್ಕೆ ಖಾತರಿ ಇಲ್ಲ.",
    footer: "ಆರೋಗ್ಯ ವಿಮೆ ಮಾಹಿತಿ ಮತ್ತು ಸಲಹೆ",
    role: "ಆರೋಗ್ಯ ವಿಮೆ ಸಲಹೆಗಾರ",
    brand: "ಆರೋಗ್ಯ ವಿಮೆ",
    badge: "ಕನ್ನಡ",
  }
};

const phone = "8050372422";
const waLink = (message: string) => `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

export default function ConsultantSite() {
  const [lang, setLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [audience, setAudience] = useState("My family");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const t = copy[lang];

  const navIds = ["home", "why", "about", "faqs", "contact"];
  const audienceValues = ["Myself", "My family", "My parents", "Myself + family + parents"];
  const audienceLabels = lang === "en"
    ? audienceValues
    : ["ನನಗಾಗಿ", "ನನ್ನ ಕುಟುಂಬಕ್ಕಾಗಿ", "ನನ್ನ ಪೋಷಕರಿಗಾಗಿ", "ನಾನು + ಕುಟುಂಬ + ಪೋಷಕರು"];
  const formMessage = useMemo(() => {
    const lines = [
      "Hello Shivaratnakumar Patil, I would like to know about health insurance options.",
      `Name: ${name || "Not provided"}`,
      `Mobile: ${mobile || "Not provided"}`,
      `Looking to cover: ${audience}`,
      `Message: ${message || "Not provided"}`,
      `Language: ${lang === "en" ? "English" : "Kannada"}`
    ];
    return lines.join("\n");
  }, [name, mobile, audience, message, lang]);

  async function submitEnquiry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    setFormSuccess("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: mobile,
          coverageNeed: audience,
          message,
          language: lang,
          consent,
          website: honeypot,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit your enquiry.");
      }

      setFormSuccess(lang === "en"
        ? "Your enquiry has been saved. WhatsApp will open so you can also message me."
        : "ನಿಮ್ಮ ವಿಚಾರಣೆಯನ್ನು ಉಳಿಸಲಾಗಿದೆ. ವಾಟ್ಸಾಪ್ ಮೂಲಕವೂ ಸಂಪರ್ಕಿಸಲು ತೆರೆಯುತ್ತದೆ.");
      window.open(waLink(formMessage), "_blank", "noopener,noreferrer");
      setName("");
      setMobile("");
      setMessage("");
      setConsent(false);
      setHoneypot("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="container-shell flex h-[76px] items-center justify-between gap-4">
          <a href="#home" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-900 text-sm font-black tracking-tight text-white">SP</span>
            <span className="leading-tight">
              <span className="block text-sm font-extrabold text-navy-950">Shivaratnakumar Patil</span>
              <span className="block text-xs text-slate-500">{t.role}</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex">
            {t.nav.map((label, i) => <a key={label} href={`#${navIds[i]}`} className="text-sm font-semibold text-slate-600 transition hover:text-navy-800">{label}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "en" ? "kn" : "en")} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-navy-900 hover:border-gold-500" aria-label="Switch language">
              <Languages size={16}/>{lang === "en" ? "ಕನ್ನಡ" : "English"}
            </button>
            <a href={waLink("Hello, I would like to discuss health insurance options.")} target="_blank" rel="noreferrer" className="hidden rounded-full bg-navy-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-navy-800 sm:inline-flex">{lang === "en" ? "Contact me" : "ಸಂಪರ್ಕಿಸಿ"}</a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-navy-900 lg:hidden" aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button>
          </div>
        </div>
        {menuOpen && <div className="container-shell grid gap-1 pb-4 lg:hidden">{t.nav.map((label, i) => <a onClick={() => setMenuOpen(false)} key={label} href={`#${navIds[i]}`} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">{label}</a>)}</div>}
      </header>

      <section id="home" className="relative bg-[radial-gradient(circle_at_80%_18%,rgba(239,193,93,.20),transparent_28%),linear-gradient(135deg,#071936_0%,#0B2450_58%,#174C91_100%)] text-white">
        <div className="container-shell grid min-h-[660px] items-center gap-12 py-16 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-[.14em] text-gold-300"><ShieldCheck size={15}/>{t.eyebrow}</div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-[58px]">{t.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">{t.heroText}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-4 font-extrabold text-navy-950 shadow-lg shadow-black/10 transition hover:bg-gold-300">{t.primary}<ArrowRight size={18}/></a>
              <a href={waLink("Hello, I would like to know about health insurance options.")} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 font-bold text-white transition hover:bg-white/10"><MessageCircle size={18}/>{t.secondary}</a>
            </div>
            <p className="mt-7 text-xs font-medium text-blue-200">{t.trust}</p>
          </div>
          <div className="relative mx-auto w-full max-w-[470px]">
            <div className="absolute -inset-5 rounded-[36px] bg-gold-400/20 blur-2xl"/>
            <div className="relative overflow-hidden rounded-[30px] border border-white/25 bg-white/10 p-2 shadow-2xl">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[23px] bg-slate-200">
                <Image src="/images/shivaratnakumar-patil.png" alt="Shivaratnakumar Patil, Health Insurance Consultant" fill priority className="object-cover object-center"/>
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/40 bg-white/95 p-4 text-navy-950 shadow-xl">
                <p className="font-extrabold">Shivaratnakumar Patil</p>
                <p className="mt-1 text-sm text-slate-600">{t.role}</p>
                <p className="mt-2 text-sm font-bold text-navy-800">☎ 8050372422</p>
              </div>
            </div>
            <div className="absolute -left-8 top-16 hidden rounded-2xl bg-white p-4 text-navy-950 shadow-xl sm:block">
              <div className="flex items-center gap-2 text-sm font-extrabold"><HeartPulse className="text-rose-500" size={18}/> {lang === "en" ? "Family-first guidance" : "ಕುಟುಂಬಕ್ಕೆ ಮೊದಲ ಆದ್ಯತೆ"}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-5">
        <div className="container-shell flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-semibold text-slate-600">
          <span className="flex items-center gap-2"><CheckCircle2 className="text-emerald-600" size={18}/>{lang === "en" ? "Understand policy features" : "ಪಾಲಿಸಿ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ತಿಳಿಯಿರಿ"}</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="text-emerald-600" size={18}/>{lang === "en" ? "Ask questions freely" : "ಮುಕ್ತವಾಗಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ"}</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="text-emerald-600" size={18}/>{lang === "en" ? "Make an informed choice" : "ತಿಳಿದ ನಿರ್ಧಾರ ಕೈಗೊಳ್ಳಿ"}</span>
        </div>
      </section>

      <section id="why" className="section-pad">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black tracking-[.2em] text-amber-700">{t.sectionTag}</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-navy-950 sm:text-4xl">{t.whyTitle}</h2>
            <p className="mt-4 leading-7 text-slate-600">{t.whyText}</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {t.cards.map((card, i) => {
              const Icon = [Users, HeartPulse, BriefcaseBusiness][i];
              return <article key={card[0]} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft transition hover:-translate-y-1">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-700"><Icon size={23}/></span>
                <h3 className="mt-6 text-xl font-extrabold text-navy-950">{card[0]}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card[1]}</p>
              </article>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-extrabold tracking-wider text-navy-800"><ClipboardList size={15} className="mr-2"/>{lang === "en" ? "SMART POLICY CHECKLIST" : "ಪಾಲಿಸಿ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ"}</div>
            <h2 className="text-3xl font-black leading-tight text-navy-950">{t.checklistTitle}</h2>
            <p className="mt-4 leading-7 text-slate-600">{lang === "en" ? "A little reading today can help avoid confusion at claim time. Ask for the latest policy wording and product brochure." : "ಇಂದು ಸ್ವಲ್ಪ ಮಾಹಿತಿ ತಿಳಿದುಕೊಳ್ಳುವುದರಿಂದ ಕ್ಲೇಮ್ ಸಮಯದ ಗೊಂದಲವನ್ನು ತಪ್ಪಿಸಬಹುದು. ಇತ್ತೀಚಿನ ಪಾಲಿಸಿ ನಿಯಮಗಳು ಮತ್ತು ಉತ್ಪನ್ನದ ಕರಪತ್ರವನ್ನು ಕೇಳಿ."}</p>
          </div>
          <div className="rounded-3xl bg-navy-950 p-7 text-white shadow-soft sm:p-9">
            <ul className="space-y-5">{t.checklist.map((item, i) => <li key={item} className="flex gap-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-400 text-sm font-black text-navy-950">{i+1}</span><span className="pt-1 text-sm font-semibold leading-6 text-blue-50">{item}</span></li>)}</ul>
          </div>
        </div>
      </section>

      <section id="about" className="section-pad">
        <div className="container-shell grid items-center gap-10 md:grid-cols-[.72fr_1.28fr]">
          <div className="relative mx-auto w-full max-w-[330px]">
            <div className="absolute -inset-3 rounded-[30px] bg-gold-400/30 blur-xl"/>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border-4 border-white shadow-soft">
              <Image src="/images/shivaratnakumar-patil.png" alt="Shivaratnakumar Patil" fill className="object-cover object-center"/>
            </div>
          </div>
          <div>
            <p className="text-xs font-black tracking-[.2em] text-amber-700">{t.aboutTag}</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-navy-950 sm:text-4xl">{t.aboutTitle}</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">{t.aboutText}</p>
            <p className="mt-4 rounded-2xl border-l-4 border-gold-400 bg-white p-5 text-sm leading-7 text-slate-600 shadow-sm">{t.aboutNote}</p>
            <a href="#contact" className="mt-7 inline-flex items-center gap-2 font-extrabold text-navy-800 hover:text-amber-700">{t.primary}<ArrowRight size={18}/></a>
          </div>
        </div>
      </section>

      <section id="faqs" className="bg-white py-20">
        <div className="container-shell max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black tracking-[.2em] text-amber-700">{lang === "en" ? "GOOD TO KNOW" : "ತಿಳಿದುಕೊಳ್ಳಬೇಕಾದ ಮಾಹಿತಿ"}</p>
            <h2 className="mt-4 text-3xl font-black text-navy-950 sm:text-4xl">{t.faqTitle}</h2>
          </div>
          <div className="mt-10 space-y-3">
            {t.faqs.map(([q, a], i) => <div key={q} className="overflow-hidden rounded-2xl border border-slate-200">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-extrabold text-navy-950">
                <span>{q}</span><ChevronDown className={`shrink-0 transition ${openFaq === i ? "rotate-180" : ""}`}/>
              </button>
              {openFaq === i && <p className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-slate-600">{a}</p>}
            </div>)}
          </div>
        </div>
      </section>

      <section id="contact" className="section-pad bg-[linear-gradient(135deg,#071936,#123B78)] text-white">
        <div className="container-shell grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div className="pt-4">
            <p className="text-xs font-black tracking-[.2em] text-gold-300">{lang === "en" ? "LET'S CONNECT" : "ಸಂಪರ್ಕಿಸೋಣ"}</p>
            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{t.contactTitle}</h2>
            <p className="mt-5 max-w-md leading-8 text-blue-100">{t.contactText}</p>
            <a href="tel:+918050372422" className="mt-8 flex items-center gap-4 text-xl font-extrabold"><span className="grid h-12 w-12 place-items-center rounded-full bg-white/10"><Phone/></span>+91 80503 72422</a>
            <a href={waLink("Hello Shivaratnakumar, I would like to discuss health insurance options.")} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-extrabold text-white hover:bg-emerald-400"><MessageCircle size={19}/>WhatsApp</a>
          </div>
          <form onSubmit={submitEnquiry} className="rounded-3xl bg-white p-6 text-navy-950 shadow-2xl sm:p-8">
            <h3 className="text-2xl font-black">{t.formTitle}</h3>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold">{t.name}<input required value={name} onChange={e=>setName(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none transition focus:border-navy-700 focus:ring-2 focus:ring-blue-100" placeholder={lang === "en" ? "Enter your name" : "ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ"}/></label>
              <label className="grid gap-2 text-sm font-bold">{t.phone}<input required inputMode="tel" pattern="[0-9+ -]{10,15}" value={mobile} onChange={e=>setMobile(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none transition focus:border-navy-700 focus:ring-2 focus:ring-blue-100" placeholder="10-digit mobile number"/></label>
              <label className="grid gap-2 text-sm font-bold">{t.audience}<select value={audience} onChange={e=>setAudience(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-navy-700">{audienceValues.map((value, index)=><option key={value} value={value}>{audienceLabels[index]}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-bold">{t.message}<textarea value={message} onChange={e=>setMessage(e.target.value)} rows={3} className="resize-y rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-navy-700" placeholder={lang === "en" ? "Tell me what you would like to understand..." : "ನೀವು ತಿಳಿದುಕೊಳ್ಳಲು ಬಯಸುವ ವಿಷಯವನ್ನು ಬರೆಯಿರಿ..."}/></label>
              <label className="flex items-start gap-3 text-xs leading-5 text-slate-600">
                <input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#123B78]"/>
                <span>{lang === "en"
                  ? "I agree that my details may be used to respond to this health insurance enquiry. Please do not submit medical records or sensitive health information through this form."
                  : "ಈ ಆರೋಗ್ಯ ವಿಮೆ ವಿಚಾರಣೆಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಲು ನನ್ನ ವಿವರಗಳನ್ನು ಬಳಸಲು ನಾನು ಒಪ್ಪುತ್ತೇನೆ. ಈ ಫಾರ್ಮ್ ಮೂಲಕ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು ಅಥವಾ ಸೂಕ್ಷ್ಮ ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ಕಳುಹಿಸಬೇಡಿ."}</span>
              </label>
              <input type="text" name="website" value={honeypot} onChange={e=>setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              {formError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
              {formSuccess && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{formSuccess}</p>}
              <button disabled={saving} type="submit" className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-4 font-extrabold text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-60">{saving ? (lang === "en" ? "Saving enquiry..." : "ಉಳಿಸಲಾಗುತ್ತಿದೆ...") : t.submit}<ArrowRight size={18}/></button>
              <p className="text-xs leading-5 text-slate-500">{lang === "en"
                ? "Your enquiry is securely submitted to the consultant's lead inbox. WhatsApp also opens for a direct conversation."
                : "ನಿಮ್ಮ ವಿಚಾರಣೆಯನ್ನು ಸಲಹೆಗಾರರ ಲೀಡ್ ಇನ್‌ಬಾಕ್ಸ್‌ಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ. ನೇರ ಮಾತುಕತೆಗಾಗಿ ವಾಟ್ಸಾಪ್ ಕೂಡ ತೆರೆಯುತ್ತದೆ."}</p>
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-[#06142d] py-10 text-blue-100">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
            <div><p className="text-lg font-black text-white">Shivaratnakumar Patil</p><p className="mt-1 text-sm text-blue-200">{t.role}</p></div>
            <a href={waLink("Hello, I would like to discuss health insurance options.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-bold text-gold-300"><MessageCircle size={18}/>8050372422</a>
          </div>
          <p className="mt-7 text-xs leading-6 text-blue-200/80">{t.footerDisclaimer}</p>
          <p className="mt-6 text-xs text-blue-300/70">© {new Date().getFullYear()} Shivaratnakumar Patil. {t.footer}.</p>
        </div>
      </footer>

      <a href={waLink("Hello Shivaratnakumar, I would like to discuss health insurance options.")} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-xl transition hover:scale-105 hover:bg-emerald-400"><MessageCircle size={27}/></a>
    </main>
  );
}
