import { FAQItem } from "@/types";

export const faqItems: FAQItem[] = [
  {
    question: "How is Graphite faster than Dropbox?",
    answer:
      "Dropbox and Google Drive throttle uploads to 10-15 Mbps regardless of your connection speed. Graphite uses chunked parallel uploads across multiple connections, with no server-side throttling. If you have a gigabit connection, you can actually use it.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "Your files are stored on dedicated NVMe servers in Dallas, Texas. We use RAID 1 for redundancy and perform regular backups. Your data never leaves our infrastructure—no third-party cloud providers.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "No arbitrary file size limits. Upload 50GB video files, entire project folders, whatever you need. Our resumable upload protocol means even if your connection drops, you can pick up right where you left off.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No contracts, no cancellation fees. Cancel anytime from your dashboard. If you cancel, you'll keep access until the end of your billing period.",
  },
  {
    question: "Do you offer a free tier?",
    answer:
      "We offer a 14-day free trial on all plans with full features. After the trial, you can choose the plan that fits your needs. We don't offer a permanent free tier—our focus is on providing the fastest possible experience for paying customers.",
  },
  {
    question: "Is my data encrypted?",
    answer:
      "Yes. All data is encrypted at rest using AES-256 encryption. All transfers happen over TLS 1.3. We take security seriously—your files are yours.",
  },
];
