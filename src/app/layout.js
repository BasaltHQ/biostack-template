import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://biostacklimitless.com'),
  title: "BioStack Limitless | Unlock Your Best Self",
  description: "BioStack Limitless - Your guide to living stronger, longer, and healthier. Personalized wellness coaching for anti-aging, weight management, and peak performance.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "BioStack Limitless | Unlock Your Best Self",
    description: "Your guide to living stronger, longer, and healthier. Personalized wellness coaching for anti-aging, weight management, and peak performance.",
    url: "https://biostacklimitless.com",
    siteName: "BioStack Limitless",
    images: [
      {
        url: "/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "BioStack Limitless Hero Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BioStack Limitless | Unlock Your Best Self",
    description: "Your guide to living stronger, longer, and healthier. Personalized wellness coaching for anti-aging, weight management, and peak performance.",
    images: ["/hero-bg.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased text-slate-800 bg-white min-h-screen flex flex-col`}>
        <Navbar />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
