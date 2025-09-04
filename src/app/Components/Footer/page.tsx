// src/app/Components/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-t from-white via-cyan-50 to-white text-gray-700 pt-10 pb-6 border-t border-cyan-500">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & slogan */}
        <div>
          <Image
            src="/logo.png"
            alt="CharityCloud Logo"
            width={80}
            height={80}
            className="rounded-full bg-white p-1 shadow-lg"
          />
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            Spojme sily pre lepší svet. Transparentné a efektívne dobročinné projekty.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-md font-semibold uppercase mb-3 text-cyan-800">
            Navigácia
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/', label: 'Domov' },
              { href: '/Pages/Zbierka', label: 'Zbierky' },
              { href: '/Onas', label: 'O nás' },
              { href: '/kontakt', label: 'Kontakt' },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative inline-block hover:text-cyan-700 transition-colors"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-cyan-500 transition-all hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="text-md font-semibold uppercase mb-3 text-cyan-800">
            Informácie
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/ochrana-sukromia', label: 'Ochrana súkromia' },
              { href: '/gdpr', label: 'GDPR' },
              { href: '/terms', label: 'Podmienky používania' },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative inline-block hover:text-cyan-700 transition-colors"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-cyan-500 transition-all hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-md font-semibold uppercase mb-3 text-cyan-800">
            Sledujte nás
          </h3>
          <div className="flex space-x-4 mt-2">
            {[
              { href: 'https://facebook.com', icon: <FaFacebook /> },
              { href: 'https://instagram.com', icon: <FaInstagram /> },
              { href: 'https://twitter.com', icon: <FaTwitter /> },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow hover:bg-cyan-100 transition"
                aria-label={item.href}
              >
                <span className="text-cyan-700 hover:text-cyan-800 text-xl">
                  {item.icon}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-cyan-500 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} HMS. Všetky práva vyhradené.
      </div>
    </footer>
  );
};

export default Footer;
