"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";

const navLinks = [
  { name: "Admin", href: "/Pages/Admin" }, // Predpokladám správnu cestu
  { name: "Lekár", href: "/Pages/Lekar" },
  { name: "Pobyt", href: "/Pages/Pobyt" },
  { name: "Správca", href: "/Pages/Spravca" },
  { name: "Obsluha", href: "/Pages/Obsluha" },
  { name: "O nás", href: "/Pages/Onas" },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const isObsluhaPage = pathname === "/Pages/Obsluha";

  // Na stránke "Obsluha" sa nezobrazí link na seba samú v menu.
  const filteredLinks = navLinks.filter(
    (link) => !(isObsluhaPage && link.name === "Obsluha")
  );

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo je vždy vľavo */}
        <Link href="/Pages/Home" onClick={() => setMenuOpen(false)}>
          <Image src="/logo.png" alt="Logo" width={114} height={114} priority />
        </Link>

        {/* Na stránke Obsluha je čas v strede (len na desktope) */}
        {isObsluhaPage && (
          <div className="hidden md:block text-4xl font-bold text-gray-700">
            {currentTime.toLocaleTimeString()}
          </div>
        )}

        {/* Kontajnér pre pravú stranu: navigačné linky a tlačidlá */}
        <div className="flex items-center space-x-4">
          
          {/* Navigačné linky (len na desktope a nie na Obsluha stránke) */}
          <div className="hidden md:flex items-center space-x-4">
            {!isObsluhaPage &&
              filteredLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "text-gray-600 hover:text-blue-600 transition",
                    pathname === link.href && "text-blue-600 font-semibold"
                  )}
                >
                  {link.name}
                </Link>
              ))}
          </div>

          {/* Tlačidlo "Odhlásiť sa" (len na desktope na Obsluha stránke) */}
          {isObsluhaPage && (
            <button
              onClick={() => alert("Odhlásenie")}
              className="hidden md:block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Odhlásiť sa
            </button>
          )}

          {/* Hamburger menu tlačidlo (len na mobilných zariadeniach) */}
          <button
            onClick={toggleMenu}
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center group"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={clsx("block absolute h-0.5 w-6 rounded bg-gray-700 transition-transform duration-300 ease-in-out group-hover:bg-blue-600", menuOpen ? "rotate-45" : "-translate-y-1.5")}/>
            <span className={clsx("block absolute h-0.5 w-6 rounded bg-gray-700 transition-opacity duration-300 ease-in-out group-hover:bg-blue-600", menuOpen ? "opacity-0" : "opacity-100")}/>
            <span className={clsx("block absolute h-0.5 w-6 rounded bg-gray-700 transition-transform duration-300 ease-in-out group-hover:bg-blue-600", menuOpen ? "-rotate-45" : "translate-y-1.5")}/>
          </button>
        </div>
      </div>

      {/* Mobilné menu (vysúvacie) */}
      <div
        className={clsx(
          "md:hidden overflow-hidden bg-white shadow-md origin-top transition-all duration-300 ease-in-out",
          menuOpen ? "max-h-96 border-t" : "max-h-0"
        )}
      >
        <ul className="flex flex-col space-y-4 p-4">
          {/* Zobrazia sa buď linky alebo obsah pre Obsluhu */}
          {isObsluhaPage ? (
            <>
              <li className="text-gray-700 font-medium text-lg text-center">
                {currentTime.toLocaleTimeString()}
              </li>
              <li>
                <button
                  onClick={() => alert("Odhlásenie")}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full"
                >
                  Odhlásiť sa
                </button>
              </li>
            </>
          ) : (
            filteredLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "block text-gray-700 hover:text-blue-600 transition font-medium text-lg text-center",
                    pathname === link.href && "text-blue-600 font-semibold"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;