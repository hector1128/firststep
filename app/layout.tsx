import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

// Keeping your bouncy Lesa-style font!
const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "600", "700"] });

// High-quality SEO Metadata for Google Search and Social Sharing
export const metadata: Metadata = {
  title: "FirstStep | UCF Internship & Job Alerts",
  description:
    "Stop searching. Get personalized tech, business, and design internship alerts delivered straight to your inbox. Built for UCF students.",
  keywords: [
    "UCF",
    "UCF internships",
    "FirstStep",
    "college jobs",
    "student internships",
    "new grad roles",
    "tech internships",
  ],
  // NEW: Added the favicon here!
  icons: {
    icon: "/sword.png",
  },
  openGraph: {
    title: "FirstStep | UCF Internship Alerts",
    description:
      "Personalized internship and new grad job alerts delivered daily or weekly.",
    type: "website",
    url: "https://firststep.services", // Your custom domain
    siteName: "FirstStep",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fredoka.className}>{children}</body>
    </html>
  );
}
