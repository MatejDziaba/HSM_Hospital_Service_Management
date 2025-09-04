import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from './Components/Navbar/page';
import Footer from "./Components/Footer/page";
import 'flag-icons/css/flag-icons.min.css';


export const metadata: Metadata = {
  title: "HMS",
  description: "Hospital manage service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
       <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
