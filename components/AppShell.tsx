"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
