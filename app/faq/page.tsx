"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "What is this application?",
      a: "This app helps you instantly create, edit, and generate projects or content using AI — similar to Bolt.new. You can build, preview, and export your ideas directly from your browser.",
    },
    {
      q: "How does it work?",
      a: "Just log in, start a new workspace, and enter your topic or idea. The app uses AI to generate code or content in real-time, and you can modify or save it as you like.",
    },
    {
      q: "Do I need to pay to use it?",
      a: "You can start free with limited tokens. When you run out, you can purchase additional tokens via a one-time payment — no subscription required.",
    },
    {
      q: "How do payments work?",
      a: "Payments are handled securely through Stripe Checkout. Once payment is complete, tokens are automatically added to your account.",
    },
    {
      q: "Can I see my payment history?",
      a: "Yes! You can view all past payments and token purchases from your Billing section.",
    },
    {
      q: "What are tokens used for?",
      a: "Tokens are required for AI-powered actions like generating content or code. Each operation consumes a few tokens based on complexity.",
    },
    {
      q: "Do tokens expire?",
      a: "No, purchased tokens never expire. You can use them anytime while your account remains active.",
    },
    {
      q: "What technologies does this app use?",
      a: "This platform is built using Next.js, Convex for the backend, Stripe for payments, ShadCN UI with Tailwind CSS for styling, and Framer Motion for animations.",
    },
    {
      q: "Who is this app for?",
      a: "Developers, students, and freelancers who want to prototype quickly, learn, or build AI-assisted projects effortlessly.",
    },
    {
      q: "How can I contact support?",
      a: "You can reach out via the Contact form in the dashboard or email us at mnazimhossain.codes@gmail.com",
    },
    {
      q: "Can I delete my account?",
      a: "Yes. Go to Settings → Account → Delete Account to permanently remove your data from our servers.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto py-12 px-6"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-3">
          <HelpCircle size={32} className="text-purple-500" />
        </div>
        <h1 className="text-3xl font-semibold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-400 text-sm">
          Everything you need to know about how our app works and how to make the most of it.
        </p>
      </div>

      {/* Accordion FAQ */}
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((item, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border border-gray-800 rounded-xl bg-gray-900 px-4"
          >
            <AccordionTrigger className="text-left text-base font-medium hover:text-purple-400 transition">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-gray-400 text-sm leading-relaxed">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}
