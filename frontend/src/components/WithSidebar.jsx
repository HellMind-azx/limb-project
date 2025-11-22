"use client";

import { usePathname } from "next/navigation";
import SidebarNav from "@/components/SidebarNav";

// Pages that should show the sidebar
const SIDEBAR_PAGES = [
  '/habits',
  '/calendar',
  '/focus',
  '/notifications',
  '/users',
  '/settings'
];

export default function WithSidebar({ children }) {
  const pathname = usePathname();

  // Check if current path should show sidebar
  const shouldShowSidebar = SIDEBAR_PAGES.some(page => 
    pathname === page || pathname?.startsWith(page + '/')
  );

  if (!shouldShowSidebar) {
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


