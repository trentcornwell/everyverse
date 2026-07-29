"use client";

import { useState } from "react";
import type { BibleTreeTestament } from "@/lib/study-notes";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";

interface AppShellProps {
  children: React.ReactNode;
  tree: BibleTreeTestament[];
}

export default function AppShell({ children, tree }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} tree={tree} />
      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
