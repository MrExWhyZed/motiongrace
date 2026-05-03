"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Briefcase
} from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer";

export default function Footer() {
  // Footer link data adapted for MotionGrace
  const footerLinks = [
    {
      title: "Explore",
      links: [
        { label: "Work", href: "#" },
        { label: "Services", href: "#" },
        { label: "Process", href: "#" },
        { label: "Studio", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        {
          label: "Contact",
          href: "#",
          pulse: true,
        },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#0894ff]" />,
      text: "hello@motiongraceco.com",
      href: "mailto:hello@motiongraceco.com",
    },
    {
      icon: <Briefcase size={18} className="text-[#0894ff]" />,
      text: "Start a Project",
      href: "https://app.motiongraceco.com/",
    },
    {
      icon: <MapPin size={18} className="text-[#0894ff]" />,
      text: "Global Remote Studio",
    },
  ];

  const socialLinks = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      ),
      label: "Instagram",
      href: "#",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10zm-10 8c-4.42 0-8-3.58-8-8 0-1.87.64-3.59 1.71-4.96.22.15.54.34.95.53 1.83.85 4.3 1.63 6.94 1.78.1.58.17 1.18.21 1.77-2.6.5-5.07 1.34-7.25 2.53C5.55 15.65 8.5 18 12 18c2.2 0 4.2-.88 5.64-2.31-1.39-1.04-3.13-1.93-5.06-2.62-.23.76-.51 1.5-.83 2.22-1.2.66-2.54 1.15-3.95 1.48.51 1.09 1.25 2.06 2.2 2.87v-1.64zm6.65-3.32c-1.58.82-3.41 1.29-5.35 1.35.31-.69.58-1.4.8-2.12 1.82.64 3.47 1.48 4.79 2.45-.08.11-.16.22-.24.32zM15.14 8.5c-.71-1.35-1.54-2.61-2.48-3.77 1.45.69 2.76 1.66 3.82 2.85-1.04-.37-2.15-.68-3.32-.93.63 1.02 1.18 2.09 1.65 3.2 1.21-.07 2.41-.05 3.58.07a8.038 8.038 0 0 1-1.25 3.19c-1.29-1.03-2.92-1.9-4.7-2.58-.06-.57-.14-1.15-.24-1.72 1.04-.1 2.04-.26 3.01-.48l-.07-.83zm-6.19.46c.4-1.06.87-2.09 1.42-3.08-1.55.51-2.95 1.33-4.11 2.4.92-.09 1.82-.12 2.69-.08z"/>
        </svg>
      ),
      label: "Dribbble",
      href: "#",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      label: "LinkedIn",
      href: "#",
    },
  ];

  return (
    <footer suppressHydrationWarning className="bg-[#0A0A0F] relative h-fit rounded-t-[40px] overflow-hidden mt-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto p-10 md:p-14 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/motion_grace_logo.png"
                  alt="Motion Grace"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="font-bold text-xl tracking-tight">
                <span className="text-white">Motion</span>
                <span className="text-white">Grace</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 max-w-[250px]">
              Cinematic CGI for modern beauty brands. Create once. Scale infinitely.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-lg font-semibold mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative w-fit">
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                    {link.pulse && (
                      <span className="absolute top-0 -right-3 w-1.5 h-1.5 rounded-full bg-[#0894ff] animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">
              Connect
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-white/60 text-sm">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="hover:text-white transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-white/10 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0 text-white/40">
          {/* Social icons */}
          <div className="flex space-x-6">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-white transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left text-xs">
            &copy; 2026 MotionGrace. All rights reserved.
          </p>
        </div>
      </div>

      {/* Text hover effect */}
      <div className="flex h-[15rem] sm:h-[20rem] md:h-[25rem] lg:h-[30rem] -mt-10 sm:-mt-20 md:-mt-32 lg:-mt-52 mb-[-2rem] sm:mb-[-4rem] md:mb-[-6rem] lg:-mb-36 overflow-hidden pointer-events-none sm:pointer-events-auto">
        <TextHoverEffect text="MOTION" className="z-50 w-full" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
