"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Building2, Heart, LayoutDashboard, Menu, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { href: "/properties", label: "Browse", icon: Search },
  { href: "/properties/map", label: "Map Search", icon: Building2 },
];

const authLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
];

const sellerAgentLinks = [
  { href: "/properties/new", label: "List Property", icon: Plus },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!isSignedIn) { setActiveRole(null); setRoles([]); return; }
    fetch("/api/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.activeRole) setActiveRole(data.activeRole);
        if (data?.roles) setRoles(data.roles);
      })
      .catch(() => {});
  }, [isSignedIn]);

  const canListProperty = activeRole === "SELLER" || activeRole === "AGENT" || activeRole === "ADMIN";
  const visibleAuthLinks = [
    ...authLinks,
    ...(canListProperty ? sellerAgentLinks : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">EstateForge</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant={pathname === link.href ? "secondary" : "ghost"} size="sm" className="gap-2">
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
          {isSignedIn && visibleAuthLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant={pathname.startsWith(link.href) ? "secondary" : "ghost"} size="sm" className="gap-2">
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!isSignedIn ? (
            <SignInButton>
              <Button size="sm">Sign In</Button>
            </SignInButton>
          ) : (
            <>
              {activeRole && (
                <Badge variant="outline" className="text-xs">
                  {activeRole}
                </Badge>
              )}
              <UserButton />
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
              <Button variant={pathname === link.href ? "secondary" : "ghost"} className={cn("w-full justify-start gap-2")}>
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
          {isSignedIn && visibleAuthLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
              <Button variant={pathname.startsWith(link.href) ? "secondary" : "ghost"} className="w-full justify-start gap-2">
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
