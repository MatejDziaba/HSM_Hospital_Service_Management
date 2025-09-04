"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";

const navLinks = [
  { name: "Admin", href: "Admin" },
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

  const filteredLinks = navLinks.filter(
    (link) => !(isObsluhaPage && link.name === "Obsluha")
  );

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-2 md:py-3 flex items-center justify-between">
        {/* Čas vľavo len na Obsluha */}
        {isObsluhaPage ? (
          <div className="text-xl md:text-2xl font-bold text-gray-700">
            {currentTime.toLocaleTimeString()}
          </div>
        ) : (
          <div></div>
        )}

        {/* Logo - flex-1 aby bolo vždy centrované */}
        <div className={clsx("flex-1 flex justify-center items-center")}>
          <Link href="/Pages/Home" onClick={() => setMenuOpen(false)}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={80} // menšie na mobiloch
              height={80} // menšie na mobiloch
              className="md:w-[114px] md:h-[114px] w-[60px] h-[60px] object-contain"
            />
          </Link>
        </div>

        {/* Ostatné odkazy / tlačidlo odhlásenia */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {!isObsluhaPage &&
            filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "text-gray-600 hover:text-blue-600 transition text-sm md:text-base",
                  pathname === link.href && "text-blue-600 font-semibold"
                )}
              >
                {link.name}
              </Link>
            ))}

          {isObsluhaPage && (
            <button
              onClick={() => alert("Odhlásenie")}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm md:text-base"
            >
              Odhlásiť sa
            </button>
          )}

          {/* Hamburger pre mobil */}
          <button
            onClick={toggleMenu}
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center group"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className={clsx(
                "block absolute h-1 w-6 rounded bg-gray-700 transition-transform duration-300 ease-in-out",
                menuOpen ? "rotate-45 translate-y-2.5" : "-translate-y-2.5",
                "group-hover:bg-blue-600"
              )}
            />
            <span
              className={clsx(
                "block absolute h-1 w-6 rounded bg-gray-700 transition-opacity duration-300 ease-in-out",
                menuOpen ? "opacity-0" : "opacity-100",
                "group-hover:bg-blue-600"
              )}
            />
            <span
              className={clsx(
                "block absolute h-1 w-6 rounded bg-gray-700 transition-transform duration-300 ease-in-out",
                menuOpen ? "-rotate-45 -translate-y-2.5" : "translate-y-2.5",
                "group-hover:bg-blue-600"
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "md:hidden overflow-hidden bg-white shadow-md origin-top transition-[max-height,padding] duration-500 ease-in-out",
          menuOpen ? "max-h-[500px] py-4 px-4" : "max-h-0 py-0 px-4"
        )}
      >
        <ul className="flex flex-col space-y-3">
          {filteredLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  "block text-gray-700 hover:text-blue-600 transition font-medium text-base",
                  pathname === link.href && "text-blue-600 font-semibold"
                )}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {isObsluhaPage && (
            <>
              <li className="text-gray-700 font-medium text-left text-base">
                {currentTime.toLocaleTimeString()}
              </li>
              <li>
                <button
                  onClick={() => alert("Odhlásenie")}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition w-full text-base"
                >
                  Odhlásiť sa
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
