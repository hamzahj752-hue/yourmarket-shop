"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

function MailIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>);
}

function PhoneIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>);
}

function MapPinIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>);
}

function ClockIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>);
}

function SendIcon() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>);
}

const CONTACT_INFO = [
  { icon: <MailIcon />, label: "Email", value: "support@yourmarket.com", href: "mailto:support@yourmarket.com" },
  { icon: <PhoneIcon />, label: "Phone", value: "+1 (555) 000-0000", href: "tel:+15550000000" },
  { icon: <MapPinIcon />, label: "Address", value: "Johannesburg, South Africa", href: "#" },
  { icon: <ClockIcon />, label: "Hours", value: "Mon - Fri, 9am - 6pm SAST", href: "#" },
];

const HELP_LINKS = [
  { label: "Help Center & FAQ", href: "/help" },
  { label: "Shipping Information", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute -left-40 -top-40 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-64 w-64 rounded-full bg-accent/5 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Get in touch</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Contact Us</h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              Have a question, suggestion or just want to say hello? We would love to hear from you.
            </p>
          </div>
        </section>

        <section aria-label="Contact form and information">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
              <div>
                <h2 className="text-lg font-bold text-foreground">Send us a message</h2>
                <p className="mt-1 text-sm text-muted">We typically respond within 1-2 business days.</p>

                {!submitted ? (
                  <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} noValidate className="mt-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-sm font-medium text-muted">Name</label>
                        <input id="name" type="text" required placeholder="Your name" className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-muted">Email</label>
                        <input id="email" type="email" required placeholder="you@example.com" className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-sm font-medium text-muted">Subject</label>
                      <input id="subject" type="text" required placeholder="How can we help?" className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-sm font-medium text-muted">Message</label>
                      <textarea id="message" rows={5} required placeholder="Tell us more..." className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
                    </div>

                    <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-hover">
                      <SendIcon /> Send Message
                    </button>
                  </form>
                ) : (
                  <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center">
                    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-accent">
                      <SendIcon />
                    </div>
                    <p className="text-sm font-bold text-foreground">Message sent</p>
                    <p className="mt-2 text-sm text-muted">Thank you for reaching out. We will get back to you shortly.</p>
                    <p className="mt-3 text-xs text-muted">This is a demo form. No message was actually sent.</p>
                    <button type="button" onClick={() => setSubmitted(false)} className="mt-4 text-sm font-semibold text-accent hover:text-accent-hover">Send another message</button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-sm font-bold text-foreground">Contact Information</h3>
                  <div className="mt-4 space-y-4">
                    {CONTACT_INFO.map((info) => (
                      <div key={info.label} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">{info.icon}</span>
                        <div>
                          <p className="text-xs text-muted">{info.label}</p>
                          <a href={info.href} className="text-sm font-semibold text-foreground transition-colors hover:text-accent">{info.value}</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-sm font-bold text-foreground">Quick Links</h3>
                  <div className="mt-4 space-y-2">
                    {HELP_LINKS.map((link) => (
                      <a key={link.label} href={link.href} className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent">
                        <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
