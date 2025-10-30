"use client";

import { usePathname } from "next/navigation";
import SidebarNav from "@/components/SidebarNav";

export default function WithSidebar({ children }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return children;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarNav />
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}


