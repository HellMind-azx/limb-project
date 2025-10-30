"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiHome,
  FiTarget,
  FiActivity,
  FiBell,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiCalendar,
} from "react-icons/fi";
import styles from "./SidebarNav.module.scss";
import { clearTokens, clearStoredUser } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: FiHome },
  { href: "/habits", label: "Habits", icon: FiTarget },
  { href: "/calendar", label: "Calendar", icon: FiCalendar },
  { href: "/activity", label: "Activity", icon: FiActivity },
  { href: "/notifications", label: "Notifications", icon: FiBell },
  { href: "/users", label: "Users", icon: FiUsers },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar_expanded");
    if (saved !== null) setExpanded(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar_expanded", String(expanded));
  }, [expanded]);

  const isActive = useCallback(
    (href) => pathname === href || pathname?.startsWith(href + "/"),
    [pathname]
  );

  const handleLogout = () => {
    clearTokens();
    clearStoredUser();
    window.location.href = "/login";
  };

  // Close on ESC when mobile overlay is open
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Close when clicking outside in mobile
  useEffect(() => {
    if (!mobileOpen) return;
    const onClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={[
          styles.sidebar,
          expanded ? styles.expanded : styles.collapsed,
          mobileOpen ? styles.mobileOpen : "",
        ].join(" ")}
        aria-label="Primary"
      >
        <div className={styles.header}>
          <button
            className={styles.toggle}
            aria-label="Toggle sidebar"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
          >
            <FiMenu size={20} />
          </button>
          <div className={styles.brand} aria-hidden={!expanded}>
            Progressor
          </div>
        </div>
        <div className={styles.divider} />

        <nav className={styles.nav} role="navigation" aria-label="Main">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={[
                styles.navItem,
                isActive(href) ? styles.active : "",
              ].join(" ")}
              title={!expanded ? label : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <span className={styles.iconWrap}>
                <Icon size={18} />
              </span>
              {expanded && <span className={styles.label}>{label}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.footer}>
          <Link
            href="/settings"
            className={styles.navItem}
            title={!expanded ? "Settings" : undefined}
            onClick={() => setMobileOpen(false)}
          >
            <span className={styles.iconWrap}>
              <FiSettings size={18} />
            </span>
            {expanded && <span className={styles.label}>Settings</span>}
          </Link>
          <button
            className={[styles.navItem, styles.logout].join(" ")}
            onClick={handleLogout}
            title={!expanded ? "Log out" : undefined}
            type="button"
          >
            <span className={styles.iconWrap}>
              <FiLogOut size={18} />
            </span>
            {expanded && <span className={styles.label}>Log out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay trigger (hamburger) can be placed in Navbar later. For now, sidebar supports overlay via CSS breakpoint. */}
      {mobileOpen && <div className={styles.backdrop} onClick={() => setMobileOpen(false)} />}
    </>
  );
}


