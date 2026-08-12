import type { Metadata } from "next";
import { Merriweather, Oswald } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.everyverse.online"),
  title: "EveryVerse.online — Every Verse, Every Nation",
  description:
    "A collaborative Bible commentary platform where readers around the world study and discuss scripture, one verse at a time.",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${merriweather.variable} ${oswald.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
