import type { Metadata } from "next";
import { Merriweather, Oswald } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { getBibleTree } from "@/lib/study-notes";

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
  title: "EveryVerse.online — Every Verse, Every Nation",
  description:
    "A collaborative Bible commentary platform where readers around the world study and discuss scripture, one verse at a time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = getBibleTree();

  return (
    <html lang="en" className={`${merriweather.variable} ${oswald.variable}`}>
      <body>
        <AppShell tree={tree}>{children}</AppShell>
      </body>
    </html>
  );
}
