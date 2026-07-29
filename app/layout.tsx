import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { getBibleTree } from "@/lib/study-notes";

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
    <html lang="en">
      <body>
        <AppShell tree={tree}>{children}</AppShell>
      </body>
    </html>
  );
}
