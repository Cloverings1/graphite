"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/data/faq-items";

export function FAQ() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
            Questions & <span className="italic text-gradient">answers</span>
          </h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass glass-border rounded-xl px-6 overflow-hidden data-[state=open]:border-accent/30 transition-colors duration-300"
            >
              <AccordionTrigger className="text-left py-5 hover:no-underline group">
                <span className="text-foreground group-hover:text-accent transition-colors duration-300">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-foreground-muted pb-5 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact link */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted">
            Still have questions?{" "}
            <a
              href="mailto:hello@graphite.cloud"
              className="text-accent hover:text-accent-muted transition-colors duration-300 link-underline"
            >
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
