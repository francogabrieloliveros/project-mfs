"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dataset", label: "Dataset" },
    { href: "/methods", label: "Methods" },
    { href: "/experiments", label: "Experiments" },
    { href: "/results", label: "Results" },
    { href: "/discussion", label: "Discussion" },
    { href: "/references", label: "References" },
  ];

  return (
    <header className="w-dvw flex justify-center z-50">
      <nav
        className={`
          fixed flex gap-4 backdrop-blur-sm rounded-3xl bg-black/2 mt-2 px-6 py-2 text-sm border border-white/50
          transition-transform duration-300 ease-in-out
          ${isVisible ? "translate-y-0" : "-translate-y-17.5"}
        `}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:bg-black rounded-2xl hover:text-white px-3 py-1.5 transition whitespace-nowrap"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}