import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">EstateForge</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted marketplace for buying, selling, and renting properties.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Browse</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/properties?status=FOR_SALE" className="hover:text-primary">Buy</Link></li>
              <li><Link href="/properties?status=FOR_RENT" className="hover:text-primary">Rent</Link></li>
              <li><Link href="/properties/map" className="hover:text-primary">Map Search</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">For Professionals</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/properties/new" className="hover:text-primary">List a Property</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">Agent Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">About</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EstateForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
